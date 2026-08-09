import { SupabaseClient } from '@supabase/supabase-js'
import { getLeadDetails, MetaLeadData } from './graph-api'
import { findExistingContact } from '@/lib/contacts/dedupe'
import { normalizePhone } from '@/lib/whatsapp/phone-utils'
import { logMetaAttribution } from './attribution'
import { decryptToken } from './token-manager'

export interface ProcessLeadResult {
  success: boolean
  contactId?: string
  error?: string
}

/**
 * Normalizes field data array returned by Meta Graph API into key-value pairs
 */
function extractLeadFields(fieldData: MetaLeadData['field_data']) {
  let name = ''
  let email = ''
  let phone = ''
  const customFields: Record<string, string> = {}

  for (const field of fieldData || []) {
    const fieldName = field.name.toLowerCase()
    const val = field.values?.[0] || ''

    if (fieldName.includes('full_name') || fieldName.includes('name') || fieldName === 'first_name') {
      name = name ? `${name} ${val}` : val
    } else if (fieldName.includes('last_name')) {
      name = name ? `${name} ${val}` : val
    } else if (fieldName.includes('email')) {
      email = val
    } else if (fieldName.includes('phone') || fieldName.includes('mobile')) {
      phone = val
    } else {
      customFields[field.name] = val
    }
  }

  return {
    name: name.trim() || 'Meta Ad Lead',
    email: email.trim(),
    phone: normalizePhone(phone),
    customFields,
  }
}

/**
 * Process raw Meta Lead ID: fetch Graph API data, deduplicate/create contact, assign to pipeline, log attribution.
 */
export async function processMetaLead(
  db: SupabaseClient,
  leadgenId: string,
  formId: string,
  pageId: string
): Promise<ProcessLeadResult> {
  try {
    // 1. Look up workspace matching lead form mapping or ad account
    const { data: mapping } = await db
      .from('meta_lead_form_mappings')
      .select('*')
      .eq('form_id', formId)
      .maybeSingle()

    // Find account_id from mapping or fallback to first active meta_ad_account
    let accountId = mapping?.account_id

    if (!accountId) {
      const { data: adAcc } = await db
        .from('meta_ad_accounts')
        .select('account_id, access_token')
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      accountId = adAcc?.account_id
    }

    if (!accountId) {
      return { success: false, error: 'No workspace linked to this lead form or ad account.' }
    }

    // 2. Get active access token for this workspace
    const { data: adAccount } = await db
      .from('meta_ad_accounts')
      .select('access_token')
      .eq('account_id', accountId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()

    if (!adAccount?.access_token) {
      return { success: false, error: 'Missing access token for workspace.' }
    }

    const decryptedToken = decryptToken(adAccount.access_token)

    // 3. Fetch lead details from Meta Graph API
    const leadData = await getLeadDetails(leadgenId, decryptedToken)
    const { name, email, phone, customFields } = extractLeadFields(leadData.field_data)

    if (!phone && !email) {
      return { success: false, error: 'Lead contains no contact phone or email.' }
    }

    // 4. Deduplicate contact in CRM
    let existingContact = phone ? await findExistingContact(db, accountId, phone) : null
    let contactId = existingContact?.id

    if (!existingContact) {
      const { data: newContact, error: insertErr } = await db
        .from('contacts')
        .insert({
          account_id: accountId,
          name,
          phone: phone || null,
          email: email || null,
          source: 'Meta Lead Ads',
          tags: ['meta_lead_ad'],
          custom_fields: customFields,
        })
        .select('id')
        .single()

      if (insertErr || !newContact) {
        throw new Error(`Failed to create contact: ${insertErr?.message}`)
      }

      contactId = newContact.id
    }

    // 5. If mapping exists, place in target pipeline stage
    if (mapping?.target_pipeline_id && mapping?.target_stage_id && contactId) {
      try {
        await db.from('deals').insert({
          account_id: accountId,
          contact_id: contactId,
          pipeline_id: mapping.target_pipeline_id,
          stage_id: mapping.target_stage_id,
          title: `Lead: ${name}`,
          assigned_to: mapping.auto_assign_to || null,
        })
      } catch (e) {
        // ignore deal insert if schema varies
      }
    }

    // 6. Log Attribution & Audit Entry
    if (contactId) {
      await logMetaAttribution(db, {
        accountId,
        contactId,
        campaignId: leadData.campaign_id,
        adsetId: leadData.adset_id,
        adId: leadData.ad_id,
        source: 'lead_ad',
      })
    }

    await db.from('meta_lead_logs').insert({
      account_id: accountId,
      lead_id: leadgenId,
      form_id: formId,
      contact_id: contactId,
      raw_payload: leadData,
      status: 'processed',
    })

    return { success: true, contactId }
  } catch (error: any) {
    console.error('Error processing Meta lead:', error)
    return { success: false, error: error.message }
  }
}
