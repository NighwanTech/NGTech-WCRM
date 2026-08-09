-- ============================================================
-- 089_pbac_and_hash_chained_audit.sql — Fine-Grained PBAC & Hash Chaining
--
-- Adds prev_hash and current_hash columns to audit_logs for tamper detection.
-- Creates role_permissions table for fine-grained PBAC permission evaluations.
-- ============================================================

-- 1. Hash-chaining columns on audit_logs
ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS prev_hash TEXT,
  ADD COLUMN IF NOT EXISTS current_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_audit_logs_current_hash ON audit_logs (current_hash);

-- 2. PBAC Role Permissions mapping table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role account_role_enum NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions (role);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS role_permissions_select ON role_permissions;
CREATE POLICY role_permissions_select ON role_permissions FOR SELECT USING (true);

-- Seed default baseline permission assignments for standard roles
INSERT INTO role_permissions (role, permission) VALUES
  ('owner', 'all'),
  ('admin', 'contacts:read'), ('admin', 'contacts:create'), ('admin', 'contacts:update'), ('admin', 'contacts:delete_any'),
  ('admin', 'messages:send'), ('admin', 'broadcasts:launch'), ('admin', 'sequences:manage'), ('admin', 'settings:write'), ('admin', 'team:manage'),
  ('manager', 'contacts:read'), ('manager', 'contacts:create'), ('manager', 'contacts:update'),
  ('manager', 'messages:send'), ('manager', 'broadcasts:launch'), ('manager', 'sequences:manage'), ('manager', 'team:manage'),
  ('agent', 'contacts:read'), ('agent', 'contacts:create'), ('agent', 'contacts:update'),
  ('agent', 'messages:send'),
  ('client', 'conversations:read'), ('client', 'messages:send'),
  ('viewer', 'contacts:read'), ('viewer', 'messages:read')
ON CONFLICT (role, permission) DO NOTHING;
