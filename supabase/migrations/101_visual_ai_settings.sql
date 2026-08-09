-- Phase 5: Visual AI Engine Configuration Schema Updates
-- Add Visual AI columns to the ai_assistant_settings table

ALTER TABLE ai_assistant_settings 
ADD COLUMN IF NOT EXISTS visual_ai_provider VARCHAR(50) DEFAULT 'dalle-3',
ADD COLUMN IF NOT EXISTS visual_ai_model VARCHAR(100) DEFAULT 'dall-e-3',
ADD COLUMN IF NOT EXISTS visual_ai_api_key_encrypted TEXT,
ADD COLUMN IF NOT EXISTS visual_ai_enabled BOOLEAN DEFAULT FALSE;

-- Also add an AI Accuracy Score field to ai_agent_operations for Phase 8
ALTER TABLE ai_agent_operations
ADD COLUMN IF NOT EXISTS actual_impact JSONB,
ADD COLUMN IF NOT EXISTS ai_accuracy_score NUMERIC(5, 2);

-- Creative Asset Library Table
CREATE TABLE IF NOT EXISTS meta_ad_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('IMAGE', 'VIDEO')),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  source VARCHAR(50) NOT NULL CHECK (source IN ('MANUAL_UPLOAD', 'AI_GENERATED')),
  ai_prompt TEXT,
  approval_status VARCHAR(50) DEFAULT 'DRAFT' CHECK (approval_status IN ('DRAFT', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE meta_ad_assets ENABLE ROW LEVEL SECURITY;

-- Policies for meta_ad_assets
CREATE POLICY "Users can view their account's assets"
  ON meta_ad_assets FOR SELECT
  USING (is_account_member(account_id));

CREATE POLICY "Users can insert assets for their account"
  ON meta_ad_assets FOR INSERT
  WITH CHECK (is_account_member(account_id));

CREATE POLICY "Users can update their account's assets"
  ON meta_ad_assets FOR UPDATE
  USING (is_account_member(account_id));

CREATE POLICY "Users can delete their account's assets"
  ON meta_ad_assets FOR DELETE
  USING (is_account_member(account_id));
