-- Migration 081: Enterprise Meta Ads Portal Integration
-- Workspace multi-tenant tables for Meta Ads, Webhook Queue, Attribution & Conversions API

-- 1. Meta Ad Accounts per Workspace
CREATE TABLE IF NOT EXISTS meta_ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  ad_account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_ad_accounts_workspace ON meta_ad_accounts(workspace_id);

-- 2. Meta Campaign Performance Cache
CREATE TABLE IF NOT EXISTS meta_campaign_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  campaign_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50),
  objective VARCHAR(100),
  daily_budget NUMERIC(12, 2) DEFAULT 0,
  spend NUMERIC(12, 2) DEFAULT 0,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  leads INT DEFAULT 0,
  last_synced_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_campaign_cache_ws ON meta_campaign_cache(workspace_id);

-- 3. Lead Form Mappings to CRM Pipelines & Automations
CREATE TABLE IF NOT EXISTS meta_lead_form_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  form_id VARCHAR(255) NOT NULL,
  form_name VARCHAR(255),
  page_id VARCHAR(255),
  target_pipeline_id UUID REFERENCES pipelines(id) ON DELETE SET NULL,
  target_stage_id UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
  auto_assign_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_lead_form_mappings_form ON meta_lead_form_mappings(form_id);

-- 4. Fault-Tolerant Webhook Queue
CREATE TABLE IF NOT EXISTS meta_webhook_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, processed, failed
  retry_count INT DEFAULT 0,
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_meta_webhook_queue_status ON meta_webhook_queue(status, created_at);

-- 5. Lead Processing Audit Logs
CREATE TABLE IF NOT EXISTS meta_lead_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  lead_id VARCHAR(255) NOT NULL,
  form_id VARCHAR(255),
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  raw_payload JSONB,
  status VARCHAR(50) DEFAULT 'processed',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_lead_logs_lead ON meta_lead_logs(lead_id);

-- 6. Multi-Touch Attribution Logs
CREATE TABLE IF NOT EXISTS meta_attribution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  campaign_id VARCHAR(255),
  adset_id VARCHAR(255),
  ad_id VARCHAR(255),
  click_id VARCHAR(255),
  source VARCHAR(50) NOT NULL, -- lead_ad, click_to_wa
  first_touch BOOLEAN DEFAULT true,
  last_touch BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_attribution_contact ON meta_attribution_logs(contact_id);

-- 7. WhatsApp Click-to-WhatsApp Attribution Tracking
CREATE TABLE IF NOT EXISTS whatsapp_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  phone VARCHAR(50) NOT NULL,
  campaign_id VARCHAR(255),
  ad_id VARCHAR(255),
  ref_param VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_whatsapp_attribution_phone ON whatsapp_attribution(phone);
