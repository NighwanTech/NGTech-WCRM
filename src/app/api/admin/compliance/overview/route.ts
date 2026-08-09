import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { calculateComplianceScorecard, runAIComplianceCopilot } from '@/lib/security/enterprise-compliance-engine'

/**
 * GET /api/admin/compliance/overview
 * Real-time Compliance Scorecard, Framework Readiness, KPIs & Recommendations
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const scorecard = await calculateComplianceScorecard(ctx.accountId)
      const advisor = await runAIComplianceCopilot(ctx.accountId)

      return NextResponse.json({
        ...scorecard,
        recommendations: advisor.recommendations,
      })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
