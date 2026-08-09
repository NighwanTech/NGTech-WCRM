-- ============================================================
-- 087_enterprise_infrastructure.sql — Rate Limit Customization & Infrastructure
--
-- Enables custom rate limits per enterprise account and per route. Safe to run idempotently.
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limit_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  route_pattern TEXT NOT NULL,
  max_requests INT NOT NULL,
  window_seconds INT NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, route_pattern)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_custom_account ON rate_limit_customizations (account_id);

ALTER TABLE rate_limit_customizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rate_limit_customizations_select ON rate_limit_customizations;
CREATE POLICY rate_limit_customizations_select ON rate_limit_customizations
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS rate_limit_customizations_manage ON rate_limit_customizations;
CREATE POLICY rate_limit_customizations_manage ON rate_limit_customizations
  FOR ALL USING (is_account_member(account_id, 'admin'));
