import { getAdminClient } from '@/lib/admin-supabase'
import { CampaignFSM, CampaignStatus } from '@/lib/meta/campaign-domain'
import { getActiveMetaAdAccounts } from '@/lib/meta/db-adapter'
import { decryptToken } from '@/lib/meta/token-manager'
import { createAdSet, createAdCreative, createAd } from '@/lib/meta/graph-api'

const META_API_VERSION = process.env.META_API_VERSION || 'v20.0'
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

export interface CampaignPublishResult {
  success: boolean
  metaCampaignId?: string
  metaAdSetId?: string
  metaCreativeId?: string
  metaAdId?: string
  error?: string
  rolledBack?: boolean
}

export class CampaignPublishService {
  private static get db() {
    return getAdminClient()
  }

  /**
   * Execute End-to-End Meta Publishing Pipeline with Automatic Rollback
   * Workflow: Campaign -> Ad Set -> Creative -> Ad -> Database Persistence
   */
  public static async publishFullCampaign(
    campaignId: string,
    accountId: string,
    userId?: string
  ): Promise<CampaignPublishResult> {
    const db = this.db

    // 1. Fetch Hydrated Campaign Aggregate Root from DB
    const { data: campaign, error: campErr } = await db
      .from('marketing_campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('account_id', accountId)
      .single()

    if (campErr || !campaign) {
      throw new Error('Campaign aggregate not found')
    }

    // 2. Validate FSM State Transition (Must be APPROVED or DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED)
    if (campaign.status !== 'APPROVED' && campaign.status !== 'PUBLISHED') {
      CampaignFSM.validateTransition(campaign.status as CampaignStatus, 'PUBLISHED')
    }

    // 3. Fetch Decrypted Meta Access Token
    const accounts = await getActiveMetaAdAccounts(accountId, userId)
    if (!accounts || accounts.length === 0) {
      throw new Error('No active Meta Ad Account connected to this workspace')
    }

    const metaAcc = accounts[0]
    const token = decryptToken(metaAcc.access_token)
    const formattedAdAccountId = metaAcc.ad_account_id.startsWith('act_') ? metaAcc.ad_account_id : `act_${metaAcc.ad_account_id}`

    // Fetch Child Params
    const [stratRes, audRes, crtRes, bdgRes] = await Promise.all([
      db.from('campaign_strategies').select('*').eq('campaign_id', campaignId).single(),
      db.from('campaign_audiences').select('*').eq('campaign_id', campaignId).single(),
      db.from('campaign_creatives').select('*').eq('campaign_id', campaignId).single(),
      db.from('campaign_budgets').select('*').eq('campaign_id', campaignId).single()
    ])

    const strategy = stratRes.data || {}
    const audience = audRes.data || {}
    const creative = crtRes.data || {}
    const budget = bdgRes.data || {}

    let metaCampaignId: string | undefined = campaign.meta_campaign_id
    let metaAdSetId: string | undefined
    let metaCreativeId: string | undefined
    let metaAdId: string | undefined

    try {
      // -----------------------------------------------------------------
      // STEP 1: POST /campaigns (Meta Graph API)
      // -----------------------------------------------------------------
      if (!metaCampaignId) {
        const campUrl = `${BASE_URL}/${formattedAdAccountId}/campaigns`
        const campPayload = {
          name: campaign.name,
          objective: strategy.campaign_objective || 'OUTCOME_LEADS',
          status: 'PAUSED',
          special_ad_categories: ['NONE'],
          is_adset_budget_sharing_enabled: false,
          access_token: token
        }

        const startCamp = Date.now()
        const campRes = await fetch(campUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campPayload)
        })
        const campData = await campRes.json()
        const latCamp = Date.now() - startCamp

        // Log Publish History
        await db.from('campaign_publish_history').insert({
          account_id: accountId,
          campaign_id: campaignId,
          endpoint: 'POST /campaigns',
          request_payload: { ...campPayload, access_token: '[REDACTED]' },
          response_payload: campData,
          http_status: campRes.status,
          latency_ms: latCamp,
          status: campRes.status === 200 ? 'SUCCESS' : 'FAILED',
          error_message: campData.error?.message || null,
          meta_campaign_id: campData.id || null,
          created_by: userId
        })

        if (campData.error || !campData.id) {
          throw new Error(`Meta Campaign Creation Failed: ${campData.error?.message || 'Unknown Error'}`)
        }

        metaCampaignId = campData.id
      }

      // Update marketing_campaigns root
      await db.from('marketing_campaigns').update({
        status: 'PUBLISHED',
        meta_campaign_id: metaCampaignId,
        updated_at: new Date().toISOString()
      }).eq('id', campaignId)

      // -----------------------------------------------------------------
      // STEP 2: POST /adsets (Meta Graph API)
      // -----------------------------------------------------------------
      const adsetUrl = `${BASE_URL}/${formattedAdAccountId}/adsets`
      const dailyBudgetCents = Math.round((budget.daily_budget || 500) * 100)
      const adsetPayload = {
        name: `${campaign.name} - AdSet`,
        campaign_id: metaCampaignId,
        daily_budget: dailyBudgetCents,
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'LEAD_GENERATION',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
        promoted_object: {
          page_id: '556826294186459'
        },
        targeting: {
          geo_locations: { countries: ['IN'] }
        },
        status: 'PAUSED',
        access_token: token
      }

      const startAdset = Date.now()
      const adsetRes = await fetch(adsetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adsetPayload)
      })
      const adsetData = await adsetRes.json()
      const latAdset = Date.now() - startAdset

      await db.from('campaign_publish_history').insert({
        account_id: accountId,
        campaign_id: campaignId,
        endpoint: 'POST /adsets',
        request_payload: { ...adsetPayload, access_token: '[REDACTED]' },
        response_payload: adsetData,
        http_status: adsetRes.status,
        latency_ms: latAdset,
        status: adsetRes.status === 200 ? 'SUCCESS' : 'FAILED',
        error_message: adsetData.error?.message || null,
        meta_campaign_id: metaCampaignId,
        meta_adset_id: adsetData.id || null,
        created_by: userId
      })

      if (adsetData.error || !adsetData.id) {
        throw new Error(`Meta AdSet Creation Failed: ${adsetData.error?.message || 'Unknown Error'}`)
      }

      metaAdSetId = adsetData.id

      // Persist into campaign_adsets table
      await db.from('campaign_adsets').insert({
        account_id: accountId,
        campaign_id: campaignId,
        meta_adset_id: metaAdSetId,
        name: `${campaign.name} - AdSet`,
        status: 'PAUSED',
        daily_budget: budget.daily_budget || 500
      })

      // -----------------------------------------------------------------
      // STEP 3: POST /adcreatives (Meta Graph API)
      // -----------------------------------------------------------------
      const crtUrl = `${BASE_URL}/${formattedAdAccountId}/adcreatives`
      const crtPayload = {
        name: `${campaign.name} - Creative`,
        object_story_spec: {
          page_id: '556826294186459', // Valid Facebook Page ID from token scope audit
          link_data: {
            message: creative.primary_text || 'Connect on WhatsApp',
            name: creative.headline || campaign.name,
            link: 'https://www.aiwcrm.com'
          }
        },
        access_token: token
      }

      const startCrt = Date.now()
      const crtRes = await fetch(crtUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crtPayload)
      })
      const crtData = await crtRes.json()
      const latCrt = Date.now() - startCrt

      await db.from('campaign_publish_history').insert({
        account_id: accountId,
        campaign_id: campaignId,
        endpoint: 'POST /adcreatives',
        request_payload: { ...crtPayload, access_token: '[REDACTED]' },
        response_payload: crtData,
        http_status: crtRes.status,
        latency_ms: latCrt,
        status: crtRes.status === 200 ? 'SUCCESS' : 'FAILED',
        error_message: crtData.error?.message || null,
        meta_campaign_id: metaCampaignId,
        meta_adset_id: metaAdSetId,
        meta_creative_id: crtData.id || null,
        created_by: userId
      })

      if (crtData.error || !crtData.id) {
        throw new Error(`Meta AdCreative Creation Failed: ${crtData.error?.message || 'Unknown Error'}`)
      }

      metaCreativeId = crtData.id

      // -----------------------------------------------------------------
      // STEP 4: POST /ads (Meta Graph API)
      // -----------------------------------------------------------------
      const adUrl = `${BASE_URL}/${formattedAdAccountId}/ads`
      const adPayload = {
        name: `${campaign.name} - Ad`,
        adset_id: metaAdSetId,
        creative: { creative_id: metaCreativeId },
        status: 'PAUSED',
        access_token: token
      }

      const startAd = Date.now()
      const adRes = await fetch(adUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adPayload)
      })
      const adData = await adRes.json()
      const latAd = Date.now() - startAd

      await db.from('campaign_publish_history').insert({
        account_id: accountId,
        campaign_id: campaignId,
        endpoint: 'POST /ads',
        request_payload: { ...adPayload, access_token: '[REDACTED]' },
        response_payload: adData,
        http_status: adRes.status,
        latency_ms: latAd,
        status: adRes.status === 200 ? 'SUCCESS' : 'FAILED',
        error_message: adData.error?.message || null,
        meta_campaign_id: metaCampaignId,
        meta_adset_id: metaAdSetId,
        meta_creative_id: metaCreativeId,
        meta_ad_id: adData.id || null,
        created_by: userId
      })

      if (adData.error || !adData.id) {
        throw new Error(`Meta Ad Creation Failed: ${adData.error?.message || 'Unknown Error'}`)
      }

      metaAdId = adData.id

      // Persist into campaign_ads table
      await db.from('campaign_ads').insert({
        account_id: accountId,
        campaign_id: campaignId,
        meta_ad_id: metaAdId,
        meta_creative_id: metaCreativeId,
        name: `${campaign.name} - Ad`,
        headline: creative.headline,
        primary_text: creative.primary_text,
        cta: creative.cta || 'Send WhatsApp Message',
        status: 'PAUSED'
      })

      // Log Domain Event
      await db.from('campaign_events').insert({
        campaign_id: campaignId,
        actor_id: userId,
        event_type: 'FullMetaPipelinePublished',
        title: 'Full Meta Graph API Pipeline Published',
        details: `Created Campaign (${metaCampaignId}), AdSet (${metaAdSetId}), Creative (${metaCreativeId}), Ad (${metaAdId})`
      })

      return {
        success: true,
        metaCampaignId,
        metaAdSetId,
        metaCreativeId,
        metaAdId
      }
    } catch (err: any) {
      console.error('[CampaignPublishService] Pipeline Exception:', err.message)

      // ROLLBACK ENGINE
      await db.from('marketing_campaigns').update({
        status: 'DRAFT',
        updated_at: new Date().toISOString()
      }).eq('id', campaignId)

      await db.from('campaign_events').insert({
        campaign_id: campaignId,
        actor_id: userId,
        event_type: 'MetaPublishFailed',
        title: 'Meta Graph API Publishing Failed - Rolled Back',
        details: err.message
      })

      return {
        success: false,
        metaCampaignId,
        metaAdSetId,
        metaCreativeId,
        metaAdId,
        error: err.message,
        rolledBack: true
      }
    }
  }
}
