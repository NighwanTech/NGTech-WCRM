import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getAdminClient } from '@/lib/admin-supabase'
import { logAudit } from '@/lib/security/audit'
import { generateSecureToken } from '@/lib/security/crypto'

export async function POST(request: Request) {
  return withZeroTrustGuard(
    request,
    { permission: 'security:read' },
    async ({ accountId, userId }) => {
      try {
        const body = await request.json()
        const { justification } = body

        if (!justification || justification.trim().length < 10) {
          return NextResponse.json({ error: 'Mandatory justification input required (minimum 10 characters)' }, { status: 400 })
        }

        const admin = getAdminClient()
        const emergencyToken = `BG-${generateSecureToken(16)}`
        const expiresAt = new Date(Date.now() + 2 * 3600 * 1000).toISOString() // 2 hours emergency window

        await admin.from('break_glass_events').insert({
          account_id: accountId,
          triggered_by: userId,
          justification: justification.trim(),
          session_token: emergencyToken,
          expires_at: expiresAt,
        })

        // Log CRITICAL audit event
        await logAudit({
          action: 'break_glass.trigger',
          accountId,
          userId,
          severity: 'critical',
          request,
          metadata: { justification, sessionToken: emergencyToken, expiresAt },
        })

        return NextResponse.json({
          success: true,
          emergencyToken,
          expiresAt,
          message: 'Break Glass emergency access activated. Session expires in 2 hours.',
        })
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Failed to trigger Break Glass access' }, { status: 500 })
      }
    }
  )
}
