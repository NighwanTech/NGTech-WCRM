import { createClient } from '@/lib/supabase/server'
import { RATE_LIMITS } from '@/lib/rate-limit'

export type PolicyScopeLevel = 'global' | 'plan' | 'workspace' | 'role' | 'api_key' | 'emergency'

export interface RateLimitPolicyItem {
  id: string
  accountId: string
  name: string
  scopeLevel: PolicyScopeLevel
  targetRole?: string | null
  targetApiKeyId?: string | null
  targetIpRange?: string | null
  routePattern: string
  httpMethods: string[]
  maxRequests: number
  windowSeconds: number
  status: 'active' | 'disabled' | 'archived'
  priorityRank: number
  version: number
  startAt?: string | null
  expiresAt?: string | null
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface EvaluationContext {
  accountId: string
  userId?: string
  role?: string
  apiKeyId?: string
  ipAddress?: string
  method?: string
  routePattern?: string
  rateLimitCategory?: keyof typeof RATE_LIMITS
}

export interface EffectiveRateLimitResult {
  limit: number
  windowMs: number
  matchedPolicyId?: string
  matchedPolicyName?: string
  scopeLevel: PolicyScopeLevel
}

// In-memory cache for fast-path sub-millisecond route checks
interface CacheEntry {
  policies: RateLimitPolicyItem[]
  expiresAt: number
}

const policyCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 30_000 // 30s cache TTL with instant invalidation

export function invalidateRateLimitCache(accountId: string) {
  policyCache.delete(accountId)
}

/**
 * Precedence ranks for hierarchical evaluation (higher number = higher priority)
 */
const SCOPE_PRECEDENCE: Record<PolicyScopeLevel, number> = {
  emergency: 600,
  api_key: 500,
  role: 400,
  workspace: 300,
  plan: 200,
  global: 100,
}

/**
 * Loads rate limit policies for a workspace with in-memory fast-path caching
 */
export async function getWorkspaceRateLimitPolicies(accountId: string): Promise<RateLimitPolicyItem[]> {
  const now = Date.now()
  const cached = policyCache.get(accountId)
  if (cached && cached.expiresAt > now) {
    return cached.policies
  }

  try {
    const supabase = await createClient()
    const { data: dbPolicies } = await supabase
      .from('rate_limit_policies')
      .select('*')
      .eq('account_id', accountId)
      .neq('status', 'archived')
      .order('priority_rank', { ascending: false })

    const formatted: RateLimitPolicyItem[] = (dbPolicies || []).map((p) => ({
      id: p.id,
      accountId: p.account_id,
      name: p.name,
      scopeLevel: p.scope_level as PolicyScopeLevel,
      targetRole: p.target_role,
      targetApiKeyId: p.target_api_key_id,
      targetIpRange: p.target_ip_range,
      routePattern: p.route_pattern,
      httpMethods: p.http_methods || ['*'],
      maxRequests: p.max_requests,
      windowSeconds: p.window_seconds,
      status: p.status,
      priorityRank: p.priority_rank ?? SCOPE_PRECEDENCE[p.scope_level as PolicyScopeLevel] ?? 100,
      version: p.version || 1,
      startAt: p.start_at,
      expiresAt: p.expires_at,
      metadata: p.metadata || {},
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }))

    policyCache.set(accountId, { policies: formatted, expiresAt: now + CACHE_TTL_MS })
    return formatted
  } catch (err) {
    console.error('Error fetching workspace rate limit policies:', err)
    return []
  }
}

/**
 * Evaluates the hierarchical rate limit for a request context based on strict precedence rules
 */
export async function evaluateHierarchicalRateLimit(
  ctx: EvaluationContext
): Promise<EffectiveRateLimitResult> {
  const defaultFallback: EffectiveRateLimitResult = ctx.rateLimitCategory
    ? {
        limit: RATE_LIMITS[ctx.rateLimitCategory].limit,
        windowMs: RATE_LIMITS[ctx.rateLimitCategory].windowMs,
        scopeLevel: 'global',
      }
    : { limit: 120, windowMs: 60_000, scopeLevel: 'global' }

  if (!ctx.accountId) return defaultFallback

  const policies = await getWorkspaceRateLimitPolicies(ctx.accountId)
  const nowIso = new Date().toISOString()
  const reqMethod = (ctx.method || 'GET').toUpperCase()
  const targetRoute = ctx.routePattern || ctx.rateLimitCategory || 'default'

  // Filter active and unexpired policies matching route & method
  const eligible = policies.filter((p) => {
    if (p.status !== 'active') return false

    // Check time window if scheduled
    if (p.startAt && p.startAt > nowIso) return false
    if (p.expiresAt && p.expiresAt < nowIso) return false

    // Match route pattern (exact or wildcard prefix)
    const routeMatches =
      p.routePattern === '*' ||
      p.routePattern === targetRoute ||
      (p.routePattern.endsWith('*') && targetRoute.startsWith(p.routePattern.slice(0, -1)))

    if (!routeMatches) return false

    // Match HTTP method
    const methodMatches =
      p.httpMethods.includes('*') || p.httpMethods.map((m) => m.toUpperCase()).includes(reqMethod)

    if (!methodMatches) return false

    // Match specific scope target if defined
    if (p.scopeLevel === 'role' && p.targetRole && ctx.role !== p.targetRole) return false
    if (p.scopeLevel === 'api_key' && p.targetApiKeyId && ctx.apiKeyId !== p.targetApiKeyId) return false
    if (p.scopeLevel === 'emergency' && p.targetIpRange && ctx.ipAddress !== p.targetIpRange) return false

    return true
  })

  if (eligible.length === 0) return defaultFallback

  // Sort eligible policies by precedence rank descending
  eligible.sort((a, b) => b.priorityRank - a.priorityRank)
  const winningPolicy = eligible[0]

  return {
    limit: winningPolicy.maxRequests,
    windowMs: winningPolicy.windowSeconds * 1000,
    matchedPolicyId: winningPolicy.id,
    matchedPolicyName: winningPolicy.name,
    scopeLevel: winningPolicy.scopeLevel,
  }
}

/**
 * Dry-Run Policy Simulator to validate proposed rates against traffic bursts before publishing
 */
export function simulateRateLimitPolicy(
  policyDraft: { maxRequests: number; windowSeconds: number },
  trafficBurstCount: number
): {
  totalBurst: number
  allowed: number
  blocked: number
  utilizationPercentage: number
  recommendedWindowSec: number
} {
  const limit = policyDraft.maxRequests
  const allowed = Math.min(trafficBurstCount, limit)
  const blocked = Math.max(0, trafficBurstCount - limit)
  const utilizationPercentage = Math.min(100, Math.round((trafficBurstCount / limit) * 100))

  let recommendedWindowSec = policyDraft.windowSeconds
  if (utilizationPercentage > 90) {
    recommendedWindowSec = Math.round(policyDraft.windowSeconds * 1.5)
  }

  return {
    totalBurst: trafficBurstCount,
    allowed,
    blocked,
    utilizationPercentage,
    recommendedWindowSec,
  }
}

/**
 * Continuous Coverage & Rule Health Validator
 */
export async function runRateLimitPolicyAudit(accountId: string) {
  const policies = await getWorkspaceRateLimitPolicies(accountId)

  const knownRoutes = [
    '/api/whatsapp/send',
    '/api/whatsapp/react',
    '/api/broadcasts',
    '/api/account/invitations',
    '/api/v1/*',
    '/api/admin/roles',
  ]

  const coveredRoutes = new Set(policies.map((p) => p.routePattern))
  const unprotectedRoutes = knownRoutes.filter((r) => !coveredRoutes.has(r) && !coveredRoutes.has('*'))

  const conflicts: Array<{ route: string; policyA: string; policyB: string }> = []
  for (let i = 0; i < policies.length; i++) {
    for (let j = i + 1; j < policies.length; j++) {
      if (
        policies[i].routePattern === policies[j].routePattern &&
        policies[i].scopeLevel === policies[j].scopeLevel &&
        policies[i].status === 'active' &&
        policies[j].status === 'active'
      ) {
        conflicts.push({
          route: policies[i].routePattern,
          policyA: policies[i].name,
          policyB: policies[j].name,
        })
      }
    }
  }

  return {
    totalPolicies: policies.length,
    activePolicies: policies.filter((p) => p.status === 'active').length,
    unprotectedRoutes,
    conflicts,
    healthy: unprotectedRoutes.length === 0 && conflicts.length === 0,
  }
}
