import { getAdminClient } from '@/lib/admin-supabase'
import { DeterministicRiskEngine, RiskInputPayload } from './deterministic-risk-engine'
import { ApprovalWorkflowEngine } from './approval-workflow-engine'

export interface ExecutionPlannerInput {
  accountId: string
  campaignId: string
  metaCampaignId: string
  recommendationType: string
  proposedChanges: Record<string, any>
  riskInput: RiskInputPayload
}

/**
 * Phase 6.2 Autonomous Execution Planner & Risk Router
 * Pipeline: Execution Planner -> Risk Classifier -> Safety & Policy Validator -> Router -> Execution
 */
export class AutonomousExecutionPlanner {
  public static async evaluateAndRoute(input: ExecutionPlannerInput) {
    const db = getAdminClient()
    const eventId = `evt_exec_${Date.now()}`

    // 1. Evaluate Deterministic Risk Score (0-100)
    const riskResult = DeterministicRiskEngine.evaluateRisk(input.riskInput)

    // Save risk evaluation log into campaign_ai_risk_scores
    await DeterministicRiskEngine.recordRiskEvaluation(
      input.accountId,
      input.campaignId,
      eventId,
      riskResult
    )

    // 2. Action Safety Classification & Routing
    let finalRouting = riskResult.routingDecision

    // Hard Safety Rule Override: Budget increase > 15% MUST require human approval regardless of risk score
    if (input.proposedChanges.increasePercent && input.proposedChanges.increasePercent > 15.0) {
      finalRouting = 'REQUIRE_HUMAN_APPROVAL'
    }

    // 3. Routing Execution
    if (finalRouting === 'AUTONOMOUS_EXECUTE') {
      // Execute autonomously under Human-on-the-Loop with 1-click Rollback capability
      const queueItem = await ApprovalWorkflowEngine.submitToQueue({
        accountId: input.accountId,
        campaignId: input.campaignId,
        metaCampaignId: input.metaCampaignId,
        actionType: input.recommendationType,
        proposedChanges: { ...input.proposedChanges, riskScore: riskResult.riskScore, mode: 'AUTONOMOUS' }
      })

      // Auto-approve low-risk autonomous item
      await ApprovalWorkflowEngine.approveAndExecute(queueItem.id, '00000000-0000-0000-0000-000000000000') // System User ID
      await ApprovalWorkflowEngine.verifyExecutionImpact(queueItem.id)

      return {
        success: true,
        routing: 'AUTONOMOUS_EXECUTE',
        riskScore: riskResult.riskScore,
        message: 'Executed autonomously under Human-on-the-Loop governance.'
      }
    } else if (finalRouting === 'REQUIRE_HUMAN_APPROVAL') {
      // Enqueue in Approval Queue for 1-click Human-in-the-Loop approval
      const queueItem = await ApprovalWorkflowEngine.submitToQueue({
        accountId: input.accountId,
        campaignId: input.campaignId,
        metaCampaignId: input.metaCampaignId,
        actionType: input.recommendationType,
        proposedChanges: { ...input.proposedChanges, riskScore: riskResult.riskScore, mode: 'HUMAN_APPROVAL' }
      })

      return {
        success: true,
        routing: 'REQUIRE_HUMAN_APPROVAL',
        riskScore: riskResult.riskScore,
        queueId: queueItem.id,
        message: 'High risk / scale detected. Routed to Approval Queue for human verification.'
      }
    } else {
      // FORBIDDEN Action
      await db.from('campaign_activity_timeline').insert({
        account_id: input.accountId,
        campaign_id: input.campaignId,
        event_type: 'ActionForbidden',
        title: 'Autonomous Action Blocked by Safety Guardrails',
        description: `Action ${input.recommendationType} was blocked due to critical risk score (${riskResult.riskScore}/100)`,
        metadata: riskResult.riskBreakdown
      })

      return {
        success: false,
        routing: 'FORBIDDEN',
        riskScore: riskResult.riskScore,
        error: 'Action blocked by enterprise safety guardrails.'
      }
    }
  }
}
