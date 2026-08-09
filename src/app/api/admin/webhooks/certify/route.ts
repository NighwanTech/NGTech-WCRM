import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { runHyperscaleCertificationValidator } from '@/lib/security/hyperscale-ops-engine'

/**
 * GET /api/admin/webhooks/certify
 * Enterprise Operations Certification Report Generator
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'webhooks:read' }, async (ctx) => {
    try {
      const cert = await runHyperscaleCertificationValidator(ctx.accountId)
      return NextResponse.json(cert)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
