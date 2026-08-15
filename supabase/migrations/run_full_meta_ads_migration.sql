-- ============================================================
-- 🚀 AIWCRM Meta Ads OS — Complete Enterprise Database Migration
-- Target Instance: https://supabase.nighwantech.com
-- Run this script in your Supabase SQL Editor -> Run
-- ============================================================

-- 1. Marketing Strategies Table (Dedicated Strategy Blueprints)
CREATE TABLE IF NOT EXISTS public.marketing_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    strategy_name TEXT NOT NULL,
    prompt TEXT,
    industry TEXT,
    subcategory TEXT,
    status TEXT DEFAULT 'APPROVED',
    version TEXT DEFAULT 'v1.0',
    strategy_payload JSONB DEFAULT '{}'::jsonb,
    confidence_score INT DEFAULT 95,
    campaign_objective TEXT,
    budget TEXT,
    location TEXT,
    radius TEXT,
    meta_interest_names TEXT[],
    headline TEXT,
    primary_text TEXT,
    cta TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_marketing_strategies_acc ON public.marketing_strategies(account_id);

-- 2. Marketing Campaigns Aggregate Root Table
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    workspace_id UUID,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, IN_REVIEW, APPROVED, PUBLISHING, PUBLISHED, PAUSED, ARCHIVED
    version TEXT NOT NULL DEFAULT 'v1.0',
    meta_campaign_id TEXT UNIQUE,
    meta_ad_account_id TEXT,
    created_by UUID REFERENCES auth.users(id),
    assigned_to UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_acc ON public.marketing_campaigns(account_id);

-- 3. Normalized Campaign Strategies
CREATE TABLE IF NOT EXISTS public.campaign_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    business_category TEXT NOT NULL,
    business_subcategory TEXT,
    campaign_goal TEXT NOT NULL,
    campaign_objective TEXT NOT NULL,
    creative_angle TEXT,
    why_recommended TEXT,
    confidence_score INT DEFAULT 95,
    version TEXT NOT NULL DEFAULT 'v1.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_strategies_cid ON public.campaign_strategies(campaign_id);

-- 4. Normalized Campaign Audiences & Geofencing
CREATE TABLE IF NOT EXISTS public.campaign_audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    primary_location TEXT NOT NULL,
    secondary_expansion TEXT,
    recommended_radius TEXT NOT NULL,
    age_min INT DEFAULT 18,
    age_max INT DEFAULT 65,
    gender TEXT DEFAULT 'ALL',
    languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
    osm_latitude DECIMAL(10,7),
    osm_longitude DECIMAL(10,7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_audiences_cid ON public.campaign_audiences(campaign_id);

-- 5. Meta Verified Targeting Catalog
CREATE TABLE IF NOT EXISTS public.campaign_meta_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    meta_interest_id TEXT NOT NULL,
    interest_name TEXT NOT NULL,
    audience_size TEXT,
    source TEXT DEFAULT 'Meta Graph API v20.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_meta_interests_cid ON public.campaign_meta_interests(campaign_id);

-- 6. Normalized Campaign Creatives & Copy
CREATE TABLE IF NOT EXISTS public.campaign_creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    headline TEXT NOT NULL,
    primary_text TEXT NOT NULL,
    cta TEXT DEFAULT 'Send WhatsApp Message',
    image_url TEXT,
    video_url TEXT,
    creative_format TEXT DEFAULT 'poster',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_creatives_cid ON public.campaign_creatives(campaign_id);

-- 7. Normalized Campaign Budgets & Placements
CREATE TABLE IF NOT EXISTS public.campaign_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    budget_type TEXT DEFAULT 'daily',
    daily_budget DECIMAL(12,2) NOT NULL DEFAULT 500.00,
    currency TEXT DEFAULT 'INR',
    placements TEXT[] DEFAULT ARRAY['feeds', 'reels', 'stories'],
    is_advantage_plus BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_budgets_cid ON public.campaign_budgets(campaign_id);

-- 8. Enterprise Domain Event Stream
CREATE TABLE IF NOT EXISTS public.campaign_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_events_cid ON public.campaign_events(campaign_id);

-- 9. Immutable Whole-Campaign Version Snapshots
CREATE TABLE IF NOT EXISTS public.campaign_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    snapshot_payload JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_versions_cid ON public.campaign_versions(campaign_id);
