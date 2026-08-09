-- ============================================================
-- 093_identity_governance.sql — Enterprise Identity & Access Governance
--
-- Enables Modular ABAC Policies, Separation of Duties (SoD) Rules,
-- Just-In-Time (JIT) Access Requests, Delegated Admins, and Break Glass Logs.
-- ============================================================

-- 1. ABAC Policies Table
CREATE TABLE IF NOT EXISTS abac_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_permission TEXT NOT NULL,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('business_hours', 'ip_network', 'device_trust', 'mfa', 'risk_score')),
  condition_json JSONB NOT NULL,
  effect TEXT NOT NULL DEFAULT 'ALLOW' CHECK (effect IN ('ALLOW', 'DENY')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Separation of Duties (SoD) Rules Table
CREATE TABLE IF NOT EXISTS sod_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  permission_a TEXT NOT NULL,
  permission_b TEXT NOT NULL,
  risk_level TEXT DEFAULT 'HIGH' CHECK (risk_level IN ('MEDIUM', 'HIGH', 'CRITICAL')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Access Requests & Just-In-Time (JIT) Elevation
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_permission TEXT NOT NULL,
  duration_hours INT NOT NULL DEFAULT 4,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Delegated Administration Table
CREATE TABLE IF NOT EXISTS delegated_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('branch', 'department', 'region')),
  scope_value TEXT NOT NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Break Glass Emergency Log Table
CREATE TABLE IF NOT EXISTS break_glass_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  triggered_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  justification TEXT NOT NULL,
  ip_address TEXT,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE abac_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sod_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegated_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE break_glass_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS abac_select ON abac_policies;
CREATE POLICY abac_select ON abac_policies FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS abac_manage ON abac_policies;
CREATE POLICY abac_manage ON abac_policies FOR ALL USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS sod_select ON sod_rules;
CREATE POLICY sod_select ON sod_rules FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS access_req_select ON access_requests;
CREATE POLICY access_req_select ON access_requests FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS access_req_manage ON access_requests;
CREATE POLICY access_req_manage ON access_requests FOR ALL USING (is_account_member(account_id, 'admin'));
