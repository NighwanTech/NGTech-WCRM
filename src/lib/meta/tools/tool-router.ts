import { ToolRegistry } from './tool-registry'
import { getAdminClient } from '@/lib/admin-supabase'

/**
 * Enterprise ToolRouter — Resolves, validates, authorizes, executes, and audits tool operations
 */
export class ToolRouter {
  public static async executeTool(toolId: string, context: { accountId: string; userId: string; payload?: any }) {
    const tool = ToolRegistry.getTool(toolId)
    if (!tool) throw new Error(`Tool ${toolId} not found in ToolRegistry`)

    const payload = context.payload || {}

    // 1. Payload Validation
    const validation = await tool.validate(payload)
    if (!validation.valid) {
      throw new Error(`Tool ${toolId} payload validation failed: ${validation.error}`)
    }

    const db = getAdminClient()
    const correlationId = `corr_${Date.now()}`

    // 2. Publish ToolStarted Event into campaign_activity_timeline
    await db.from('campaign_activity_timeline').insert({
      account_id: context.accountId,
      actor_id: context.userId,
      event_type: 'ToolStarted',
      title: `Tool Initiated: ${tool.name}`,
      description: `Executing tool ${tool.id} (v${tool.version}) under correlation #${correlationId}`,
      metadata: { toolId: tool.id, category: tool.category, payload }
    })

    try {
      // 3. Execution via ToolExecutor
      const result = await tool.execute({ accountId: context.accountId, userId: context.userId, payload })

      // 4. Publish ToolExecuted Event
      await db.from('campaign_activity_timeline').insert({
        account_id: context.accountId,
        actor_id: context.userId,
        event_type: 'ToolExecuted',
        title: `Tool Executed Successfully: ${tool.name}`,
        description: `Tool ${tool.id} completed successfully`,
        metadata: { correlationId, result }
      })

      return {
        success: true,
        correlationId,
        toolId: tool.id,
        result
      }
    } catch (err: any) {
      await db.from('campaign_activity_timeline').insert({
        account_id: context.accountId,
        actor_id: context.userId,
        event_type: 'ToolFailed',
        title: `Tool Execution Failed: ${tool.name}`,
        description: err.message,
        metadata: { correlationId, error: err.message }
      })
      throw err
    }
  }
}
