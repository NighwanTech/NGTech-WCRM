import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireActiveAccount } from './account-guard'
import { hasPermission, Permission, AccountRole } from './permissions'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { evaluateHierarchicalRateLimit } from './rate-limit-governance-engine'
import { enforceQuota, QuotaExceededError } from './quota-guard'
import { logAudit } from './audit'

export interface ZeroTrustContext {
  userId: string
  accountId: string
  role: AccountRole
}

export interface ZeroTrustOptions {
  permission?: Permission
  quotaResource?: 'contacts' | 'messages'
  rateLimitCategory?: keyof typeof RATE_LIMITS
}

// In-memory counter for tracking repeated 403 breaches per user
const breachTracker = new Map<string, { count: number; resetAt: number }>()

/**
 * Centralized Zero-Trust Guard Middleware Pipeline for API routes.
 * Evaluates Auth -> RLS Account Isolation -> Account Status -> PBAC Permissions -> Rate Limiting -> Quotas.
 */
export async function withZeroTrustGuard(
  request: Request,
  options: ZeroTrustOptions,
  handler: (ctx: ZeroTrustContext) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // 1. Authentication check
    const supabase = await createClient()
    const { data: userRes } = await supabase.auth.getUser()

    if (!userRes?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = userRes.user.id

    // 2. Account status & tenant isolation check
    const accountId = await requireActiveAccount(userId)

    // 3. User Role & PBAC Permission check
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_role')
      .eq('user_id', userId)
      .single()

    const role = (profile?.account_role as AccountRole) || 'viewer'

    if (options.permission) {
      const allowed = await hasPermission(role, options.permission, userId, accountId)

      if (!allowed) {
        // Track repeated 403 breaches for security anomaly alerts
        const now = Date.now()
        const trackKey = `${accountId}:${userId}`
        const currentBreaches = breachTracker.get(trackKey)

        let newCount = 1
        if (currentBreaches && currentBreaches.resetAt > now) {
          newCount = currentBreaches.count + 1
        }
        breachTracker.set(trackKey, { count: newCount, resetAt: now + 5 * 60 * 1000 })

        // Log 403 Forbidden audit event with high severity
        await logAudit({
          action: 'unauthorized_access_attempt',
          accountId,
          userId,
          severity: newCount >= 3 ? 'critical' : 'high',
          request,
          metadata: {
            requiredPermission: options.permission,
            attemptedUrl: request.url,
            userRole: role,
            breachCount: newCount,
          },
        })

        return NextResponse.json(
          {
            error: 'Forbidden',
            requiredPermission: options.permission,
            message: `Access denied. Requires '${options.permission}' permission.`,
          },
          { status: 403 }
        )
      }
    }

    // 4. Hierarchical Rate Limiting Check
    if (options.rateLimitCategory) {
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
      const effectiveLimit = await evaluateHierarchicalRateLimit({
        accountId,
        userId,
        role,
        ipAddress: clientIp,
        method: request.method,
        rateLimitCategory: options.rateLimitCategory,
      })

      const limitOpts = { limit: effectiveLimit.limit, windowMs: effectiveLimit.windowMs }
      const rateCheck = checkRateLimit(`${accountId}:${userId}:${options.rateLimitCategory}`, limitOpts)

      if (!rateCheck.success) {
        try {
          const supabase = await createClient()
          await supabase.from('rate_limit_metrics').insert({
            account_id: accountId,
            policy_id: effectiveLimit.matchedPolicyId || null,
            route_pattern: options.rateLimitCategory,
            key_identifier: `${userId}`,
            ip_address: clientIp,
            total_requests: 1,
            blocked_requests_429: 1,
          })
        } catch (_) {}

        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            scopeLevel: effectiveLimit.scopeLevel,
            policyName: effectiveLimit.matchedPolicyName || 'Default System Limit',
            retryAfter: Math.ceil((rateCheck.reset - Date.now()) / 1000),
          },
          { status: 429 }
        )
      }
    }

    // 5. Quota Validation
    if (options.quotaResource) {
      await enforceQuota(accountId, options.quotaResource)
    }

    // Execution handler
    return await handler({ userId, accountId, role })
  } catch (err: any) {
    if (err instanceof QuotaExceededError) {
      return NextResponse.json(
        { error: 'Quota Exceeded', message: err.message, resource: err.resource },
        { status: 402 }
      )
    }

    console.error('[ZeroTrustGuard] Request blocked or failed:', err)
    return NextResponse.json({ error: err.message || 'Access Denied' }, { status: 403 })
  }
}
