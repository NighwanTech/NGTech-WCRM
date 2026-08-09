import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/compliance/exceptions
 * Fetch Policy Exception Approvals
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: exceptions } = await supabase
        .from('compliance_policy_exceptions')
        .select('*')
        .eq('account_id', ctx.accountId)

      const defaults = [
        { id: 'ex1', policy_name: 'Temporary 90-Day Audit Log Retention Waiver', justification: 'Migration of legacy logs', expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), status: 'active' },
      ]

      return NextResponse.json({ exceptions: exceptions && exceptions.length > 0 ? exceptions : defaults })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/compliance/exceptions
 * Create Policy Exception Approval
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:manage' }, async (ctx) => {
    try {
      const body = await req.json()
      const { policyName, justification, durationDays = 30 } = body

      if (!policyName || !justification) {
        return NextResponse.json({ error: 'policyName and justification are required' }, { status: 400 })
      }

      const expiresAt = new Date(Date.now() + Number(durationDays) * 24 * 60 * 60 * 1000).toISOString()

      const supabase = await createClient()
      const { data: created, error } = await supabase
        .from('compliance_policy_exceptions')
        .insert({
          account_id: ctx.accountId,
          policy_name: policyName,
          justification,
          approved_by: ctx.userId,
          expires_at: expiresAt,
          status: 'active',
        })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, exception: created })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
