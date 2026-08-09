import { SupabaseClient } from '@supabase/supabase-js'

export interface LogAttributionParams {
  accountId: string
  contactId: string
  campaignId?: string
  adsetId?: string
  adId?: string
  clickId?: string
  source: 'lead_ad' | 'click_to_wa'
}

/**
 * Log multi-touch attribution for a contact
 */
export async function logMetaAttribution(
  db: SupabaseClient,
  params: LogAttributionParams
): Promise<void> {
  const { accountId, contactId, campaignId, adsetId, adId, clickId, source } = params

  try {
    await db.from('meta_attribution_logs').insert({
      account_id: accountId,
      contact_id: contactId,
      campaign_id: campaignId || null,
      adset_id: adsetId || null,
      ad_id: adId || null,
      click_id: clickId || null,
      source,
      first_touch: true,
      last_touch: true,
    })
  } catch (error) {
    console.error('Error logging Meta attribution:', error)
  }
}

/**
 * Track Click-to-WhatsApp referral link parameters
 */
export async function logWhatsAppReferral(
  db: SupabaseClient,
  params: {
    accountId: string
    phone: string
    campaignId?: string
    adId?: string
    refParam?: string
  }
): Promise<void> {
  try {
    await db.from('whatsapp_attribution').insert({
      account_id: params.accountId,
      phone: params.phone,
      campaign_id: params.campaignId || null,
      ad_id: params.adId || null,
      ref_param: params.refParam || null,
    })
  } catch (error) {
    console.error('Error logging WhatsApp referral:', error)
  }
}
