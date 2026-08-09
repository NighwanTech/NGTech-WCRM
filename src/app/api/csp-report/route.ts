import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/security/audit'

export async function POST(request: Request) {
  try {
    const report = await request.json().catch(() => null)

    if (report) {
      console.warn('[CSP Violation Report Received]', JSON.stringify(report, null, 2))

      await logAudit({
        action: 'csp.violation',
        severity: 'medium',
        request,
        changes: { after: report },
      })
    }

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('[CSP Report Error]', err)
    return new Response(null, { status: 204 })
  }
}
