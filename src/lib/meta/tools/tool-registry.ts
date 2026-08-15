import { SystemToolContract } from './system-tool-contract'
import {
  GetCampaignTelemetryTool,
  RunSimulationTool,
  ApproveRecommendationTool,
  RollbackCampaignTool,
  GetSystemHealthTool
} from './all-registered-tools'

/**
 * Enterprise ToolRegistry — Discovers, registers, and catalogs system tools without hardcoded switches
 */
export class ToolRegistry {
  private static registry: Map<string, SystemToolContract> = new Map()

  public static initialize() {
    if (ToolRegistry.registry.size > 0) return
    ToolRegistry.registerTool(new GetCampaignTelemetryTool())
    ToolRegistry.registerTool(new RunSimulationTool())
    ToolRegistry.registerTool(new ApproveRecommendationTool())
    ToolRegistry.registerTool(new RollbackCampaignTool())
    ToolRegistry.registerTool(new GetSystemHealthTool())
  }

  public static registerTool(tool: SystemToolContract) {
    if (ToolRegistry.registry.has(tool.id)) {
      console.warn(`[ToolRegistry] Tool ${tool.id} already registered. Overwriting.`)
    }
    ToolRegistry.registry.set(tool.id, tool)
  }

  public static getTool(toolId: string): SystemToolContract | undefined {
    ToolRegistry.initialize()
    return ToolRegistry.registry.get(toolId)
  }

  public static listTools(): SystemToolContract[] {
    ToolRegistry.initialize()
    return Array.from(ToolRegistry.registry.values())
  }
}
