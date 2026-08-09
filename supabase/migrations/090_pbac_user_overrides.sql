-- ============================================================
-- 090_pbac_user_overrides.sql — Hybrid Per-User Permission Overrides
--
-- Enables per-user grant or revoke permission overrides without mutating base roles.
-- ============================================================

CREATE TABLE IF NOT EXISTS user_permissions_override (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  effect TEXT NOT NULL CHECK (effect IN ('grant', 'revoke')),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, user_id, permission)
);

CREATE INDEX IF NOT EXISTS idx_user_perm_override ON user_permissions_override (account_id, user_id);

ALTER TABLE user_permissions_override ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_permissions_override_select ON user_permissions_override;
CREATE POLICY user_permissions_override_select ON user_permissions_override
  FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS user_permissions_override_manage ON user_permissions_override;
CREATE POLICY user_permissions_override_manage ON user_permissions_override
  FOR ALL USING (is_account_member(account_id, 'admin'));
