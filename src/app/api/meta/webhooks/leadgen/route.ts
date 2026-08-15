import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'

/**
 * Meta LeadGen Webhook Verification & Webhook Event Receiver
 * Route: /api/meta/webhooks/leadgen
 */

// GET - Meta Graph API Webhook Handshake Verification
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'aiwcrm_meta_leadgen_verify_token_2026'

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[MetaLeadGenWebhook] Webhook Handshake Verified Successfully!')
      return new Response(challenge, { status: 200 })
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST - Receive Live Meta LeadGen Webhook Notification & Persist to Attribution Engine
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('[MetaLeadGenWebhook] Incoming Event Body:', JSON.stringify(body))

    const db = getAdminClient()
    const entries = body.entry || []

    for (const entry of entries) {
      const changes = entry.changes || []
      for (const change of changes) {
        if (change.field === 'leadgen') {
          const leadData = change.value || {}
          const leadgenId = leadData.leadgen_id
          const formId = leadData.form_id
          const createdTime = leadData.created_time ? new Date(leadData.created_time * 1000).toISOString() : new Date().toISOString()

          // Log event to campaign_activity_timeline
          await db.from('campaign_activity_timeline').insert({
            account_id: '84fe6136-b819-449b-90e0-fdc90add7e2c',
            event_type: 'LeadCaptured',
            title: `Instant Meta Lead Captured: #${leadgenId}`,
            description: `Lead submitted via Meta Lead Form #${formId}`,
            metadata: { leadgen_id: leadgenId, form_id: formId, created_time: createdTime }
          })
        }
      }
    }

    return NextResponse.json({ success: true, received: true })
  } catch (err: any) {
    console.error('[MetaLeadGenWebhook] Event Handler Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
