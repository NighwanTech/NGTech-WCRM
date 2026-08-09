-- ============================================================
-- 096_enterprise_compliance_governance.sql
-- Enterprise Compliance, Governance, DSR, Consent & Evidence System
-- ============================================================

-- 1. DSR Requests Table (Data Subject Requests)
CREATE TABLE IF NOT EXISTS dsr_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'anonymize', 'rectify', 'consent_withdrawal', 'restrict_processing', 'portability')),
  subject_email TEXT NOT NULL,
  subject_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'completed', 'rejected')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT,
  archive_url TEXT,
  archive_expires_at TIMESTAMPTZ,
  audit_trail JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsr_account_status ON dsr_requests (account_id, status);
ALTER TABLE dsr_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dsr_requests_select ON dsr_requests;
CREATE POLICY dsr_requests_select ON dsr_requests
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS dsr_requests_manage ON dsr_requests;
CREATE POLICY dsr_requests_manage ON dsr_requests
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 2. Multi-Channel Consent Records Table
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms', 'voice', 'marketing', 'cookies', 'processing')),
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'granted' CHECK (status IN ('granted', 'withdrawn', 'expired')),
  ip_address TEXT,
  source TEXT,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  withdrawn_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_consent_account ON consent_records (account_id, channel, status);
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS consent_records_select ON consent_records;
CREATE POLICY consent_records_select ON consent_records
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS consent_records_manage ON consent_records;
CREATE POLICY consent_records_manage ON consent_records
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 3. Data Retention Policies Table
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('contacts', 'conversations', 'audit_logs', 'media', 'ai_conversations', 'api_logs', 'backups', 'deleted_accounts')),
  retention_days INT NOT NULL DEFAULT 365,
  action_on_expire TEXT NOT NULL DEFAULT 'archive' CHECK (action_on_expire IN ('purge', 'anonymize', 'archive')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  version INT NOT NULL DEFAULT 1,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS data_retention_select ON data_retention_policies;
CREATE POLICY data_retention_select ON data_retention_policies
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS data_retention_manage ON data_retention_policies;
CREATE POLICY data_retention_manage ON data_retention_policies
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 4. Vendor Compliance Governance Table
CREATE TABLE IF NOT EXISTS vendor_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  dpa_signed BOOLEAN NOT NULL DEFAULT false,
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  risk_level TEXT NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  dpa_expires_at TIMESTAMPTZ,
  data_residency_region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vendor_compliance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS vendor_compliance_select ON vendor_compliance;
CREATE POLICY vendor_compliance_select ON vendor_compliance
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS vendor_compliance_manage ON vendor_compliance;
CREATE POLICY vendor_compliance_manage ON vendor_compliance
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 5. Compliance Incidents & Breaches Register
CREATE TABLE IF NOT EXISTS compliance_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'remediated', 'closed')),
  root_cause TEXT,
  corrective_actions TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE compliance_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS compliance_incidents_select ON compliance_incidents;
CREATE POLICY compliance_incidents_select ON compliance_incidents
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS compliance_incidents_manage ON compliance_incidents;
CREATE POLICY compliance_incidents_manage ON compliance_incidents
  FOR ALL USING (is_account_member(account_id, 'admin'));

-- 6. Compliance Calendar & Task Board
CREATE TABLE IF NOT EXISTS compliance_calendar_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compliance_calendar_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS compliance_tasks_select ON compliance_calendar_tasks;
CREATE POLICY compliance_tasks_select ON compliance_calendar_tasks
  FOR SELECT USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS compliance_tasks_manage ON compliance_calendar_tasks;
CREATE POLICY compliance_tasks_manage ON compliance_calendar_tasks
  FOR ALL USING (is_account_member(account_id, 'admin'));
