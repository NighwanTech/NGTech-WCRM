-- ============================================================
-- 088_queue_job_logs.sql — BullMQ Dead-Letter Queue (DLQ) Storage
--
-- Persists failed queue jobs that exceed max retry attempts for administrative resolution.
-- ============================================================

CREATE TABLE IF NOT EXISTS dead_letter_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  queue_name TEXT NOT NULL,
  job_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  error_message TEXT,
  failed_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_dlq_account ON dead_letter_jobs (account_id);
CREATE INDEX IF NOT EXISTS idx_dlq_queue ON dead_letter_jobs (queue_name);
CREATE INDEX IF NOT EXISTS idx_dlq_unresolved ON dead_letter_jobs (resolved_at) WHERE resolved_at IS NULL;

ALTER TABLE dead_letter_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dead_letter_jobs_select ON dead_letter_jobs;
CREATE POLICY dead_letter_jobs_select ON dead_letter_jobs
  FOR SELECT USING (
    account_id IS NULL OR is_account_member(account_id, 'admin')
  );

DROP POLICY IF EXISTS dead_letter_jobs_manage ON dead_letter_jobs;
CREATE POLICY dead_letter_jobs_manage ON dead_letter_jobs
  FOR ALL USING (
    account_id IS NULL OR is_account_member(account_id, 'admin')
  );
