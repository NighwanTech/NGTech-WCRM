import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { ContinuousLearningEngine } from '@/lib/meta/continuous-learning-engine'
import { RollbackService } from '@/lib/meta/rollback-service'

/**
 * Enterprise AI Performance & Rollback Management API (/api/meta/v1/ai/performance)
 */

// GET - Fetch AI performance metrics, success %, ROAS lift, and model accuracy
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const metrics = await ContinuousLearningEngine.getAIPerformanceMetrics(ctx.accountId)
      return NextResponse.json({ success: true, metrics })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

// POST - Execute atomic rollback for a campaign or recommendation action
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { campaignId, recommendationId, queueId, rollbackReason } = body

      if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 })

      const result = await RollbackService.executeRollback({
        accountId: ctx.accountId,
        campaignId,
        recommendationId,
        queueId,
        rollbackReason: rollbackReason || 'Manual User Triggered Rollback',
        rolledBackByUserId: ctx.userId
      })

      return NextResponse.json({ success: true, result })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}
