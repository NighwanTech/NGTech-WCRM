-- ============================================================================
-- AIWCRM META ADS OS — PHASE 5.6 DDL MIGRATION
-- INTELLIGENT AUTOMATION & APPROVAL ENGINE (GOVERNANCE, QUEUED EXECUTION & AUDIT)
-- ============================================================================

-- 1. APPROVAL QUEUE TABLE (REVIEW -> APPROVAL -> QUEUED EXECUTION -> VERIFICATION)
CREATE TABLE IF NOT EXISTS campaign_approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES campaign_ai_recommendations(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  meta_campaign_id VARCHAR(255) NOT NULL,
  action_type VARCHAR(100) NOT NULL, -- e.g. 'PAUSE_AD', 'SCALE_BUDGET', 'UPDATE_TARGETING'
  proposed_changes JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXECUTING', 'EXECUTED', 'FAILED', 'VERIFIED'
  requested_by UUID REFERENCES profiles(user_id),
  approved_by UUID REFERENCES profiles(user_id),
  approved_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verification_status VARCHAR(50) DEFAULT 'UNVERIFIED', -- 'SUCCESS', 'METRIC_DEGRADED', 'UNVERIFIED'
  rollback_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APPROVAL POLICY & THRESHOLDS TABLE (GOVERNANCE CONTROLS)
CREATE TABLE IF NOT EXISTS approval_governance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  policy_name VARCHAR(255) NOT NULL,
  max_auto_budget_increase_percent NUMERIC(5, 2) DEFAULT 15.00,
  require_approval_above_spend NUMERIC(10, 2) DEFAULT 500.00,
  require_two_factor_for_pause BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST GOVERNANCE & APPROVAL QUEUE QUERIES
CREATE INDEX IF NOT EXISTS idx_approval_queue_status ON campaign_approval_queue(account_id, status);
CREATE INDEX IF NOT EXISTS idx_approval_queue_camp ON campaign_approval_queue(campaign_id);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.campaign_approval_queue TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.approval_governance_policies TO postgres, service_role, anon, authenticated;
