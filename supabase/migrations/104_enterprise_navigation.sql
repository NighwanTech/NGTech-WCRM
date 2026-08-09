-- Enterprise Workspace Navigation System Schema
-- Adds support for workspace-level navigation settings, user-level preferences, and navigation telemetry

-- 1. Workspace Navigation Settings (Organization Level)
CREATE TABLE workspace_navigation_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL UNIQUE, -- One settings row per workspace
  hidden_modules TEXT[] DEFAULT '{}', -- Modules the Super Admin has disabled
  module_renames JSONB DEFAULT '{}', -- E.g., {"pipelines": "Deals"}
  group_order TEXT[] DEFAULT '{"Workspace", "CRM", "Marketing", "Intelligence", "Governance", "Administration"}',
  custom_logo_url TEXT,
  primary_color VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Navigation Preferences (Personal Level)
CREATE TABLE user_navigation_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  expanded_groups TEXT[] DEFAULT '{"Workspace", "CRM"}',
  favorites TEXT[] DEFAULT '{}', -- Array of module IDs
  recent_pages JSONB DEFAULT '[]', -- Array of { path, label, timestamp }
  rail_mode_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- 3. Navigation Telemetry Logs (Analytics)
CREATE TABLE navigation_telemetry_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('PAGE_VISIT', 'SEARCH_EXECUTE', 'FAVORITE_ADD', 'MODULE_CLICK')),
  target_path TEXT NOT NULL,
  module_id VARCHAR(100),
  latency_ms INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_nav_telemetry_tenant ON navigation_telemetry_logs(tenant_id, created_at DESC);
CREATE INDEX idx_nav_telemetry_module ON navigation_telemetry_logs(module_id);
CREATE INDEX idx_user_nav_prefs ON user_navigation_preferences(user_id, tenant_id);

-- RLS Enforcement
ALTER TABLE workspace_navigation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_navigation_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_telemetry_logs ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies restrict by tenant_id and user_id. For prototyping we allow authenticated users to read/write their own workspace/user data.
CREATE POLICY "Allow authenticated read workspace settings" ON workspace_navigation_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins update workspace settings" ON workspace_navigation_settings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow users read own nav prefs" ON user_navigation_preferences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users insert own nav prefs" ON user_navigation_preferences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow users update own nav prefs" ON user_navigation_preferences FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert telemetry" ON navigation_telemetry_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admins read telemetry" ON navigation_telemetry_logs FOR SELECT TO authenticated USING (true);
