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

      const { data: customRoles } = await admin
        .from('custom_roles')
        .select('*')
        .eq('account_id', accountId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })

      return NextResponse.json({ customRoles: customRoles || [] })
    }
  )
}

export async function POST(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'rbac:manage' },
    async ({ accountId, userId }) => {
      try {
        const body = await request.json()
        const { name, description } = body

        if (!name || typeof name !== 'string') {
          return NextResponse.json({ error: 'Role name is required' }, { status: 400 })
        }

        const admin = getAdminClient()

        // Insert new custom role
        const { data: role, error } = await admin
          .from('custom_roles')
          .insert({
            account_id: accountId,
            name: name.trim(),
            description: description ? description.trim() : null,
            is_system: false,
          })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            return NextResponse.json({ error: `Role '${name}' already exists in this workspace` }, { status: 400 })
          }
          throw error
        }

        await logAudit({
          action: 'custom_role.create',
          accountId,
          userId,
          severity: 'high',
          request,
          metadata: { roleName: name },
        })

        return NextResponse.json({ role })
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to create custom role' }, { status: 500 })
      }
    }
  )
}

export async function DELETE(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'rbac:manage' },
    async ({ accountId, userId }) => {
      try {
        const { searchParams } = new URL(request.url)
        const roleId = searchParams.get('id')

        if (!roleId) {
          return NextResponse.json({ error: 'Role ID required' }, { status: 400 })
        }

        const admin = getAdminClient()

        // Verify role exists and is not a system role
        const { data: role } = await admin
          .from('custom_roles')
          .select('name, is_system')
          .eq('id', roleId)
          .eq('account_id', accountId)
          .single()

        if (!role) {
          return NextResponse.json({ error: 'Role not found' }, { status: 404 })
        }

        if (role.is_system) {
          return NextResponse.json({ error: 'System roles cannot be deleted' }, { status: 400 })
        }

        // Soft delete role
        await admin
          .from('custom_roles')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', roleId)

        await logAudit({
          action: 'custom_role.delete',
          accountId,
          userId,
          severity: 'high',
          request,
          metadata: { roleName: role.name },
        })

        return NextResponse.json({ success: true })
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to delete role' }, { status: 500 })
      }
    }
  )
}
