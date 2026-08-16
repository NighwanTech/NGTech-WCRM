import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { SmartDuplicateResolver } from '@/lib/meta/smart-duplicate-resolver'
import { LeadQualificationEngine } from '@/lib/ai/lead-qualification-engine'
import { LeadRouterEngine } from '@/lib/meta/lead-router-engine'
import { WhatsAppAIConversationEngine } from '@/lib/meta/whatsapp-ai-conversation-engine'
import { eventBus } from '@/lib/ai/event-bus'

/**
 * GET - Meta Webhook Verification (hub.challenge)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === (process.env.META_WEBHOOK_VERIFY_TOKEN || 'wacrm_meta_verify_token')) {
    return new Response(challenge, { status: 200 })
  }

  return NextResponse.json({ status: 'active', service: 'AIWCRM Universal Lead Intake Platform API' })
}

/**
 * POST - Universal Lead Intake Endpoint (Meta Instant Forms, Website, Excel, Google Sheets, API, WhatsApp)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = getAdminClient()

    let accountId = body.accountId || 'acc_default_01'
    let leadName = body.name || 'Meta Instant Lead'
    let phone = body.phone || '+919876543210'
    let email = body.email || 'lead@example.com'
    let city = body.city || 'Patna'
    let sourceType = body.sourceType || 'META_INSTANT_FORM'
    let campaignId = body.campaignId || 'cmp_patna_leadgen_01'
    let adsetId = body.adsetId || 'adset_patna_25km'
    let adId = body.adId || 'ad_poster_hook_01'

    // If payload is raw Meta Webhook
    if (body.entry && body.entry[0]?.changes) {
      const value = body.entry[0].changes[0].value
      const leadgenId = value.leadgen_id
      campaignId = value.campaign_id || campaignId
      adsetId = value.adset_id || adsetId
      adId = value.ad_id || adId

      // Log raw event safely
      try {
        await db.from('meta_leadgen_events').insert({
          account_id: accountId,
          leadgen_id: leadgenId,
          source_type: 'META_INSTANT_FORM',
          form_id: value.form_id,
          page_id: value.page_id,
          campaign_id: campaignId,
          adset_id: adsetId,
          ad_id: adId,
          field_data: value
        })
      } catch (e) {
        console.warn('[IntakeAPI] Non-critical leadgen event insert fallback:', e)
      }
    }

    // 1. Duplicate Resolution
    const dupResult = await SmartDuplicateResolver.resolveContact({
      accountId,
      name: leadName,
      phone,
      email,
      city,
      campaignId,
      adsetId,
      adId
    })

    // 2. AI Qualification & Scoring
    const qualification = await LeadQualificationEngine.qualifyLead({
      accountId,
      contactId: dupResult.contactId,
      formAnswers: body.answers || {},
      source: sourceType
    })

    // 3. Lead Routing
    const routing = await LeadRouterEngine.routeLead({
      accountId,
      contactId: dupResult.contactId,
      city,
      budget: qualification.estimatedRevenue
    })

    // 4. WhatsApp AI Sales Assistant Conversation Start
    const whatsapp = await WhatsAppAIConversationEngine.processLeadGreeting({
      accountId,
      contactId: dupResult.contactId,
      name: leadName,
      phone
    })

    // 5. Emit Event on Universal Event Bus
    await eventBus.emit({
      eventType: 'LEAD_CREATED',
      accountId,
      contactId: dupResult.contactId,
      campaignId,
      adsetId,
      adId,
      payload: {
        dupResult,
        qualification,
        routing,
        whatsapp
      }
    })

    // 6. Log in Universal Lead Activity Timeline
    try {
      await db.from('lead_activity_timeline').insert({
        account_id: accountId,
        contact_id: dupResult.contactId,
        event_type: 'LEAD_CREATED',
        title: `Lead Acquired via ${sourceType}`,
        description: `AI Score: ${qualification.leadScore}/100 • Intent: ${qualification.buyingIntent} • Assigned: ${routing.assignedUser}`,
        actor_type: 'SYSTEM',
        actor_name: 'Universal Intake Engine'
      })
    } catch (e) {
      console.warn('[IntakeAPI] Non-critical timeline insert fallback:', e)
    }

    return NextResponse.json({
      success: true,
      message: 'Lead processed successfully',
      contactId: dupResult.contactId,
      actionTaken: dupResult.actionTaken,
      leadScore: qualification.leadScore,
      buyingIntent: qualification.buyingIntent,
      assignedUser: routing.assignedUser,
      whatsappGreeting: whatsapp.messageText
    })
  } catch (error: any) {
    console.error('[IntakeAPI] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
