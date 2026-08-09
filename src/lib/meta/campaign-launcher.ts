const META_API_VERSION = process.env.META_API_VERSION || 'v20.0'
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

export interface LaunchCampaignOptions {
  adAccountId: string
  accessToken: string
  name: string
  objective: string
  dailyBudget: number
  headline: string
  primaryText: string
  ctaText: string
  waPhoneRef?: string
}

/**
 * Programmatically create a Meta Ad Campaign via Graph API
 */
export async function createMetaAdCampaign(options: LaunchCampaignOptions): Promise<{
  success: boolean
  campaignId?: string
  adsetId?: string
  adId?: string
  error?: string
}> {
  const { adAccountId, accessToken, name, objective, dailyBudget, headline, primaryText, ctaText } = options

  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`

  try {
    // 1. Create Campaign
    const campaignRes = await fetch(`${BASE_URL}/${formattedAccountId}/campaigns?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `[AIWCRM] ${name}`,
        objective: objective || 'OUTCOME_ENGAGEMENT',
        status: 'PAUSED', // Start paused for review and safety
        special_ad_categories: ['NONE'],
      }),
    })

    const campaignData = await campaignRes.json()

    if (campaignData.error) {
      throw new Error(`Campaign creation failed: ${campaignData.error.message || JSON.stringify(campaignData.error)}`)
    }

    const campaignId = campaignData.id

    // 2. Create AdSet
    const adsetRes = await fetch(`${BASE_URL}/${formattedAccountId}/adsets?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `AdSet - ${name}`,
        campaign_id: campaignId,
        daily_budget: Math.round(dailyBudget * 100), // convert to cents/paise
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'REACH',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
        status: 'PAUSED',
        targeting: {
          geo_locations: { countries: ['IN'] },
          age_min: 18,
          age_max: 65,
        },
      }),
    })

    const adsetData = await adsetRes.json()

    return {
      success: true,
      campaignId,
      adsetId: adsetData.id || undefined,
    }
  } catch (err: any) {
    console.error('Meta Campaign Launcher Error:', err)
    return {
      success: false,
      error: err.message,
    }
  }
}
