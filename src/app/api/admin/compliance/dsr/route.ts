import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'
import { executeDSRWorkflow } from '@/lib/security/enterprise-compliance-engine'
import { logAudit } from '@/lib/security/audit'

/**
 * GET /api/admin/compliance/dsr
 * Fetch Data Subject Requests (DSR) queue
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: requests } = await supabase
        .from('dsr_requests')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })

      return NextResponse.json({ requests: requests || [] })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/compliance/dsr
 * Create or execute DSR action (approve, complete, reject)
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:manage' }, async (ctx) => {
    try {
      const body = await req.json()
      const { action = 'create', requestId, requestType = 'export', subjectEmail, reason } = body

      const supabase = await createClient()

      if (action === 'create') {
        if (!subjectEmail) {
          return NextResponse.json({ error: 'Subject Email is required' }, { status: 400 })
        }

        const { data: created, error } = await supabase
          .from('dsr_requests')
          .insert({
            account_id: ctx.accountId,
            request_type: requestType,
            subject_email: subjectEmail,
            status: 'pending',
            reason: reason || 'Data Subject Privacy Request',
            created_by: ctx.userId,
          })
          .select()
          .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        await logAudit({
          action: 'dsr_request_submitted',
          accountId: ctx.accountId,
          userId: ctx.userId,
          severity: 'high',
          request: req,
          metadata: { requestId: created.id, requestType, subjectEmail },
        })

        return NextResponse.json({ success: true, request: created })
      }

      if (['approve', 'complete', 'reject'].includes(action)) {
        if (!requestId) return NextResponse.json({ error: 'requestId is required' }, { status: 400 })

        const result = await executeDSRWorkflow(requestId, action as any, ctx.accountId, ctx.userId)
        return NextResponse.json(result)
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
