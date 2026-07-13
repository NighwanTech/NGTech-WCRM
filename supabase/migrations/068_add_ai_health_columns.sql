-- ============================================================
-- Migration 068: Add ALL missing AI health columns
-- Fixes: "column conversations.ai_summary does not exist"
-- This is the root cause of both Customer Health and AI Summary
-- sections being broken on the Contact Profile page.
-- ============================================================

-- ai_summary (should have been added by 027 but was never run)
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- ai_sentiment and ai_lead_score (should have been added by 030)
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_sentiment TEXT CHECK (ai_sentiment IN ('positive', 'neutral', 'negative'));
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_lead_score TEXT CHECK (ai_lead_score IN ('cold', 'warm', 'hot'));

-- priority and ai_confidence (new columns for the enhanced AI analysis)
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('high', 'medium', 'low'));
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100);