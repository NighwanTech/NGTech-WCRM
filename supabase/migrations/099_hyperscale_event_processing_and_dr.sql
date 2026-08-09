-- ============================================================
-- 099_hyperscale_event_processing_and_dr.sql
-- Queue Snapshots, Disaster Recovery, Event Replays & Runbooks
-- ============================================================

-- 1. Queue Snapshots Table (Disaster Recovery & Backup Verification)
CREATE TABLE IF NOT EXISTS queue_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  snapshot_name TEXT NOT NULL,
  queue_name TEXT NOT NULL,
  record_count INT NOT NULL DEFAULT 0,
  checksum_sha256 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('creating', 'completed', 'restored')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE queue_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS queue_snapshots_select ON queue_snapshots;
CREATE POLICY queue_snapshots_select ON queue_snapshots
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS queue_snapshots_manage ON queue_snapshots;
CREATE POLICY queue_snapshots_manage ON queue_snapshots
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 2. Operations Runbooks & Playbooks Table
CREATE TABLE IF NOT EXISTS operations_runbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  trigger_condition TEXT NOT NULL,
  remediation_steps TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE operations_runbooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS operations_runbooks_select ON operations_runbooks;
CREATE POLICY operations_runbooks_select ON operations_runbooks
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS operations_runbooks_manage ON operations_runbooks;
CREATE POLICY operations_runbooks_manage ON operations_runbooks
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 3. Event Replay Audit Table
CREATE TABLE IF NOT EXISTS event_replays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  correlation_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  replayed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE event_replays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS event_replays_select ON event_replays;
CREATE POLICY event_replays_select ON event_replays
  FOR SELECT USING (is_account_member(account_id, 'admin'));
