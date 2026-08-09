import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { getActiveMetaAdAccounts } from '@/lib/meta/db-adapter'
import { createMetaAdCampaign } from '@/lib/meta/campaign-launcher'
import { decryptToken } from '@/lib/meta/token-manager'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { name, objective, dailyBudget, headline, primaryText, ctaText, ageMin, ageMax, location, adAccountId } = body

      if (!name || !headline || !primaryText) {
        return NextResponse.json({ error: 'name, headline, and primaryText are required' }, { status: 400 })
      }

      const db = getAdminClient()

      // 1. Fetch connected Meta Ad Account (match target adAccountId if provided)
      const accounts = await getActiveMetaAdAccounts(ctx.accountId, ctx.userId)
      const adAccount = adAccountId 
        ? (accounts.find(a => a.ad_account_id === adAccountId) || accounts?.[0] || null)
        : (accounts?.[0] || null)

      let metaCampaignId = null

      // 2. Launch programmatically via Graph API if token available
      if (adAccount?.access_token) {
        const decryptedToken = decryptToken(adAccount.access_token)
        const launchResult = await createMetaAdCampaign({
          adAccountId: adAccount.ad_account_id,
          accessToken: decryptedToken,
          name,
          objective: objective || 'OUTCOME_ENGAGEMENT',
          dailyBudget: Number(dailyBudget || 500),
          headline,
          primaryText,
          ctaText: ctaText || 'Send WhatsApp Message',
        })

        metaCampaignId = launchResult.campaignId || null
      }

      // 3. Generate tracking ref param for Click-to-WhatsApp link
      const waRefParam = `meta_ad_${Date.now()}`

      // 4. Save campaign in ai_ad_campaigns safely
      let campaign = null

      const { data: byAccount, error: campErrAcc } = await db
        .from('ai_ad_campaigns')
        .insert({
          account_id: ctx.accountId,
          meta_campaign_id: metaCampaignId,
          name,
          objective: objective || 'OUTCOME_ENGAGEMENT',
          ai_generated: true,
          daily_budget: Number(dailyBudget || 500),
          status: metaCampaignId ? 'active' : 'draft',
          destination_type: 'whatsapp',
          wa_ref_param: waRefParam,
        })
        .select()
        .maybeSingle()

      if (!campErrAcc && byAccount) {
        campaign = byAccount
      } else {
        // Fallback with workspace_id
        const { data: byWs } = await db
          .from('ai_ad_campaigns')
          .insert({
            workspace_id: ctx.accountId,
            meta_campaign_id: metaCampaignId,
            name,
            objective: objective || 'OUTCOME_ENGAGEMENT',
            ai_generated: true,
            daily_budget: Number(dailyBudget || 500),
            status: metaCampaignId ? 'active' : 'draft',
            destination_type: 'whatsapp',
            wa_ref_param: waRefParam,
          })
          .select()
          .maybeSingle()

        campaign = byWs
      }

      if (campaign) {
        // 5. Save creative details
        try {
          await db.from('ai_ad_creatives').insert({
            campaign_id: campaign.id,
            headline,
            primary_text: primaryText,
            cta_text: ctaText || 'Send WhatsApp Message',
          })
        } catch {
          // ignore creative insert error
        }

        // 6. Save audience details
        try {
          await db.from('ai_ad_audience').insert({
            campaign_id: campaign.id,
            location: location || 'India',
            age_min: ageMin || 18,
            age_max: ageMax || 65,
          })
        } catch {
          // ignore audience insert error
        }
      }

      return NextResponse.json({
        success: true,
        campaign: campaign || {
          name,
          status: metaCampaignId ? 'active' : 'draft',
          meta_campaign_id: metaCampaignId,
          wa_ref_param: waRefParam,
        },
        waRefParam,
      })
    } catch (error: any) {
      console.error('Launch AI Ad Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
