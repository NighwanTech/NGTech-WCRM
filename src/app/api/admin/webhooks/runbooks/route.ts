import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/webhooks/runbooks
 * Operational Playbooks & Runbooks
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const defaultRunbooks = [
        {
          id: 'rb_1',
          title: 'Meta Webhook Rate Limit Spillover Recovery',
          category: 'Rate Limiting',
          triggerCondition: 'HTTP 429 spike on Meta Cloud API',
          remediationSteps: '1. Scale worker concurrency to 60. 2. Enable fast-path cache. 3. Re-enqueue DLQ backlog.',
          status: 'active',
        },
        {
          id: 'rb_2',
          title: 'Redis Queue Memory Optimization',
          category: 'Queue Engine',
          triggerCondition: 'Redis memory utilization > 80%',
          remediationSteps: '1. Purge completed jobs older than 24h. 2. Compact stream keys.',
          status: 'active',
        },
      ]

      const supabase = await createClient()
      const { data: runbooks } = await supabase
        .from('operations_runbooks')
        .select('*')
        .eq('account_id', ctx.accountId)

      return NextResponse.json({ runbooks: runbooks && runbooks.length > 0 ? runbooks : defaultRunbooks })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
