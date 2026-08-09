import { Permission } from './permissions'

export interface ContextualAttributes {
  currentTime?: Date
  clientIp?: string
  mfaVerified?: boolean
  isTrustedDevice?: boolean
  isUnfamiliarIp?: boolean
  isUnusualLocation?: boolean
}

export interface RiskEvaluationResult {
  riskScore: number // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  factors: string[]
  recommendedAction: 'ALLOW' | 'STEP_UP_MFA' | 'DENY'
}

/**
 * Dynamic Authorization Risk Score Calculator (0-100).
 */
export function calculateAuthorizationRiskScore(context: ContextualAttributes): RiskEvaluationResult {
  let score = 10
  const factors: string[] = []

  // Check MFA
  if (!context.mfaVerified) {
    score += 30
    factors.push('Missing Multi-Factor Authentication (MFA)')
  }

  // Check Device Trust
  if (!context.isTrustedDevice) {
    score += 25
    factors.push('Unrecognized / Untrusted Device')
  }

  // Check IP Network Trust
  if (context.isUnfamiliarIp) {
    score += 20
    factors.push('Unfamiliar IP Subnet')
  }

  // Check Location Anomaly
  if (context.isUnusualLocation) {
    score += 25
    factors.push('Geographic Location Anomaly')
  }

  // Check Business Hours (09:00 - 18:00)
  const now = context.currentTime || new Date()
  const hour = now.getHours()
  if (hour < 8 || hour > 20) {
    score += 15
    factors.push('Off-Business-Hours Request (Night Session)')
  }

  score = Math.min(score, 100)

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'
  let recommendedAction: 'ALLOW' | 'STEP_UP_MFA' | 'DENY' = 'ALLOW'

  if (score >= 75) {
    riskLevel = 'CRITICAL'
    recommendedAction = 'DENY'
  } else if (score >= 50) {
    riskLevel = 'HIGH'
    recommendedAction = 'STEP_UP_MFA'
  } else if (score >= 30) {
    riskLevel = 'MEDIUM'
    recommendedAction = 'ALLOW'
  }

  return {
    riskScore: score,
    riskLevel,
    factors,
    recommendedAction,
  }
}

/**
 * Modular ABAC Policy Evaluator.
 */
export function evaluateModularABACPolicy(
  permission: Permission,
  context: ContextualAttributes
): { allowed: boolean; reason?: string } {
  const riskResult = calculateAuthorizationRiskScore(context)

  if (riskResult.recommendedAction === 'DENY') {
    return {
      allowed: false,
      reason: `ABAC Risk Score Policy Triggered: Score ${riskResult.riskScore}/100 exceeds critical threshold. Factors: ${riskResult.factors.join(', ')}`,
    }
  }

  return { allowed: true }
}
