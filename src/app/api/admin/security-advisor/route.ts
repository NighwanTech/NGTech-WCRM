import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { generateSecurityAdvisorReport } from '@/lib/security/security-advisor'

export async function GET(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'security:read' },
    async ({ accountId }) => {
      const report = await generateSecurityAdvisorReport(accountId)
      return NextResponse.json(report)
    }
  )
}
