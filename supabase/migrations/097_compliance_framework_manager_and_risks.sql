-- ============================================================
-- 097_compliance_framework_manager_and_risks.sql
-- Dynamic Framework Manager, Risk Register & Cryptographic SHA-256 Verification
-- ============================================================

-- 1. Custom Compliance Frameworks Table
CREATE TABLE IF NOT EXISTS compliance_custom_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  framework_key TEXT NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Global',
  controls_count INT NOT NULL DEFAULT 20,
  maturity_score INT NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, framework_key)
);

ALTER TABLE compliance_custom_frameworks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS custom_frameworks_select ON compliance_custom_frameworks;
CREATE POLICY custom_frameworks_select ON compliance_custom_frameworks
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS custom_frameworks_manage ON compliance_custom_frameworks;
CREATE POLICY custom_frameworks_manage ON compliance_custom_frameworks
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 2. Compliance Risk Register Table
CREATE TABLE IF NOT EXISTS compliance_risk_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  risk_title TEXT NOT NULL,
  category TEXT NOT NULL,
  likelihood INT NOT NULL CHECK (likelihood BETWEEN 1 AND 5),
  impact INT NOT NULL CHECK (impact BETWEEN 1 AND 5),
  risk_score INT NOT NULL,
  mitigation_plan TEXT,
  owner TEXT,
  review_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'mitigated', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compliance_risk_register ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS risk_register_select ON compliance_risk_register;
CREATE POLICY risk_register_select ON compliance_risk_register
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS risk_register_manage ON compliance_risk_register;
CREATE POLICY risk_register_manage ON compliance_risk_register
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 3. Compliance Policy Exceptions Table
CREATE TABLE IF NOT EXISTS compliance_policy_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  policy_name TEXT NOT NULL,
  justification TEXT NOT NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compliance_policy_exceptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_exceptions_select ON compliance_policy_exceptions;
CREATE POLICY policy_exceptions_select ON compliance_policy_exceptions
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS policy_exceptions_manage ON compliance_policy_exceptions;
CREATE POLICY policy_exceptions_manage ON compliance_policy_exceptions
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 4. SHA-256 Cryptographic Evidence Ledger
CREATE TABLE IF NOT EXISTS compliance_evidence_hashes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  evidence_pack_id TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  framework_id TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compliance_evidence_hashes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS evidence_hashes_select ON compliance_evidence_hashes;
CREATE POLICY evidence_hashes_select ON compliance_evidence_hashes
  FOR SELECT USING (is_account_member(account_id, 'admin'));
