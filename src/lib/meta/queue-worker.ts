import { SupabaseClient } from '@supabase/supabase-js'

export interface QueueJob {
  id: string
  account_id: string
  job_type: string
  payload: any
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  retry_count: number
  error_log: string | null
}

const MAX_RETRIES = 3

/**
 * Process a single batch of pending jobs from the queue.
 * Designed to be called by a cron or worker process.
 */
export async function processQueueBatch(db: SupabaseClient, batchSize: number = 10) {
  // 1. Fetch pending jobs
  const { data: jobs, error: fetchErr } = await db
    .from('meta_queue_jobs')
    .select('*')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: true })
    .limit(batchSize)

  if (fetchErr || !jobs || jobs.length === 0) return { success: true, processed: 0, failed: 0 }

  // 2. Lock jobs (Mark as PROCESSING)
  const jobIds = jobs.map(j => j.id)
  await db
    .from('meta_queue_jobs')
    .update({ status: 'PROCESSING', updated_at: new Date().toISOString() })
    .in('id', jobIds)

  let processedCount = 0
  let failedCount = 0

  // 3. Execute jobs
  for (const job of jobs as QueueJob[]) {
    try {
      if (job.job_type === 'SYNC_CAMPAIGNS') {
        // e.g. await syncAccountCampaigns(db, job.account_id)
      } else if (job.job_type === 'PROCESS_WEBHOOK') {
        // e.g. await processWebhookPayload(job.payload)
      } else if (job.job_type === 'RUN_RULES') {
        // e.g. await runRulesEngine(db, job.account_id)
      } else {
        throw new Error(`Unknown job type: ${job.job_type}`)
      }

      // Mark Complete
      await db
        .from('meta_queue_jobs')
        .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
        .eq('id', job.id)
        
      processedCount++
    } catch (e: any) {
      // Handle Failure / Retry
      const nextRetryCount = job.retry_count + 1
      const nextStatus = nextRetryCount >= MAX_RETRIES ? 'FAILED' : 'PENDING'
      
      await db
        .from('meta_queue_jobs')
        .update({ 
          status: nextStatus, 
          retry_count: nextRetryCount,
          error_log: e.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id)
        
      failedCount++
    }
  }

  return { success: true, processed: processedCount, failed: failedCount }
}
