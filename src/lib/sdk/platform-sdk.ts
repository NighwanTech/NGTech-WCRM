/**
 * AIWCRM Enterprise Platform SDK (@aiwcrm/platform-sdk)
 * Unified internal SDK creating a stable boundary between UIs, Providers, and the Enterprise AI Core.
 */

import { CampaignOrchestrator } from '@/lib/meta/campaign-orchestrator'
import { DecisionLedgerEngine } from '@/lib/meta/decision-ledger-engine'
import { RollbackService } from '@/lib/meta/rollback-service'
import { ApprovalWorkflowEngine } from '@/lib/meta/approval-workflow-engine'
import { ContinuousLearningEngine } from '@/lib/meta/continuous-learning-engine'
import { MetaIntegrationService } from '@/lib/meta/meta-integration-service'
import { ContextEngine } from '@/lib/meta/context-engine'
import { KnowledgeEngine } from '@/lib/meta/knowledge-engine'
import { ToolRouter } from '@/lib/meta/tools/tool-router'
import { ToolRegistry } from '@/lib/meta/tools/tool-registry'

const contextEngine = new ContextEngine()
const knowledgeEngine = new KnowledgeEngine()

export class AIWCRMPlatformSDK {
  // 1. Campaign & Orchestration API
  public static CampaignAPI = {
    orchestrate: (accountId: string, campaignId: string, metaCampaignId: string) =>
      CampaignOrchestrator.orchestrateCampaign(accountId, campaignId, metaCampaignId),
    sync: (accountId: string) => MetaIntegrationService.syncAll(accountId)
  }

  // 2. Decision Ledger & Audit API
  public static DecisionLedgerAPI = {
    record: (input: any) => DecisionLedgerEngine.recordDecision(input),
    evaluate: (eventCode: string, metrics: any) => DecisionLedgerEngine.evaluateOutcomeAndCalibrate(eventCode, metrics)
  }

  // 3. Rollback & State Restoration API
  public static RollbackAPI = {
    execute: (req: any) => RollbackService.executeRollback(req)
  }

  // 4. Controlled Approval Queue API
  public static ApprovalAPI = {
    submit: (req: any) => ApprovalWorkflowEngine.submitToQueue(req),
    approve: (queueId: string, userId: string) => ApprovalWorkflowEngine.approveAndExecute(queueId, userId),
    verify: (queueId: string) => ApprovalWorkflowEngine.verifyExecutionImpact(queueId)
  }

  // 5. Analytics & Learning Memory API
  public static AnalyticsAPI = {
    getPerformanceMetrics: (accountId: string) => ContinuousLearningEngine.getAIPerformanceMetrics(accountId)
  }

  // 6. Enterprise Context Engine API
  public static ContextAPI = {
    assembleContext: (accountId: string, campaignId?: string) =>
      contextEngine.assembleContext(accountId, campaignId)
  }

  // 7. Enterprise Knowledge Engine API
  public static KnowledgeAPI = {
    retrieveKnowledge: (accountId: string, query?: string, campaignId?: string) =>
      knowledgeEngine.retrieveKnowledge(accountId, query, campaignId)
  }

  // 8. Enterprise System Tool API (Phase 6.4.3)
  public static ToolAPI = {
    executeTool: (toolId: string, context: { accountId: string; userId: string; payload?: any }) =>
      ToolRouter.executeTool(toolId, context),
    listTools: () => ToolRegistry.listTools()
  }
}
