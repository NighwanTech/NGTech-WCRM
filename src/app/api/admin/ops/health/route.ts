import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { generateEnterpriseOpsReport } from '@/lib/operations/ops-monitor'

export async function GET(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'security:read' },
    async ({ accountId }) => {
      const opsReport = await generateEnterpriseOpsReport(accountId)
      return NextResponse.json(opsReport)
    }
  )
}
