-- ============================================================================
-- AIWCRM META ADS OS — PHASE 5.5 DDL MIGRATION
-- AI OPTIMIZATION ENGINE, VERSIONED RECOMMENDATIONS & AUDIT EXECUTION ENGINE
-- ============================================================================

-- 1. VERSIONED AI RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS campaign_ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'HIGH_CPL', 'LOW_CTR', 'CREATIVE_FATIGUE', 'BUDGET_WASTE'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  prompt_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.0',
  model_name VARCHAR(100) NOT NULL DEFAULT 'gemini-1.5-pro',
  confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 95.00,
  expected_improvement TEXT NOT NULL, -- e.g. '+22% Estimated ROAS'
  recommendation_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPLIED', 'DISMISSED'
  applied_by UUID REFERENCES profiles(user_id),
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTOMATION RULES DEFINITION TABLE
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  rule_name VARCHAR(255) NOT NULL,
  metric_trigger VARCHAR(50) NOT NULL, -- 'CPL', 'CTR', 'FREQUENCY', 'BUDGET'
  condition_operator VARCHAR(20) NOT NULL, -- 'GREATER_THAN', 'LESS_THAN'
  threshold_value NUMERIC(10, 2) NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'PAUSE_AD', 'SCALE_BUDGET', 'NOTIFY'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AUTOMATION EXECUTION AUDIT RUNS TABLE
CREATE TABLE IF NOT EXISTS automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES automation_rules(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'SUCCESS', 'FAILED', 'ROLLED_BACK'
  action_taken TEXT NOT NULL,
  execution_details JSONB DEFAULT '{}'::jsonb,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERY LOOKUPS
CREATE INDEX IF NOT EXISTS idx_ai_recs_camp ON campaign_ai_recommendations(account_id, campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_auto_runs_camp ON automation_runs(account_id, campaign_id);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.campaign_ai_recommendations TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.automation_rules TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.automation_runs TO postgres, service_role, anon, authenticated;
