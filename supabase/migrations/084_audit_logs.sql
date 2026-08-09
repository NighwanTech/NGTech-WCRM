-- ============================================================
-- 084_audit_logs.sql — Comprehensive Audit Logging with Severity
--
-- Creates the `audit_logs` table for tracking security events, role changes,
-- data exports, and configuration updates. Safe to run idempotently.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_severity_enum') THEN
    CREATE TYPE audit_severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  severity audit_severity_enum NOT NULL DEFAULT 'low',
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_account_date ON audit_logs (account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs (severity) WHERE severity IN ('high', 'critical');
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_logs_select ON audit_logs;
CREATE POLICY audit_logs_select ON audit_logs FOR SELECT USING (
  is_account_member(account_id, 'admin')
  OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_platform_admin = true)
);

DROP POLICY IF EXISTS audit_logs_insert ON audit_logs;
CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT WITH CHECK (true);
