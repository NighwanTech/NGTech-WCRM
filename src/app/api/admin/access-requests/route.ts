import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getAdminClient } from '@/lib/admin-supabase'
import { logAudit } from '@/lib/security/audit'

export async function GET(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'security:read' },
    async ({ accountId }) => {
      const admin = getAdminClient()

      const { data: requests } = await admin
        .from('access_requests')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })

      return NextResponse.json({ requests: requests || [] })
    }
  )
}

export async function POST(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'security:read' },
    async ({ accountId, userId }) => {
      try {
        const body = await request.json()
        const { action, requestId, requestedPermission, durationHours, reason } = body
        const admin = getAdminClient()

        if (action === 'create') {
          if (!requestedPermission || !reason) {
            return NextResponse.json({ error: 'requestedPermission and reason required' }, { status: 400 })
          }

          const { data: req, error } = await admin
            .from('access_requests')
            .insert({
              account_id: accountId,
              user_id: userId,
              requested_permission: requestedPermission,
              duration_hours: durationHours || 4,
              reason: reason.trim(),
              status: 'PENDING',
            })
            .select()
            .single()

          if (error) throw error

          await logAudit({
            action: 'access_request.create',
            accountId,
            userId,
            severity: 'medium',
            request,
            metadata: { requestedPermission, durationHours },
          })

          return NextResponse.json({ request: req })
        }

        if (action === 'approve' || action === 'reject') {
          if (!requestId) {
            return NextResponse.json({ error: 'requestId required' }, { status: 400 })
          }

          const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'
          const expiresAt = action === 'approve' ? new Date(Date.now() + (durationHours || 4) * 3600 * 1000).toISOString() : null

          await admin
            .from('access_requests')
            .update({
              status: newStatus,
              approved_by: userId,
              expires_at: expiresAt,
            })
            .eq('id', requestId)
            .eq('account_id', accountId)

          await logAudit({
            action: `access_request.${action}`,
            accountId,
            userId,
            severity: 'high',
            request,
            metadata: { requestId, newStatus },
          })

          return NextResponse.json({ success: true, status: newStatus })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Access request operation failed' }, { status: 500 })
      }
    }
  )
}
