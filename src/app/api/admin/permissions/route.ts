import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getAdminClient } from '@/lib/admin-supabase'
import { logAudit } from '@/lib/security/audit'
import { invalidatePermissionCache } from '@/lib/security/permissions'

export async function POST(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'rbac:manage' },
    async ({ accountId, userId }) => {
      try {
        const body = await request.json()
        const { roleName, permission, enabled } = body

        if (!roleName || !permission) {
          return NextResponse.json({ error: 'roleName and permission required' }, { status: 400 })
        }

        const admin = getAdminClient()

        if (enabled) {
          // Grant permission
          await admin.from('role_permissions').upsert(
            {
              account_id: accountId,
              role_name: roleName,
              role: 'agent', // Fallback PostgreSQL enum value
              permission,
            },
            { onConflict: 'role,permission' }
          )
        } else {
          // Revoke permission
          await admin
            .from('role_permissions')
            .delete()
            .eq('account_id', accountId)
            .eq('role_name', roleName)
            .eq('permission', permission)
        }

        // Bust permission cache immediately
        invalidatePermissionCache()

        await logAudit({
          action: 'permission_matrix.toggle',
          accountId,
          userId,
          severity: 'high',
          request,
          changes: {
            before: { roleName, permission, enabled: !enabled },
            after: { roleName, permission, enabled },
          },
        })

        return NextResponse.json({ success: true, roleName, permission, enabled })
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to update permission' }, { status: 500 })
      }
    }
  )
}
