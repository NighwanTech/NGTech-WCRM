-- Migration: 084_meta_ads_enterprise_os.sql
-- Description: Adds enterprise tables for Meta Ads OS (Ad Sets, Creatives v2, Rules, Decision Logs, Queues) with strict RLS

-- 1. Meta Ad Sets
CREATE TABLE IF NOT EXISTS public.meta_ad_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES public.meta_ad_campaigns(id) ON DELETE CASCADE,
    meta_adset_id TEXT, -- Populated after sync with Graph API
    name TEXT NOT NULL,
    daily_budget_cents BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, DELETED
    targeting_age_min INTEGER DEFAULT 18,
    targeting_age_max INTEGER DEFAULT 65,
    targeting_gender TEXT DEFAULT 'ALL',
    targeting_interests JSONB DEFAULT '[]'::jsonb,
    targeting_locations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Meta Ad Creatives V2
CREATE TABLE IF NOT EXISTS public.meta_ad_creatives_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    adset_id UUID NOT NULL REFERENCES public.meta_ad_sets(id) ON DELETE CASCADE,
    meta_ad_id TEXT, -- Populated after sync with Graph API
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    primary_text TEXT NOT NULL,
    headline TEXT,
    description TEXT,
    call_to_action_type TEXT DEFAULT 'LEARN_MORE',
    media_type TEXT NOT NULL, -- IMAGE, VIDEO
    media_url TEXT NOT NULL,
    destination_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Meta Optimization Rules
CREATE TABLE IF NOT EXISTS public.meta_optimization_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    condition_metric TEXT NOT NULL, -- cpl, roas, ctr, spend
    condition_operator TEXT NOT NULL, -- greater_than, less_than
    condition_value NUMERIC NOT NULL,
    action_type TEXT NOT NULL, -- pause_ad, pause_campaign, increase_budget, decrease_budget
    action_value NUMERIC, -- percentage or absolute value if applicable
    last_evaluated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Meta AI Decision Logs
CREATE TABLE IF NOT EXISTS public.meta_ai_decision_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.meta_ad_campaigns(id) ON DELETE CASCADE,
    decision_type TEXT NOT NULL, -- audience_expansion, budget_optimization, creative_suggestion, rule_execution
    description TEXT NOT NULL,
    ai_rationale TEXT,
    metrics_snapshot JSONB,
    status TEXT NOT NULL DEFAULT 'APPLIED', -- SUGGESTED, APPLIED, REJECTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Meta Queue Jobs
CREATE TABLE IF NOT EXISTS public.meta_queue_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL, -- sync_campaigns, sync_metrics, sync_leads, apply_rules
    payload JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    error_message TEXT,
    attempts INTEGER DEFAULT 0,
    next_run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_meta_ad_sets_updated_at BEFORE UPDATE ON public.meta_ad_sets FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_meta_ad_creatives_v2_updated_at BEFORE UPDATE ON public.meta_ad_creatives_v2 FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_meta_optimization_rules_updated_at BEFORE UPDATE ON public.meta_optimization_rules FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_meta_queue_jobs_updated_at BEFORE UPDATE ON public.meta_queue_jobs FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Enable RLS
ALTER TABLE public.meta_ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ad_creatives_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_optimization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ai_decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_queue_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access their account meta_ad_sets" ON public.meta_ad_sets
    FOR ALL USING (is_account_member(account_id));

CREATE POLICY "Users can access their account meta_ad_creatives_v2" ON public.meta_ad_creatives_v2
    FOR ALL USING (is_account_member(account_id));

CREATE POLICY "Users can access their account meta_optimization_rules" ON public.meta_optimization_rules
    FOR ALL USING (is_account_member(account_id));

CREATE POLICY "Users can access their account meta_ai_decision_logs" ON public.meta_ai_decision_logs
    FOR ALL USING (is_account_member(account_id));

CREATE POLICY "Users can access their account meta_queue_jobs" ON public.meta_queue_jobs
    FOR ALL USING (is_account_member(account_id));
