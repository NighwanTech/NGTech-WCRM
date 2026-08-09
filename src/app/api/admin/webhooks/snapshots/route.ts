import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { calculateDisasterRecoveryStatus, createQueueSnapshot } from '@/lib/security/hyperscale-ops-engine'

/**
 * GET /api/admin/webhooks/snapshots
 * Fetch Queue Snapshots & Disaster Recovery Status
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const dr = await calculateDisasterRecoveryStatus(ctx.accountId)
      return NextResponse.json(dr)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/webhooks/snapshots
 * Create Queue Snapshot
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const body = await req.json().catch(() => ({}))
      const { queueName = 'webhook-ingestion' } = body

      const snapshot = await createQueueSnapshot(queueName, ctx.accountId, ctx.userId)
      return NextResponse.json({ success: true, snapshot })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
