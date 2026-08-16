/**
 * AIWCRM Enterprise Operating System (EOS) — Three-Tier Revenue Forecast Domain Engine
 * Calculates Best Case, Expected, and Worst Case revenue forecasts.
 */

export interface ThreeTierForecast {
  bestCaseInr: number
  expectedInr: number
  worstCaseInr: number
  monthlyRunRateInr: number
  targetAchievementPct: number
}

export class ThreeTierForecastDomainEngine {
  public static calculateForecast(pipelineAmount = 1800000): ThreeTierForecast {
    const expected = Math.round(pipelineAmount * 0.28)
    return {
      bestCaseInr: Math.round(expected * 1.3),
      expectedInr: expected,
      worstCaseInr: Math.round(expected * 0.7),
      monthlyRunRateInr: expected,
      targetAchievementPct: 94
    }
  }
}
