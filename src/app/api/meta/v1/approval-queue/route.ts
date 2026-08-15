import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { ApprovalWorkflowEngine } from '@/lib/meta/approval-workflow-engine'
import { getAdminClient } from '@/lib/admin-supabase'

/**
 * Enterprise Campaign Approval Queue API (/api/meta/v1/approval-queue)
 */

// GET - List approval queue items with optional status filtering
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const status = searchParams.get('status')
      const db = getAdminClient()

      let query = db.from('campaign_approval_queue').select('*').eq('account_id', ctx.accountId).order('created_at', { ascending: false })
      if (status) {
        query = query.eq('status', status)
      }

      const { data: queueItems } = await query

      return NextResponse.json({
        success: true,
        queue: queueItems || []
      })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}

// POST - Approve, Reject, or Submit an item in the Controlled Approval Queue
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { action, queueId, recommendationId, campaignId, metaCampaignId, actionType, proposedChanges } = body
      const db = getAdminClient()

      if (action === 'SUBMIT') {
        const item = await ApprovalWorkflowEngine.submitToQueue({
          accountId: ctx.accountId,
          recommendationId,
          campaignId,
          metaCampaignId,
          actionType,
          proposedChanges,
          requestedBy: ctx.userId
        })
        return NextResponse.json({ success: true, queueItem: item })
      }

      if (action === 'APPROVE') {
        if (!queueId) return NextResponse.json({ error: 'queueId required' }, { status: 400 })
        const result = await ApprovalWorkflowEngine.approveAndExecute(queueId, ctx.userId)
        await ApprovalWorkflowEngine.verifyExecutionImpact(queueId)
        return NextResponse.json({ success: true, result })
      }

      if (action === 'REJECT') {
        if (!queueId) return NextResponse.json({ error: 'queueId required' }, { status: 400 })
        await db.from('campaign_approval_queue').update({ status: 'REJECTED' }).eq('id', queueId)
        return NextResponse.json({ success: true, status: 'REJECTED' })
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
  })
}
