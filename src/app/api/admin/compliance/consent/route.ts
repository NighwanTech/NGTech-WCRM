import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/security/audit'

/**
 * GET /api/admin/compliance/consent
 * Fetch Multi-Channel Consent Records
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: records } = await supabase
        .from('consent_records')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('granted_at', { ascending: false })
        .limit(100)

      return NextResponse.json({ records: records || [] })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/compliance/consent
 * Grant or Withdraw Consent
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:manage' }, async (ctx) => {
    try {
      const body = await req.json()
      const { action = 'grant', recordId, channel = 'whatsapp', purpose = 'Marketing Communications', source = 'Web Form' } = body
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

      const supabase = await createClient()

      if (action === 'withdraw') {
        if (!recordId) return NextResponse.json({ error: 'recordId is required' }, { status: 400 })

        await supabase
          .from('consent_records')
          .update({
            status: 'withdrawn',
            withdrawn_at: new Date().toISOString(),
          })
          .eq('id', recordId)
          .eq('account_id', ctx.accountId)

        await logAudit({
          action: 'consent_withdrawn',
          accountId: ctx.accountId,
          userId: ctx.userId,
          severity: 'high',
          request: req,
          metadata: { recordId, channel },
        })

        return NextResponse.json({ success: true, status: 'withdrawn' })
      }

      // Grant new consent record
      const { data: created, error } = await supabase
        .from('consent_records')
        .insert({
          account_id: ctx.accountId,
          channel,
          purpose,
          status: 'granted',
          ip_address: clientIp,
          source,
          granted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      await logAudit({
        action: 'consent_granted',
        accountId: ctx.accountId,
        userId: ctx.userId,
        severity: 'medium',
        request: req,
        metadata: { recordId: created.id, channel, purpose },
      })

      return NextResponse.json({ success: true, record: created })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
