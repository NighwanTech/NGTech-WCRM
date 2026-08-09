import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { runAIComplianceCopilot } from '@/lib/security/enterprise-compliance-engine'

/**
 * POST /api/admin/compliance/copilot
 * Conversational AI Compliance Copilot & Remediation Guidance
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const body = await req.json().catch(() => ({}))
      const { prompt } = body

      const result = await runAIComplianceCopilot(ctx.accountId, prompt)
      return NextResponse.json(result)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
