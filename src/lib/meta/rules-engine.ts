import { SupabaseClient } from '@supabase/supabase-js'
import { getCampaigns, updateCampaignStatus, updateCampaignBudget } from '@/lib/meta/graph-api'
import { decryptToken } from '@/lib/meta/token-manager'
import { AIProviderService } from '@/lib/services/ai/provider.service'
import { getTenantAIModel } from '@/lib/meta/ai-ad-engine'
import { generateObject } from 'ai'
import { z } from 'zod'

export interface OptimizationRule {
  id: string
  account_id: string
  name: string
  is_active: boolean
  condition_metric: string // 'cpl', 'roas', 'ctr', 'spend'
  condition_operator: string // 'greater_than', 'less_than'
  condition_value: number
  action_type: string // 'pause_campaign', 'increase_budget', 'decrease_budget'
  action_value: number
}

/**
 * Runs the optimization rules engine for a specific account.
 */
export async function runRulesEngine(db: SupabaseClient, accountId: string) {
  // 1. Fetch active rules for account
  const { data: rules } = await db
    .from('meta_optimization_rules')
    .select('*')
    .eq('account_id', accountId)
    .eq('is_active', true)

  if (!rules || rules.length === 0) return { success: true, message: 'No active rules to apply.' }

  // 2. Fetch live campaigns
  const { data: adAccount } = await db
    .from('meta_ad_accounts')
    .select('*')
    .eq('account_id', accountId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (!adAccount?.access_token) return { success: false, error: 'No active Meta account' }

  const decryptedToken = decryptToken(adAccount.access_token)
  let campaigns = []
  
  try {
    campaigns = await getCampaigns(adAccount.ad_account_id, decryptedToken)
  } catch (err: any) {
    console.error('Failed to fetch live campaigns for rules engine', err)
    return { success: false, error: err.message }
  }

  const logs = []

  // 3. Evaluate each rule against campaigns
  for (const rule of rules as OptimizationRule[]) {
    for (const campaign of campaigns) {
      // Basic metrics (in real life we would merge with funnel analytics)
      const spend = Number(campaign.spend) || 0
      const leads = campaign.leads || 0
      const clicks = Number(campaign.clicks) || 0
      const impressions = Number(campaign.impressions) || 0
      
      const metrics = {
        spend,
        leads,
        cpl: leads > 0 ? spend / leads : 0,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        // Assume ROAS is 0 here since we don't have deep funnel access per campaign easily in this loop,
        // but we'd join with DB analytics in a full implementation.
        roas: 0 
      }

      let trigger = false
      const metricValue = metrics[rule.condition_metric as keyof typeof metrics] || 0

      if (rule.condition_operator === 'greater_than') {
        trigger = metricValue > rule.condition_value
      } else if (rule.condition_operator === 'less_than') {
        trigger = metricValue < rule.condition_value
      }

      if (trigger && campaign.status === 'ACTIVE') {
        try {
          // Execute Action
          if (rule.action_type === 'pause_campaign') {
            await updateCampaignStatus(campaign.id, 'PAUSED', decryptedToken)
            logs.push(`Paused campaign ${campaign.name} due to ${rule.condition_metric} ${rule.condition_operator} ${rule.condition_value}`)
          } else if (rule.action_type === 'increase_budget') {
            const currentBudget = Number(campaign.daily_budget) || 0
            if (currentBudget > 0) {
              const newBudget = currentBudget * (1 + rule.action_value / 100)
              await updateCampaignBudget(campaign.id, Math.round(newBudget * 100), decryptedToken)
              logs.push(`Increased budget for ${campaign.name} by ${rule.action_value}% to ${newBudget}`)
            }
          } else if (rule.action_type === 'decrease_budget') {
             const currentBudget = Number(campaign.daily_budget) || 0
            if (currentBudget > 0) {
              const newBudget = currentBudget * (1 - rule.action_value / 100)
              await updateCampaignBudget(campaign.id, Math.round(newBudget * 100), decryptedToken)
              logs.push(`Decreased budget for ${campaign.name} by ${rule.action_value}% to ${newBudget}`)
            }
          }

          // Log Decision
          await db.from('meta_ai_decision_logs').insert({
            account_id: accountId,
            campaign_id: campaign.id,
            decision_type: 'rule_execution',
            description: `Triggered Rule: ${rule.name}`,
            ai_rationale: `Rule condition met: ${rule.condition_metric} is ${metricValue}`,
            metrics_snapshot: metrics,
            status: 'APPLIED'
          })
        } catch (e: any) {
           console.error(`Failed to execute rule ${rule.name} on ${campaign.name}`, e)
        }
      }
    }
  }

  return { success: true, logs }
}
