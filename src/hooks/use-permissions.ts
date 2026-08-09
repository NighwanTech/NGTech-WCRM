'use client'

import { useAuth } from '@/hooks/use-auth'
import { Permission, ROLE_PERMISSION_MAP, AccountRole } from '@/lib/security/permissions'

export function usePermissions() {
  const { accountRole, isOwner } = useAuth()

  /**
   * Evaluates if the current user has the required permission.
   */
  const can = (permission?: Permission): boolean => {
    if (!permission) return true
    if (isOwner || accountRole === 'owner') return true

    const role = (accountRole as AccountRole) || 'viewer'
    const baseSet = ROLE_PERMISSION_MAP[role]

    if (!baseSet) return false
    return baseSet.has('all') || baseSet.has(permission)
  }

  return {
    can,
    role: (accountRole as AccountRole) || 'viewer',
    isOwner,
  }
}
