-- ============================================================
-- 085_webhook_events.sql — Webhook Replay Protection & Idempotency
--
-- Table with UNIQUE(event_id, source) constraint to reject duplicate webhooks at DB level.
-- ============================================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'meta',
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_webhook_event UNIQUE(event_id, source)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_id ON webhook_events (event_id);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS webhook_events_all ON webhook_events;
CREATE POLICY webhook_events_all ON webhook_events FOR ALL USING (true);
