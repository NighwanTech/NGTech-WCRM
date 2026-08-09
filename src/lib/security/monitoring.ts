import { logAudit } from './audit'

/**
 * Enterprise monitoring utility for tracking API errors, security anomalies, and failed login attempts.
 */
export function trackApiError(route: string, error: Error | unknown, userId?: string, accountId?: string) {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  console.error(`[API Error] [Route: ${route}] [User: ${userId || 'anonymous'}]`, message, stack)
}

/**
 * Tracks suspicious security anomalies such as failed logins or rate limit breaches.
 */
export async function trackAuthAnomaly(
  type: string,
  ip: string,
  details: Record<string, any>,
  request?: Request
) {
  console.warn(`[SECURITY ANOMALY] Type: ${type} | IP: ${ip}`, details)

  await logAudit({
    action: `security_anomaly.${type}`,
    severity: type.includes('lockout') ? 'critical' : 'high',
    request,
    metadata: { ip, ...details },
  })
}
