import { SupabaseClient } from '@supabase/supabase-js'
import { processMetaLead } from './lead-processor'

/**
 * Enqueue raw Meta Webhook payload into meta_webhook_queue
 */
export async function enqueueWebhookEvent(
  db: SupabaseClient,
  payload: any
): Promise<{ success: boolean; queueId?: string }> {
  try {
    const { data, error } = await db
      .from('meta_webhook_queue')
      .insert({
        payload,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to enqueue Meta webhook:', error)
      return { success: false }
    }

    return { success: true, queueId: data.id }
  } catch (err) {
    console.error('Exception enqueueing Meta webhook:', err)
    return { success: false }
  }
}

/**
 * Process pending events from the webhook queue asynchronously
 */
export async function processPendingQueueItems(db: SupabaseClient, limit = 10): Promise<number> {
  const { data: queueItems } = await db
    .from('meta_webhook_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (!queueItems || queueItems.length === 0) return 0

  let processedCount = 0

  for (const item of queueItems) {
    try {
      await db
        .from('meta_webhook_queue')
        .update({ status: 'processing' })
        .eq('id', item.id)

      const payload = item.payload
      const entries = payload?.entry || []

      for (const entry of entries) {
        const changes = entry.changes || []
        for (const change of changes) {
          if (change.field === 'leadgen') {
            const val = change.value
            const leadgenId = val.leadgen_id
            const formId = val.form_id
            const pageId = val.page_id

            if (leadgenId) {
              await processMetaLead(db, leadgenId, formId, pageId)
            }
          }
        }
      }

      await db
        .from('meta_webhook_queue')
        .update({ status: 'processed', processed_at: new Date().toISOString() })
        .eq('id', item.id)

      processedCount++
    } catch (err: any) {
      console.error(`Error processing queue item ${item.id}:`, err)
      await db
        .from('meta_webhook_queue')
        .update({
          status: 'failed',
          retry_count: (item.retry_count || 0) + 1,
          error_log: err?.message || String(err),
        })
        .eq('id', item.id)
    }
  }

  return processedCount
}
