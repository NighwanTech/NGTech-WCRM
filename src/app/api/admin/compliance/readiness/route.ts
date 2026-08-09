import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { evaluateAuditReadinessCenter } from '@/lib/security/compliance-risk-engine'

/**
 * GET /api/admin/compliance/readiness
 * Audit Readiness Center Status & SHA-256 Evidence Integrity Verification
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const readiness = await evaluateAuditReadinessCenter(ctx.accountId)
      return NextResponse.json(readiness)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
