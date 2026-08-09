-- ============================================================
-- 083_encryption_key_version.sql — Key Rotation & Token Security
--
-- Adds encryption_key_version tracking to tables storing sensitive secrets,
-- access tokens, and API keys. Safe to execute idempotently.
-- ============================================================

ALTER TABLE whatsapp_config
  ADD COLUMN IF NOT EXISTS access_token_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS encryption_key_version INT DEFAULT 1;

ALTER TABLE meta_ad_accounts
  ADD COLUMN IF NOT EXISTS encryption_key_version INT DEFAULT 1;

ALTER TABLE ai_assistant_settings
  ADD COLUMN IF NOT EXISTS encryption_key_version INT DEFAULT 1;
