import { getAdminClient } from '@/lib/admin-supabase'

export type RiskClassification = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RoutingDecision = 'AUTONOMOUS_EXECUTE' | 'REQUIRE_HUMAN_APPROVAL' | 'FORBIDDEN'

export interface RiskInputPayload {
  predictedRoas: number
  predictedCpl: number
  budgetIncreasePercent: number
  frequency: number
  ctr: number
  historicalVariance: number
  learningConfidence: number
}

export interface RiskEvaluationResult {
  riskScore: number
  riskClassification: RiskClassification
  routingDecision: RoutingDecision
  riskBreakdown: Record<string, any>
}

/**
 * Deterministic Risk Engine (Section 6)
 * Calculates a mathematical Risk Score (0 to 100) and routes to AUTONOMOUS, HUMAN_APPROVAL, or FORBIDDEN
 */
export class DeterministicRiskEngine {
  public static evaluateRisk(input: RiskInputPayload): RiskEvaluationResult {
    // Risk Formula Calculation:
    // Risk = (BudgetScaleFactor * 0.30) + (CPLVarianceFactor * 0.25) + (FrequencyFactor * 0.20) + (ConfidenceDeficit * 0.25)

    const budgetFactor = Math.min(input.budgetIncreasePercent * 2.5, 40) // 0 to 40
    const cplFactor = Math.min(input.predictedCpl > 40 ? (input.predictedCpl - 40) * 1.5 : 0, 30) // 0 to 30
    const freqFactor = Math.min(input.frequency * 6, 20) // 0 to 20
    const confidenceDeficit = Math.max((100 - input.learningConfidence) * 0.3, 0) // 0 to 10

    const totalRiskScore = parseFloat((budgetFactor + cplFactor + freqFactor + confidenceDeficit).toFixed(2))

    let classification: RiskClassification = 'LOW'
    let routing: RoutingDecision = 'AUTONOMOUS_EXECUTE'

    if (totalRiskScore >= 70.0 || input.budgetIncreasePercent > 50.0) {
      classification = 'CRITICAL'
      routing = 'FORBIDDEN'
    } else if (totalRiskScore >= 40.0 || input.budgetIncreasePercent > 15.0) {
      classification = 'HIGH'
      routing = 'REQUIRE_HUMAN_APPROVAL'
    } else if (totalRiskScore >= 20.0) {
      classification = 'MEDIUM'
      routing = 'AUTONOMOUS_EXECUTE' // Low-risk, executing under Human-on-the-Loop with Rollback
    } else {
      classification = 'LOW'
      routing = 'AUTONOMOUS_EXECUTE'
    }

    return {
      riskScore: totalRiskScore,
      riskClassification: classification,
      routingDecision: routing,
      riskBreakdown: {
        budgetFactor,
        cplFactor,
        freqFactor,
        confidenceDeficit
      }
    }
  }

  public static async recordRiskEvaluation(
    accountId: string,
    campaignId: string,
    eventId: string,
    evalResult: RiskEvaluationResult
  ) {
    const db = getAdminClient()
    const { data: row, error } = await db.from('campaign_ai_risk_scores').insert({
      account_id: accountId,
      campaign_id: campaignId,
      orchestration_event_id: eventId,
      risk_score: evalResult.riskScore,
      risk_classification: evalResult.riskClassification,
      routing_decision: evalResult.routingDecision,
      risk_breakdown: evalResult.riskBreakdown
    }).select('*').single()

    if (error) console.error('[RiskEngine] Error saving risk evaluation:', error.message)
    return row
  }
}
