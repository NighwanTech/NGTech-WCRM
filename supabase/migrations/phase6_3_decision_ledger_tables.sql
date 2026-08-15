-- ============================================================================
-- AIWCRM MARKETING INTELLIGENCE PLATFORM — PHASE 6.3 DDL MIGRATION
-- IMMUTABLE DECISION LEDGER, CONTINUOUS LEARNING & ADAPTIVE CONFIDENCE ENGINE
-- ============================================================================

-- 1. IMMUTABLE DECISION LEDGER TABLE (CTO STRATEGIC RECOMMENDATION)
CREATE TABLE IF NOT EXISTS campaign_ai_decision_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  orchestration_event_id VARCHAR(255) NOT NULL UNIQUE,
  agents_involved JSONB NOT NULL DEFAULT '["BudgetAgent", "CreativeAgent"]'::jsonb,
  feature_snapshot_id UUID REFERENCES campaign_ai_features(id) ON DELETE SET NULL,
  simulation_id UUID REFERENCES campaign_ai_simulations(id) ON DELETE SET NULL,
  risk_score_id UUID REFERENCES campaign_ai_risk_scores(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  proposed_changes JSONB NOT NULL,
  routing_decision VARCHAR(50) NOT NULL, -- 'AUTONOMOUS_EXECUTE', 'REQUIRE_HUMAN_APPROVAL', 'FORBIDDEN'
  human_approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  execution_result VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'EXECUTED', 'FAILED', 'SKIPPED'
  rollback_status VARCHAR(50) NOT NULL DEFAULT 'NONE', -- 'NONE', 'ROLLED_BACK'
  outcome_1h JSONB DEFAULT '{}'::jsonb,
  outcome_24h JSONB DEFAULT '{}'::jsonb,
  outcome_7d JSONB DEFAULT '{}'::jsonb,
  outcome_30d JSONB DEFAULT '{}'::jsonb,
  learning_evaluation VARCHAR(50) DEFAULT 'PENDING', -- 'SUCCESS', 'PARTIAL_SUCCESS', 'FAILURE', 'ROLLED_BACK'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MODEL & AGENT VERSION TRACKING TABLE (SECTION 7)
CREATE TABLE IF NOT EXISTS campaign_ai_model_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(100) NOT NULL,
  agent_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  simulation_version VARCHAR(20) NOT NULL DEFAULT 'v1.0-monte-carlo',
  risk_engine_version VARCHAR(20) NOT NULL DEFAULT 'v1.0-deterministic',
  playbook_version VARCHAR(20) NOT NULL DEFAULT 'v1.0-lead-gen',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR IMMUTABLE DECISION LEDGER LOOKUPS
CREATE INDEX IF NOT EXISTS idx_decision_ledger_camp ON campaign_ai_decision_ledger(account_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_decision_ledger_eval ON campaign_ai_decision_ledger(account_id, learning_evaluation);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.campaign_ai_decision_ledger TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_ai_model_versions TO postgres, service_role, anon, authenticated;
