import { getAdminClient } from '@/lib/admin-supabase'

export type AccountRole = 'owner' | 'admin' | 'manager' | 'agent' | 'client' | 'viewer' | string

export type DataScope = 'all' | 'region' | 'branch' | 'department' | 'team' | 'assigned' | 'own'

export const PERMISSIONS = [
  'all',
  'security:read',
  'audit:read',
  'sessions:read',
  'sessions:manage',
  'api_keys:manage',
  'rbac:manage',
  'rate_limits:manage',
  'compliance:read',
  'compliance:manage',
  'webhooks:read',
  'system_health:read',
  'contacts:read',
  'contacts:create',
  'contacts:update',
  'contacts:delete_any',
  'messages:read',
  'messages:send',
  'broadcasts:launch',
  'sequences:manage',
  'settings:write',
  'team:manage',
  'billing:manage',
  'meta_ads:read',
  'meta_ads:manage',
] as const

export type Permission = (typeof PERMISSIONS)[number]

/**
 * 7 Pre-Built Enterprise Role Templates for 1-Click Workspace Onboarding.
 */
export interface RoleTemplate {
  name: string
  description: string
  defaultScope: DataScope
  permissions: Permission[]
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    name: 'Sales Manager',
    description: 'Manages departmental sales team, contacts, broadcasts, and sequences.',
    defaultScope: 'department',
    permissions: ['contacts:read', 'contacts:create', 'contacts:update', 'messages:read', 'messages:send', 'broadcasts:launch', 'sequences:manage', 'team:manage', 'meta_ads:read', 'meta_ads:manage'],
  },
  {
    name: 'Support Agent',
    description: 'Operational agent handling assigned incoming messages and contacts.',
    defaultScope: 'assigned',
    permissions: ['contacts:read', 'contacts:create', 'contacts:update', 'messages:read', 'messages:send'],
  },
  {
    name: 'HR & Operations Manager',
    description: 'Manages team invitations, member roles, and departmental rosters.',
    defaultScope: 'all',
    permissions: ['team:manage', 'contacts:read', 'messages:read'],
  },
  {
    name: 'Finance & Billing Admin',
    description: 'Manages billing invoices, subscription upgrades, and GDPR compliance exports.',
    defaultScope: 'all',
    permissions: ['billing:manage', 'compliance:read', 'security:read'],
  },
  {
    name: 'Auditor / Compliance Inspector',
    description: 'Read-only access to audit trails, system health, and compliance records.',
    defaultScope: 'all',
    permissions: ['security:read', 'audit:read', 'compliance:read', 'system_health:read', 'webhooks:read'],
  },
  {
    name: 'Marketing Campaign Specialist',
    description: 'Builds and launches bulk WhatsApp broadcasts and visual automated sequences.',
    defaultScope: 'all',
    permissions: ['contacts:read', 'messages:read', 'messages:send', 'broadcasts:launch', 'sequences:manage'],
  },
  {
    name: 'Read-Only Executive',
    description: 'Executive view across workspace reports, contacts, and audit logs.',
    defaultScope: 'all',
    permissions: ['security:read', 'audit:read', 'contacts:read', 'messages:read', 'system_health:read'],
  },
]

/**
 * Permission Dependency Map.
 */
export const PERMISSION_DEPENDENCIES: Partial<Record<Permission, Permission>> = {
  'contacts:create': 'contacts:read',
  'contacts:update': 'contacts:read',
  'contacts:delete_any': 'contacts:read',
  'messages:send': 'messages:read',
  'broadcasts:launch': 'messages:send',
  'sequences:manage': 'messages:send',
  'audit:read': 'security:read',
  'sessions:read': 'security:read',
  'sessions:manage': 'sessions:read',
  'api_keys:manage': 'security:read',
  'rbac:manage': 'security:read',
  'rate_limits:manage': 'security:read',
  'compliance:read': 'security:read',
  'webhooks:read': 'security:read',
  'system_health:read': 'security:read',
}

/**
 * Precomputed Base System Role Permission Map for O(1) evaluation.
 */
export const ROLE_PERMISSION_MAP: Record<string, Set<Permission>> = {
  owner: new Set(['all']),
  admin: new Set([
    'security:read',
    'audit:read',
    'sessions:read',
    'sessions:manage',
    'api_keys:manage',
    'rbac:manage',
    'rate_limits:manage',
    'compliance:read',
    'webhooks:read',
    'system_health:read',
    'contacts:read',
    'contacts:create',
    'contacts:update',
    'contacts:delete_any',
    'messages:read',
    'messages:send',
    'broadcasts:launch',
    'sequences:manage',
    'settings:write',
    'team:manage',
  ]),
  manager: new Set([
    'security:read',
    'audit:read',
    'sessions:read',
    'webhooks:read',
    'system_health:read',
    'contacts:read',
    'contacts:create',
    'contacts:update',
    'messages:read',
    'messages:send',
    'broadcasts:launch',
    'sequences:manage',
    'team:manage',
  ]),
  agent: new Set([
    'sessions:read',
    'contacts:read',
    'contacts:create',
    'contacts:update',
    'messages:read',
    'messages:send',
  ]),
  client: new Set(['messages:read', 'messages:send']),
  viewer: new Set([
    'security:read',
    'audit:read',
    'sessions:read',
    'webhooks:read',
    'system_health:read',
    'contacts:read',
    'messages:read',
  ]),
}

// In-Memory Permission Cache Engine
interface CacheEntry {
  permissions: Set<string>
  expiresAt: number
}
const userPermissionCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 5 * 60 * 1000

/**
 * Evaluates whether a role or user possesses a permission.
 */
export async function hasPermission(
  role: AccountRole,
  requiredPermission: Permission,
  userId?: string,
  accountId?: string
): Promise<boolean> {
  // Owner bypasses all checks
  if (role === 'owner') return true

  // System role fast-path (O(1))
  const baseSet = ROLE_PERMISSION_MAP[role]
  let isAllowed = false
  if (baseSet) {
    isAllowed = baseSet.has('all') || baseSet.has(requiredPermission)
  }

  // Custom role lookup
  if (!baseSet && accountId) {
    try {
      const admin = getAdminClient()
      const { data: dbPerms } = await admin
        .from('role_permissions')
        .select('permission')
        .eq('account_id', accountId)
        .eq('role_name', role)

      if (dbPerms) {
        const customSet = new Set(dbPerms.map((p) => p.permission))
        isAllowed = customSet.has('all') || customSet.has(requiredPermission)
      }
    } catch (err) {
      console.error('[permissions] Failed to fetch custom role permissions:', err)
    }
  }

  // Temporary auto-expiring permissions check
  if (userId && accountId) {
    try {
      const admin = getAdminClient()
      const { data: tempPerms } = await admin
        .from('temporary_permissions')
        .select('permission, expires_at')
        .eq('account_id', accountId)
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())

      if (tempPerms && tempPerms.some((t) => t.permission === 'all' || t.permission === requiredPermission)) {
        return true
      }
    } catch (err) {
      console.error('[permissions] Failed to fetch temporary permissions:', err)
    }
  }

  return isAllowed
}

/**
 * Busts user permission cache immediately when permissions change.
 */
export function invalidatePermissionCache(userId?: string, accountId?: string): void {
  if (userId && accountId) {
    userPermissionCache.delete(`${accountId}:${userId}`)
  } else {
    userPermissionCache.clear()
  }
}
