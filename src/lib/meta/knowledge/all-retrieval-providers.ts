import { getAdminClient } from '@/lib/admin-supabase'
import { IRetrievalProvider } from './retrieval-provider-contract'

export class SQLRetrievalProvider implements IRetrievalProvider {
  public providerName = 'SQLRetrievalProvider'
  public async retrieveKnowledge(accountId: string, query?: string, campaignId?: string) {
    const db = getAdminClient()
    let q = db.from('marketing_campaigns').select('id, name, status, budget, objective').eq('account_id', accountId)
    if (campaignId) q = q.eq('id', campaignId)
    const { data } = await q
    return data || []
  }
}

export class DecisionLedgerRetrievalProvider implements IRetrievalProvider {
  public providerName = 'DecisionLedgerRetrievalProvider'
  public async retrieveKnowledge(accountId: string, query?: string, campaignId?: string) {
    const db = getAdminClient()
    let q = db.from('campaign_ai_decision_ledger').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    if (campaignId) q = q.eq('campaign_id', campaignId)
    const { data } = await q
    return data || []
  }
}

export class FeatureStoreRetrievalProvider implements IRetrievalProvider {
  public providerName = 'FeatureStoreRetrievalProvider'
  public async retrieveKnowledge(accountId: string, query?: string, campaignId?: string) {
    const db = getAdminClient()
    let q = db.from('campaign_ai_features').select('*').eq('account_id', accountId).order('date', { ascending: false }).limit(14)
    if (campaignId) q = q.eq('campaign_id', campaignId)
    const { data } = await q
    return data || []
  }
}

export class CRMRetrievalProvider implements IRetrievalProvider {
  public providerName = 'CRMRetrievalProvider'
  public async retrieveKnowledge(accountId: string) {
    const db = getAdminClient()
    const { data } = await db.from('crm_deal_meta_attribution').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    return data || []
  }
}

export class PlaybookRetrievalProvider implements IRetrievalProvider {
  public providerName = 'PlaybookRetrievalProvider'
  public async retrieveKnowledge() {
    const db = getAdminClient()
    const { data } = await db.from('campaign_ai_playbooks').select('*').eq('is_active', true)
    return data || []
  }
}

export class SimulationRetrievalProvider implements IRetrievalProvider {
  public providerName = 'SimulationRetrievalProvider'
  public async retrieveKnowledge(accountId: string, query?: string, campaignId?: string) {
    const db = getAdminClient()
    let q = db.from('campaign_ai_simulations').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    if (campaignId) q = q.eq('campaign_id', campaignId)
    const { data } = await q
    return data || []
  }
}

export class TimelineRetrievalProvider implements IRetrievalProvider {
  public providerName = 'TimelineRetrievalProvider'
  public async retrieveKnowledge(accountId: string, query?: string, campaignId?: string) {
    const db = getAdminClient()
    let q = db.from('campaign_activity_timeline').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(10)
    if (campaignId) q = q.eq('campaign_id', campaignId)
    const { data } = await q
    return data || []
  }
}

export class HealthRetrievalProvider implements IRetrievalProvider {
  public providerName = 'HealthRetrievalProvider'
  public async retrieveKnowledge(accountId: string) {
    const db = getAdminClient()
    const { data } = await db.from('meta_sync_logs').select('*').eq('account_id', accountId).order('created_at', { ascending: false }).limit(5)
    return { status: 'HEALTHY', syncLogs: data || [] }
  }
}

export class FutureVectorRetrievalProvider implements IRetrievalProvider {
  public providerName = 'FutureVectorRetrievalProvider'
  public async retrieveKnowledge() {
    // Stub provider for future vector database / pgvector embeddings
    return { status: 'STUB_READY', vectorDatabase: 'pgvector_ready', matches: [] }
  }
}
