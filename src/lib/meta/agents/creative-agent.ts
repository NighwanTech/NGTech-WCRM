import { getAdminClient } from '@/lib/admin-supabase'
import { IBaseSpecializedAgent, AgentAnalysisResult } from './base-agent-contract'

/**
 * CreativeAgent — Specialized Agent for Ad Frequency & Audience Fatigue
 */
export class CreativeAgent implements IBaseSpecializedAgent {
  public agentName = 'CreativeAgent'

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

    // High frequency or declining CTR -> Propose Creative Pause/Rotation
    if (latestFeature.frequency > 3.5 || latestFeature.ctr_delta < -0.2) {
      return {
        agentName: this.agentName,
        recommendationType: 'CREATIVE_FATIGUE',
        actionProposed: 'Pause Fatigued Ad Creative & Rotate Hook',
        proposedChanges: { action: 'ROTATE_CREATIVE', frequency: latestFeature.frequency, currentCtr: latestFeature.ctr },
        confidenceScore: 96.5,
        expectedImprovement: '+35% Engagement Recovery',
        riskScore: 8.0
      }
    }

    return null
  }
}
