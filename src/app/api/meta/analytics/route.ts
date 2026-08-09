import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { getFunnelAnalytics } from '@/lib/meta/analytics-engine'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * GET - Fetch Full-Funnel Analytics for Meta Ads OS
 */
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const days = parseInt(searchParams.get('days') || '30', 10)

      const db = supabaseAdmin()
      const analytics = await getFunnelAnalytics(db, ctx.accountId, days)

      return NextResponse.json({
        success: true,
        analytics,
      })
    } catch (error: any) {
      console.error('Analytics fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
