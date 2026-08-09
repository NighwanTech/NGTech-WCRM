import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { generateAuditEvidencePack } from '@/lib/security/enterprise-compliance-engine'

/**
 * POST /api/admin/compliance/evidence
 * Generate 1-Click Downloadable Audit Evidence Pack
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:manage' }, async (ctx) => {
    try {
      const body = await req.json().catch(() => ({}))
      const { frameworkId = 'gdpr' } = body

      const pack = await generateAuditEvidencePack(ctx.accountId, frameworkId)
      return NextResponse.json({ success: true, pack })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
