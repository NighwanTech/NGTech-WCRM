-- ============================================================
-- 074_ai_calls.sql
-- Schema for Retell AI Voice Calling integration
-- ============================================================

-- 1. Tenant Retell Configuration
CREATE TABLE IF NOT EXISTS retell_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  api_key TEXT, -- Should ideally be encrypted via pgcrypto in production
  agent_id TEXT,
  from_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(account_id)
);

CREATE INDEX IF NOT EXISTS idx_retell_config_account ON retell_config(account_id);

-- 2. AI Call Logs
CREATE TABLE IF NOT EXISTS ai_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  retell_call_id TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  duration_seconds INTEGER,
  transcript TEXT,
  summary TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(retell_call_id)
);

CREATE INDEX IF NOT EXISTS idx_ai_calls_account ON ai_calls(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_calls_contact ON ai_calls(contact_id);

-- RLS
ALTER TABLE retell_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage account retell_config" ON retell_config;
CREATE POLICY "Users can manage account retell_config" ON retell_config FOR ALL
  USING (account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage account ai_calls" ON ai_calls;
CREATE POLICY "Users can manage account ai_calls" ON ai_calls FOR ALL
  USING (account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()));

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_retell_config ON retell_config;
CREATE TRIGGER set_updated_at_retell_config BEFORE UPDATE ON retell_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
DROP TRIGGER IF EXISTS set_updated_at_ai_calls ON ai_calls;
CREATE TRIGGER set_updated_at_ai_calls BEFORE UPDATE ON ai_calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
