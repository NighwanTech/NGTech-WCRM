import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { createMetaAdCampaign } from '@/lib/meta/campaign-launcher'
import { decryptToken } from '@/lib/meta/token-manager'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { name, objective, dailyBudget, headline, primaryText, ctaText, ageMin, ageMax, location } = body

      if (!name || !headline || !primaryText) {
        return NextResponse.json({ error: 'name, headline, and primaryText are required' }, { status: 400 })
      }

      const db = supabaseAdmin()

      // 1. Fetch connected Meta Ad Account
      const { data: adAccount } = await db
        .from('meta_ad_accounts')
        .select('*')
        .eq('account_id', ctx.accountId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

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

      // 4. Save campaign in ai_ad_campaigns
      const { data: campaign, error: campErr } = await db
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
        .single()

      if (campErr || !campaign) {
        throw new Error(`Failed to save AI ad campaign: ${campErr?.message}`)
      }

      // 5. Save creative details
      await db.from('ai_ad_creatives').insert({
        campaign_id: campaign.id,
        headline,
        primary_text: primaryText,
        cta_text: ctaText || 'Send WhatsApp Message',
      })

      // 6. Save audience details
      await db.from('ai_ad_audience').insert({
        campaign_id: campaign.id,
        location: location || 'India',
        age_min: ageMin || 18,
        age_max: ageMax || 65,
      })

      return NextResponse.json({
        success: true,
        campaign,
        waRefParam,
      })
    } catch (error: any) {
      console.error('Launch AI Ad Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
