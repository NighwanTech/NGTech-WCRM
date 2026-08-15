-- ============================================================================
-- AIWCRM META ADS OS — PHASE 5.1 DDL MIGRATION
-- SYNCHRONIZATION FOUNDATION, EXTENDED CACHE LAYER & RAW INSIGHTS WAREHOUSE
-- ============================================================================

-- 1. META CAMPAIGN CACHE
CREATE TABLE IF NOT EXISTS meta_campaign_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  effective_status VARCHAR(50),
  objective VARCHAR(100),
  daily_budget NUMERIC(12, 2) DEFAULT 0.00,
  lifetime_budget NUMERIC(12, 2) DEFAULT 0.00,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, meta_campaign_id)
);

-- 2. META ADSET CACHE
CREATE TABLE IF NOT EXISTS meta_adset_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  meta_adset_id VARCHAR(255) NOT NULL,
  meta_campaign_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  effective_status VARCHAR(50),
  optimization_goal VARCHAR(100),
  daily_budget NUMERIC(12, 2) DEFAULT 0.00,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, meta_adset_id)
);

-- 3. META AD CACHE
CREATE TABLE IF NOT EXISTS meta_ad_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  meta_ad_id VARCHAR(255) NOT NULL,
  meta_adset_id VARCHAR(255) NOT NULL,
  meta_campaign_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  effective_status VARCHAR(50),
  creative_id VARCHAR(255),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, meta_ad_id)
);

-- 4. META CREATIVE CACHE
CREATE TABLE IF NOT EXISTS meta_creative_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  meta_creative_id VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  title VARCHAR(255),
  body TEXT,
  image_url TEXT,
  video_id VARCHAR(255),
  call_to_action VARCHAR(100),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, meta_creative_id)
);

-- 5. RAW META INSIGHTS STORE (DATA WAREHOUSE RAW LAYER)
CREATE TABLE IF NOT EXISTS meta_insights_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  meta_adset_id VARCHAR(255),
  meta_ad_id VARCHAR(255),
  date_start DATE NOT NULL,
  date_stop DATE NOT NULL,
  raw_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. META SYNC LOGS & HEALTH ENGINE
CREATE TABLE IF NOT EXISTS meta_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- 'CAMPAIGN', 'ADSET', 'AD', 'CREATIVE', 'INSIGHTS'
  status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILED'
  records_synced INT DEFAULT 0,
  duration_ms INT DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST WAREHOUSE LOOKUPS
CREATE INDEX IF NOT EXISTS idx_meta_camp_cache_acc ON meta_campaign_cache(account_id);
CREATE INDEX IF NOT EXISTS idx_meta_adset_cache_camp ON meta_adset_cache(meta_campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_ad_cache_adset ON meta_ad_cache(meta_adset_id);
CREATE INDEX IF NOT EXISTS idx_meta_insights_raw_date ON meta_insights_raw(account_id, meta_campaign_id, date_start);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.meta_campaign_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_adset_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_ad_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_creative_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_insights_raw TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_sync_logs TO postgres, service_role, anon, authenticated;
