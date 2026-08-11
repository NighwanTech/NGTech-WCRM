import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getEnterpriseGovernanceReport } from '@/lib/admin/enterprise-governance'

export async function GET(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'security:read' },
    async ({ accountId }) => {
      const report = await getEnterpriseGovernanceReport(accountId)
      return NextResponse.json(report)
    }
  )
}
