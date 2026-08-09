-- ============================================================
-- 🚀 AIWCRM Complete Meta Ads & AI Ads OS Migration + Role Grants
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

-- 1. Meta Ad Accounts Table
CREATE TABLE IF NOT EXISTS public.meta_ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  workspace_id UUID,
  ad_account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active',
  capi_pixel_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_ad_accounts_acc ON public.meta_ad_accounts(account_id);

-- 2. Meta Campaign Performance Cache
CREATE TABLE IF NOT EXISTS public.meta_campaign_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  workspace_id UUID,
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
CREATE INDEX IF NOT EXISTS idx_meta_campaign_cache_acc ON public.meta_campaign_cache(account_id);

-- 3. AI Ad Campaigns Table
CREATE TABLE IF NOT EXISTS public.ai_ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  workspace_id UUID,
  meta_campaign_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  objective VARCHAR(100) NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  daily_budget NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  destination_type VARCHAR(50) DEFAULT 'whatsapp',
  wa_ref_param VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_ad_campaigns_acc ON public.ai_ad_campaigns(account_id);

-- 4. AI Ad Creatives Table
CREATE TABLE IF NOT EXISTS public.ai_ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.ai_ad_campaigns(id) ON DELETE CASCADE,
  headline VARCHAR(255) NOT NULL,
  primary_text TEXT NOT NULL,
  cta_text VARCHAR(100) DEFAULT 'Send WhatsApp Message',
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_ad_creatives_camp ON public.ai_ad_creatives(campaign_id);

-- 5. AI Target Audience Table
CREATE TABLE IF NOT EXISTS public.ai_ad_audience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.ai_ad_campaigns(id) ON DELETE CASCADE,
  location VARCHAR(255),
  age_min INT DEFAULT 18,
  age_max INT DEFAULT 65,
  gender VARCHAR(20) DEFAULT 'ALL',
  interests JSONB DEFAULT '[]'::jsonb,
  behaviors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_ad_audience_camp ON public.ai_ad_audience(campaign_id);

-- 6. Lead Form Mappings
CREATE TABLE IF NOT EXISTS public.meta_lead_form_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  workspace_id UUID,
  form_id VARCHAR(255) NOT NULL,
  form_name VARCHAR(255),
  page_id VARCHAR(255),
  target_pipeline_id UUID,
  target_stage_id UUID,
  auto_assign_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_lead_form_mappings ON public.meta_lead_form_mappings(form_id);

-- 7. Optimization Rules
CREATE TABLE IF NOT EXISTS public.meta_optimization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  workspace_id UUID,
  rule_name VARCHAR(255) NOT NULL,
  metric VARCHAR(50) NOT NULL,
  operator VARCHAR(10) NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  action VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant full table permissions to service_role, anon, authenticated, postgres
GRANT ALL ON TABLE public.meta_ad_accounts TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.meta_campaign_cache TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.ai_ad_campaigns TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.ai_ad_creatives TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.ai_ad_audience TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.meta_lead_form_mappings TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.meta_optimization_rules TO postgres, anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.meta_ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_campaign_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_ad_audience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_lead_form_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_optimization_rules ENABLE ROW LEVEL SECURITY;

-- Allow access policies
DROP POLICY IF EXISTS "meta_ad_accounts_policy" ON public.meta_ad_accounts;
CREATE POLICY "meta_ad_accounts_policy" ON public.meta_ad_accounts FOR ALL USING (true);

DROP POLICY IF EXISTS "meta_campaign_cache_policy" ON public.meta_campaign_cache;
CREATE POLICY "meta_campaign_cache_policy" ON public.meta_campaign_cache FOR ALL USING (true);

DROP POLICY IF EXISTS "ai_ad_campaigns_policy" ON public.ai_ad_campaigns;
CREATE POLICY "ai_ad_campaigns_policy" ON public.ai_ad_campaigns FOR ALL USING (true);

DROP POLICY IF EXISTS "ai_ad_creatives_policy" ON public.ai_ad_creatives;
CREATE POLICY "ai_ad_creatives_policy" ON public.ai_ad_creatives FOR ALL USING (true);

DROP POLICY IF EXISTS "ai_ad_audience_policy" ON public.ai_ad_audience;
CREATE POLICY "ai_ad_audience_policy" ON public.ai_ad_audience FOR ALL USING (true);

DROP POLICY IF EXISTS "meta_lead_form_mappings_policy" ON public.meta_lead_form_mappings;
CREATE POLICY "meta_lead_form_mappings_policy" ON public.meta_lead_form_mappings FOR ALL USING (true);

DROP POLICY IF EXISTS "meta_optimization_rules_policy" ON public.meta_optimization_rules;
CREATE POLICY "meta_optimization_rules_policy" ON public.meta_optimization_rules FOR ALL USING (true);
