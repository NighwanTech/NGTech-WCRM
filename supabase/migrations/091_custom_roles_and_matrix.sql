-- ============================================================
-- 091_custom_roles_and_matrix.sql — Custom Role Engine & Matrix
--
-- Enables workspace admins to create custom roles, manage account-scoped
-- role permissions, and define menu item access rules. Safe to run idempotently.
-- ============================================================

-- 1. Custom Roles Table with Versioning & Soft Deletion
CREATE TABLE IF NOT EXISTS custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT false,
  version INT NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, name)
);

CREATE INDEX IF NOT EXISTS idx_custom_roles_account ON custom_roles (account_id) WHERE deleted_at IS NULL;

ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS custom_roles_select ON custom_roles;
CREATE POLICY custom_roles_select ON custom_roles FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS custom_roles_manage ON custom_roles;
CREATE POLICY custom_roles_manage ON custom_roles FOR ALL USING (is_account_member(account_id, 'admin'));

-- 2. Expand role_permissions to be account-scoped for custom roles
ALTER TABLE role_permissions
  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS role_name TEXT;

CREATE INDEX IF NOT EXISTS idx_role_permissions_acct_role ON role_permissions (account_id, role_name);

-- 3. Menu Permissions Lookup Table
CREATE TABLE IF NOT EXISTS menu_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  required_permission TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE menu_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS menu_permissions_select ON menu_permissions;
CREATE POLICY menu_permissions_select ON menu_permissions FOR SELECT USING (true);

-- Seed baseline menu permission mappings
INSERT INTO menu_permissions (menu_key, label, required_permission) VALUES
  ('/dashboard', 'Dashboard', 'contacts:read'),
  ('/team-performance', 'Team Performance', 'team:manage'),
  ('/inbox', 'Shared Inbox', 'messages:read'),
  ('/contacts', 'Contacts & Companies', 'contacts:read'),
  ('/pipelines', 'Deals & Pipelines', 'contacts:read'),
  ('/broadcasts', 'Broadcast Campaigns', 'broadcasts:launch'),
  ('/flows', 'Visual Automations', 'sequences:manage'),
  ('/ai-assistant', 'AI Assistant', 'messages:send'),
  ('/sequences', 'Automated Sequences', 'sequences:manage'),
  ('/analytics', 'Advanced Analytics', 'audit:read'),
  ('/settings/security', 'Security & Governance', 'security:read')
ON CONFLICT (menu_key) DO NOTHING;
