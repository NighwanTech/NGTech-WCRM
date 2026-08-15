import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { CampaignFSM, CampaignStatus } from '@/lib/meta/campaign-domain'

/**
 * Enterprise Campaign Workspace API (/api/meta/campaigns/workspace)
 * Implements CRUD, FSM validation, Whole-Campaign Versioning, Domain Event Stream
 */

// GET - Retrieve full hydrated Campaign Aggregate Root by campaignId or list tenant campaigns
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const campaignId = searchParams.get('campaignId')
      const status = searchParams.get('status')
      const db = getAdminClient()

      // Single Campaign Full Hydration Lookup
      if (campaignId) {
        const { data: campaign, error: campErr } = await db
          .from('marketing_campaigns')
          .select('*')
          .eq('id', campaignId)
          .eq('account_id', ctx.accountId)
          .is('deleted_at', null)
          .single()

        if (campErr || !campaign) {
          return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 })
        }

        // Parallel Hydration Query across normalized child tables
        const [stratRes, audRes, intRes, crtRes, bdgRes, evtRes, verRes] = await Promise.all([
          db.from('campaign_strategies').select('*').eq('campaign_id', campaignId).maybeSingle(),
          db.from('campaign_audiences').select('*').eq('campaign_id', campaignId).maybeSingle(),
          db.from('campaign_meta_interests').select('*').eq('campaign_id', campaignId),
          db.from('campaign_creatives').select('*').eq('campaign_id', campaignId).maybeSingle(),
          db.from('campaign_budgets').select('*').eq('campaign_id', campaignId).maybeSingle(),
          db.from('campaign_events').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false }).limit(20),
          db.from('campaign_versions').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false })
        ])

        return NextResponse.json({
          success: true,
          aggregate: {
            campaign,
            strategy: stratRes.data || null,
            audience: audRes.data || null,
            interests: intRes.data || [],
            creative: crtRes.data || null,
            budget: bdgRes.data || null,
            events: evtRes.data || [],
            versions: verRes.data || []
          }
        })
      }

      // List Tenant Campaigns with Status Filter
      let query = db
        .from('marketing_campaigns')
        .select('*')
        .eq('account_id', ctx.accountId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(30)

      if (status) {
        query = query.eq('status', status)
      }

      const { data: campaigns, error: listErr } = await query

      if (listErr) {
        return NextResponse.json({ success: false, error: listErr.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, campaigns: campaigns || [] })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

// POST - Create a new Campaign Aggregate Root
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { name, strategy, audience, creative, budget, interests } = body
      const db = getAdminClient()

      // 1. Create Root Campaign
      const { data: campaign, error: campErr } = await db
        .from('marketing_campaigns')
        .insert({
          account_id: ctx.accountId,
          name: name || 'New Enterprise Campaign',
          status: 'DRAFT',
          version: 'v1.0',
          created_by: ctx.userId
        })
        .select('*')
        .single()

      if (campErr || !campaign) {
        return NextResponse.json({ success: false, error: campErr?.message || 'Failed to create campaign' }, { status: 500 })
      }

      const cid = campaign.id

      // 2. Insert Normalized Child Entities (if provided)
      let insertedStrat = null
      let insertedAud = null
      let insertedCrt = null
      let insertedBdg = null

      if (strategy) {
        const { data } = await db.from('campaign_strategies').insert({
          campaign_id: cid,
          business_category: strategy.businessCategory || 'General',
          business_subcategory: strategy.businessSubCategory || 'Enterprise',
          campaign_goal: strategy.campaignGoal || 'Lead Generation',
          campaign_objective: strategy.campaignObjective || 'OUTCOME_ENGAGEMENT',
          creative_angle: strategy.creativeAngle || '',
          why_recommended: strategy.whyRecommended || '',
          confidence_score: strategy.confidenceScore || 95,
          version: 'v1.0'
        }).select('*').single()
        insertedStrat = data
      }

      if (audience) {
        const { data } = await db.from('campaign_audiences').insert({
          campaign_id: cid,
          primary_location: audience.primaryLocation || 'India',
          recommended_radius: audience.recommendedRadius || '25 km',
          age_min: audience.ageMin || 18,
          age_max: audience.ageMax || 65,
          gender: audience.gender || 'ALL',
          languages: audience.languages || ['English', 'Hindi']
        }).select('*').single()
        insertedAud = data
      }

      if (creative) {
        const { data } = await db.from('campaign_creatives').insert({
          campaign_id: cid,
          headline: creative.headline || 'Enterprise Campaign',
          primary_text: creative.primaryText || '',
          cta: creative.cta || 'Send WhatsApp Message',
          creative_format: creative.creativeFormat || 'poster'
        }).select('*').single()
        insertedCrt = data
      }

      if (budget) {
        const { data } = await db.from('campaign_budgets').insert({
          campaign_id: cid,
          budget_type: budget.budgetType || 'daily',
          daily_budget: budget.dailyBudget || 500.00,
          currency: budget.currency || 'INR',
          placements: budget.placements || ['feeds', 'reels', 'stories']
        }).select('*').single()
        insertedBdg = data
      }

      if (Array.isArray(interests) && interests.length > 0) {
        const interestRows = interests.map((i: any) => ({
          campaign_id: cid,
          meta_interest_id: i.id || i.meta_interest_id || '0',
          interest_name: i.name || i.interest_name || 'General Interest',
          audience_size: i.audience_size || 'Verified',
          source: 'Meta Graph API v20.0'
        }))
        await db.from('campaign_meta_interests').insert(interestRows)
      }

      // 3. Log Domain Event
      await db.from('campaign_events').insert({
        campaign_id: cid,
        actor_id: ctx.userId,
        event_type: 'CampaignCreated',
        title: '1. Campaign Created',
        details: `Created campaign "${name}" with status DRAFT (v1.0)`
      })

      // 4. Create Initial Version Snapshot (v1.0)
      const snapshot = {
        campaign,
        strategy: insertedStrat,
        audience: insertedAud,
        creative: insertedCrt,
        budget: insertedBdg
      }

      await db.from('campaign_versions').insert({
        campaign_id: cid,
        version_number: 'v1.0',
        snapshot_payload: snapshot,
        created_by: ctx.userId
      })

      return NextResponse.json({
        success: true,
        campaignId: cid,
        campaign,
        message: 'Campaign created successfully with v1.0 snapshot'
      })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

// PUT - Update Campaign Status via FSM Validation or Update Normalized Entities
export async function PUT(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { campaignId, targetStatus, strategy, audience, creative, budget } = await request.json()
      if (!campaignId) {
        return NextResponse.json({ success: false, error: 'campaignId is required' }, { status: 400 })
      }

      const db = getAdminClient()

      // Fetch Current Campaign
      const { data: campaign, error: fetchErr } = await db
        .from('marketing_campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('account_id', ctx.accountId)
        .single()

      if (fetchErr || !campaign) {
        return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 })
      }

      // Execute Status Transition with FSM Validation
      if (targetStatus && targetStatus !== campaign.status) {
        CampaignFSM.validateTransition(campaign.status as CampaignStatus, targetStatus as CampaignStatus)
        
        let metaCampaignId = campaign.meta_campaign_id

        // Execute Full 4-Step Meta Graph API Publishing Pipeline via CampaignPublishService
        if (targetStatus === 'PUBLISHED') {
          try {
            const { CampaignPublishService } = await import('@/lib/meta/campaign-publish-service')
            const pubResult = await CampaignPublishService.publishFullCampaign(campaignId, ctx.accountId, ctx.userId)

            if (!pubResult.success) {
              return NextResponse.json({
                success: false,
                error: pubResult.error || 'Meta Publishing Failed',
                rolledBack: pubResult.rolledBack
              }, { status: 400 })
            }

            metaCampaignId = pubResult.metaCampaignId
          } catch (pubErr: any) {
            return NextResponse.json({
              success: false,
              error: pubErr.message,
              rolledBack: true
            }, { status: 400 })
          }
        }

        await db
          .from('marketing_campaigns')
          .update({
            status: targetStatus,
            meta_campaign_id: metaCampaignId,
            updated_at: new Date().toISOString(),
            ...(targetStatus === 'APPROVED' ? { approved_by: ctx.userId, approved_at: new Date().toISOString() } : {})
          })
          .eq('id', campaignId)

        // Log Domain Event
        await db.from('campaign_events').insert({
          campaign_id: campaignId,
          actor_id: ctx.userId,
          event_type: `StatusTransition_${targetStatus}`,
          title: `Campaign Status Changed to ${targetStatus}`,
          details: `FSM transition from '${campaign.status}' to '${targetStatus}' (Meta ID: ${metaCampaignId || 'Internal'})`
        })
      }

      // Upsert Child Updates if provided
      if (strategy) {
        await db.from('campaign_strategies').upsert({ campaign_id: campaignId, ...strategy }, { onConflict: 'campaign_id' })
      }
      if (audience) {
        await db.from('campaign_audiences').upsert({ campaign_id: campaignId, ...audience }, { onConflict: 'campaign_id' })
      }
      if (creative) {
        await db.from('campaign_creatives').upsert({ campaign_id: campaignId, ...creative }, { onConflict: 'campaign_id' })
      }
      if (budget) {
        await db.from('campaign_budgets').upsert({ campaign_id: campaignId, ...budget }, { onConflict: 'campaign_id' })
      }

      return NextResponse.json({
        success: true,
        campaignId,
        message: 'Campaign updated successfully'
      })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

// DELETE - Soft-delete Campaign Aggregate Root (sets deleted_at = NOW())
export async function DELETE(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const campaignId = searchParams.get('campaignId')
      if (!campaignId) {
        return NextResponse.json({ success: false, error: 'campaignId parameter required' }, { status: 400 })
      }

      const db = getAdminClient()

      const { data, error } = await db
        .from('marketing_campaigns')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', campaignId)
        .eq('account_id', ctx.accountId)
        .select('id, name, status')

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      // Log Domain Event
      await db.from('campaign_events').insert({
        campaign_id: campaignId,
        actor_id: ctx.userId,
        event_type: 'CampaignSoftDeleted',
        title: 'Campaign Soft-Deleted',
        details: 'Campaign marked as deleted (deleted_at IS NOT NULL)'
      })

      return NextResponse.json({ success: true, message: 'Campaign soft-deleted', deleted: data })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}
