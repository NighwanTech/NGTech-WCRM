-- Migration 082: AI-Powered Meta Ads Builder & Autonomous Ads OS

-- 1. AI Ad Campaigns Table
CREATE TABLE IF NOT EXISTS ai_ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  objective VARCHAR(100) NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  daily_budget NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, launching, active, paused
  destination_type VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, lead_form, website
  wa_ref_param VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_ad_campaigns_ws ON ai_ad_campaigns(workspace_id);

-- 2. AI Ad Creatives Table
CREATE TABLE IF NOT EXISTS ai_ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ai_ad_campaigns(id) ON DELETE CASCADE,
  headline VARCHAR(255) NOT NULL,
  primary_text TEXT NOT NULL,
  cta_text VARCHAR(100) DEFAULT 'Send WhatsApp Message',
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_ad_creatives_campaign ON ai_ad_creatives(campaign_id);

-- 3. AI Target Audience Table
CREATE TABLE IF NOT EXISTS ai_ad_audience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ai_ad_campaigns(id) ON DELETE CASCADE,
  location VARCHAR(255),
  age_min INT DEFAULT 18,
  age_max INT DEFAULT 65,
  gender VARCHAR(20) DEFAULT 'ALL',
  interests JSONB DEFAULT '[]'::jsonb,
  behaviors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_ad_audience_campaign ON ai_ad_audience(campaign_id);
