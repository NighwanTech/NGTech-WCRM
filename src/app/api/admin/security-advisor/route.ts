import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import {
  generateSecurityAdvisorReport,
  runOnDemandSecurityAudit,
  generateDeveloperSecurityReportHtml,
} from '@/lib/security/security-advisor'

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

export async function POST(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'security:manage' },
    async ({ accountId }) => {
      const { action } = await request.json().catch(() => ({}))

      if (action === 'download_report') {
        const report = await generateSecurityAdvisorReport(accountId)
        const htmlContent = generateDeveloperSecurityReportHtml(report)
        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': `attachment; filename="aiwcrm_developer_security_report_${Date.now()}.html"`,
          },
        })
      }

      const auditResult = await runOnDemandSecurityAudit(accountId)
      return NextResponse.json(auditResult)
    }
  )
}
