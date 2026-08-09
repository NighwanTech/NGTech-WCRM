import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { generateAIInsights } from '@/lib/meta/ai-ad-engine'

export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = supabaseAdmin()
      
      // Fetch latest campaign telemetry for insights
      const { data: campaigns } = await db
        .from('meta_campaign_cache')
        .select('*')
        .eq('account_id', ctx.accountId)
        .eq('status', 'ACTIVE')
        .order('last_synced_at', { ascending: false })

      if (!campaigns || campaigns.length === 0) {
        return NextResponse.json({ success: true, insights: [] })
      }

      const telemetry = campaigns.map((c: any) => ({
        campaignName: c.name,
        spend: Number(c.spend) || 0,
        impressions: Number(c.impressions) || 0,
        clicks: Number(c.clicks) || 0,
        leads: Number(c.leads) || 0,
        cpl: c.leads > 0 ? (Number(c.spend) || 0) / c.leads : 0,
        ctr: c.impressions > 0 ? (Number(c.clicks) || 0) / (Number(c.impressions) || 0) * 100 : 0,
        roas: 0 // Mocked for now until funnel is integrated
      }))

      const insights = await generateAIInsights(ctx.accountId, telemetry)

      return NextResponse.json({ success: true, insights })
    } catch (error: any) {
      console.error('Fetch AI insights error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
