import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * GET - Retrieve saved AI Strategy by strategyId or list all tenant strategies
 * POST - Create or update persistent AI Strategy & Version into database
 * PUT - Update strategy status/payload (Draft -> Approved -> Archived)
 * DELETE - Soft delete strategy (sets deleted_at)
 */
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const strategyId = searchParams.get('strategyId')
      const includeArchived = searchParams.get('includeArchived') === 'true'
      const db = getAdminClient()

      if (strategyId) {
        // Try dedicated table first, then fallback to audit table
        let { data, error } = await db
          .from('marketing_strategies')
          .select('*')
          .eq('id', strategyId)
          .eq('account_id', ctx.accountId)
          .single()

        if (error || !data) {
          const { data: auditData } = await db
            .from('ai_agent_operations')
            .select('*')
            .eq('id', strategyId)
            .eq('account_id', ctx.accountId)
            .single()

          if (auditData) {
            return NextResponse.json({ success: true, strategy: auditData.payload, id: auditData.id })
          }
          return NextResponse.json({ success: false, error: 'Strategy not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, strategy: data.strategy_payload || data, id: data.id, raw: data })
      }

      // Fetch dedicated marketing_strategies list first
      let { data: dedicatedList } = await db
        .from('marketing_strategies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      // Fallback query from ai_agent_operations
      const { data: auditList } = await db
        .from('ai_agent_operations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      // Merge results seamlessly
      const combined = [
        ...(dedicatedList || []),
        ...(auditList || []).filter((a: any) => a.payload && (a.payload.businessCategory || a.payload.prompt)).map((a: any) => ({
          id: a.id,
          account_id: a.account_id,
          strategy_name: a.payload?.businessCategory ? `${a.payload.businessCategory} Blueprint` : 'AI Marketing Strategy',
          prompt: a.payload?.prompt || 'Enterprise Marketing Strategy',
          industry: a.payload?.businessCategory || 'General',
          subcategory: a.payload?.businessSubCategory || 'Standard',
          status: 'APPROVED',
          version: a.payload?.version || 'v1.0',
          strategy_payload: a.payload,
          confidence_score: a.payload?.confidenceBreakdown?.overallConfidence || 95,
          created_at: a.created_at,
          payload: a.payload
        }))
      ]

      // Filter duplicates by ID
      const uniqueMap = new Map()
      combined.forEach(item => {
        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item)
        }
      })

      const finalStrategies = Array.from(uniqueMap.values())

      return NextResponse.json({ success: true, strategies: finalStrategies })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { strategy, prompt, version, status, industry } = await request.json()
      const db = getAdminClient()

      const strategyPayload = strategy || {}
      const strategyName = `${strategyPayload.businessCategory || 'Enterprise'} Strategy`

      // 1. Try inserting into dedicated marketing_strategies table
      let strategyId = null
      try {
        const { data: inserted, error: dedicatedErr } = await db
          .from('marketing_strategies')
          .insert({
            account_id: ctx.accountId,
            strategy_name: strategyName,
            prompt: prompt || strategyPayload.prompt || '',
            industry: industry || strategyPayload.businessCategory || 'General',
            subcategory: strategyPayload.businessSubCategory || 'Standard',
            status: status || 'APPROVED',
            version: version || 'v1.0',
            strategy_payload: strategyPayload,
            confidence_score: strategyPayload.confidenceBreakdown?.overallConfidence || 95,
            campaign_objective: strategyPayload.campaignObjective || 'OUTCOME_ENGAGEMENT',
            budget: strategyPayload.budgetRecommendation || '₹500 / day',
            location: strategyPayload.primaryLocation || 'Resolved Location',
            radius: strategyPayload.recommendedRadius || '10-15 km',
            meta_interest_names: strategyPayload.metaInterestsVerified?.map((i: any) => i.name) || [],
            headline: strategyPayload.creativeAngle || '',
            primary_text: strategyPayload.explainability?.whyThisRecommendation || '',
            cta: strategyPayload.suggestedCTA || 'Send WhatsApp Message',
            created_by: ctx.userId || 'system_ai',
          })
          .select('id')
          .single()

        if (!dedicatedErr && inserted) {
          strategyId = inserted.id
        }
      } catch (e) {
        console.warn('Dedicated marketing_strategies table insert note:', e)
      }

      // 2. Insert execution audit log into ai_agent_operations
      const { data: auditRow } = await db
        .from('ai_agent_operations')
        .insert({
          account_id: ctx.accountId,
          agent_name: 'enterprise_audience_strategist',
          action_type: 'SAVE_STRATEGY_VERSION',
          ai_rationale: strategyPayload.explainability?.whyThisRecommendation || 'Persistent AI Strategy Saved',
          estimated_token_usage: 1200,
          estimated_cost_cents: 1,
          status: 'AUTO_EXECUTED',
          payload: { ...strategyPayload, version: version || 'v1.0', prompt, strategyId }
        })
        .select('id')
        .single()

      const finalId = strategyId || auditRow?.id

      return NextResponse.json({ success: true, strategyId: finalId })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

export async function PUT(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { strategyId, status, payload } = await request.json()
      const db = getAdminClient()

      if (!strategyId) {
        return NextResponse.json({ success: false, error: 'strategyId is required' }, { status: 400 })
      }

      await db
        .from('marketing_strategies')
        .update({
          status: status || 'APPROVED',
          strategy_payload: payload,
          updated_at: new Date().toISOString(),
          updated_by: ctx.userId || 'system_ai',
        })
        .eq('id', strategyId)
        .eq('account_id', ctx.accountId)

      return NextResponse.json({ success: true })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

export async function DELETE(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const strategyId = searchParams.get('strategyId')
      const db = getAdminClient()

      if (!strategyId) {
        return NextResponse.json({ success: false, error: 'strategyId is required' }, { status: 400 })
      }

      // Soft delete
      await db
        .from('marketing_strategies')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', strategyId)
        .eq('account_id', ctx.accountId)

      return NextResponse.json({ success: true })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}
