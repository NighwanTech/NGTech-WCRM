import { getAdminClient } from '@/lib/admin-supabase'
import { IContextProvider } from './context-provider-contract'

export class CampaignContextProvider implements IContextProvider {
  public providerName = 'CampaignContextProvider'
  public async loadContext(accountId: string, campaignId?: string) {
    if (!campaignId) return null
    const db = getAdminClient()
    const { data } = await db.from('marketing_campaigns').select('*').eq('account_id', accountId).eq('id', campaignId).single()
    return data
  }
}

export class AnalyticsContextProvider implements IContextProvider {
  public providerName = 'AnalyticsContextProvider'
  public async loadContext(accountId: string, campaignId?: string) {
    const db = getAdminClient()
    const { data } = await db.from('campaign_metrics_daily').select('*').eq('account_id', accountId).order('date', { ascending: false }).limit(14)
    return data || []
  }
}

export class CrmContextProvider implements IContextProvider {
  public providerName = 'CrmContextProvider'
  public async loadContext(accountId: string) {
    const db = getAdminClient()
    const { data } = await db.from('crm_deal_meta_attribution').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    return data || []
  }
}

export class WhatsAppContextProvider implements IContextProvider {
  public providerName = 'WhatsAppContextProvider'
  public async loadContext(accountId: string) {
    const db = getAdminClient()
    const { data } = await db.from('whatsapp_meta_attribution').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    return data || []
  }
}

export class DecisionLedgerProvider implements IContextProvider {
  public providerName = 'DecisionLedgerProvider'
  public async loadContext(accountId: string, campaignId?: string) {
    const db = getAdminClient()
    let query = db.from('campaign_ai_decision_ledger').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    if (campaignId) query = query.eq('campaign_id', campaignId)
    const { data } = await query
    return data || []
  }
}

export class LearningProvider implements IContextProvider {
  public providerName = 'LearningProvider'
  public async loadContext(accountId: string) {
    const db = getAdminClient()
    const { data } = await db.from('campaign_ai_learning').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    return data || []
  }
}

export class SimulationProvider implements IContextProvider {
  public providerName = 'SimulationProvider'
  public async loadContext(accountId: string, campaignId?: string) {
    const db = getAdminClient()
    let query = db.from('campaign_ai_simulations').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    if (campaignId) query = query.eq('campaign_id', campaignId)
    const { data } = await query
    return data || []
  }
}

export class PlaybookProvider implements IContextProvider {
  public providerName = 'PlaybookProvider'
  public async loadContext(accountId: string) {
    const db = getAdminClient()
    const { data } = await db.from('campaign_ai_playbooks').select('*').eq('is_active', true)
    return data || []
  }
}

export class HealthProvider implements IContextProvider {
  public providerName = 'HealthProvider'
  public async loadContext(accountId: string) {
    const db = getAdminClient()
    const { data } = await db.from('meta_sync_logs').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(5)
    return { status: 'HEALTHY', rateLimiter: 'Per-Tenant Token Bucket', recentLogs: data || [] }
  }
}
