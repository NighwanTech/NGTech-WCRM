import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { runAIOperationsCopilot, replayWebhookPayload } from '@/lib/security/webhook-ops-engine'

/**
 * POST /api/admin/webhooks/copilot
 * AI Operations Copilot & Webhook Replay Debugger
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const body = await req.json().catch(() => ({}))
      const { action = 'scan', provider = 'meta', payload } = body

      if (action === 'replay') {
        const result = await replayWebhookPayload(provider, payload || { event: 'test_ping' }, ctx.accountId, ctx.userId)
        return NextResponse.json(result)
      }

      const copilot = await runAIOperationsCopilot(ctx.accountId)
      return NextResponse.json(copilot)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
