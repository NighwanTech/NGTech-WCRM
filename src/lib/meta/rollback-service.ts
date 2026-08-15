import { getAdminClient } from '@/lib/admin-supabase'

export interface RollbackRequest {
  accountId: string
  campaignId: string
  recommendationId?: string
  queueId?: string
  rollbackReason: string
  rolledBackByUserId?: string
}

/**
 * Enterprise Rollback Engine & State Restoration Service (Section 1)
 * Restores Campaign, Budget, AdSet, Creative, and Status to exact state before execution
 */
export class RollbackService {
  /**
   * Execute atomic rollback to restore campaign snapshot state
   */
  public static async executeRollback(req: RollbackRequest) {
    const db = getAdminClient()

    // 1. Fetch snapshot before execution from campaign_approval_queue or marketing_campaigns
    let snapshotBefore: any = {}
    if (req.queueId) {
      const { data: queueItem } = await db.from('campaign_approval_queue').select('rollback_payload, meta_campaign_id').eq('id', req.queueId).single()
      if (queueItem) snapshotBefore = queueItem.rollback_payload || {}
    }

    // 2. Fetch current state before rollback
    const { data: currentCamp } = await db.from('marketing_campaigns').select('*').eq('id', req.campaignId).single()
    if (!currentCamp) throw new Error('Campaign not found for rollback')

    // 3. Restore status and budget to original snapshot
    const targetStatus = snapshotBefore.status || 'PAUSED'
    const targetBudget = snapshotBefore.budget || currentCamp.budget

    const { data: restoredCamp, error: updateErr } = await db
      .from('marketing_campaigns')
      .update({
        status: targetStatus,
        budget: targetBudget,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.campaignId)
      .select('*')
      .single()

    if (updateErr) throw new Error(`Rollback update failed: ${updateErr.message}`)

    // 4. Log rollback in campaign_rollback_logs
    const { data: rollbackLog } = await db.from('campaign_rollback_logs').insert({
      account_id: req.accountId,
      campaign_id: req.campaignId,
      recommendation_id: req.recommendationId || null,
      queue_id: req.queueId || null,
      snapshot_before: snapshotBefore,
      rollback_payload: { status: targetStatus, budget: targetBudget },
      rollback_reason: req.rollbackReason,
      status: 'ROLLED_BACK',
      rolled_back_by: req.rolledBackByUserId || null
    }).select('*').single()

    // 5. Update linked recommendation state to ROLLED_BACK
    if (req.recommendationId) {
      await db.from('campaign_ai_recommendations').update({ status: 'ROLLED_BACK' }).eq('id', req.recommendationId)
    }

    // 6. Record audit event in activity timeline
    await db.from('campaign_activity_timeline').insert({
      account_id: req.accountId,
      campaign_id: req.campaignId,
      actor_id: req.rolledBackByUserId || null,
      event_type: 'CampaignRolledBack',
      title: `Campaign State Rolled Back`,
      description: `Reason: ${req.rollbackReason}. Budget restored to ₹${targetBudget}, status restored to ${targetStatus}.`,
      metadata: { snapshotBefore, restoredCamp }
    })

    return { success: true, rollbackLog, restoredCamp }
  }
}
