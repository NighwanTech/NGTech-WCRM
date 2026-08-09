import { SupabaseClient } from '@supabase/supabase-js'
import { getCampaigns, updateCampaignStatus, updateCampaignBudget } from '@/lib/meta/graph-api'
import { decryptToken } from '@/lib/meta/token-manager'
import { AIProviderService } from '@/lib/services/ai/provider.service'
import { getTenantAIModel, getModelForAccount } from '@/lib/meta/ai-ad-engine'
import { z } from 'zod'
import { generateObject } from 'ai'

export interface AgentOptimizationTask {
  accountId: string
  executionMode: 'MANUAL_ANALYSIS' | 'SCHEDULED_ANALYSIS' | 'RECOMMENDATION_ONLY' | 'APPROVAL_REQUIRED' | 'FULL_AUTONOMY' | 'SIMULATION'
}

/**
 * Lightweight Rule-Based Engine
 * Runs continuously without consuming AI tokens. Returns campaigns that violate rules.
 */
function runLightweightRulesEngine(campaigns: any[]) {
  const flaggedCampaigns = []
  
  for (const c of campaigns) {
    const spend = Number(c.spend) || 0
    const leads = c.leads || 0
    const cpl = leads > 0 ? spend / leads : spend

    // Example Static Rules - in reality these would be fetched from `budget_governance`
    if (spend > 1000 && leads === 0) {
      flaggedCampaigns.push({ campaignId: c.id, reason: 'High Spend, Zero Leads' })
    } else if (cpl > 500) {
      flaggedCampaigns.push({ campaignId: c.id, reason: 'CPL exceeds threshold' })
    } else if (cpl < 100 && spend > 500) {
      flaggedCampaigns.push({ campaignId: c.id, reason: 'Excellent CPL, ready to scale' })
    }
  }

  return flaggedCampaigns
}

/**
 * The Autonomous AI Meta Ads Agent (Enterprise Governed)
 */
export async function runAIAgent(db: SupabaseClient, task: AgentOptimizationTask) {
  const { accountId, executionMode } = task

  // 1. Fetch live campaigns
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
    console.error('AI Agent: Failed to fetch campaigns', err)
    return { success: false, error: err.message }
  }

  if (campaigns.length === 0) return { success: true, message: 'No campaigns to analyze' }

  const telemetryData = campaigns.map(c => ({
    id: c.id,
    name: c.name,
    status: c.status,
    daily_budget: c.daily_budget,
    spend: Number(c.spend) || 0,
    impressions: Number(c.impressions) || 0,
    clicks: Number(c.clicks) || 0,
    leads: c.leads || 0,
    cpl: c.leads && c.leads > 0 ? (Number(c.spend) || 0) / c.leads : 0,
  }))

  // 2. Run Lightweight Rules FIRST (Token Savings)
  const flaggedCampaigns = runLightweightRulesEngine(telemetryData)
  
  // If nothing is flagged and it's not a forced manual/scheduled analysis, exit to save tokens
  if (flaggedCampaigns.length === 0 && !['MANUAL_ANALYSIS', 'SCHEDULED_ANALYSIS'].includes(executionMode)) {
    return { success: true, message: 'Lightweight rules passed. No AI invocation required.' }
  }

  // 3. Fetch Knowledge Base (Replaces continuous raw CRM queries)
  const { data: kbData } = await db
    .from('marketing_intelligence_kb')
    .select('summary')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .limit(5)
  
  const kbContext = kbData ? kbData.map(k => k.summary).join('\\n') : 'No historical data yet.'

  // 4. Query AI Provider Service for Explainable AI (XAI)
  const aiConfig = await getTenantAIModel(accountId)
  const aiModel = getModelForAccount(aiConfig)
  
  const systemPrompt = `You are an Enterprise Autonomous AI Meta Ads Agent.
Analyze the following flagged campaigns (identified by rule engine) or general telemetry.
Execution Mode: ${executionMode}

MARKETING INTELLIGENCE KNOWLEDGE BASE:
${kbContext}

Evaluate the following telemetry:
${JSON.stringify(telemetryData, null, 2)}`

  try {
    const { object: decisions, usage } = await generateObject({
      model: aiModel,
      system: systemPrompt,
      prompt: 'Generate Explainable AI optimization decisions for the campaigns.',
      schema: z.object({
        decisions: z.array(
          z.object({
            campaignId: z.string(),
            actionType: z.enum(['PAUSE', 'SCALE', 'OBSERVE', 'ALERT']),
            confidenceScore: z.number().min(0).max(100),
            aiRationale: z.string().describe('Clear reasoning for this decision.'),
            supportingEvidence: z.string().describe('Evidence referencing the Knowledge Base or telemetry.'),
            estimatedROI: z.number().optional().describe('Estimated Return on Investment % if executed.'),
            suggestedBudgetAdjustmentPercentage: z.number().optional()
          })
        )
      })
    })

    const logs = []
    
    // Estimate cost (Mock logic: in reality, multiply by provider's token cost)
    const usageData = usage as any
    const totalTokens = (usageData?.promptTokens || 0) + (usageData?.completionTokens || 0)
    const estimatedCostCents = Math.round(totalTokens * 0.0002) // Approx cost

    // 5. Process AI Decisions with Strict Governance
    for (const decision of decisions.decisions) {
      if (decision.actionType === 'OBSERVE') continue

      const campaign = campaigns.find(c => c.id === decision.campaignId)
      if (!campaign) continue

      let status = 'PENDING_APPROVAL'
      
      if (executionMode === 'SIMULATION') {
        status = 'SIMULATED'
      } else if (executionMode === 'RECOMMENDATION_ONLY') {
        status = 'PENDING_APPROVAL'
      } else if (executionMode === 'FULL_AUTONOMY' && decision.confidenceScore >= 80) {
        try {
          if (decision.actionType === 'PAUSE' && campaign.status === 'ACTIVE') {
            await updateCampaignStatus(decision.campaignId, 'PAUSED', decryptedToken)
            status = 'AUTO_EXECUTED'
          } else if (decision.actionType === 'SCALE' && decision.suggestedBudgetAdjustmentPercentage && campaign.status === 'ACTIVE') {
            const currentBudget = Number(campaign.daily_budget) || 0
            if (currentBudget > 0) {
               const newBudget = currentBudget * (1 + (decision.suggestedBudgetAdjustmentPercentage / 100))
               await updateCampaignBudget(decision.campaignId, Math.round(newBudget * 100), decryptedToken)
               status = 'AUTO_EXECUTED'
            }
          }
        } catch (execErr: any) {
          console.error(`AI Agent: Auto-execute failed on ${decision.campaignId}`, execErr)
          status = 'EXECUTION_FAILED'
        }
      }

      // Log the Agent Operation with full Cost Governance & XAI
      await db.from('ai_agent_operations').insert({
        account_id: accountId,
        agent_name: 'meta_ads_agent',
        action_type: executionMode === 'SIMULATION' ? 'SIMULATION' : decision.actionType,
        target_id: decision.campaignId,
        ai_rationale: decision.aiRationale,
        confidence_score: decision.confidenceScore,
        supporting_evidence: decision.supportingEvidence,
        estimated_roi: decision.estimatedROI,
        expected_impact: { 
          budget_adjustment: decision.suggestedBudgetAdjustmentPercentage || 0,
          original_cpl: telemetryData.find(t => t.id === decision.campaignId)?.cpl || 0
        },
        provider_name: 'AIProviderService', // Usually resolve from model id
        estimated_token_usage: totalTokens,
        estimated_cost_cents: estimatedCostCents,
        status,
        version: 1, // Future: Increment on updates
        rollback_data: { previous_budget: campaign.daily_budget, previous_status: campaign.status },
        executed_at: status === 'AUTO_EXECUTED' ? new Date().toISOString() : null
      })

      logs.push(`Logged ${decision.actionType} decision for ${campaign.name} (Mode: ${executionMode}, Status: ${status}, Tokens: ${totalTokens})`)
    }

    return { success: true, logs, totalTokens, estimatedCostCents }

  } catch (error: any) {
    console.error('AI Agent logic error:', error)
    return { success: false, error: error.message }
  }
}
