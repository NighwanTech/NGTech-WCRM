/**
 * Standardized Agent Contract Interface (Item 2)
 * Every specialized agent (BudgetAgent, CreativeAgent, AudienceAgent, SafetyAgent) implements this standard contract.
 */
export interface AgentAnalysisResult {
  agentName: string
  recommendationType: string
  actionProposed: string
  proposedChanges: Record<string, any>
  confidenceScore: number
  expectedImprovement: string
  riskScore: number
}

export interface IBaseSpecializedAgent {
  agentName: string
  analyze(accountId: string, campaignId: string): Promise<AgentAnalysisResult | null>
  simulate?(actionPayload: Record<string, any>): Promise<any>
}
