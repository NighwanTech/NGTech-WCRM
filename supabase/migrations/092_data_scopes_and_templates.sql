-- ============================================================
-- 092_data_scopes_and_templates.sql — Data Visibility Scopes & Temp Access
--
-- Adds data_scope column for branch/department data-level authorization.
-- Creates temporary_permissions table for auto-expiring access tokens.
-- ============================================================

-- 1. Data Visibility Scope column on custom_roles & user_permissions_override
ALTER TABLE custom_roles
  ADD COLUMN IF NOT EXISTS data_scope TEXT DEFAULT 'all' CHECK (data_scope IN ('all', 'region', 'branch', 'department', 'team', 'assigned', 'own'));

ALTER TABLE user_permissions_override
  ADD COLUMN IF NOT EXISTS data_scope TEXT CHECK (data_scope IN ('all', 'region', 'branch', 'department', 'team', 'assigned', 'own'));

-- 2. Temporary Auto-Expiring Permissions Table
CREATE TABLE IF NOT EXISTS temporary_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_temp_perm_expiry ON temporary_permissions (user_id, expires_at);

ALTER TABLE temporary_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS temp_perm_select ON temporary_permissions;
CREATE POLICY temp_perm_select ON temporary_permissions FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS temp_perm_manage ON temporary_permissions;
CREATE POLICY temp_perm_manage ON temporary_permissions FOR ALL USING (is_account_member(account_id, 'admin'));
