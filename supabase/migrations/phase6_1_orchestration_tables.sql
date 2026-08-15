-- ============================================================================
-- AIWCRM META ADS OS — PHASE 6.1 DDL MIGRATION
-- EVENT-DRIVEN ORCHESTRATION, STANDARDIZED AGENTS, SIMULATIONS & PLAYBOOKS
-- ============================================================================

-- 1. DIGITAL TWIN VERSIONED SIMULATIONS TABLE (ITEM 3 & 7)
CREATE TABLE IF NOT EXISTS campaign_ai_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  orchestration_event_id VARCHAR(255) NOT NULL,
  model_version VARCHAR(50) NOT NULL DEFAULT 'v1.0-monte-carlo',
  scenario VARCHAR(50) NOT NULL DEFAULT 'EXPECTED', -- 'CONSERVATIVE', 'EXPECTED', 'AGGRESSIVE'
  proposed_action JSONB NOT NULL,
  predicted_spend NUMERIC(12, 2) NOT NULL,
  predicted_revenue NUMERIC(12, 2) NOT NULL,
  predicted_cpl NUMERIC(10, 2) NOT NULL,
  predicted_ctr NUMERIC(5, 2) NOT NULL,
  predicted_roas NUMERIC(5, 2) NOT NULL,
  confidence_interval VARCHAR(50) DEFAULT '95% CI [3.2x, 4.8x]',
  risk_score NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
  actual_outcome JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. REUSABLE CAMPAIGN OPTIMIZATION PLAYBOOKS TABLE (ITEM 6)
CREATE TABLE IF NOT EXISTS campaign_ai_playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  playbook_name VARCHAR(100) NOT NULL, -- e.g. 'Lead Generation Playbook', 'Sales Playbook'
  objective VARCHAR(100) NOT NULL, -- 'OUTCOME_LEADS', 'OUTCOME_SALES', 'OUTCOME_TRAFFIC'
  primary_kpi VARCHAR(50) NOT NULL, -- 'CPL', 'ROAS', 'CPC'
  guardrail_cpl_max NUMERIC(10, 2),
  guardrail_roas_min NUMERIC(5, 2),
  max_daily_scale_percent NUMERIC(5, 2) DEFAULT 15.00,
  rules_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST SIMULATION & PLAYBOOK LOOKUPS
CREATE INDEX IF NOT EXISTS idx_simulations_camp ON campaign_ai_simulations(account_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_playbooks_obj ON campaign_ai_playbooks(objective);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.campaign_ai_simulations TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_ai_playbooks TO postgres, service_role, anon, authenticated;
