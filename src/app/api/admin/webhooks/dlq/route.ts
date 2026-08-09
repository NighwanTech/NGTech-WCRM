import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'
import { processDLQJob } from '@/lib/security/webhook-ops-engine'

/**
 * GET /api/admin/webhooks/dlq
 * Fetch Dead Letter Queue (DLQ) items
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: jobs } = await supabase
        .from('dead_letter_jobs')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })

      return NextResponse.json({ jobs: jobs || [] })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/webhooks/dlq
 * Process DLQ action (retry, discard)
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const body = await req.json()
      const { action = 'retry', jobId } = body

      if (!jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 })

      const result = await processDLQJob(jobId, action as any, ctx.accountId, ctx.userId)
      return NextResponse.json(result)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
