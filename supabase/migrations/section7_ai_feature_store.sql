-- ============================================================================
-- AIWCRM META ADS OS — SECTION 7: AI FEATURE STORE DDL
-- DEDICATED PHYSICAL FEATURE STORE TABLE FOR PHASE 5.5 LLM RECOMMENDATION ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS campaign_ai_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  spend NUMERIC(12, 2) DEFAULT 0.00,
  ctr NUMERIC(5, 2) DEFAULT 0.00,
  cpc NUMERIC(10, 2) DEFAULT 0.00,
  cpm NUMERIC(10, 2) DEFAULT 0.00,
  cpl NUMERIC(10, 2) DEFAULT 0.00,
  roas NUMERIC(5, 2) DEFAULT 0.00,
  frequency NUMERIC(5, 2) DEFAULT 1.00,
  reach BIGINT DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  leads INT DEFAULT 0,
  revenue NUMERIC(12, 2) DEFAULT 0.00,
  conversion_rate NUMERIC(5, 2) DEFAULT 0.00,
  trend_7d VARCHAR(50) DEFAULT 'STABLE', -- 'UP', 'DOWN', 'STABLE'
  trend_30d VARCHAR(50) DEFAULT 'STABLE',
  ctr_delta NUMERIC(5, 2) DEFAULT 0.00,
  cpl_delta NUMERIC(10, 2) DEFAULT 0.00,
  roas_delta NUMERIC(5, 2) DEFAULT 0.00,
  budget_change NUMERIC(12, 2) DEFAULT 0.00,
  creative_count INT DEFAULT 1,
  audience_size BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, campaign_id, date)
);

CREATE INDEX IF NOT EXISTS idx_ai_features_date ON campaign_ai_features(account_id, campaign_id, date);

GRANT ALL ON public.campaign_ai_features TO postgres, service_role, anon, authenticated;
