import crypto from 'node:crypto'

/**
 * Request Fingerprinting Utility.
 * Combines IP, User-Agent, and Accept-Language to detect session anomalies.
 */
export function generateRequestFingerprint(request: Request): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const userAgent = request.headers.get('user-agent') || 'unknown'
  const lang = request.headers.get('accept-language') || 'unknown'

  const raw = `${ip}|${userAgent}|${lang}`
  return crypto.createHash('sha256').update(raw).digest('hex')
}
