import { getAdminClient } from '@/lib/admin-supabase'
import { decryptToken } from '@/lib/meta/token-manager'
import { getActiveMetaAdAccounts } from '@/lib/meta/db-adapter'

export interface MetaSyncResult {
  success: boolean
  entityType: string
  recordsSynced: number
  durationMs: number
  error?: string
}

/**
 * Enterprise Meta Integration Service
 * Centralized wrapper handling OAuth token decryption, Meta Graph API v20.0 calls,
 * exponential backoff rate limiting, error normalization, and audit logging.
 */
export class MetaIntegrationService {
  private static GRAPH_API_VERSION = 'v20.0'
  private static BASE_URL = `https://graph.facebook.com/${MetaIntegrationService.GRAPH_API_VERSION}`

  /**
   * Execute fetch against Meta Graph API with rate limit detection and retries
   */
  public static async graphFetch(endpoint: string, accessToken: string, options: RequestInit = {}, retries = 3): Promise<any> {
    const url = endpoint.startsWith('http') ? endpoint : `${MetaIntegrationService.BASE_URL}/${endpoint.replace(/^\//, '')}`
    const isPost = options.method === 'POST'
    
    let lastError: any = null
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            ...(options.headers || {})
          }
        })

        const data = await res.json()

        if (!res.ok) {
          const metaError = data.error || {}
          // Check for rate limit error codes (Code 17 or Code 32)
          if (metaError.code === 17 || metaError.code === 32 || res.status === 429) {
            const backoffMs = Math.pow(2, attempt) * 1000
            console.warn(`[MetaIntegrationService] Rate limit encountered. Backing off ${backoffMs}ms...`)
            await new Promise((r) => setTimeout(r, backoffMs))
            continue
          }
          throw new Error(metaError.message || `Meta Graph API Error [${res.status}]`)
        }

        return data
      } catch (err: any) {
        lastError = err
        if (attempt === retries - 1) throw err
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
      }
    }
    throw lastError
  }

  /**
   * Synchronize all live Meta Campaigns for a given tenant workspace
   */
  public static async syncCampaigns(accountId: string, userId?: string): Promise<MetaSyncResult> {
    const startTime = Date.now()
    const db = getAdminClient()

    try {
      const accounts = await getActiveMetaAdAccounts(accountId, userId)
      if (!accounts || accounts.length === 0) {
        return { success: false, entityType: 'CAMPAIGN', recordsSynced: 0, durationMs: Date.now() - startTime, error: 'No active Meta Ad Account connected' }
      }

      const activeAccount = accounts[0]
      const decryptedToken = decryptToken(activeAccount.access_token)

      // Fetch live campaigns from Meta Graph API
      const endpoint = `${activeAccount.ad_account_id}/campaigns?fields=id,name,status,effective_status,objective,daily_budget,lifetime_budget`
      const response = await MetaIntegrationService.graphFetch(endpoint, decryptedToken)
      const campaigns = response.data || []

      // Upsert into raw meta_campaign_cache
      let syncedCount = 0
      for (const c of campaigns) {
        const dailyBudget = c.daily_budget ? parseFloat(c.daily_budget) / 100 : 0
        const lifetimeBudget = c.lifetime_budget ? parseFloat(c.lifetime_budget) / 100 : 0

        const { error } = await db.from('meta_campaign_cache').upsert(
          {
            account_id: accountId,
            meta_campaign_id: c.id,
            name: c.name,
            status: c.status,
            effective_status: c.effective_status || c.status,
            objective: c.objective || 'OUTCOME_LEADS',
            daily_budget: dailyBudget,
            lifetime_budget: lifetimeBudget,
            last_synced_at: new Date().toISOString()
          },
          { onConflict: 'account_id,meta_campaign_id' }
        )

        if (!error) syncedCount++
      }

      const durationMs = Date.now() - startTime

      // Log Sync Run
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'CAMPAIGN',
        status: 'SUCCESS',
        records_synced: syncedCount,
        duration_ms: durationMs
      })

      return { success: true, entityType: 'CAMPAIGN', recordsSynced: syncedCount, durationMs }
    } catch (err: any) {
      const durationMs = Date.now() - startTime
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'CAMPAIGN',
        status: 'FAILED',
        records_synced: 0,
        duration_ms: durationMs,
        error_message: err.message
      })

      return { success: false, entityType: 'CAMPAIGN', recordsSynced: 0, durationMs, error: err.message }
    }
  }

  /**
   * Synchronize all live Meta AdSets for a given tenant workspace
   */
  public static async syncAdSets(accountId: string, userId?: string): Promise<MetaSyncResult> {
    const startTime = Date.now()
    const db = getAdminClient()

    try {
      const accounts = await getActiveMetaAdAccounts(accountId, userId)
      if (!accounts || accounts.length === 0) {
        return { success: false, entityType: 'ADSET', recordsSynced: 0, durationMs: Date.now() - startTime, error: 'No active Meta Ad Account connected' }
      }

      const activeAccount = accounts[0]
      const decryptedToken = decryptToken(activeAccount.access_token)

      const endpoint = `${activeAccount.ad_account_id}/adsets?fields=id,campaign_id,name,status,effective_status,optimization_goal,daily_budget`
      const response = await MetaIntegrationService.graphFetch(endpoint, decryptedToken)
      const adsets = response.data || []

      let syncedCount = 0
      for (const a of adsets) {
        const dailyBudget = a.daily_budget ? parseFloat(a.daily_budget) / 100 : 0

        const { error } = await db.from('meta_adset_cache').upsert(
          {
            account_id: accountId,
            meta_adset_id: a.id,
            meta_campaign_id: a.campaign_id,
            name: a.name,
            status: a.status,
            effective_status: a.effective_status || a.status,
            optimization_goal: a.optimization_goal,
            daily_budget: dailyBudget,
            last_synced_at: new Date().toISOString()
          },
          { onConflict: 'account_id,meta_adset_id' }
        )

        if (!error) syncedCount++
      }

      const durationMs = Date.now() - startTime
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'ADSET',
        status: 'SUCCESS',
        records_synced: syncedCount,
        duration_ms: durationMs
      })

      return { success: true, entityType: 'ADSET', recordsSynced: syncedCount, durationMs }
    } catch (err: any) {
      const durationMs = Date.now() - startTime
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'ADSET',
        status: 'FAILED',
        records_synced: 0,
        duration_ms: durationMs,
        error_message: err.message
      })

      return { success: false, entityType: 'ADSET', recordsSynced: 0, durationMs, error: err.message }
    }
  }

  /**
   * Synchronize all live Meta Ads for a given tenant workspace
   */
  public static async syncAds(accountId: string, userId?: string): Promise<MetaSyncResult> {
    const startTime = Date.now()
    const db = getAdminClient()

    try {
      const accounts = await getActiveMetaAdAccounts(accountId, userId)
      if (!accounts || accounts.length === 0) {
        return { success: false, entityType: 'AD', recordsSynced: 0, durationMs: Date.now() - startTime, error: 'No active Meta Ad Account connected' }
      }

      const activeAccount = accounts[0]
      const decryptedToken = decryptToken(activeAccount.access_token)

      const endpoint = `${activeAccount.ad_account_id}/ads?fields=id,adset_id,campaign_id,name,status,effective_status,creative`
      const response = await MetaIntegrationService.graphFetch(endpoint, decryptedToken)
      const ads = response.data || []

      let syncedCount = 0
      for (const ad of ads) {
        const { error } = await db.from('meta_ad_cache').upsert(
          {
            account_id: accountId,
            meta_ad_id: ad.id,
            meta_adset_id: ad.adset_id,
            meta_campaign_id: ad.campaign_id,
            name: ad.name,
            status: ad.status,
            effective_status: ad.effective_status || ad.status,
            creative_id: ad.creative?.id || null,
            last_synced_at: new Date().toISOString()
          },
          { onConflict: 'account_id,meta_ad_id' }
        )

        if (!error) syncedCount++
      }

      const durationMs = Date.now() - startTime
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'AD',
        status: 'SUCCESS',
        records_synced: syncedCount,
        duration_ms: durationMs
      })

      return { success: true, entityType: 'AD', recordsSynced: syncedCount, durationMs }
    } catch (err: any) {
      const durationMs = Date.now() - startTime
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'AD',
        status: 'FAILED',
        records_synced: 0,
        duration_ms: durationMs,
        error_message: err.message
      })

      return { success: false, entityType: 'AD', recordsSynced: 0, durationMs, error: err.message }
    }
  }

  /**
   * Synchronize Meta Insights into Data Warehouse (raw store + daily rollup)
   */
  public static async syncInsights(accountId: string, userId?: string): Promise<MetaSyncResult> {
    const startTime = Date.now()
    const db = getAdminClient()

    try {
      const accounts = await getActiveMetaAdAccounts(accountId, userId)
      if (!accounts || accounts.length === 0) {
        return { success: false, entityType: 'INSIGHTS', recordsSynced: 0, durationMs: Date.now() - startTime, error: 'No active Meta Ad Account connected' }
      }

      const activeAccount = accounts[0]
      const decryptedToken = decryptToken(activeAccount.access_token)

      // Fetch 30-day performance insights from Meta Graph API
      const endpoint = `${activeAccount.ad_account_id}/insights?date_preset=last_30d&time_increment=1&fields=campaign_id,campaign_name,spend,impressions,reach,clicks,frequency,actions,cpc,cpm,cpp,ctr`
      const response = await MetaIntegrationService.graphFetch(endpoint, decryptedToken)
      const insights = response.data || []

      let syncedCount = 0
      for (const row of insights) {
        // 1. Raw Store Save
        await db.from('meta_insights_raw').insert({
          account_id: accountId,
          meta_campaign_id: row.campaign_id,
          date_start: row.date_start,
          date_stop: row.date_stop,
          raw_payload: row
        })

        // Extract lead count from actions array
        let leads = 0
        if (Array.isArray(row.actions)) {
          const leadAct = row.actions.find((a: any) => a.action_type === 'lead' || a.action_type === 'onsite_conversion.lead_grouped')
          if (leadAct) leads = parseInt(leadAct.value || '0', 10)
        }

        const spend = parseFloat(row.spend || '0')
        const impressions = parseInt(row.impressions || '0', 10)
        const reach = parseInt(row.reach || '0', 10)
        const clicks = parseInt(row.clicks || '0', 10)
        const frequency = parseFloat(row.frequency || '1.0')
        const ctr = parseFloat(row.ctr || '0')
        const cpc = parseFloat(row.cpc || '0')
        const cpm = parseFloat(row.cpm || '0')
        const cpl = leads > 0 ? parseFloat((spend / leads).toFixed(2)) : 0

        // 2. Aggregate Warehouse Daily Rollup
        const { error: rollErr } = await db.from('campaign_metrics_daily').upsert(
          {
            account_id: accountId,
            meta_campaign_id: row.campaign_id,
            date: row.date_start,
            spend,
            impressions,
            reach,
            frequency,
            clicks,
            leads,
            cpl,
            cpc,
            cpm,
            ctr,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'account_id,meta_campaign_id,date' }
        )

        if (!rollErr) syncedCount++
      }

      const durationMs = Date.now() - startTime
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'INSIGHTS',
        status: 'SUCCESS',
        records_synced: syncedCount,
        duration_ms: durationMs
      })

      return { success: true, entityType: 'INSIGHTS', recordsSynced: syncedCount, durationMs }
    } catch (err: any) {
      const durationMs = Date.now() - startTime
      await db.from('meta_sync_logs').insert({
        account_id: accountId,
        entity_type: 'INSIGHTS',
        status: 'FAILED',
        records_synced: 0,
        duration_ms: durationMs,
        error_message: err.message
      })

      return { success: false, entityType: 'INSIGHTS', recordsSynced: 0, durationMs, error: err.message }
    }
  }

  /**
   * Execute Full Sync Suite (Campaigns + AdSets + Ads + Insights)
   */
  public static async syncAll(accountId: string, userId?: string): Promise<MetaSyncResult[]> {
    const campResult = await MetaIntegrationService.syncCampaigns(accountId, userId)
    const adsetResult = await MetaIntegrationService.syncAdSets(accountId, userId)
    const adResult = await MetaIntegrationService.syncAds(accountId, userId)
    const insightsResult = await MetaIntegrationService.syncInsights(accountId, userId)
    return [campResult, adsetResult, adResult, insightsResult]
  }
}
