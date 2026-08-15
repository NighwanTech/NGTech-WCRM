-- ============================================================================
-- AIWCRM META ADS OS — ENTERPRISE OPERATIONAL VALIDATION DDL MIGRATION
-- ROLLBACK ENGINE, LIFECYCLE, CONTINUOUS LEARNING & PERFORMANCE METRICS
-- ============================================================================

-- 1. ROLLBACK LOGS & SNAPSHOTS TABLE (SECTION 1)
CREATE TABLE IF NOT EXISTS campaign_rollback_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES campaign_ai_recommendations(id) ON DELETE SET NULL,
  queue_id UUID REFERENCES campaign_approval_queue(id) ON DELETE SET NULL,
  snapshot_before JSONB NOT NULL,
  rollback_payload JSONB NOT NULL,
  rollback_reason TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ROLLED_BACK', -- 'ROLLED_BACK', 'FAILED'
  rolled_back_by UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONTINUOUS LEARNING MEMORY TABLE (SECTION 5 & 6)
CREATE TABLE IF NOT EXISTS campaign_ai_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES campaign_ai_recommendations(id) ON DELETE SET NULL,
  recommendation_type VARCHAR(100) NOT NULL,
  industry VARCHAR(100) DEFAULT 'GENERAL',
  objective VARCHAR(100) DEFAULT 'OUTCOME_LEADS',
  before_metrics JSONB NOT NULL,
  after_metrics JSONB NOT NULL,
  ai_confidence NUMERIC(5, 2) NOT NULL,
  actual_improvement NUMERIC(5, 2) NOT NULL,
  is_success BOOLEAN NOT NULL DEFAULT TRUE,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST ROLLBACK & LEARNING QUERIES
CREATE INDEX IF NOT EXISTS idx_rollback_camp ON campaign_rollback_logs(account_id, campaign_id);
CREATE INDEX IF NOT EXISTS idx_learning_rec ON campaign_ai_learning(account_id, recommendation_type);

-- GRANT PERMISSIONS TO POSTGRES, SERVICE_ROLE, AUTHENTICATED & ANON
GRANT ALL ON public.campaign_rollback_logs TO postgres, service_role, anon, authenticated;
GRANT ALL ON public.campaign_ai_learning TO postgres, service_role, anon, authenticated;
