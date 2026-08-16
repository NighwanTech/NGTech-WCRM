/**
 * AIWCRM Enterprise Operating System (EOS) — Platform Configuration Registry
 * Configurable thresholds for Max AI Tokens, Lead Score Threshold, Currency, Working Hours, Retry Count.
 */

export interface PlatformConfig {
  maxAiTokensPerRequest: number
  highIntentLeadScoreThreshold: number
  defaultCurrency: string
  timezone: string
  maxRetryCount: number
  queueSizeLimit: number
  defaultAiProvider: string
  autoModelFallbackEnabled: boolean
}

export class PlatformConfigRegistry {
  private static config: PlatformConfig = {
    maxAiTokensPerRequest: 4096,
    highIntentLeadScoreThreshold: 90,
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
    maxRetryCount: 3,
    queueSizeLimit: 10000,
    defaultAiProvider: "Gemini 1.5 Pro",
    autoModelFallbackEnabled: true
  }

  public static getConfig(): PlatformConfig {
    return { ...this.config }
  }

  public static updateConfig(updates: Partial<PlatformConfig>): PlatformConfig {
    this.config = { ...this.config, ...updates }
    return { ...this.config }
  }
}
