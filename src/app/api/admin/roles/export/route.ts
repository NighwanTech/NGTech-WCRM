import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getAdminClient } from '@/lib/admin-supabase'
import { logAudit } from '@/lib/security/audit'

export async function GET(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'rbac:manage' },
    async ({ accountId }) => {
      const admin = getAdminClient()

      const { data: roles } = await admin.from('custom_roles').select('*').eq('account_id', accountId).is('deleted_at', null)
      const { data: permissions } = await admin.from('role_permissions').select('*').eq('account_id', accountId)

      const exportBundle = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        accountId,
        roles: roles || [],
        permissions: permissions || [],
      }

      return NextResponse.json(exportBundle)
    }
  )
}

export async function POST(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'rbac:manage' },
    async ({ accountId, userId }) => {
      try {
        const bundle = await request.json()

        if (!bundle || !Array.isArray(bundle.roles)) {
          return NextResponse.json({ error: 'Invalid JSON role bundle format' }, { status: 400 })
        }

        const admin = getAdminClient()
        let importedCount = 0

        for (const roleObj of bundle.roles) {
          const { data: role } = await admin
            .from('custom_roles')
            .upsert(
              {
                account_id: accountId,
                name: roleObj.name,
                description: roleObj.description || null,
                data_scope: roleObj.data_scope || 'all',
                is_system: false,
              },
              { onConflict: 'account_id,name' }
            )
            .select()
            .single()

          if (role) importedCount++
        }

        await logAudit({
          action: 'role_bundle.import',
          accountId,
          userId,
          severity: 'high',
          request,
          metadata: { importedCount },
        })

        return NextResponse.json({ success: true, importedCount })
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to import role bundle' }, { status: 500 })
      }
    }
  )
}
