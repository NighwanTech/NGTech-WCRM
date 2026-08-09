-- ============================================================
-- AIWCRM: Multi-Provider Voice AI Platform Migration
-- Run this against your Supabase project using the SQL Editor
-- ============================================================

-- ─── Step 1: Create the new generic provider config table ───

CREATE TABLE IF NOT EXISTS voice_ai_provider_configs (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id        UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  provider          TEXT        NOT NULL,  -- 'retell' | 'elevenlabs' | 'bland' | 'vapi'
  api_key           TEXT        NOT NULL,  -- encrypted (same method as existing BYOK keys)
  agent_id          TEXT,                  -- provider's agent / assistant ID
  phone_number_id   TEXT,                  -- Twilio / provider phone number SID
  voice_id          TEXT,                  -- default voice for this account+provider
  settings_json     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  is_default        BOOLEAN     NOT NULL DEFAULT false,
  is_active         BOOLEAN     NOT NULL DEFAULT true,
  monthly_budget    INTEGER,               -- INR, NULL = unlimited
  daily_call_limit  INTEGER,               -- NULL = unlimited
  per_user_limit    INTEGER,               -- calls per user per day
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(account_id, provider)
);

-- Only one default provider per account
CREATE UNIQUE INDEX IF NOT EXISTS voice_ai_one_default_per_account
  ON voice_ai_provider_configs(account_id)
  WHERE is_default = true;

-- Enable RLS
ALTER TABLE voice_ai_provider_configs ENABLE ROW LEVEL SECURITY;

-- Admins can read/write their own account's configs
CREATE POLICY "account_admins_manage_voice_configs"
  ON voice_ai_provider_configs
  FOR ALL
  USING (
    account_id IN (
      SELECT account_id FROM account_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- ─── Step 2: Migrate existing retell_config data ────────────

INSERT INTO voice_ai_provider_configs
  (account_id, provider, api_key, agent_id, phone_number_id, is_default, is_active, created_at, updated_at)
SELECT
  account_id,
  'retell'                          AS provider,
  api_key,
  COALESCE(agent_id, '')            AS agent_id,
  COALESCE(from_number, '')         AS phone_number_id,
  true                              AS is_default,
  true                              AS is_active,
  COALESCE(created_at, NOW()),
  NOW()
FROM retell_config
ON CONFLICT (account_id, provider) DO NOTHING;

-- Verify migration
DO $$
DECLARE
  retell_count  INT;
  migrated_count INT;
BEGIN
  SELECT COUNT(*) INTO retell_count    FROM retell_config;
  SELECT COUNT(*) INTO migrated_count  FROM voice_ai_provider_configs WHERE provider = 'retell';

  IF retell_count != migrated_count THEN
    RAISE WARNING 'Migration check: retell_config has % rows but voice_ai_provider_configs has % Retell rows. Please investigate.',
      retell_count, migrated_count;
  ELSE
    RAISE NOTICE 'Migration OK: % Retell configs migrated successfully.', migrated_count;
  END IF;
END $$;

-- ─── Step 3: Extend ai_calls table ──────────────────────────

-- Generic provider tracking
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS provider             TEXT NOT NULL DEFAULT 'retell';
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS provider_call_id     TEXT;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS initiated_by_user_id UUID REFERENCES auth.users(id);
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS estimated_cost_inr   NUMERIC(10,4);
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS actual_cost_inr      NUMERIC(10,4);
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS language_used        TEXT;

-- Structured CRM Intelligence
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS call_summary         TEXT;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS customer_intent      TEXT;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS sentiment            TEXT;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS buying_signals       JSONB;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS objections           JSONB;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS next_followup_at     TIMESTAMPTZ;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS action_items         JSONB;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS ai_lead_score        INTEGER;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS opportunity_stage    TEXT;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS ai_recommendation    TEXT;

-- Ecosystem links
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS linked_deal_id       UUID;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS linked_task_id       UUID;
ALTER TABLE ai_calls ADD COLUMN IF NOT EXISTS followup_sent_at     TIMESTAMPTZ;

-- Backfill provider_call_id from retell_call_id if the column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='ai_calls' AND column_name='retell_call_id') THEN
    UPDATE ai_calls SET provider_call_id = retell_call_id
    WHERE provider_call_id IS NULL AND retell_call_id IS NOT NULL;
  END IF;
END $$;

-- Index for webhook lookups
CREATE INDEX IF NOT EXISTS ai_calls_provider_call_id_idx ON ai_calls(provider_call_id);
CREATE INDEX IF NOT EXISTS ai_calls_provider_idx         ON ai_calls(provider);

-- ─── ROLLBACK SCRIPT (run only if you need to undo) ─────────
-- Uncomment to roll back:

-- -- Restore retell_config from voice_ai_provider_configs
-- INSERT INTO retell_config (account_id, api_key, agent_id, from_number)
-- SELECT account_id, api_key, agent_id, phone_number_id
-- FROM voice_ai_provider_configs
-- WHERE provider = 'retell'
-- ON CONFLICT (account_id) DO UPDATE
--   SET api_key = EXCLUDED.api_key,
--       agent_id = EXCLUDED.agent_id,
--       from_number = EXCLUDED.from_number;

-- DROP TABLE IF EXISTS voice_ai_provider_configs;
-- -- Remove added columns from ai_calls:
-- ALTER TABLE ai_calls DROP COLUMN IF EXISTS provider;
-- ALTER TABLE ai_calls DROP COLUMN IF EXISTS provider_call_id;
-- ALTER TABLE ai_calls DROP COLUMN IF EXISTS call_summary;
-- ALTER TABLE ai_calls DROP COLUMN IF EXISTS customer_intent;
-- -- (etc. for all added columns)
