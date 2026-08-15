import { getAdminClient } from '@/lib/admin-supabase'
import { IBaseSpecializedAgent, AgentAnalysisResult } from './base-agent-contract'

/**
 * BudgetAgent — Specialized Agent for Spend Velocity & Budget Scaling
 */
export class BudgetAgent implements IBaseSpecializedAgent {
  public agentName = 'BudgetAgent'

  public async analyze(accountId: string, campaignId: string): Promise<AgentAnalysisResult | null> {
    const db = getAdminClient()
    const { data: latestFeature } = await db
      .from('campaign_ai_features')
      .select('*')
      .eq('account_id', accountId)
      .eq('campaign_id', campaignId)
      .order('date', { ascending: false })
      .limit(1)
      .single()

    if (!latestFeature) return null

    // High performance -> Propose +15% budget scaling
    if (latestFeature.roas >= 3.5 || (latestFeature.cpl > 0 && latestFeature.cpl <= 35)) {
      return {
        agentName: this.agentName,
        recommendationType: 'SCALE_BUDGET',
        actionProposed: 'Scale Daily Budget by +15%',
        proposedChanges: { action: 'SCALE_BUDGET', increasePercent: 15.0, currentSpend: latestFeature.spend },
        confidenceScore: 95.0,
        expectedImprovement: '+18% Projected Conversions',
        riskScore: 12.0
      }
    }

    return null
  }
}
