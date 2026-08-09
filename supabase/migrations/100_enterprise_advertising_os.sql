-- Migration 100: AIWCRM Enterprise Advertising OS Architecture
-- Lays the foundation for the Meta-First Advertising OS, Asset Libraries, A/B Experiments, 
-- Budget Governance, AI Operations, and the AI Sales Feedback Loop.

-- 1. Creative Asset Library
CREATE TABLE IF NOT EXISTS ad_creative_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- image, video, carousel, ad_copy
  url TEXT,
  file_path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- AI suggestions, tags, aspect ratios
  approval_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  version INT DEFAULT 1,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ad_creative_assets_account ON ad_creative_assets(account_id);

-- 2. Ad Experiments (A/B Testing)
CREATE TABLE IF NOT EXISTS ad_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, RUNNING, COMPLETED, CANCELLED
  campaign_id VARCHAR(255),
  test_metric VARCHAR(50) NOT NULL, -- cpl, roas, ctr
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  variants JSONB NOT NULL, -- definition of A vs B
  winner_variant VARCHAR(255),
  auto_rollout BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ad_experiments_account ON ad_experiments(account_id);

-- 3. Budget Governance
CREATE TABLE IF NOT EXISTS budget_governance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- ACCOUNT, BRANCH, CAMPAIGN
  entity_id VARCHAR(255), -- If scoped
  daily_limit_cents BIGINT,
  monthly_limit_cents BIGINT,
  require_approval_over_cents BIGINT,
  overspend_flag BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_budget_governance_account ON budget_governance(account_id);

-- 4. Campaign Approvals
CREATE TABLE IF NOT EXISTS campaign_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  campaign_id VARCHAR(255) NOT NULL,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  changes_requested JSONB,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_campaign_approvals_account ON campaign_approvals(account_id);

-- 5. Meta Attribution Engine (Deep Funnel tracking)
CREATE TABLE IF NOT EXISTS meta_attribution_engine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  campaign_id VARCHAR(255),
  adset_id VARCHAR(255),
  ad_id VARCHAR(255),
  impression_time TIMESTAMPTZ,
  click_time TIMESTAMPTZ,
  landing_page_time TIMESTAMPTZ,
  whatsapp_chat_time TIMESTAMPTZ,
  lead_creation_time TIMESTAMPTZ,
  opportunity_time TIMESTAMPTZ,
  order_time TIMESTAMPTZ,
  realized_revenue_cents BIGINT DEFAULT 0,
  roas NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meta_attribution_engine_account ON meta_attribution_engine(account_id);
CREATE INDEX IF NOT EXISTS idx_meta_attribution_engine_contact ON meta_attribution_engine(contact_id);

-- 6. Scheduled Reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  frequency VARCHAR(50) NOT NULL, -- DAILY, WEEKLY, MONTHLY
  format VARCHAR(50) DEFAULT 'PDF', -- PDF, EXCEL
  recipients JSONB NOT NULL, -- Array of emails or user IDs
  last_sent_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_account ON scheduled_reports(account_id);

-- 7. Marketing Intelligence Knowledge Base (AI Sales Feedback Loop)
CREATE TABLE IF NOT EXISTS marketing_intelligence_kb (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL, -- AUDIENCE_PATTERN, CREATIVE_PERFORMANCE, REGIONAL_TREND, BUDGET_EFFICIENCY
  summary TEXT NOT NULL,
  confidence_score NUMERIC(5, 2),
  source_campaign_ids TEXT[],
  revenue_attributed_cents BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_marketing_intelligence_kb_account ON marketing_intelligence_kb(account_id);

-- 8. AI Agent Operations (with Cost Governance and Explainable AI)
CREATE TABLE IF NOT EXISTS ai_agent_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  agent_name VARCHAR(100) DEFAULT 'meta_ads_agent',
  action_type VARCHAR(100) NOT NULL, -- SCAN, RECOMMEND, EXECUTE, ALERT, SIMULATION
  target_id VARCHAR(255), -- Campaign ID, Adset ID, etc.
  
  -- Explainable AI (XAI)
  ai_rationale TEXT,
  confidence_score NUMERIC(5, 2),
  expected_impact JSONB,
  estimated_roi NUMERIC(10, 2),
  supporting_evidence TEXT,
  
  -- Cost Governance
  provider_name VARCHAR(100),
  estimated_token_usage INT,
  estimated_cost_cents BIGINT,
  
  status VARCHAR(50) DEFAULT 'PENDING_APPROVAL', -- PENDING_APPROVAL, EXECUTED, REJECTED, AUTO_EXECUTED, SIMULATED
  version INT DEFAULT 1,
  rollback_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_ai_agent_operations_account ON ai_agent_operations(account_id);


-- Row Level Security (RLS) Policies
ALTER TABLE ad_creative_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY ad_creative_assets_select ON ad_creative_assets FOR SELECT USING (is_account_member(account_id));
CREATE POLICY ad_creative_assets_all ON ad_creative_assets FOR ALL USING (is_account_member(account_id, 'admin'));

ALTER TABLE ad_experiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY ad_experiments_select ON ad_experiments FOR SELECT USING (is_account_member(account_id));
CREATE POLICY ad_experiments_all ON ad_experiments FOR ALL USING (is_account_member(account_id, 'admin'));

ALTER TABLE budget_governance ENABLE ROW LEVEL SECURITY;
CREATE POLICY budget_governance_select ON budget_governance FOR SELECT USING (is_account_member(account_id));
CREATE POLICY budget_governance_all ON budget_governance FOR ALL USING (is_account_member(account_id, 'admin'));

ALTER TABLE campaign_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaign_approvals_select ON campaign_approvals FOR SELECT USING (is_account_member(account_id));
CREATE POLICY campaign_approvals_all ON campaign_approvals FOR ALL USING (is_account_member(account_id, 'admin'));

ALTER TABLE meta_attribution_engine ENABLE ROW LEVEL SECURITY;
CREATE POLICY meta_attribution_engine_select ON meta_attribution_engine FOR SELECT USING (is_account_member(account_id));
CREATE POLICY meta_attribution_engine_all ON meta_attribution_engine FOR ALL USING (is_account_member(account_id, 'admin'));

ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY scheduled_reports_select ON scheduled_reports FOR SELECT USING (is_account_member(account_id));
CREATE POLICY scheduled_reports_all ON scheduled_reports FOR ALL USING (is_account_member(account_id, 'admin'));

ALTER TABLE marketing_intelligence_kb ENABLE ROW LEVEL SECURITY;
CREATE POLICY marketing_intelligence_kb_select ON marketing_intelligence_kb FOR SELECT USING (is_account_member(account_id));
CREATE POLICY marketing_intelligence_kb_all ON marketing_intelligence_kb FOR ALL USING (is_account_member(account_id, 'admin'));

ALTER TABLE ai_agent_operations ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_agent_operations_select ON ai_agent_operations FOR SELECT USING (is_account_member(account_id));
CREATE POLICY ai_agent_operations_all ON ai_agent_operations FOR ALL USING (is_account_member(account_id, 'admin'));
