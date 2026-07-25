-- 079_universal_ai_keys_and_usage.sql

-- 1. Add multi-provider BYOK (Bring Your Own Key) & Budget Protection columns to ai_assistant_settings
ALTER TABLE ai_assistant_settings
  ADD COLUMN IF NOT EXISTS use_custom_keys BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS openai_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS gemini_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS claude_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS groq_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS deepseek_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS custom_api_base_url TEXT,
  ADD COLUMN IF NOT EXISTS custom_api_key_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS custom_model_name TEXT,
  -- Budget Protection & Threshold Columns
  ADD COLUMN IF NOT EXISTS monthly_budget_inr NUMERIC(10, 2) DEFAULT 2500.00,
  ADD COLUMN IF NOT EXISTS budget_alert_threshold_percent INT DEFAULT 90,
  ADD COLUMN IF NOT EXISTS budget_action VARCHAR(50) DEFAULT 'handoff',
  ADD COLUMN IF NOT EXISTS budget_reset_day INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS enable_budget_cap BOOLEAN DEFAULT true,
  -- Secondary Provider Auto-Failover Columns
  ADD COLUMN IF NOT EXISTS enable_auto_fallback BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS fallback_provider VARCHAR(50) DEFAULT 'gemini',
  ADD COLUMN IF NOT EXISTS fallback_model VARCHAR(100) DEFAULT 'gemini-1.5-flash';

-- 2. Create ai_usage_logs table for multi-tenant token, USD & INR cost tracking
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  feature VARCHAR(50) DEFAULT 'general',
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  estimated_cost_usd NUMERIC(10, 6) DEFAULT 0,
  estimated_cost_inr NUMERIC(10, 4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS & set policies for ai_usage_logs
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_usage_logs_select ON ai_usage_logs;
CREATE POLICY ai_usage_logs_select ON ai_usage_logs FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS ai_usage_logs_insert ON ai_usage_logs;
CREATE POLICY ai_usage_logs_insert ON ai_usage_logs FOR INSERT WITH CHECK (is_account_member(account_id));

-- 4. Create index for fast account analytics queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_account_date ON ai_usage_logs (account_id, created_at DESC);

-- 5. Auto-migrate all existing client account settings to gemini-1.5-flash for universal compatibility
UPDATE ai_assistant_settings 
SET model = 'gemini-1.5-flash' 
WHERE model = 'gemini-2.0-flash' OR model IS NULL;

