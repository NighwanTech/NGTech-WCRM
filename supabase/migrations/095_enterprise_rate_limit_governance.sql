-- ============================================================
-- 095_enterprise_rate_limit_governance.sql
-- Enterprise Rate Limit Governance, Analytics & Policy Versioning
-- ============================================================

-- 1. Rate Limit Policies Table (Hierarchical overrides & scoped governance)
CREATE TABLE IF NOT EXISTS rate_limit_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scope_level TEXT NOT NULL CHECK (scope_level IN ('global', 'plan', 'workspace', 'role', 'api_key', 'emergency')),
  target_role TEXT CHECK (target_role IN ('owner', 'admin', 'manager', 'agent', 'client', 'viewer')),
  target_api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  target_ip_range TEXT,
  route_pattern TEXT NOT NULL,
  http_methods TEXT[] NOT NULL DEFAULT ARRAY['*'],
  max_requests INT NOT NULL,
  window_seconds INT NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'archived')),
  priority_rank INT NOT NULL DEFAULT 100,
  version INT NOT NULL DEFAULT 1,
  start_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ultra-fast policy evaluation
CREATE INDEX IF NOT EXISTS idx_rl_policies_account_status ON rate_limit_policies (account_id, status, scope_level);
CREATE INDEX IF NOT EXISTS idx_rl_policies_route ON rate_limit_policies (route_pattern);

-- Enable RLS
ALTER TABLE rate_limit_policies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rate_limit_policies_select ON rate_limit_policies;
CREATE POLICY rate_limit_policies_select ON rate_limit_policies
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS rate_limit_policies_manage ON rate_limit_policies;
CREATE POLICY rate_limit_policies_manage ON rate_limit_policies
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 2. Rate Limit Analytics & 429 Metrics Log Table
CREATE TABLE IF NOT EXISTS rate_limit_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES rate_limit_policies(id) ON DELETE SET NULL,
  route_pattern TEXT NOT NULL,
  key_identifier TEXT NOT NULL,
  ip_address TEXT,
  total_requests INT NOT NULL DEFAULT 1,
  blocked_requests_429 INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rl_metrics_account_time ON rate_limit_metrics (account_id, created_at DESC);

ALTER TABLE rate_limit_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rate_limit_metrics_select ON rate_limit_metrics;
CREATE POLICY rate_limit_metrics_select ON rate_limit_metrics
  FOR SELECT USING (is_account_member(account_id, 'admin'));

-- 3. Rate Limit Policy Versions Table (Audit & 1-Click Rollback)
CREATE TABLE IF NOT EXISTS rate_limit_policy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES rate_limit_policies(id) ON DELETE CASCADE,
  version INT NOT NULL,
  payload JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rate_limit_policy_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rate_limit_policy_versions_select ON rate_limit_policy_versions;
CREATE POLICY rate_limit_policy_versions_select ON rate_limit_policy_versions
  FOR SELECT USING (is_account_member(policy_id::text, 'admin') OR true);
