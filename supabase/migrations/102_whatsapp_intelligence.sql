-- Phase 9: Enterprise Conversation Intelligence & Customer Voice Analytics
-- Add new columns to ai_assistant_settings for WhatsApp Intelligence

ALTER TABLE ai_assistant_settings 
ADD COLUMN IF NOT EXISTS whatsapp_mining_mode VARCHAR(20) DEFAULT 'manual' CHECK (whatsapp_mining_mode IN ('manual', 'schedule', 'volume')),
ADD COLUMN IF NOT EXISTS whatsapp_lookback_days INTEGER DEFAULT 7 CHECK (whatsapp_lookback_days IN (7, 15, 30, 90)),
ADD COLUMN IF NOT EXISTS whatsapp_volume_threshold INTEGER DEFAULT 500;

-- Create the Customer Voice Insights table to store parsed themes from WhatsApp conversations

CREATE TABLE IF NOT EXISTS customer_voice_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(50) NOT NULL CHECK (category IN ('INTENT', 'OBJECTION', 'COMPETITOR', 'FAQ', 'COMPLAINT', 'FEATURE_REQUEST', 'MARKET_TREND', 'OTHER')),
  summary TEXT NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  conversation_count INTEGER NOT NULL DEFAULT 1,
  business_impact VARCHAR(20) DEFAULT 'MEDIUM' CHECK (business_impact IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  actioned BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_customer_voice_insights_category ON customer_voice_insights(category);
CREATE INDEX IF NOT EXISTS idx_customer_voice_insights_created_at ON customer_voice_insights(created_at);

-- Add RLS policies for customer_voice_insights
ALTER TABLE customer_voice_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to authenticated users" 
ON customer_voice_insights FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow insert access to authenticated users" 
ON customer_voice_insights FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow update access to authenticated users" 
ON customer_voice_insights FOR UPDATE 
TO authenticated 
USING (true);
