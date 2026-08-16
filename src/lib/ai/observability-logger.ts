/**
 * AIWCRM Enterprise Revenue OS — AI Observability & Audit Logger Engine
 * Logs model provider, prompt, response time, token usage, cost, confidence score, tool calls, and human overrides.
 */

export interface AIObservabilityLog {
  id: string
  modelProvider: string
  promptSummary: string
  responseTimeMs: number
  promptTokens: number
  completionTokens: number
  totalCostUsd: number
  confidenceScore: number
  toolCallsExecuted: string[]
  humanOverrideApplied: boolean
  timestamp: string
}

export class AIObservabilityLogger {
  private static logs: AIObservabilityLog[] = []

  public static logExecution(params: Omit<AIObservabilityLog, 'id' | 'timestamp'>): AIObservabilityLog {
    const entry: AIObservabilityLog = {
      ...params,
      id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    }
    this.logs.unshift(entry)
    if (this.logs.length > 200) this.logs.pop()
    return entry
  }

  public static getRecentLogs(): AIObservabilityLog[] {
    return this.logs
  }
}
