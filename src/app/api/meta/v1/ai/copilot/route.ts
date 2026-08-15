import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { AIWCRMPlatformSDK } from '@/lib/sdk/platform-sdk'
import { GeminiLLMProvider } from '@/lib/meta/llm/gemini-llm-provider'

const llmProvider = new GeminiLLMProvider()

/**
 * Enterprise Copilot API (/api/meta/v1/ai/copilot)
 * Consumes ONLY @aiwcrm/platform-sdk and ILLMProvider abstraction.
 */
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const body = await request.json()
      const { messages, campaignId } = body
      const startTime = Date.now()

      // 1. Assemble Context & Knowledge via Platform SDK
      const context = await AIWCRMPlatformSDK.ContextAPI.assembleContext(ctx.accountId, campaignId)
      const knowledge = await AIWCRMPlatformSDK.KnowledgeAPI.retrieveKnowledge(ctx.accountId, '', campaignId)

      // 2. Generate LLM Reasoning & Intent Classification
      const llmResult = await llmProvider.generateResponse(messages || [], { campaignId, context, knowledge })

      let toolExecutionResult: any = null
      let correlationId = `corr_${Date.now()}`

      // 3. Execute Tool via Platform SDK ToolAPI if tool call generated
      if (llmResult.toolCall) {
        toolExecutionResult = await AIWCRMPlatformSDK.ToolAPI.executeTool(llmResult.toolCall.toolId, {
          accountId: ctx.accountId,
          userId: ctx.userId,
          payload: llmResult.toolCall.payload
        })
        if (toolExecutionResult.correlationId) correlationId = toolExecutionResult.correlationId
      }

      const totalDurationMs = Date.now() - startTime

      return NextResponse.json({
        success: true,
        provider: llmProvider.providerName,
        correlationId,
        durationMs: totalDurationMs,
        response: {
          content: llmResult.content,
          intent: llmResult.intent,
          reasoningSteps: llmResult.reasoningSteps,
          toolExecutionResult
        }
      })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}
