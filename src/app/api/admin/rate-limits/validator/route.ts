import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { runRateLimitPolicyAudit } from '@/lib/security/rate-limit-governance-engine'

/**
 * GET /api/admin/rate-limits/validator
 * Continuous route coverage & conflict validator engine
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'rate_limits:manage' }, async (ctx) => {
    try {
      const auditResult = await runRateLimitPolicyAudit(ctx.accountId)
      return NextResponse.json(auditResult)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
