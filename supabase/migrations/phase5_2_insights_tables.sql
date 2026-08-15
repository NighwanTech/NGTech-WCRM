-- ============================================================================
-- AIWCRM META ADS OS — PHASE 5.2 DDL MIGRATION
-- INSIGHTS ENGINE, MULTI-GRANULAR WAREHOUSE ROLLUPS & DAILY/HOURLY METRICS
-- ============================================================================

-- 1. HOURLY CAMPAIGN METRICS TABLE
CREATE TABLE IF NOT EXISTS campaign_metrics_hourly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  spend NUMERIC(12, 2) DEFAULT 0.00,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  leads INT DEFAULT 0,
  ctr NUMERIC(5, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, meta_campaign_id, timestamp)
);

-- 2. DAILY CAMPAIGN METRICS TABLE
CREATE TABLE IF NOT EXISTS campaign_metrics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  spend NUMERIC(12, 2) DEFAULT 0.00,
  impressions BIGINT DEFAULT 0,
  reach BIGINT DEFAULT 0,
  frequency NUMERIC(5, 2) DEFAULT 0.00,
  clicks BIGINT DEFAULT 0,
  leads INT DEFAULT 0,
  cpl NUMERIC(10, 2) DEFAULT 0.00,
  cpc NUMERIC(10, 2) DEFAULT 0.00,
  cpm NUMERIC(10, 2) DEFAULT 0.00,
  ctr NUMERIC(5, 2) DEFAULT 0.00,
  roas NUMERIC(5, 2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, meta_campaign_id, date)
);

-- 3. MONTHLY CAMPAIGN METRICS AGGREGATE
CREATE TABLE IF NOT EXISTS campaign_metrics_monthly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  year_month VARCHAR(7) NOT NULL, -- e.g. '2026-08'
  total_spend NUMERIC(12, 2) DEFAULT 0.00,
  total_impressions BIGINT DEFAULT 0,
  total_reach BIGINT DEFAULT 0,
  total_clicks BIGINT DEFAULT 0,
  total_leads INT DEFAULT 0,
  avg_cpl NUMERIC(10, 2) DEFAULT 0.00,
  avg_ctr NUMERIC(5, 2) DEFAULT 0.00,
  avg_roas NUMERIC(5, 2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, meta_campaign_id, year_month)
);

-- INDEXES FOR FAST TIME-SERIES QUERIES
CREATE INDEX IF NOT EXISTS idx_metrics_hourly_ts ON campaign_metrics_hourly(account_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_date ON campaign_metrics_daily(account_id, date);
CREATE INDEX IF NOT EXISTS idx_metrics_monthly_ym ON campaign_metrics_monthly(account_id, year_month);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.campaign_metrics_hourly TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_metrics_daily TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_metrics_monthly TO postgres, service_role, anon, authenticated;
