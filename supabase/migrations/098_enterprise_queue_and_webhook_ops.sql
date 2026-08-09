-- ============================================================
-- 098_enterprise_queue_and_webhook_ops.sql
-- Enterprise Webhook & Queue Operations, Observability & Tracing
-- ============================================================

-- 1. Webhook Providers Vault Table
CREATE TABLE IF NOT EXISTS webhook_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  provider_key TEXT NOT NULL,
  name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'degraded', 'disabled')),
  hmac_secret_status TEXT NOT NULL DEFAULT 'rotated_valid' CHECK (hmac_secret_status IN ('rotated_valid', 'expiring_soon', 'invalid')),
  health_score INT NOT NULL DEFAULT 99,
  last_event_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, provider_key)
);

ALTER TABLE webhook_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS webhook_providers_select ON webhook_providers;
CREATE POLICY webhook_providers_select ON webhook_providers
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS webhook_providers_manage ON webhook_providers;
CREATE POLICY webhook_providers_manage ON webhook_providers
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 2. Dead Letter Queue (DLQ) Table
CREATE TABLE IF NOT EXISTS dead_letter_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  queue_name TEXT NOT NULL,
  job_id TEXT NOT NULL,
  correlation_id TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT NOT NULL,
  retry_count INT NOT NULL DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'failed' CHECK (status IN ('failed', 'retried', 'discarded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dlq_account_queue ON dead_letter_jobs (account_id, queue_name, status);
ALTER TABLE dead_letter_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dead_letter_jobs_select ON dead_letter_jobs;
CREATE POLICY dead_letter_jobs_select ON dead_letter_jobs
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS dead_letter_jobs_manage ON dead_letter_jobs;
CREATE POLICY dead_letter_jobs_manage ON dead_letter_jobs
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 3. Distributed Event Traces Table
CREATE TABLE IF NOT EXISTS event_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  correlation_id TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  duration_ms INT NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'retried')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_traces_correlation ON event_traces (account_id, correlation_id);
ALTER TABLE event_traces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS event_traces_select ON event_traces;
CREATE POLICY event_traces_select ON event_traces
  FOR SELECT USING (is_account_member(account_id, 'admin'));

-- 4. Queue Workers Pool Status Table
CREATE TABLE IF NOT EXISTS queue_worker_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  worker_id TEXT NOT NULL,
  queue_name TEXT NOT NULL,
  concurrency INT NOT NULL DEFAULT 10,
  cpu_pct INT NOT NULL DEFAULT 24,
  memory_mb INT NOT NULL DEFAULT 128,
  active_jobs INT NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'idle', 'overloaded')),
  last_heartbeat TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE queue_worker_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS queue_worker_nodes_select ON queue_worker_nodes;
CREATE POLICY queue_worker_nodes_select ON queue_worker_nodes
  FOR SELECT USING (is_account_member(account_id, 'admin'));
