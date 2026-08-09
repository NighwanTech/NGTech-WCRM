-- Enterprise Customer Voice Intelligence Platform Extensible Schema
-- Extends the previous insights table and adds KB and Alerts

-- 1. Redefine customer_voice_insights to be channel-agnostic and support robust classification
DROP TABLE IF EXISTS customer_voice_insights CASCADE;

CREATE TABLE customer_voice_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL, -- Ensure RLS separation
  source_channel VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP' CHECK (source_channel IN ('WHATSAPP', 'WEBSITE_CHAT', 'EMAIL', 'CRM_NOTES', 'META_LEADS', 'OTHER')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('INTENT', 'OBJECTION', 'COMPLAINT', 'FEATURE_REQUEST', 'COMPETITOR', 'BUYING_SIGNAL', 'PRODUCT_FEEDBACK', 'SENTIMENT', 'SALES_STAGE', 'MARKET_TREND', 'FAQ', 'OTHER')),
  summary TEXT NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  conversation_count INTEGER NOT NULL DEFAULT 1,
  business_impact VARCHAR(20) DEFAULT 'MEDIUM' CHECK (business_impact IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  estimated_revenue_opportunity NUMERIC(12, 2) DEFAULT 0.00,
  recommended_action_type VARCHAR(50) CHECK (recommended_action_type IN ('CREATE_AD', 'UPDATE_CHATBOT', 'CREATE_FAQ', 'UPDATE_LANDING_PAGE', 'SALES_SCRIPT', 'CRM_TASK', 'NONE')),
  sentiment_score NUMERIC(3, 2) DEFAULT 0.00, -- -1.0 to 1.0
  region_id VARCHAR(100),
  branch_id VARCHAR(100),
  version_hash VARCHAR(256), -- For audibility and deduplication
  created_at TIMESTAMPTZ DEFAULT NOW(),
  actioned BOOLEAN DEFAULT false
);

CREATE INDEX idx_cvi_tenant_channel ON customer_voice_insights(tenant_id, source_channel);
CREATE INDEX idx_cvi_category ON customer_voice_insights(category);
CREATE INDEX idx_cvi_created_at ON customer_voice_insights(created_at);

-- 2. Customer Voice Alerts (Subscriptions)
CREATE TABLE customer_voice_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  threshold_impact VARCHAR(20) NOT NULL CHECK (threshold_impact IN ('MEDIUM', 'HIGH', 'CRITICAL')),
  notify_via VARCHAR(20) NOT NULL DEFAULT 'DASHBOARD' CHECK (notify_via IN ('DASHBOARD', 'EMAIL', 'WHATSAPP')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- 3. Marketing Intelligence Knowledge Base
CREATE TABLE marketing_intelligence_kb (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  insight_id UUID REFERENCES customer_voice_insights(id) ON DELETE SET NULL,
  source_channel VARCHAR(50) NOT NULL,
  original_summary TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  execution_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (execution_status IN ('PENDING', 'EXECUTED', 'FAILED', 'REVERTED')),
  measured_outcome TEXT,
  business_impact VARCHAR(20) NOT NULL,
  historical_trend_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enforcement
ALTER TABLE customer_voice_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_voice_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_intelligence_kb ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies would standardly restrict by tenant_id, but for prototyping we allow authenticated.
CREATE POLICY "Allow authenticated read insights" ON customer_voice_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert insights" ON customer_voice_insights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update insights" ON customer_voice_insights FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read alerts" ON customer_voice_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert alerts" ON customer_voice_alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update alerts" ON customer_voice_alerts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read kb" ON marketing_intelligence_kb FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert kb" ON marketing_intelligence_kb FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update kb" ON marketing_intelligence_kb FOR UPDATE TO authenticated USING (true);
