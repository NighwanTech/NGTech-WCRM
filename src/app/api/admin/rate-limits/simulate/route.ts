import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { simulateRateLimitPolicy } from '@/lib/security/rate-limit-governance-engine'

/**
 * POST /api/admin/rate-limits/simulate
 * Dry-run rate limit simulation testing before production publishing
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'rate_limits:manage' }, async () => {
    try {
      const body = await req.json()
      const { maxRequests = 100, windowSeconds = 60, burstCount = 120 } = body

      const result = simulateRateLimitPolicy(
        { maxRequests: Number(maxRequests), windowSeconds: Number(windowSeconds) },
        Number(burstCount)
      )

      return NextResponse.json({
        success: true,
        simulation: result,
      })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
