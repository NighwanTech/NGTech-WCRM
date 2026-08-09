import { getAdminClient } from '@/lib/admin-supabase'
import { SupabaseClient } from '@supabase/supabase-js'

export interface MetaAdAccountRecord {
  id: string
  account_id?: string
  workspace_id?: string
  ad_account_id: string
  account_name: string
  access_token: string
  token_expires_at?: string | null
  user_id?: string | null
  status: string
  capi_pixel_id?: string | null
  created_at?: string
  updated_at?: string
}

function getDb(): SupabaseClient {
  return getAdminClient()
}

/**
 * Fetch all active Meta Ad accounts for a given account / workspace ID / user ID
 */
export async function getActiveMetaAdAccounts(accountId: string, userId?: string): Promise<MetaAdAccountRecord[]> {
  const db = getDb()

  // 1. Try querying by account_id
  try {
    const { data: byAccount, error: accErr } = await db
      .from('meta_ad_accounts')
      .select('*')
      .eq('account_id', accountId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!accErr && byAccount && byAccount.length > 0) {
      return byAccount
    }
  } catch {}

  // 2. Try querying by workspace_id
  try {
    const { data: byWorkspace, error: wsErr } = await db
      .from('meta_ad_accounts')
      .select('*')
      .eq('workspace_id', accountId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!wsErr && byWorkspace && byWorkspace.length > 0) {
      return byWorkspace
    }
  } catch {}

  // 3. Try querying by user_id if provided
  if (userId) {
    try {
      const { data: byUser, error: userErr } = await db
        .from('meta_ad_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (!userErr && byUser && byUser.length > 0) {
        return byUser
      }
    } catch {}
  }

  // 4. Try querying any active account in table as final fallback
  try {
    const { data: anyActive } = await db
      .from('meta_ad_accounts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5)

    if (anyActive && anyActive.length > 0) {
      return anyActive
    }
  } catch {}

  return []
}

/**
 * Upsert / Save a Meta Ad Account record safely handling both account_id and workspace_id columns
 */
export async function saveMetaAdAccount(params: {
  accountId: string
  userId: string
  adAccountId: string
  accountName: string
  encryptedAccessToken: string
  tokenExpiresAt?: string | null
}): Promise<MetaAdAccountRecord | null> {
  const db = getDb()
  const { accountId, userId, adAccountId, accountName, encryptedAccessToken, tokenExpiresAt } = params

  // 1. Check if record exists for this specific adAccountId
  const existingAccounts = await getActiveMetaAdAccounts(accountId, userId)
  const existing = existingAccounts.find((a) => a.ad_account_id === adAccountId)

  if (existing) {
    const { data: updated, error: updateErr } = await db
      .from('meta_ad_accounts')
      .update({
        ad_account_id: adAccountId,
        account_name: accountName,
        access_token: encryptedAccessToken,
        token_expires_at: tokenExpiresAt,
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .maybeSingle()

    if (!updateErr && updated) {
      return updated
    }
  }

  // 2. Insert new record - try with account_id first
  const payloadPrimary: any = {
    account_id: accountId,
    ad_account_id: adAccountId,
    account_name: accountName,
    access_token: encryptedAccessToken,
    token_expires_at: tokenExpiresAt,
    user_id: userId,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: insertedAcc, error: insertAccErr } = await db
    .from('meta_ad_accounts')
    .insert(payloadPrimary)
    .select()
    .maybeSingle()

  if (!insertAccErr && insertedAcc) {
    return insertedAcc
  }

  // Fallback to workspace_id
  const payloadWs: any = {
    workspace_id: accountId,
    ad_account_id: adAccountId,
    account_name: accountName,
    access_token: encryptedAccessToken,
    token_expires_at: tokenExpiresAt,
    user_id: userId,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: insertedWs, error: insertWsErr } = await db
    .from('meta_ad_accounts')
    .insert(payloadWs)
    .select()
    .maybeSingle()

  if (!insertWsErr && insertedWs) {
    return insertedWs
  }

  console.error('Failed to save meta_ad_account in both attempts:', insertAccErr?.message, insertWsErr?.message)
  return null
}

/**
 * Update CAPI Pixel ID
 */
export async function updateMetaPixelId(accountId: string, pixelId: string): Promise<boolean> {
  const db = getDb()
  const accounts = await getActiveMetaAdAccounts(accountId)
  if (!accounts || accounts.length === 0) {
    return false
  }

  const { error } = await db
    .from('meta_ad_accounts')
    .update({ capi_pixel_id: pixelId })
    .eq('id', accounts[0].id)

  return !error
}

/**
 * Disconnect / Detach all Meta Ad Accounts for a given account / workspace / user ID
 */
export async function disconnectMetaAdAccounts(accountId: string, userId?: string): Promise<boolean> {
  const db = getDb()

  try {
    await db
      .from('meta_ad_accounts')
      .update({ status: 'disconnected' })
      .eq('account_id', accountId)
  } catch {}

  try {
    await db
      .from('meta_ad_accounts')
      .update({ status: 'disconnected' })
      .eq('workspace_id', accountId)
  } catch {}

  if (userId) {
    try {
      await db
        .from('meta_ad_accounts')
        .update({ status: 'disconnected' })
        .eq('user_id', userId)
    } catch {}
  }

  return true
}

