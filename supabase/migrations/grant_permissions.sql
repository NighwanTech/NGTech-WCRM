-- ============================================================
-- 🔓 GRANT PUBLIC/AUTHENTICATED & SERVICE ROLE PERMISSIONS
-- Run this in Supabase SQL Editor -> Run
-- ============================================================

GRANT ALL ON public.marketing_strategies TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.marketing_campaigns TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_strategies TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_audiences TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_meta_interests TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_creatives TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_budgets TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_events TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_versions TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_campaign_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_adset_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_ad_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_creative_cache TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_insights_raw TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.meta_sync_logs TO postgres, service_role, anon, authenticated;
