import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getQueueHealthOverview } from '@/lib/security/webhook-ops-engine'

/**
 * GET /api/admin/webhooks/queues
 * Fetch all background queue pools and worker stats
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const overview = await getQueueHealthOverview(ctx.accountId)
      return NextResponse.json({ queues: overview.queues })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
