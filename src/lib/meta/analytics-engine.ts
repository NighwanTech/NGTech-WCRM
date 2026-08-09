import { SupabaseClient } from '@supabase/supabase-js'

export interface FunnelMetrics {
  impressions: number
  clicks: number
  whatsappChats: number
  crmLeads: number
  dealsWon: number
  totalSpend: number
  revenue: number
  roas: number
  cpl: number
}

/**
 * Calculates end-to-end multi-touch attribution metrics for a specific account.
 * Traces Ad Spend -> Impressions -> Link Clicks -> WhatsApp Chats -> CRM Leads -> Deals Won -> Revenue.
 */
export async function getFunnelAnalytics(
  db: SupabaseClient,
  accountId: string,
  timeRangeDays: number = 30
): Promise<FunnelMetrics> {
  const cutoffDate = new Date(Date.now() - timeRangeDays * 24 * 60 * 60 * 1000).toISOString()

  // 1. Get Top-of-Funnel Metrics from Meta Campaign Cache (Spend, Impressions, Clicks)
  const { data: campaigns } = await db
    .from('meta_campaign_cache')
    .select('spend, impressions, clicks')
    .eq('account_id', accountId)
    .gte('last_synced_at', cutoffDate)

  let totalSpend = 0
  let impressions = 0
  let clicks = 0

  if (campaigns) {
    campaigns.forEach(c => {
      totalSpend += Number(c.spend) || 0
      impressions += Number(c.impressions) || 0
      clicks += Number(c.clicks) || 0
    })
  }

  // 2. Get WhatsApp Chats attributed to Meta
  const { count: whatsappChats } = await db
    .from('whatsapp_attribution')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)
    .gte('created_at', cutoffDate)

  // 3. Get CRM Leads (Contacts with source = 'meta_ads')
  const { count: crmLeads } = await db
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)
    .eq('source', 'meta_ads')
    .gte('created_at', cutoffDate)

  // 4. Get Revenue from Closed Won Deals attributed to Meta contacts
  // We need to join deals with contacts where contact source is meta_ads
  const { data: wonDeals } = await db
    .from('deals')
    .select('amount, contacts!inner(source)')
    .eq('account_id', accountId)
    .eq('status', 'won')
    .eq('contacts.source', 'meta_ads')
    .gte('created_at', cutoffDate)

  let revenue = 0
  let dealsWon = 0

  if (wonDeals) {
    wonDeals.forEach(d => {
      revenue += Number(d.amount) || 0
      dealsWon++
    })
  }

  const cpl = crmLeads && crmLeads > 0 ? totalSpend / crmLeads : 0
  const roas = totalSpend > 0 ? revenue / totalSpend : 0

  return {
    impressions,
    clicks,
    whatsappChats: whatsappChats || 0,
    crmLeads: crmLeads || 0,
    dealsWon,
    totalSpend,
    revenue,
    roas,
    cpl,
  }
}
