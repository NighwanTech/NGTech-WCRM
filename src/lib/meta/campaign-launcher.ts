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
  imageUrl?: string
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
  const { adAccountId, accessToken, name, objective, dailyBudget, headline, primaryText, ctaText, imageUrl } = options

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
      const msg = campaignData.error.error_user_msg || campaignData.error.message || JSON.stringify(campaignData.error)
      throw new Error(`Meta Campaign Error: ${msg}`)
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

    if (adsetData.error) {
      const msg = adsetData.error.error_user_msg || adsetData.error.message || JSON.stringify(adsetData.error)
      throw new Error(`Meta AdSet Error: ${msg}`)
    }

    const adsetId = adsetData.id

    // 3. Fetch connected Page ID for Ad Creative
    let pageId: string | null = null
    try {
      const pagesRes = await fetch(`${BASE_URL}/me/accounts?access_token=${accessToken}`)
      const pagesData = await pagesRes.json()
      if (pagesData?.data?.length > 0) {
        pageId = pagesData.data[0].id
      }
    } catch {
      // ignore page fetch error
    }

    // 4. Create Ad Creative on Meta
    let creativeId: string | null = null
    try {
      const creativePayload: any = {
        name: `Creative - ${name}`,
      }

      if (pageId) {
        creativePayload.object_story_spec = {
          page_id: pageId,
          link_data: {
            message: primaryText,
            name: headline,
            link: `https://wa.me/?text=Hi%20Interested%20in%20${encodeURIComponent(name)}`,
            ...(imageUrl && !imageUrl.startsWith('data:') ? { image_url: imageUrl } : {}),
            call_to_action: {
              type: 'MESSAGE_PAGE',
              value: {
                link: `https://wa.me/?text=Hi%20Interested%20in%20${encodeURIComponent(name)}`,
              },
            },
          },
        }
      }

      const creativeRes = await fetch(`${BASE_URL}/${formattedAccountId}/adcreatives?access_token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creativePayload),
      })
      const creativeData = await creativeRes.json()
      if (creativeData.id) {
        creativeId = creativeData.id
      }
    } catch (creativeErr) {
      console.warn('Creative creation non-fatal warning:', creativeErr)
    }

    // 5. Create Ad on Meta
    let adId: string | null = null
    if (adsetId && creativeId) {
      try {
        const adRes = await fetch(`${BASE_URL}/${formattedAccountId}/ads?access_token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Ad - ${name}`,
            adset_id: adsetId,
            creative: { creative_id: creativeId },
            status: 'PAUSED',
          }),
        })
        const adData = await adRes.json()
        if (adData.id) {
          adId = adData.id
        }
      } catch (adErr) {
        console.warn('Ad creation non-fatal warning:', adErr)
      }
    }

    return {
      success: true,
      campaignId,
      adsetId,
      adId: adId || undefined,
    }
  } catch (err: any) {
    console.error('Meta Campaign Launcher Error:', err)
    return {
      success: false,
      error: err.message,
    }
  }
}
