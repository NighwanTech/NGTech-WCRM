-- ============================================================================
-- AIWCRM META ADS OS — PHASE 5.4 DDL MIGRATION
-- WHATSAPP LEAD & CRM DEAL ATTRIBUTION ENGINE (FULL-FUNNEL NET ROAS CALCULATOR)
-- ============================================================================

-- 1. WHATSAPP ATTRIBUTION MAPPING TABLE
CREATE TABLE IF NOT EXISTS whatsapp_meta_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  wamid VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NOT NULL,
  meta_campaign_id VARCHAR(255),
  meta_adset_id VARCHAR(255),
  meta_ad_id VARCHAR(255),
  utm_source VARCHAR(100) DEFAULT 'meta_ads',
  utm_medium VARCHAR(100) DEFAULT 'cpc',
  utm_campaign VARCHAR(255),
  first_message_body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CRM DEAL ATTRIBUTION TABLE
CREATE TABLE IF NOT EXISTS crm_deal_meta_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL, -- References pipeline deals
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  meta_adset_id VARCHAR(255),
  meta_ad_id VARCHAR(255),
  deal_stage VARCHAR(100) NOT NULL, -- e.g. 'CLOSED_WON', 'QUALIFIED'
  deal_value NUMERIC(12, 2) DEFAULT 0.00,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, deal_id)
);

-- 3. CAMPAIGN ACTIVITY TIMELINE (MODULE 11 AUDIT HISTORY ENGINE)
CREATE TABLE IF NOT EXISTS campaign_activity_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  actor_id UUID,
  event_type VARCHAR(100) NOT NULL, -- e.g. 'LeadAttributed', 'DealClosedWon', 'ROASCalculated'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST ATTRIBUTION LOOKUPS
CREATE INDEX IF NOT EXISTS idx_wa_attr_phone ON whatsapp_meta_attribution(account_id, phone_number);
CREATE INDEX IF NOT EXISTS idx_wa_attr_camp ON whatsapp_meta_attribution(meta_campaign_id);
CREATE INDEX IF NOT EXISTS idx_deal_attr_camp ON crm_deal_meta_attribution(meta_campaign_id);
CREATE INDEX IF NOT EXISTS idx_activity_timeline_camp ON campaign_activity_timeline(campaign_id);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.whatsapp_meta_attribution TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.crm_deal_meta_attribution TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_activity_timeline TO postgres, service_role, anon, authenticated;
