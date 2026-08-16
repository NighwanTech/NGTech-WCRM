import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { AIWCRMPlatformSDK } from '@/lib/sdk/platform-sdk'
import { GeminiLLMProvider } from '@/lib/meta/llm/gemini-llm-provider'
import { PIIMasker } from '@/lib/security/pii-masking'
import { getAdminClient } from '@/lib/admin-supabase'

const llmProvider = new GeminiLLMProvider()

/**
 * Enterprise Copilot API (/api/meta/v1/ai/copilot)
 * Consumes ONLY @aiwcrm/platform-sdk and ILLMProvider abstraction.
 * Implements FIX 5 (Streaming Response), FIX 14 (PII Masking), and FIX 19 (Conversation History).
 */

// GET - Retrieve saved Copilot conversation history (FIX 19)
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = getAdminClient()
      const { data: logs } = await db
        .from('campaign_activity_timeline')
        .select('*')
        .eq('account_id', ctx.accountId)
        .eq('event_type', 'CopilotMessage')
        .order('created_at', { ascending: true })
        .limit(50)

      const messages = (logs || []).map(l => ({
        role: l.metadata?.role || 'assistant',
        content: l.description || l.title,
        reasoningSteps: l.metadata?.reasoningSteps,
        toolResult: l.metadata?.toolResult,
        createdAt: l.created_at
      }))

      return NextResponse.json({
        success: true,
        messages
      })
    } catch (err: any) {
      return NextResponse.json({ success: false, messages: [] })
    }
  })
}

// POST - Execute Copilot reasoning & streaming tool orchestration
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const body = await request.json()
      const { messages, campaignId, stream } = body
      const startTime = Date.now()
      const db = getAdminClient()

      // 1. Apply PII Masking (FIX 14)
      const sanitizedMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = PIIMasker.maskMessages(messages || [])

      // 2. Assemble Context & Knowledge via Platform SDK
      const context = await AIWCRMPlatformSDK.ContextAPI.assembleContext(ctx.accountId, campaignId)
      const knowledge = await AIWCRMPlatformSDK.KnowledgeAPI.retrieveKnowledge(ctx.accountId, '', campaignId)

      // 3. Real Server-Sent Events / ReadableStream (FIX 5)
      if (stream && llmProvider.streamResponse) {
        const encoder = new TextEncoder()
        const customStream = new ReadableStream({
          async start(controller) {
            try {
              let finalContent = ''
              let toolExecutionResult: any = null
              let correlationId = `corr_${Date.now()}`

              for await (const chunk of llmProvider.streamResponse!(sanitizedMessages, { campaignId, context, knowledge })) {
                if (chunk.type === 'tool_call' && chunk.toolCall) {
                  toolExecutionResult = await AIWCRMPlatformSDK.ToolAPI.executeTool(chunk.toolCall.toolId, {
                    accountId: ctx.accountId,
                    userId: ctx.userId,
                    payload: chunk.toolCall.payload
                  })
                  if (toolExecutionResult?.correlationId) correlationId = toolExecutionResult.correlationId
                  chunk.toolResult = toolExecutionResult
                  chunk.correlationId = correlationId
                }

                if (chunk.type === 'token' && chunk.content) {
                  finalContent += chunk.content
                }

                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
              }

              // Persist Assistant Response into Conversation History (FIX 19)
              try {
                await db.from('campaign_activity_timeline').insert({
                  account_id: ctx.accountId,
                  campaign_id: campaignId || null,
                  actor_id: ctx.userId,
                  event_type: 'CopilotMessage',
                  title: finalContent.slice(0, 100),
                  description: finalContent,
                  metadata: {
                    role: 'assistant',
                    toolResult: toolExecutionResult,
                    correlationId,
                    durationMs: Date.now() - startTime
                  }
                })
              } catch (e) {
                // Ignore DB log errors
              }

              controller.close()
            } catch (err: any) {
              controller.error(err)
            }
          }
        })

        return new Response(customStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          }
        }) as unknown as NextResponse
      }

      // Standard Non-streaming fallback
      const llmResult = await llmProvider.generateResponse(sanitizedMessages, { campaignId, context, knowledge })
      let toolExecutionResult: any = null
      let correlationId = `corr_${Date.now()}`

      if (llmResult.toolCall) {
        toolExecutionResult = await AIWCRMPlatformSDK.ToolAPI.executeTool(llmResult.toolCall.toolId, {
          accountId: ctx.accountId,
          userId: ctx.userId,
          payload: llmResult.toolCall.payload
        })
        if (toolExecutionResult?.correlationId) correlationId = toolExecutionResult.correlationId
      }

      const totalDurationMs = Date.now() - startTime

      // Persist Conversation History (FIX 19)
      const lastUserMsg = sanitizedMessages[sanitizedMessages.length - 1]
      if (lastUserMsg && lastUserMsg.role === 'user') {
        try {
          await db.from('campaign_activity_timeline').insert({
            account_id: ctx.accountId,
            campaign_id: campaignId || null,
            actor_id: ctx.userId,
            event_type: 'CopilotMessage',
            title: lastUserMsg.content.slice(0, 100),
            description: lastUserMsg.content,
            metadata: { role: 'user' }
          })
        } catch (e) {
          // Ignore DB log errors
        }
      }

      try {
        await db.from('campaign_activity_timeline').insert({
          account_id: ctx.accountId,
          campaign_id: campaignId || null,
          actor_id: ctx.userId,
          event_type: 'CopilotMessage',
          title: llmResult.content.slice(0, 100),
          description: llmResult.content,
          metadata: {
            role: 'assistant',
            reasoningSteps: llmResult.reasoningSteps,
            toolResult: toolExecutionResult,
            correlationId,
            durationMs: totalDurationMs
          }
        })
      } catch (e) {
        // Ignore DB log errors
      }

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
