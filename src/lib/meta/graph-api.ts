const META_API_VERSION = process.env.META_API_VERSION || 'v20.0'
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

export interface MetaAdAccount {
  id: string
  name: string
  account_id: string
  currency: string
  account_status: number
}

export interface MetaCampaign {
  id: string
  name: string
  status: string
  objective?: string
  daily_budget?: string
  spend?: string
  impressions?: string
  clicks?: string
  leads?: number
}

export interface MetaLeadData {
  id: string
  created_time: string
  form_id: string
  field_data: Array<{
    name: string
    values: string[]
  }>
  ad_id?: string
  adset_id?: string
  campaign_id?: string
}

/**
 * Fetch all Ad Accounts for an authenticated user token (including Business Manager accounts)
 */
export async function getAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  const allAccounts: Map<string, MetaAdAccount> = new Map()

  // 1. Direct /me/adaccounts
  try {
    const url = `${BASE_URL}/me/adaccounts?fields=id,name,account_id,currency,account_status&limit=100&access_token=${accessToken}`
    const res = await fetch(url)
    const data = await res.json()
    if (data.data && Array.isArray(data.data)) {
      for (const acc of data.data) {
        allAccounts.set(acc.id || acc.account_id, acc)
      }
    }
  } catch (err) {
    console.warn('Error fetching /me/adaccounts:', err)
  }

  // 2. Business Manager accounts (/me/businesses)
  try {
    const bizUrl = `${BASE_URL}/me/businesses?fields=id,name,owned_ad_accounts{id,name,account_id,currency,account_status},client_ad_accounts{id,name,account_id,currency,account_status}&limit=50&access_token=${accessToken}`
    const bizRes = await fetch(bizUrl)
    const bizData = await bizRes.json()
    if (bizData.data && Array.isArray(bizData.data)) {
      for (const biz of bizData.data) {
        if (biz.owned_ad_accounts?.data) {
          for (const acc of biz.owned_ad_accounts.data) {
            allAccounts.set(acc.id || acc.account_id, {
              ...acc,
              name: acc.name ? `${biz.name} - ${acc.name}` : `${biz.name} Ad Account`,
            })
          }
        }
        if (biz.client_ad_accounts?.data) {
          for (const acc of biz.client_ad_accounts.data) {
            allAccounts.set(acc.id || acc.account_id, {
              ...acc,
              name: acc.name ? `${biz.name} - ${acc.name}` : `${biz.name} Client Ad Account`,
            })
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error fetching /me/businesses ad accounts:', err)
  }

  return Array.from(allAccounts.values())
}

/**
 * Fetch Campaigns and performance insights for an Ad Account
 */
export async function getCampaigns(
  adAccountId: string,
  accessToken: string
): Promise<MetaCampaign[]> {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  const url = `${BASE_URL}/${formattedAccountId}/campaigns?fields=id,name,status,objective,daily_budget,insights{spend,impressions,clicks}&access_token=${accessToken}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.error) {
    throw new Error(`Graph API error: ${data.error.message}`)
  }

  const rawCampaigns = data.data || []

  return rawCampaigns.map((c: any) => {
    const insights = c.insights?.data?.[0] || {}
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      objective: c.objective,
      daily_budget: c.daily_budget ? (parseFloat(c.daily_budget) / 100).toFixed(2) : '0',
      spend: insights.spend || '0',
      impressions: insights.impressions || '0',
      clicks: insights.clicks || '0',
    }
  })
}

/**
 * Fetch full Lead details for a LeadGen ID received from Meta Webhook
 */
export async function getLeadDetails(leadGenId: string, accessToken: string): Promise<MetaLeadData> {
  const url = `${BASE_URL}/${leadGenId}?access_token=${accessToken}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.error) {
    throw new Error(`Failed to fetch lead ${leadGenId}: ${data.error.message}`)
  }

  return data
}

/**
 * Update Campaign Status (ACTIVE / PAUSED)
 */
export async function updateCampaignStatus(
  campaignId: string,
  status: 'ACTIVE' | 'PAUSED',
  accessToken: string
) {
  const url = `${BASE_URL}/${campaignId}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, access_token: accessToken }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Failed to update campaign status: ${data.error.message}`)
  return data
}

/**
 * Update Campaign Budget
 */
export async function updateCampaignBudget(
  campaignId: string,
  dailyBudgetCents: number,
  accessToken: string
) {
  const url = `${BASE_URL}/${campaignId}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ daily_budget: dailyBudgetCents, access_token: accessToken }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Failed to update campaign budget: ${data.error.message}`)
  return data
}

/**
 * Create an Ad Set under a Campaign
 */
export async function createAdSet(
  adAccountId: string,
  payload: {
    name: string
    campaign_id: string
    daily_budget: number
    billing_event: string
    optimization_goal: string
    bid_amount?: number
    targeting: any
    status: 'ACTIVE' | 'PAUSED'
  },
  accessToken: string
) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  const url = `${BASE_URL}/${formattedAccountId}/adsets`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, access_token: accessToken }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Failed to create AdSet: ${data.error.message}`)
  return data
}

/**
 * Create an Ad under an Ad Set
 */
export async function createAd(
  adAccountId: string,
  payload: {
    name: string
    adset_id: string
    creative: {
      creative_id: string
    }
    status: 'ACTIVE' | 'PAUSED'
  },
  accessToken: string
) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  const url = `${BASE_URL}/${formattedAccountId}/ads`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, access_token: accessToken }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Failed to create Ad: ${data.error.message}`)
  return data
}

/**
 * Create an Ad Creative under an Ad Account
 */
export async function createAdCreative(
  adAccountId: string,
  payload: {
    name: string
    title: string
    body: string
    page_id?: string
    image_url?: string
  },
  accessToken: string
) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  const url = `${BASE_URL}/${formattedAccountId}/adcreatives`
  
  const bodyPayload: any = {
    name: payload.name,
    object_story_spec: {
      page_id: payload.page_id || '100063920000000', // Fallback page ID
      link_data: {
        message: payload.body,
        name: payload.title,
        link: 'https://www.aiwcrm.com',
        ...(payload.image_url ? { picture: payload.image_url } : {})
      }
    },
    access_token: accessToken
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload)
  })

  const data = await res.json()
  if (data.error) throw new Error(`Failed to create AdCreative: ${data.error.message}`)
  return data
}

/**
 * Fetch Full Campaign Hierarchy Details (Campaign + AdSets + Ad Creatives)
 */
export async function getCampaignFullDetails(
  campaignId: string,
  accessToken: string
) {
  const url = `${BASE_URL}/${campaignId}?fields=id,name,status,objective,buying_type,special_ad_categories,daily_budget,lifetime_budget,adsets{id,name,status,daily_budget,targeting,billing_event,optimization_goal,bid_amount},ads{id,name,status,creative{id,name,title,body,image_url,thumbnail_url,call_to_action_type,link_url}}&access_token=${accessToken}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.error) {
      console.warn(`Graph API detailed fetch warning for ${campaignId}:`, data.error.message)
      return null
    }
  } catch (err: any) {
    console.warn(`Failed to fetch full campaign details for ${campaignId}:`, err.message)
    return null
  }
}

/**
 * Create Live Meta Campaign (Campaign -> AdSet -> Ad Creative Hierarchy)
 */
export async function createMetaCampaignLive(
  adAccountId: string,
  accessToken: string,
  payload: {
    name: string
    objective: string
    dailyBudget: number
    location: string
    headline: string
    primaryText: string
    cta: string
  }
) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  
  // 1. Create Campaign Level
  const campUrl = `${BASE_URL}/${formattedAccountId}/campaigns`
  const campRes = await fetch(campUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      objective: payload.objective || 'OUTCOME_LEADS',
      status: 'PAUSED', // Safety default on live publishing
      special_ad_categories: ['NONE'],
      access_token: accessToken
    })
  })
  const campData = await campRes.json()
  if (campData.error) throw new Error(`Meta Graph API Campaign Error: ${campData.error.message}`)

  const metaCampaignId = campData.id

  // 2. Create Ad Set Level
  const adsetRes = await createAdSet(
    adAccountId,
    {
      name: `${payload.name} - AdSet`,
      campaign_id: metaCampaignId,
      daily_budget: Math.round(payload.dailyBudget * 100), // Convert INR to Cents/Paise
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      targeting: {
        geo_locations: { countries: ['IN'] }
      },
      status: 'PAUSED'
    },
    accessToken
  )

  return {
    metaCampaignId,
    metaAdSetId: adsetRes.id
  }
}
