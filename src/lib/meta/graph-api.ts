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
 * Fetch list of Ad Accounts for an authenticated user token
 */
export async function getAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  const url = `${BASE_URL}/me/adaccounts?fields=id,name,account_id,currency,account_status&access_token=${accessToken}`
  const res = await fetch(url)
  const data = await res.json()

  if (data.error) {
    throw new Error(`Graph API error: ${data.error.message}`)
  }

  return data.data || []
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
 * Create Ad Creative
 */
export async function createAdCreative(
  adAccountId: string,
  payload: any,
  accessToken: string
) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  const url = `${BASE_URL}/${formattedAccountId}/adcreatives`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, access_token: accessToken }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Failed to create Ad Creative: ${data.error.message}`)
  return data
}
