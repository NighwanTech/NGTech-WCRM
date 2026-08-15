-- ============================================================
-- 🚀 PHASE 4 META PUBLISHING PIPELINE & SYNC DATABASE MIGRATION
-- Run this in Supabase SQL Editor (https://supabase.nighwantech.com)
-- ============================================================

-- 1. Campaign AdSets Table
CREATE TABLE IF NOT EXISTS public.campaign_adsets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    meta_adset_id TEXT UNIQUE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'PAUSED',
    daily_budget DECIMAL(12,2),
    billing_event TEXT DEFAULT 'IMPRESSIONS',
    optimization_goal TEXT DEFAULT 'LEAD_GENERATION',
    targeting JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_adsets_cid ON public.campaign_adsets(campaign_id);

-- 2. Campaign Ads Table
CREATE TABLE IF NOT EXISTS public.campaign_ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    adset_id UUID REFERENCES public.campaign_adsets(id) ON DELETE CASCADE,
    meta_ad_id TEXT UNIQUE,
    meta_creative_id TEXT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'PAUSED',
    headline TEXT,
    primary_text TEXT,
    cta TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_ads_cid ON public.campaign_ads(campaign_id);

-- 3. Campaign Publish History Table
CREATE TABLE IF NOT EXISTS public.campaign_publish_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_payload JSONB DEFAULT '{}'::jsonb,
    response_payload JSONB DEFAULT '{}'::jsonb,
    http_status INT NOT NULL,
    latency_ms INT,
    status TEXT NOT NULL, -- SUCCESS or FAILED
    error_message TEXT,
    meta_campaign_id TEXT,
    meta_adset_id TEXT,
    meta_creative_id TEXT,
    meta_ad_id TEXT,
    retry_count INT DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_publish_history_cid ON public.campaign_publish_history(campaign_id);

-- 4. Campaign Delivery Logs & Sync Cache Table
CREATE TABLE IF NOT EXISTS public.campaign_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    meta_campaign_id TEXT,
    spend DECIMAL(12,2) DEFAULT 0.00,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    reach INT DEFAULT 0,
    cpl DECIMAL(10,2) DEFAULT 0.00,
    roas DECIMAL(10,2) DEFAULT 0.00,
    effective_status TEXT,
    sync_status TEXT DEFAULT 'SUCCESS',
    synced_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_delivery_logs_cid ON public.campaign_delivery_logs(campaign_id);

-- Grant Permissions
GRANT ALL ON public.campaign_adsets TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_ads TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_publish_history TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_delivery_logs TO postgres, service_role, anon, authenticated;
