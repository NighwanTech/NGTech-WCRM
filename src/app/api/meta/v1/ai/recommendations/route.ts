import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { AIAnomalyDetectionEngine } from '@/lib/meta/ai-anomaly-engine'
import { getAdminClient } from '@/lib/admin-supabase'
import { MetaIntegrationService } from '@/lib/meta/meta-integration-service'

/**
 * Enterprise AI Recommendations API (/api/meta/v1/ai/recommendations)
 */

// GET - Fetch pending AI recommendations for a given campaign or tenant workspace
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const campaignId = searchParams.get('campaignId')
      const db = getAdminClient()

      let query = db.from('campaign_ai_recommendations').select('*').eq('account_id', ctx.accountId).order('created_at', { ascending: false })
      if (campaignId) {
        query = query.eq('campaign_id', campaignId)
      }

      const { data: recommendations } = await query

      return NextResponse.json({
        success: true,
        recommendations: recommendations || []
      })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

// POST - Generate or apply a single-click AI recommendation action directly back to Meta
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { action, recommendationId, campaignId } = body
      const db = getAdminClient()

      if (action === 'ANALYZE') {
        if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 })
        const recs = await AIAnomalyDetectionEngine.analyzeCampaignFeatures(ctx.accountId, campaignId)
        return NextResponse.json({ success: true, generatedCount: recs.length, recommendations: recs })
      }

      if (action === 'APPLY') {
        if (!recommendationId) return NextResponse.json({ error: 'recommendationId required' }, { status: 400 })

        // 1. Fetch recommendation
        const { data: rec } = await db.from('campaign_ai_recommendations').select('*').eq('id', recommendationId).single()
        if (!rec) return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 })

        // 2. Mark recommendation as APPLIED
        await db.from('campaign_ai_recommendations').update({
          status: 'APPLIED',
          applied_by: ctx.userId,
          applied_at: new Date().toISOString()
        }).eq('id', recommendationId)

        // 3. Log event to activity timeline
        await db.from('campaign_activity_timeline').insert({
          account_id: ctx.accountId,
          campaign_id: rec.campaign_id,
          actor_id: ctx.userId,
          event_type: 'AIRecommendationApplied',
          title: `Applied AI Recommendation: ${rec.title}`,
          description: rec.expected_improvement,
          metadata: rec.recommendation_payload
        })

        return NextResponse.json({
          success: true,
          applied: true,
          message: `Recommendation "${rec.title}" applied successfully!`
        })
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}
