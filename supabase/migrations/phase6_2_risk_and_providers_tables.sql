-- ============================================================================
-- AIWCRM MARKETING INTELLIGENCE PLATFORM — PHASE 6.2 DDL MIGRATION
-- MULTI-CHANNEL MARKETING PROVIDERS, DETERMINISTIC RISK ENGINE & RECOVERY
-- ============================================================================

-- 1. MULTI-CHANNEL MARKETING ACCOUNTS & PROVIDERS TABLE (SECTION 8)
CREATE TABLE IF NOT EXISTS marketing_provider_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  channel VARCHAR(50) NOT NULL DEFAULT 'META', -- 'META', 'GOOGLE_ADS', 'LINKEDIN', 'TIKTOK'
  provider_account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, channel, provider_account_id)
);

-- 2. DETERMINISTIC RISK SCORES LOG TABLE (SECTION 6)
CREATE TABLE IF NOT EXISTS campaign_ai_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  orchestration_event_id VARCHAR(255) NOT NULL,
  risk_score NUMERIC(5, 2) NOT NULL, -- 0 to 100
  risk_classification VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  routing_decision VARCHAR(50) NOT NULL, -- 'AUTONOMOUS_EXECUTE', 'REQUIRE_HUMAN_APPROVAL', 'FORBIDDEN'
  risk_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST CHANNEL & RISK QUERY LOOKUPS
CREATE INDEX IF NOT EXISTS idx_provider_acc ON marketing_provider_accounts(account_id, channel);
CREATE INDEX IF NOT EXISTS idx_risk_scores_camp ON campaign_ai_risk_scores(account_id, campaign_id);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.marketing_provider_accounts TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_ai_risk_scores TO postgres, service_role, anon, authenticated;
