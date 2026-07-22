-- ============================================================
-- NGTech WCRM — Consolidated Migration
-- Generated: 22 July 2026
-- Combines all 77 migration files (001 through 078)
-- Run this ONCE on a fresh self-hosted Supabase instance.
-- ============================================================


-- ============================================================
-- SOURCE: 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- Idempotent migration — safe to run multiple times.
-- Uses IF NOT EXISTS for tables/indexes and DROP IF EXISTS
-- for policies/triggers (Postgres has no CREATE POLICY IF NOT EXISTS).
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- CONTACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  email TEXT,
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own contacts" ON contacts;
CREATE POLICY "Users can manage own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own tags" ON tags;
CREATE POLICY "Users can manage own tags" ON tags FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CONTACT_TAGS (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_tags_contact ON contact_tags(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_tags_tag ON contact_tags(tag_id);

ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage contact tags" ON contact_tags;
CREATE POLICY "Users can manage contact tags" ON contact_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM contacts WHERE contacts.id = contact_tags.contact_id AND contacts.user_id = auth.uid()));

-- ============================================================
-- CUSTOM_FIELDS
-- ============================================================
CREATE TABLE IF NOT EXISTS custom_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text',
  field_options JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own custom fields" ON custom_fields;
CREATE POLICY "Users can manage own custom fields" ON custom_fields FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CONTACT_CUSTOM_VALUES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_custom_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  custom_field_id UUID NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_id, custom_field_id)
);

ALTER TABLE contact_custom_values ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage custom values" ON contact_custom_values;
CREATE POLICY "Users can manage custom values" ON contact_custom_values FOR ALL
  USING (EXISTS (SELECT 1 FROM contacts WHERE contacts.id = contact_custom_values.contact_id AND contacts.user_id = auth.uid()));

-- ============================================================
-- CONTACT_NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own notes" ON contact_notes;
CREATE POLICY "Users can manage own notes" ON contact_notes FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'closed')),
  assigned_agent_id UUID,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_contact_id ON conversations(contact_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own conversations" ON conversations;
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'agent', 'bot')),
  sender_id UUID,
  content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'document', 'audio', 'video', 'location', 'template')),
  content_text TEXT,
  media_url TEXT,
  template_name TEXT,
  message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_message_id ON messages(message_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Service role can insert messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR ALL
  USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid()));
CREATE POLICY "Service role can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- ============================================================
-- WHATSAPP_CONFIG
-- ============================================================
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number_id TEXT NOT NULL,
  waba_id TEXT,
  access_token TEXT NOT NULL,
  verify_token TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected')),
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own config" ON whatsapp_config;
CREATE POLICY "Users can manage own config" ON whatsapp_config FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- MESSAGE_TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Marketing' CHECK (category IN ('Marketing', 'Utility', 'Authentication')),
  language TEXT DEFAULT 'en_US',
  header_type TEXT CHECK (header_type IN ('text', 'image', 'video', 'document')),
  header_content TEXT,
  body_text TEXT NOT NULL,
  footer_text TEXT,
  buttons JSONB,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own templates" ON message_templates;
CREATE POLICY "Users can manage own templates" ON message_templates FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- PIPELINES
-- ============================================================
CREATE TABLE IF NOT EXISTS pipelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own pipelines" ON pipelines;
CREATE POLICY "Users can manage own pipelines" ON pipelines FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- PIPELINE_STAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_stages_pipeline ON pipeline_stages(pipeline_id);

ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage pipeline stages" ON pipeline_stages;
CREATE POLICY "Users can manage pipeline stages" ON pipeline_stages FOR ALL
  USING (EXISTS (SELECT 1 FROM pipelines WHERE pipelines.id = pipeline_stages.pipeline_id AND pipelines.user_id = auth.uid()));

-- ============================================================
-- DEALS
-- ============================================================
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES pipeline_stages(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  conversation_id UUID REFERENCES conversations(id),
  title TEXT NOT NULL,
  value NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  notes TEXT,
  expected_close_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_pipeline ON deals(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage_id);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own deals" ON deals;
CREATE POLICY "Users can manage own deals" ON deals FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- BROADCASTS
-- ============================================================
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_language TEXT NOT NULL DEFAULT 'en_US',
  template_variables JSONB,
  audience_filter JSONB,
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own broadcasts" ON broadcasts;
CREATE POLICY "Users can manage own broadcasts" ON broadcasts FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- BROADCAST_RECIPIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS broadcast_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broadcast_id UUID NOT NULL REFERENCES broadcasts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'replied', 'failed')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_broadcast_recipients_broadcast ON broadcast_recipients(broadcast_id);

ALTER TABLE broadcast_recipients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage broadcast recipients" ON broadcast_recipients;
CREATE POLICY "Users can manage broadcast recipients" ON broadcast_recipients FOR ALL
  USING (EXISTS (SELECT 1 FROM broadcasts WHERE broadcasts.id = broadcast_recipients.broadcast_id AND broadcasts.user_id = auth.uid()));

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at — drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
DROP TRIGGER IF EXISTS set_updated_at ON contacts;
DROP TRIGGER IF EXISTS set_updated_at ON conversations;
DROP TRIGGER IF EXISTS set_updated_at ON whatsapp_config;
DROP TRIGGER IF EXISTS set_updated_at ON message_templates;
DROP TRIGGER IF EXISTS set_updated_at ON deals;
DROP TRIGGER IF EXISTS set_updated_at ON broadcasts;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON whatsapp_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON broadcasts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- Uses SECURITY DEFINER with owner=postgres (bypasses RLS).
-- EXCEPTION block ensures signup still succeeds even if profile
-- insert fails — profile can be created later if needed.
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ENABLE REALTIME for key tables (idempotent via DO block)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
  END IF;
END $$;


-- ============================================================
-- SOURCE: 002_pipelines_enhancements.sql
-- ============================================================

-- ============================================================
-- Pipeline enhancements:
--   * deals.assigned_to — optional FK to profiles.id
--   * deals.status — CHECK constraint ('open', 'won', 'lost')
--     (replaces the old default 'active' with spec-compliant values)
--
-- Idempotent: safe to run multiple times.
-- ============================================================

-- Add assigned_to (nullable, FK to profiles)
ALTER TABLE deals
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_deals_assigned_to ON deals(assigned_to);

-- Normalize status values: any existing 'active' row becomes 'open'
UPDATE deals SET status = 'open' WHERE status = 'active' OR status IS NULL;

-- Replace the old default and enforce allowed values
ALTER TABLE deals ALTER COLUMN status SET DEFAULT 'open';

-- Drop prior CHECK if any (none in 001, but be idempotent)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'deals_status_check' AND conrelid = 'deals'::regclass
  ) THEN
    ALTER TABLE deals DROP CONSTRAINT deals_status_check;
  END IF;
END $$;

ALTER TABLE deals
  ADD CONSTRAINT deals_status_check CHECK (status IN ('open', 'won', 'lost'));


-- ============================================================
-- SOURCE: 003_broadcast_recipient_wamid.sql
-- ============================================================

-- ============================================================
-- Broadcast recipient correlation + aggregate counts
--
-- Problem this solves:
--   * broadcast_recipients had no column to correlate with Meta's
--     message id, so webhook status updates (sent/delivered/read)
--     could not be mirrored into the recipient row and the broadcast
--     aggregate counts never advanced.
--   * aggregate counts on `broadcasts` (sent/delivered/read/replied/
--     failed) were updated ad-hoc by the sender, which drifted quickly
--     once webhooks arrived out of band.
--
-- This migration:
--   1. Adds whatsapp_message_id (+ unique index) so webhooks can find
--      a recipient given Meta's message id.
--   2. Adds a composite index on (broadcast_id, status) so the
--      aggregate trigger's COUNT(*) FILTER scans are fast.
--   3. Installs an AFTER INSERT/UPDATE/DELETE trigger on
--      broadcast_recipients that re-aggregates the parent broadcasts
--      row. Keeps writer code trivial — the webhook + hook only touch
--      the recipient row; counts stay consistent automatically.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

ALTER TABLE broadcast_recipients
  ADD COLUMN IF NOT EXISTS whatsapp_message_id TEXT;

-- UNIQUE so webhook retries can't create duplicate correlations.
CREATE UNIQUE INDEX IF NOT EXISTS idx_broadcast_recipients_wamid
  ON broadcast_recipients (whatsapp_message_id)
  WHERE whatsapp_message_id IS NOT NULL;

-- Fast path for the aggregate trigger's COUNT(*) FILTER subqueries.
CREATE INDEX IF NOT EXISTS idx_broadcast_recipients_broadcast_status
  ON broadcast_recipients (broadcast_id, status);

-- ============================================================
-- Aggregate trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.recompute_broadcast_counts(bid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE broadcasts b SET
    sent_count      = agg.sent_count,
    delivered_count = agg.delivered_count,
    read_count      = agg.read_count,
    replied_count   = agg.replied_count,
    failed_count    = agg.failed_count,
    updated_at      = NOW()
  FROM (
    SELECT
      COUNT(*) FILTER (WHERE status IN ('sent','delivered','read','replied')) AS sent_count,
      COUNT(*) FILTER (WHERE status IN ('delivered','read','replied'))        AS delivered_count,
      COUNT(*) FILTER (WHERE status IN ('read','replied'))                    AS read_count,
      COUNT(*) FILTER (WHERE status = 'replied')                              AS replied_count,
      COUNT(*) FILTER (WHERE status = 'failed')                               AS failed_count
    FROM broadcast_recipients
    WHERE broadcast_id = bid
  ) agg
  WHERE b.id = bid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.broadcast_recipient_aggregate_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recompute_broadcast_counts(OLD.broadcast_id);
    RETURN OLD;
  END IF;

  -- INSERT or UPDATE — only recompute when status changed (or on fresh insert)
  IF TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM public.recompute_broadcast_counts(NEW.broadcast_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS broadcast_recipients_aggregate ON broadcast_recipients;
CREATE TRIGGER broadcast_recipients_aggregate
AFTER INSERT OR UPDATE OR DELETE ON broadcast_recipients
FOR EACH ROW EXECUTE FUNCTION public.broadcast_recipient_aggregate_trigger();


-- ============================================================
-- SOURCE: 004_contact_delete_set_null.sql
-- ============================================================

-- ============================================================
-- Allow contact deletion without wiping history.
--
-- broadcast_recipients.contact_id and deals.contact_id were declared
-- NOT NULL REFERENCES contacts(id) with no ON DELETE action, so
-- Postgres defaults to NO ACTION. The first time a user tried to
-- delete a contact that had ever received a broadcast or been
-- attached to a deal, the delete failed with:
--
--   ERROR 23503: update or delete on table "contacts" violates
--   foreign key constraint ... on table <other>
--
-- CASCADE is the wrong fix — it would silently wipe historical
-- broadcast recipient rows (breaking audit + retroactively moving
-- broadcasts.sent_count / delivered_count / read_count etc. via the
-- aggregate trigger) and deal rows.
--
-- SET NULL is the right fix: history rows survive with a NULL
-- contact_id. The UI is already null-safe (contact?.name ?? 'Unknown',
-- contact?.phone, etc.).
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ── broadcast_recipients.contact_id ────────────────────────────
ALTER TABLE broadcast_recipients
  ALTER COLUMN contact_id DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'broadcast_recipients_contact_id_fkey'
      AND conrelid = 'broadcast_recipients'::regclass
  ) THEN
    ALTER TABLE broadcast_recipients
      DROP CONSTRAINT broadcast_recipients_contact_id_fkey;
  END IF;
END $$;

ALTER TABLE broadcast_recipients
  ADD CONSTRAINT broadcast_recipients_contact_id_fkey
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL;

-- ── deals.contact_id ───────────────────────────────────────────
ALTER TABLE deals
  ALTER COLUMN contact_id DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'deals_contact_id_fkey'
      AND conrelid = 'deals'::regclass
  ) THEN
    ALTER TABLE deals
      DROP CONSTRAINT deals_contact_id_fkey;
  END IF;
END $$;

ALTER TABLE deals
  ADD CONSTRAINT deals_contact_id_fkey
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
    ON DELETE SET NULL;


-- ============================================================
-- SOURCE: 005_broadcast_counts_incremental.sql
-- ============================================================

-- ============================================================
-- Incremental broadcast aggregate trigger.
--
-- Migration 003 installed a trigger that recomputed every counter
-- (sent/delivered/read/replied/failed) via COUNT(*) FILTER on every
-- row change. For a 10k-recipient broadcast, the send loop produces
-- 10k INSERTs + 10k UPDATEs = 20k full aggregate scans, each walking
-- the (broadcast_id, status) index. Workable at small scale, but
-- O(n²) overall.
--
-- This migration replaces that with an incremental trigger that
-- adjusts the parent broadcast's counts by ±1 based on the OLD →
-- NEW.status delta. O(1) per recipient change; no scans at all.
--
-- Semantic model (same as the lib/broadcast-status.ts "forward-only
-- ladder" in the webhook):
--   sent_count       = recipients whose status is at or past 'sent'
--   delivered_count  = ... at or past 'delivered'
--   read_count       = ... at or past 'read'
--   replied_count    = status = 'replied'
--   failed_count     = status = 'failed'
--
-- A webhook that advances a recipient pending → sent → delivered →
-- read → replied bumps every rung it crosses by 1. Going to 'failed'
-- only bumps failed_count (and can only happen from pending / sent,
-- enforced in the webhook).
--
-- Keeps the safety net: a public recompute_broadcast_counts() SQL
-- function is retained so ops can run it manually if counts ever
-- drift (e.g. after bulk DB surgery).
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- Delta a single column by +1 / -1.
CREATE OR REPLACE FUNCTION public._bcast_bump(bid UUID, col TEXT, delta INT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE broadcasts SET %I = GREATEST(0, %I + $1), updated_at = NOW() WHERE id = $2',
    col, col
  ) USING delta, bid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Columns this recipient's status contributes to.
CREATE OR REPLACE FUNCTION public._bcast_cols_for_status(s TEXT)
RETURNS TEXT[] AS $$
BEGIN
  -- 'pending' contributes to nothing.
  IF s = 'pending' THEN RETURN ARRAY[]::TEXT[]; END IF;
  IF s = 'sent'      THEN RETURN ARRAY['sent_count']; END IF;
  IF s = 'delivered' THEN RETURN ARRAY['sent_count','delivered_count']; END IF;
  IF s = 'read'      THEN RETURN ARRAY['sent_count','delivered_count','read_count']; END IF;
  IF s = 'replied'   THEN RETURN ARRAY['sent_count','delivered_count','read_count','replied_count']; END IF;
  IF s = 'failed'    THEN RETURN ARRAY['failed_count']; END IF;
  RETURN ARRAY[]::TEXT[];
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Replace the trigger body with the incremental version.
CREATE OR REPLACE FUNCTION public.broadcast_recipient_aggregate_trigger()
RETURNS TRIGGER AS $$
DECLARE
  old_cols TEXT[];
  new_cols TEXT[];
  c TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    new_cols := _bcast_cols_for_status(NEW.status);
    FOREACH c IN ARRAY new_cols LOOP
      PERFORM _bcast_bump(NEW.broadcast_id, c, 1);
    END LOOP;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    old_cols := _bcast_cols_for_status(OLD.status);
    FOREACH c IN ARRAY old_cols LOOP
      PERFORM _bcast_bump(OLD.broadcast_id, c, -1);
    END LOOP;
    RETURN OLD;
  END IF;

  -- UPDATE: only care if status changed.
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    old_cols := _bcast_cols_for_status(OLD.status);
    new_cols := _bcast_cols_for_status(NEW.status);
    -- Subtract the old contributions, add the new.
    FOREACH c IN ARRAY old_cols LOOP
      PERFORM _bcast_bump(NEW.broadcast_id, c, -1);
    END LOOP;
    FOREACH c IN ARRAY new_cols LOOP
      PERFORM _bcast_bump(NEW.broadcast_id, c, 1);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger itself remains the same (INSERT/UPDATE/DELETE) — just its
-- body has been replaced.

-- Safety net — rebuild counts from scratch. Retained as-is so ops can
-- run it on demand if something ever drifts. Matches the incremental
-- trigger's semantic model exactly.
CREATE OR REPLACE FUNCTION public.recompute_broadcast_counts(bid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE broadcasts b SET
    sent_count      = agg.sent_count,
    delivered_count = agg.delivered_count,
    read_count      = agg.read_count,
    replied_count   = agg.replied_count,
    failed_count    = agg.failed_count,
    updated_at      = NOW()
  FROM (
    SELECT
      COUNT(*) FILTER (WHERE status IN ('sent','delivered','read','replied')) AS sent_count,
      COUNT(*) FILTER (WHERE status IN ('delivered','read','replied'))        AS delivered_count,
      COUNT(*) FILTER (WHERE status IN ('read','replied'))                    AS read_count,
      COUNT(*) FILTER (WHERE status = 'replied')                              AS replied_count,
      COUNT(*) FILTER (WHERE status = 'failed')                               AS failed_count
    FROM broadcast_recipients
    WHERE broadcast_id = bid
  ) agg
  WHERE b.id = bid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================
-- SOURCE: 006_automations.sql
-- ============================================================

-- ============================================================
-- 006_automations.sql — Automations feature
--
-- Idempotent migration — safe to run multiple times.
-- Follows the same conventions as 001_initial_schema.sql:
--   IF NOT EXISTS on tables/indexes, DROP IF EXISTS before
--   re-creating policies/triggers (Postgres has no
--   CREATE POLICY IF NOT EXISTS).
-- ============================================================

-- ============================================================
-- AUTOMATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  execution_count INTEGER NOT NULL DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automations_user_id ON automations(user_id);
-- Partial index tuned for the engine's hot path: find active automations
-- whose trigger_type matches the fired event. RLS then narrows by user_id.
CREATE INDEX IF NOT EXISTS idx_automations_active_trigger
  ON automations(trigger_type) WHERE is_active = TRUE;

ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own automations" ON automations;
CREATE POLICY "Users can manage own automations" ON automations FOR ALL
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_updated_at ON automations;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTOMATION_STEPS
--
-- `position`       — order within parent scope (root scope or a branch).
-- `parent_step_id` — NULL for root-level steps; set to the Condition
--                    step's id for steps that live inside one of its
--                    branches.
-- `branch`         — NULL for root steps. For children of a Condition,
--                    'yes' or 'no' identifying which path.
-- ============================================================
CREATE TABLE IF NOT EXISTS automation_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  parent_step_id UUID REFERENCES automation_steps(id) ON DELETE CASCADE,
  branch TEXT CHECK (branch IN ('yes', 'no')),
  step_type TEXT NOT NULL,
  step_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_steps_automation_id
  ON automation_steps(automation_id, position);
CREATE INDEX IF NOT EXISTS idx_automation_steps_parent
  ON automation_steps(parent_step_id) WHERE parent_step_id IS NOT NULL;

ALTER TABLE automation_steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage steps of own automations" ON automation_steps;
CREATE POLICY "Users can manage steps of own automations" ON automation_steps FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM automations a
      WHERE a.id = automation_steps.automation_id
        AND a.user_id = auth.uid()
    )
  );

-- ============================================================
-- AUTOMATION_LOGS
--
-- user_id is denormalized for simple RLS; contact_id is nullable so
-- history survives contact deletion (mirrors migration 004's pattern
-- on broadcast_recipients / deals).
-- ============================================================
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  trigger_event TEXT NOT NULL,
  steps_executed JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_logs_automation
  ON automation_logs(automation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_automation_logs_user ON automation_logs(user_id);

ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own automation logs" ON automation_logs;
CREATE POLICY "Users can view own automation logs" ON automation_logs FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- AUTOMATION_PENDING_EXECUTIONS
--
-- Queue row created when a running automation hits a `wait` step.
-- The cron endpoint drains rows where run_at <= now() and status =
-- 'pending', flips them to 'running', and resumes the automation
-- from `next_step_position` with the saved `context` jsonb.
--
-- Service-role only — writes never originate from the browser, and
-- the engine uses the service-role client. No user policy exposed.
-- ============================================================
CREATE TABLE IF NOT EXISTS automation_pending_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  log_id UUID REFERENCES automation_logs(id) ON DELETE CASCADE,
  parent_step_id UUID REFERENCES automation_steps(id) ON DELETE SET NULL,
  branch TEXT CHECK (branch IN ('yes', 'no')),
  next_step_position INTEGER NOT NULL,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'done', 'failed')),
  run_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automation_pending_due
  ON automation_pending_executions(run_at) WHERE status = 'pending';

ALTER TABLE automation_pending_executions ENABLE ROW LEVEL SECURITY;
-- No SELECT/INSERT/UPDATE/DELETE policy for authenticated users — all
-- access is server-side via the service-role key.


-- ============================================================
-- SOURCE: 007_automations_increment_counter.sql
-- ============================================================

-- ============================================================
-- 007_automations_increment_counter.sql
--
-- Atomic increment of automations.execution_count + refresh of
-- last_executed_at. Called via PostgREST RPC from the engine.
--
-- Before this, the engine did a read-modify-write:
--   UPDATE automations SET execution_count = <cached + 1> WHERE id = ...
-- so two concurrent dispatches (e.g. the same automation firing for
-- two different contacts in the same second) could both read N and
-- both write N+1, permanently losing one count.
--
-- Idempotent — safe to re-run.
-- ============================================================

CREATE OR REPLACE FUNCTION increment_automation_execution_count(p_automation_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE automations
  SET
    execution_count = execution_count + 1,
    last_executed_at = NOW()
  WHERE id = p_automation_id;
$$;

-- Only the service role needs to call this (engine uses the
-- service-role client). Explicitly lock anon / authenticated out so
-- an authenticated user can't juice someone else's counter via RPC.
REVOKE ALL ON FUNCTION increment_automation_execution_count(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION increment_automation_execution_count(UUID) FROM anon;
REVOKE ALL ON FUNCTION increment_automation_execution_count(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION increment_automation_execution_count(UUID) TO service_role;


-- ============================================================
-- SOURCE: 008_profile_avatars_storage.sql
-- ============================================================

-- ============================================================
-- 008_profile_avatars_storage.sql
--
-- Creates the `avatars` Supabase Storage bucket and the RLS policies
-- that let each user manage only their own avatar file while letting
-- everyone read (so rendering <img> tags without signed URLs works).
--
-- File path convention used by the app:
--   avatars/{auth.uid()}/avatar-<timestamp>.<ext>
-- The policies rely on the first path segment matching auth.uid()::text.
--
-- Idempotent — safe to re-run.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  2097152, -- 2 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Policies live on storage.objects. Drop-if-exists because Postgres
-- has no CREATE POLICY IF NOT EXISTS, and we want this migration to
-- re-run cleanly.
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
CREATE POLICY "Avatars are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- SOURCE: 009_message_actions.sql
-- ============================================================

-- ============================================================
-- Chat actions: reply linkage + reactions
--
-- Adds two things the chat UI now needs:
--
--   1. `messages.reply_to_message_id` — a self-FK so a message can
--      point at the message it replies to. We use the internal UUID
--      (not Meta's message_id text), because Meta IDs aren't unique
--      across phone numbers and can't be FK-constrained. The webhook
--      resolves `context.id` from Meta into our internal UUID before
--      writing. ON DELETE SET NULL — a deleted parent must not nuke
--      its replies (which today never happens, but the constraint
--      should match intent).
--
--   2. `message_reactions` table — one row per (message, actor).
--      Reactions arrive concurrently from agents (UI) and customers
--      (webhook). A row-level uniqueness constraint enforces "one
--      reaction per actor per message" without read-modify-write
--      games on a JSONB column.
--
--      `conversation_id` is denormalised purely so Supabase Realtime
--      can filter on it with a plain `eq`. Realtime can't join.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ============================================================
-- 1. Reply linkage on messages
-- ============================================================
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS reply_to_message_id UUID
  REFERENCES messages(id) ON DELETE SET NULL;

-- Partial index — most messages aren't replies, so skip nulls.
CREATE INDEX IF NOT EXISTS idx_messages_reply_to
  ON messages(reply_to_message_id)
  WHERE reply_to_message_id IS NOT NULL;

-- ============================================================
-- 2. message_reactions
-- ============================================================
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('customer', 'agent')),
  actor_id UUID,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (message_id, actor_type, actor_id)
);

CREATE INDEX IF NOT EXISTS idx_message_reactions_conversation
  ON message_reactions(conversation_id);

CREATE INDEX IF NOT EXISTS idx_message_reactions_message
  ON message_reactions(message_id);

ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see reactions on their conversations" ON message_reactions;
CREATE POLICY "Users see reactions on their conversations" ON message_reactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = message_reactions.conversation_id
      AND c.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users insert reactions on their conversations" ON message_reactions;
CREATE POLICY "Users insert reactions on their conversations" ON message_reactions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = message_reactions.conversation_id
      AND c.user_id = auth.uid()
  ));

-- Agents may remove their own reactions. Customer reactions are managed
-- by the webhook (service-role bypass), not the UI.
DROP POLICY IF EXISTS "Users delete their own agent reactions" ON message_reactions;
CREATE POLICY "Users delete their own agent reactions" ON message_reactions FOR DELETE
  USING (
    actor_type = 'agent'
    AND actor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = message_reactions.conversation_id
        AND c.user_id = auth.uid()
    )
  );

-- Agents may swap their own reaction emoji (UPDATE path is also used by
-- the upsert in /api/whatsapp/react).
DROP POLICY IF EXISTS "Users update their own agent reactions" ON message_reactions;
CREATE POLICY "Users update their own agent reactions" ON message_reactions FOR UPDATE
  USING (
    actor_type = 'agent'
    AND actor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = message_reactions.conversation_id
        AND c.user_id = auth.uid()
    )
  );

-- Realtime — let the thread subscribe filtered by conversation_id.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'message_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
  END IF;
END $$;


-- ============================================================
-- SOURCE: 010_flows.sql
-- ============================================================

-- ============================================================
-- Conversational Flows: stateful, branching WhatsApp chatbot.
--
-- What this migration adds:
--
--   1. `flows` — the definition envelope (name, trigger config,
--      entry node, fallback policy, status). One row per authored bot.
--
--   2. `flow_nodes` — the graph rows. Edges live INSIDE each node's
--      `config` JSONB (e.g. each button row carries its own
--      `next_node_key`). Why edges-in-config rather than a separate
--      `flow_edges` table:
--        - The runner only ever asks "given current node X, where does
--          reply Y go?" — that's a single-row lookup with the JSON
--          already on the row. Splitting edges out forces a join per
--          inbound message.
--        - The builder's natural unit of edit is the node ("change this
--          button's label and target"); a side table would force
--          coordinated inserts/deletes on every save.
--      Cross-node integrity is enforced at save-time by the validator
--      (mirrors what `automation_steps`/`validate.ts` already does).
--
--      `node_key` is a STABLE STRING (e.g. "menu_existing"), not the
--      UUID. Edge targets reference node_key, which means:
--        - Cloning a flow doesn't require UUID rewriting in JSON edges.
--        - Templates ship with human-readable keys.
--        - Direct DB inspection is debuggable.
--      The (flow_id, node_key) UNIQUE constraint guarantees lookup
--      determinism.
--
--   3. `flow_runs` — per-contact runtime state machine. The linchpin
--      is the partial unique index `idx_one_active_run_per_contact`:
--      at most one ACTIVE run per (user_id, contact_id). Two concurrent
--      webhook deliveries trying to start a run both attempt INSERT;
--      the second fails with 23505 and the runner catches & exits.
--      No locking required.
--
--   4. `flow_run_events` — append-only audit. Used by the runner for
--      idempotency (refuses to advance twice on the same Meta
--      message_id) and by the future run-history viewer.
--
--   5. Widens `messages.content_type` CHECK to allow 'interactive', and
--      adds `messages.interactive_reply_id`. With this, button/list
--      taps become first-class message rows with a queryable reply id
--      instead of getting silently coerced into the "Unsupported
--      message type" fallback in parseMessageContent.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ============================================================
-- 1. Messages table — widen content_type, add interactive_reply_id
-- ============================================================

-- Drop & re-add the CHECK constraint to add 'interactive' as an allowed
-- value. Migration 001 named it `messages_content_type_check` (Postgres
-- default for an inline CHECK on a TEXT column).
ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_content_type_check;

ALTER TABLE messages
  ADD CONSTRAINT messages_content_type_check
  CHECK (content_type IN (
    'text', 'image', 'document', 'audio', 'video',
    'location', 'template', 'interactive'
  ));

-- Reply id of the button / list row the customer tapped. NULL for
-- everything that isn't an interactive reply. No FK — Meta button ids
-- are arbitrary user-chosen strings, not row references.
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS interactive_reply_id TEXT;

-- ============================================================
-- 2. flows
-- ============================================================
CREATE TABLE IF NOT EXISTS flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'archived')),
  trigger_type TEXT NOT NULL
    CHECK (trigger_type IN ('keyword', 'first_inbound_message', 'manual')),
  trigger_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- References `flow_nodes.node_key` (a string, not the UUID). NULL
  -- while the flow is being authored; required before activation
  -- (enforced by the validator, not at the DB level so drafts can save).
  entry_node_id TEXT,
  fallback_policy JSONB NOT NULL DEFAULT
    '{"on_unknown_reply":"reprompt","max_reprompts":2,"on_timeout_hours":24,"on_exhaust":"handoff"}'::jsonb,
  execution_count INTEGER NOT NULL DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Active-only lookups dominate the runner's hot path. Partial index
-- keeps it small even when archived flows accumulate.
CREATE INDEX IF NOT EXISTS idx_flows_active_trigger
  ON flows(user_id, trigger_type)
  WHERE status = 'active';

ALTER TABLE flows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own flows" ON flows;
CREATE POLICY "Users can manage own flows" ON flows FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. flow_nodes
-- ============================================================
CREATE TABLE IF NOT EXISTS flow_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  node_key TEXT NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN (
    'start',
    'send_buttons',
    'send_list',
    'send_message',
    'collect_input',
    'condition',
    'set_tag',
    'handoff',
    'http_fetch',
    'end'
  )),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Reserved for the v2 react-flow canvas. v1 list editor leaves both
  -- at 0; carrying the columns now avoids a follow-up migration when
  -- the canvas ships.
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (flow_id, node_key)
);

CREATE INDEX IF NOT EXISTS idx_flow_nodes_flow
  ON flow_nodes(flow_id);

ALTER TABLE flow_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage nodes on their flows" ON flow_nodes;
CREATE POLICY "Users manage nodes on their flows" ON flow_nodes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM flows f
    WHERE f.id = flow_nodes.flow_id
      AND f.user_id = auth.uid()
  ));

-- ============================================================
-- 4. flow_runs
-- ============================================================
CREATE TABLE IF NOT EXISTS flow_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- contact_id intentionally SET NULL on delete (matches the
  -- automation_logs / broadcast_recipients pattern in migration 004):
  -- deleting a contact must not erase the historical audit trail.
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active',           -- currently awaiting customer input
    'completed',        -- reached an end node naturally
    'handed_off',       -- ended via a handoff node
    'timed_out',        -- swept by the cron after fallback_policy.on_timeout_hours
    'paused_by_agent',  -- an agent manually replied; flow yielded
    'failed'            -- runner hit an unrecoverable error
  )),
  current_node_key TEXT,
  last_prompt_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  -- Captured collect_input values + http_fetch responses. Interpolated
  -- into downstream node configs at advance time.
  vars JSONB NOT NULL DEFAULT '{}'::jsonb,
  reprompt_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_advanced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  end_reason TEXT
);

-- Linchpin of idempotency / concurrency safety. At most one active run
-- per (user_id, contact_id). Two concurrent webhook deliveries each
-- trying to start a run will collide on this index; the second INSERT
-- fails with 23505 and the runner catches & returns consumed:true.
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_run_per_contact
  ON flow_runs(user_id, contact_id)
  WHERE status = 'active';

-- Cron sweep query: "find active runs older than X hours" needs to be
-- index-supported so the sweeper stays cheap as flow volume grows.
CREATE INDEX IF NOT EXISTS idx_flow_runs_active_advanced
  ON flow_runs(last_advanced_at)
  WHERE status = 'active';

-- Detail / history page queries: "list runs for this flow, newest first".
CREATE INDEX IF NOT EXISTS idx_flow_runs_flow_started
  ON flow_runs(flow_id, started_at DESC);

ALTER TABLE flow_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own flow runs" ON flow_runs;
CREATE POLICY "Users see own flow runs" ON flow_runs FOR SELECT
  USING (auth.uid() = user_id);

-- The runner uses service_role for all writes; users never INSERT /
-- UPDATE / DELETE flow_runs from the client. Omitting those policies
-- keeps the surface tight (mirrors automation_pending_executions).

-- ============================================================
-- 5. flow_run_events
-- ============================================================
CREATE TABLE IF NOT EXISTS flow_run_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_run_id UUID NOT NULL REFERENCES flow_runs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'started',
    'node_entered',
    'message_sent',
    'reply_received',
    'fallback_fired',
    'handoff',
    'timeout',
    'error',
    'completed'
  )),
  node_key TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotency check in the runner needs fast lookup by
-- (flow_run_id, event_type, payload->>'meta_message_id'). The runner
-- does the JSONB extraction client-side; index just needs the first
-- two columns to narrow.
CREATE INDEX IF NOT EXISTS idx_flow_run_events_run_type
  ON flow_run_events(flow_run_id, event_type);

-- History viewer: reverse-chronological scan per run.
CREATE INDEX IF NOT EXISTS idx_flow_run_events_run_time
  ON flow_run_events(flow_run_id, created_at DESC);

ALTER TABLE flow_run_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see events on their runs" ON flow_run_events;
CREATE POLICY "Users see events on their runs" ON flow_run_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM flow_runs r
    WHERE r.id = flow_run_events.flow_run_id
      AND r.user_id = auth.uid()
  ));

-- ============================================================
-- 6. updated_at trigger on flows
-- ============================================================
-- Reuses update_updated_at_column() from migration 001. Trigger name
-- matches the convention used on every other table that has one
-- (see migration 001 lines 361-367).
DROP TRIGGER IF EXISTS set_updated_at ON flows;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. Realtime publication
-- ============================================================
-- Add flow_runs so the inbox can render "this contact is in flow X at
-- node Y" live as the runner advances. Other flow tables don't need
-- realtime — the builder reads on demand, the runner is server-side.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'flow_runs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE flow_runs;
  END IF;
END $$;


-- ============================================================
-- SOURCE: 011_profile_beta_features.sql
-- ============================================================

-- ============================================================
-- Per-account beta feature flag column on `profiles`.
--
-- Adds an array of opted-in beta feature keys to each profile row.
-- Currently used to gate the Flows feature (`'flows'`); shape is
-- generic so subsequent betas (e.g. `'ai_replies'`, `'voice_notes'`)
-- can land in this column without another migration.
--
-- Why a per-account flag rather than a global env var:
--   - Self-hosted wacrm instances are multi-user (small teams, shared
--     workspaces). A global flag would force every account on the
--     instance to opt into a not-yet-stable feature simultaneously.
--   - The owner wanted to dogfood the feature on their own account
--     before exposing it to teammates. Flipping a column via
--     Supabase Studio (`UPDATE profiles SET beta_features = ...
--     WHERE user_id = '<theirs>'`) is the lowest-friction toggle.
--   - DB-managed flags survive env rotation, deploy-restart timing,
--     and (since beta_features is a TEXT[]) extend naturally to
--     additional features without further schema work.
--
-- Default is the empty array, so every existing profile row opts
-- out of every beta feature on apply. NOT NULL keeps callers from
-- having to defend against `beta_features == null` at every site.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS beta_features TEXT[]
    NOT NULL
    DEFAULT ARRAY[]::TEXT[];

-- No new RLS policy needed: the existing `Users can view own profile` /
-- `Users can update own profile` policies (migration 001) already gate
-- access to this column. Server-side reads via service_role bypass RLS
-- as they do for every other column.
--
-- No index needed: the column is read on the login codepath (one row
-- lookup by primary key / user_id, both already indexed) and very
-- rarely written.


-- ============================================================
-- SOURCE: 012_flows_increment_counter.sql
-- ============================================================

-- ============================================================
-- 012_flows_increment_counter.sql
--
-- Atomic increment of flows.execution_count + refresh of
-- last_executed_at. Called via PostgREST RPC from the engine.
--
-- Before this, startNewRun did a read-modify-write:
--   UPDATE flows SET execution_count = <cached + 1> WHERE id = ...
-- so two concurrent dispatches (e.g. two webhooks for the same flow
-- starting runs for different contacts in the same second) could both
-- read N and both write N+1, permanently losing one count.
--
-- Mirrors migration 007 for automations — same shape, same security
-- posture. Idempotent: safe to re-run.
-- ============================================================

CREATE OR REPLACE FUNCTION increment_flow_execution_count(p_flow_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE flows
  SET
    execution_count = execution_count + 1,
    last_executed_at = NOW()
  WHERE id = p_flow_id;
$$;

-- Only the service role needs to call this (engine uses the
-- service-role client). Explicitly lock anon / authenticated out so
-- an authenticated user can't juice someone else's counter via RPC.
REVOKE ALL ON FUNCTION increment_flow_execution_count(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION increment_flow_execution_count(UUID) FROM anon;
REVOKE ALL ON FUNCTION increment_flow_execution_count(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION increment_flow_execution_count(UUID) TO service_role;


-- ============================================================
-- SOURCE: 013_whatsapp_config_phone_number_id_unique.sql
-- ============================================================

-- ============================================================
-- whatsapp_config: enforce one user per phone_number_id
--
-- The webhook routes inbound messages by `phone_number_id` and uses
-- `.single()` to find the owning config row. If two users have saved
-- the same `phone_number_id`, `.single()` errors PGRST116 ("multiple
-- rows returned") and the webhook silently drops every inbound
-- message — see issue #136.
--
-- wacrm is single-tenant per WhatsApp number by design (RLS on
-- conversations / messages is `auth.uid() = user_id`, so another user
-- physically cannot read a conversation routed to a different owner).
-- A UNIQUE constraint at the DB level makes that intent enforceable
-- and stops races between the app-level check and the insert.
--
-- ─── On existing data ───────────────────────────────────────────
-- If duplicates already exist in production, this migration FAILS
-- LOUDLY rather than silently dropping rows. Auto-deduping would
-- destroy user data (encrypted tokens, connection state) — the
-- operator has to choose which user keeps the number. To resolve:
--
--   SELECT phone_number_id, array_agg(user_id) AS owners
--   FROM whatsapp_config
--   GROUP BY phone_number_id
--   HAVING count(*) > 1;
--
-- Then DELETE the duplicate rows you don't want to keep and re-run
-- migrations.
--
-- Idempotent — safe to run multiple times once the constraint is in
-- place.
-- ============================================================

-- 1. Fail loudly if duplicates exist. Spelling out the conflicting
--    phone_number_id and the user_ids that own it gives the operator
--    a copy-pasteable starting point.
DO $$
DECLARE
  conflict_count INT;
  sample TEXT;
BEGIN
  SELECT count(*) INTO conflict_count
  FROM (
    SELECT phone_number_id
    FROM whatsapp_config
    GROUP BY phone_number_id
    HAVING count(*) > 1
  ) dupes;

  IF conflict_count > 0 THEN
    SELECT string_agg(
      phone_number_id || ' -> [' || array_to_string(owners, ', ') || ']',
      E'\n  '
    )
    INTO sample
    FROM (
      SELECT phone_number_id, array_agg(user_id::text) AS owners
      FROM whatsapp_config
      GROUP BY phone_number_id
      HAVING count(*) > 1
    ) dupe_detail;

    RAISE EXCEPTION
      E'Cannot add UNIQUE(phone_number_id) on whatsapp_config — % phone_number_id value(s) are claimed by more than one user:\n  %\nDelete the duplicate rows you do not want to keep (see migration comment), then re-run migrations.',
      conflict_count,
      sample;
  END IF;
END $$;

-- 2. Add the UNIQUE constraint. PostgreSQL has no "ADD CONSTRAINT IF
--    NOT EXISTS", so guard via pg_constraint.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'whatsapp_config_phone_number_id_key'
      AND conrelid = 'whatsapp_config'::regclass
  ) THEN
    ALTER TABLE whatsapp_config
      ADD CONSTRAINT whatsapp_config_phone_number_id_key
      UNIQUE (phone_number_id);
  END IF;
END $$;


-- ============================================================
-- SOURCE: 014_message_templates_meta_integration.sql
-- ============================================================

-- ============================================================
-- message_templates: Meta-integration columns + raw-enum status
--
-- Why this exists:
--   The original schema (001) treated message_templates as a local
--   catalog with a TitleCase status ('Draft'|'Pending'|'Approved'|
--   'Rejected'). When the sync route imports from Meta, several of
--   Meta's real statuses (PAUSED, DISABLED, IN_APPEAL, PENDING_REVIEW)
--   got collapsed into the four-bucket TitleCase set — losing
--   information that the upcoming submit / edit / resubmit flows
--   need (e.g. a PAUSED template is recoverable; a DISABLED one is
--   gone for 30 days; an IN_APPEAL one shouldn't be edited).
--
--   This migration switches `status` to the raw Meta enum and adds
--   the columns the submit/webhook/edit flows need:
--
--     - sample_values    JSONB     {body: string[], header: string[]}
--                                  required by Meta for variable templates
--     - meta_template_id TEXT      Meta's id once the template is
--                                  submitted; used as hsm_id on edit/delete
--                                  so we scope to a single language
--     - rejection_reason TEXT      surfaced from webhook on REJECTED
--     - quality_score    TEXT      GREEN | YELLOW | RED, from webhook
--     - header_handle    TEXT      from Resumable Upload, for media headers
--     - header_media_url TEXT      URL fallback for media headers (v1 path)
--     - submission_error TEXT      last 4xx from Meta on submit, for retry
--     - last_submitted_at          rate-limit awareness (100 creates/hour)
--
--   Also adds a unique index on (user_id, name, language) so the sync
--   upsert can match on it instead of select-then-insert, and so users
--   can't create two local rows for the same Meta template variant.
--
--   Buttons CHECK enforces a shape guard (array of objects with a
--   recognised `type`) at the DB level — strict per-type validation
--   lives in the API layer so error messages can be specific.
--
-- Idempotent — safe to re-run.
-- ============================================================

-- 1. New columns. ADD COLUMN IF NOT EXISTS is idempotent.
ALTER TABLE message_templates
  ADD COLUMN IF NOT EXISTS sample_values JSONB,
  ADD COLUMN IF NOT EXISTS meta_template_id TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS quality_score TEXT,
  ADD COLUMN IF NOT EXISTS header_handle TEXT,
  ADD COLUMN IF NOT EXISTS header_media_url TEXT,
  ADD COLUMN IF NOT EXISTS submission_error TEXT,
  ADD COLUMN IF NOT EXISTS last_submitted_at TIMESTAMPTZ;

-- 2. quality_score CHECK — GREEN / YELLOW / RED only (or NULL).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'message_templates_quality_score_check'
      AND conrelid = 'message_templates'::regclass
  ) THEN
    ALTER TABLE message_templates
      ADD CONSTRAINT message_templates_quality_score_check
      CHECK (quality_score IS NULL OR quality_score IN ('GREEN', 'YELLOW', 'RED'));
  END IF;
END $$;

-- 3. status: swap TitleCase enum for raw Meta enum.
--    Order: drop old check → backfill data → add new check → update default.
--    Doing it in this order means rows are momentarily check-free, but
--    the backfill is a single UPDATE so the window is microseconds.
DO $$
BEGIN
  -- Drop the legacy check by introspecting pg_constraint (the original
  -- constraint name from migration 001 is auto-generated; match by
  -- column + table).
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    WHERE c.conrelid = 'message_templates'::regclass
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%status%Draft%Pending%Approved%Rejected%'
  ) THEN
    EXECUTE (
      SELECT 'ALTER TABLE message_templates DROP CONSTRAINT ' || quote_ident(conname)
      FROM pg_constraint c
      WHERE c.conrelid = 'message_templates'::regclass
        AND c.contype = 'c'
        AND pg_get_constraintdef(c.oid) ILIKE '%status%Draft%Pending%Approved%Rejected%'
      LIMIT 1
    );
  END IF;
END $$;

-- Backfill existing rows. Idempotent — already-uppercase rows are no-ops.
UPDATE message_templates SET status = 'DRAFT'    WHERE status = 'Draft';
UPDATE message_templates SET status = 'PENDING'  WHERE status = 'Pending';
UPDATE message_templates SET status = 'APPROVED' WHERE status = 'Approved';
UPDATE message_templates SET status = 'REJECTED' WHERE status = 'Rejected';

-- Add the raw-enum check.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'message_templates_status_meta_check'
      AND conrelid = 'message_templates'::regclass
  ) THEN
    ALTER TABLE message_templates
      ADD CONSTRAINT message_templates_status_meta_check
      CHECK (status IN (
        'DRAFT',
        'PENDING',
        'APPROVED',
        'REJECTED',
        'PAUSED',
        'DISABLED',
        'IN_APPEAL',
        'PENDING_DELETION'
      ));
  END IF;
END $$;

-- New default for fresh inserts.
ALTER TABLE message_templates ALTER COLUMN status SET DEFAULT 'DRAFT';

-- 4. buttons shape guard. Postgres disallows subqueries in CHECK
--    constraints, so we can only assert the outer shape here (is-array
--    + max length). Per-element type validation (recognised `type`
--    values, max counts per type, QUICK_REPLY-vs-CTA exclusivity, URL
--    example required when {{1}} is present) lives in the API
--    validators in src/lib/whatsapp/template-validators.ts — that's
--    where error messages can be specific to the offending button
--    anyway.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'message_templates_buttons_shape_check'
      AND conrelid = 'message_templates'::regclass
  ) THEN
    ALTER TABLE message_templates
      ADD CONSTRAINT message_templates_buttons_shape_check
      CHECK (
        buttons IS NULL
        OR (
          jsonb_typeof(buttons) = 'array'
          AND jsonb_array_length(buttons) <= 10
        )
      );
  END IF;
END $$;

-- 5. Unique index on (user_id, name, language). Fails loudly on
--    duplicates rather than dropping rows — the operator picks which
--    one to keep (same pattern as migration 013).
DO $$
DECLARE
  dupe_count INT;
  sample TEXT;
BEGIN
  SELECT count(*) INTO dupe_count
  FROM (
    SELECT user_id, name, language
    FROM message_templates
    GROUP BY user_id, name, language
    HAVING count(*) > 1
  ) dupes;

  IF dupe_count > 0 THEN
    SELECT string_agg(
      user_id::text || ' / ' || name || ' / ' || COALESCE(language, '(null)') ||
        ' (' || count || ' rows)',
      E'\n  '
    )
    INTO sample
    FROM (
      SELECT user_id, name, language, count(*) AS count
      FROM message_templates
      GROUP BY user_id, name, language
      HAVING count(*) > 1
    ) dupe_detail;

    RAISE EXCEPTION
      E'Cannot add UNIQUE(user_id, name, language) on message_templates — % duplicate combination(s):\n  %\nDelete the rows you do not want to keep, then re-run migrations.',
      dupe_count, sample;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS message_templates_user_name_language_key
  ON message_templates (user_id, name, language);

-- 6. Lookup index for the webhook handler — incoming events identify
--    templates by (waba_id, meta_template_id). meta_template_id is the
--    discriminator we'll match on.
CREATE INDEX IF NOT EXISTS idx_message_templates_meta_template_id
  ON message_templates (meta_template_id)
  WHERE meta_template_id IS NOT NULL;


-- ============================================================
-- SOURCE: 015_whatsapp_config_registration.sql
-- ============================================================

-- ============================================================
-- whatsapp_config: track Meta Cloud API registration state
--
-- Why this exists:
--   Saving a row to whatsapp_config does NOT make a phone number
--   actually receive webhook events from Meta. Two extra Cloud API
--   calls are required:
--
--     POST /{phone_number_id}/register     — subscribes the number
--                                            with a 2FA PIN, makes
--                                            it routable to OUR app
--     POST /{waba_id}/subscribed_apps      — subscribes the WABA
--                                            (one-time per app, but
--                                            idempotent so we can
--                                            call on every save)
--
--   Until those two complete successfully, Meta routes inbound
--   events to whichever app last registered the number (often the
--   one that did Embedded Signup originally). Symptom: a second
--   wacrm user adds a second number under the same WABA, the UI
--   reports "Connected" because metadata verification succeeds,
--   but Meta's activity log shows zero events for that number.
--
--   These columns let the UI distinguish "credentials saved" from
--   "actually live" and let users retry registration without
--   re-entering everything.
--
-- Backfill: every column is nullable. Existing rows survive with
-- NULL values; the UI shows them as "registration status unknown —
-- click Verify Registration" and the diagnostic endpoint fills the
-- timestamps on the next probe.
--
-- Idempotent — safe to re-run.
-- ============================================================

ALTER TABLE whatsapp_config
  ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscribed_apps_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_registration_error TEXT;

-- Index supports the "find all numbers awaiting registration"
-- query a future admin dashboard might want; cheap to maintain.
CREATE INDEX IF NOT EXISTS idx_whatsapp_config_registered_at
  ON whatsapp_config (registered_at)
  WHERE registered_at IS NULL;


-- ============================================================
-- SOURCE: 016_flow_media.sql
-- ============================================================

-- ============================================================
-- 016_flow_media.sql
--
-- Adds support for media nodes in conversational flows:
--
--   1. New 'send_media' value on `flow_nodes.node_type` CHECK
--      constraint. Mirrors the same drop-and-recreate pattern migration
--      010 used to land the original list. The node config lives in
--      JSONB and is shape-checked by the validator + TS types, not the
--      DB.
--
--   2. `flow-media` Supabase Storage bucket where the builder uploads
--      the file the customer will receive. Public bucket so Meta can
--      pull the URL without auth — same trade-off as the avatars
--      bucket (see migration 008). Per-user RLS on writes scopes the
--      bucket so one tenant can't read/overwrite another's media.
--
--      Path convention:
--        flow-media/{auth.uid()}/<timestamp>-<basename>.<ext>
--      First path segment must equal auth.uid()::text — same shape
--      migration 008 uses for avatars so the policy code reads the
--      same.
--
--      Size limit 16 MB — Meta's WhatsApp Cloud API caps documents at
--      100 MB but videos at 16 MB and images at 5 MB; we pick the
--      tightest universal cap that still works for the document case
--      that prompted this feature (PDF invoices / receipts).
--
-- Idempotent — safe to re-run.
-- ============================================================

-- ============================================================
-- 1. flow_nodes.node_type — add 'send_media'
-- ============================================================
ALTER TABLE flow_nodes
  DROP CONSTRAINT IF EXISTS flow_nodes_node_type_check;

ALTER TABLE flow_nodes
  ADD CONSTRAINT flow_nodes_node_type_check
  CHECK (node_type IN (
    'start',
    'send_buttons',
    'send_list',
    'send_message',
    'send_media',
    'collect_input',
    'condition',
    'set_tag',
    'handoff',
    'http_fetch',
    'end'
  ));

-- ============================================================
-- 2. flow-media storage bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'flow-media',
  'flow-media',
  TRUE,
  16777216, -- 16 MB (Meta video cap; documents/images fit under this)
  ARRAY[
    -- Images
    'image/png', 'image/jpeg', 'image/webp',
    -- Videos
    'video/mp4', 'video/3gpp',
    -- Documents
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Policies live on storage.objects. Same drop-then-create pattern as
-- migration 008 (no CREATE POLICY IF NOT EXISTS in Postgres).
DROP POLICY IF EXISTS "Flow media is publicly readable" ON storage.objects;
CREATE POLICY "Flow media is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'flow-media');

DROP POLICY IF EXISTS "Users can upload their own flow media" ON storage.objects;
CREATE POLICY "Users can upload their own flow media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'flow-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own flow media" ON storage.objects;
CREATE POLICY "Users can update their own flow media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'flow-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own flow media" ON storage.objects;
CREATE POLICY "Users can delete their own flow media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'flow-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- SOURCE: 017_account_sharing.sql
-- ============================================================

-- ============================================================
-- 017_account_sharing.sql — Multi-user accounts (foundation)
--
-- Turns wacrm from single-tenant-per-user into multi-tenant-per-
-- account. Every existing user becomes the sole `owner` of a
-- freshly-created account; every existing row is backfilled with
-- that account's id. Post-apply behaviour is identical to before
-- *until* a teammate is invited (which lands in later PRs).
--
-- What this migration does
--   1. Introduces `account_role_enum` and tables `accounts` /
--      `account_invitations`.
--   2. Adds an `is_account_member(account_id, min_role)` SECURITY
--      DEFINER helper used by every policy below.
--   3. Adds `account_id` (+ `account_role` on `profiles`) to every
--      table that previously carried a `user_id` FK to auth.users.
--   4. Backfills one account per existing user and propagates
--      `account_id` to every domain row.
--   5. Drops the old `auth.uid() = user_id` policies and replaces
--      them with membership-checked equivalents. Viewers may read;
--      agents+ may write to operational data; admins+ may write to
--      settings-class tables.
--   6. Swaps `whatsapp_config.UNIQUE(user_id)` for
--      `UNIQUE(account_id)` — one WhatsApp number per account.
--   7. Swaps the `flow_runs` "one active run per (user_id, contact)"
--      unique index for `(account_id, contact_id)`.
--   8. Replaces `handle_new_user` so new signups receive a freshly-
--      created personal account *and* the `owner` role atomically.
--
-- What this migration does NOT touch
--   - `profiles.role TEXT` (legacy, unused) stays. Flag for removal
--     in a later cleanup.
--   - The `user_id` columns on domain tables stay too — they still
--     identify "the agent who owns this row" (assignment, audit).
--     They are *no longer* used for tenancy isolation.
--   - Storage buckets (avatars, flow-media) stay user-scoped. A
--     later migration will rescope flow-media to account paths.
--   - No user-facing UI changes — those are gated separately on
--     `profiles.beta_features` containing 'account_sharing' in the
--     follow-up PRs.
--
-- Idempotent — safe to run multiple times. New columns use
-- IF NOT EXISTS; policies / triggers / indexes are dropped before
-- recreate (Postgres has no CREATE POLICY IF NOT EXISTS).
-- ============================================================

-- ============================================================
-- TYPES
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_role_enum') THEN
    CREATE TYPE account_role_enum AS ENUM ('owner', 'admin', 'agent', 'viewer');
  END IF;
END $$;

-- ============================================================
-- ACCOUNTS
-- ============================================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  -- owner_user_id is denormalised for fast "is this user the owner of
  -- their account" reads and for the one-account-per-user invariant
  -- below. The source of truth for membership is profiles.account_id.
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One account per user (the locked design decision — single
-- membership). Drops automatically if we ever relax to many-to-many.
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_one_per_owner
  ON accounts(owner_user_id);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS set_updated_at ON accounts;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ACCOUNT_INVITATIONS
--
-- One row per outstanding invite link. We store `token_hash` (SHA-
-- 256) rather than the raw token so a leaked DB snapshot doesn't
-- yield a usable invite. The plaintext token is returned exactly
-- once by the POST endpoint at creation time and never persisted.
-- ============================================================
CREATE TABLE IF NOT EXISTS account_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  role account_role_enum NOT NULL CHECK (role <> 'owner'),
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_account_invitations_account_pending
  ON account_invitations(account_id, expires_at)
  WHERE accepted_at IS NULL;

ALTER TABLE account_invitations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILE EXTENSION
--
-- account_role lives on profiles (not a separate memberships table)
-- because the design is one-account-per-user; this keeps reads cheap
-- (one row, already loaded by the auth hook).
--
-- Added BEFORE the is_account_member helper below because LANGUAGE
-- sql functions resolve column references at CREATE time (unlike
-- plpgsql, which defers to call time).
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS account_role account_role_enum;

CREATE INDEX IF NOT EXISTS idx_profiles_account_role
  ON profiles(account_id, account_role);

-- ============================================================
-- MEMBERSHIP HELPER
--
-- SECURITY DEFINER so the policy body can read `profiles` without
-- recursive RLS evaluation. Returns true iff `auth.uid()` is a
-- member of `target_account_id` with at least `min_role`.
--
-- Role hierarchy: owner > admin > agent > viewer.
-- ============================================================
CREATE OR REPLACE FUNCTION is_account_member(
  target_account_id UUID,
  min_role account_role_enum DEFAULT 'viewer'
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.user_id = auth.uid()
      AND p.account_id = target_account_id
      AND CASE p.account_role
            WHEN 'owner'  THEN 4
            WHEN 'admin'  THEN 3
            WHEN 'agent'  THEN 2
            WHEN 'viewer' THEN 1
          END
        >=
          CASE min_role
            WHEN 'owner'  THEN 4
            WHEN 'admin'  THEN 3
            WHEN 'agent'  THEN 2
            WHEN 'viewer' THEN 1
          END
  );
$$;

ALTER FUNCTION is_account_member(UUID, account_role_enum) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION is_account_member(UUID, account_role_enum) TO authenticated, service_role;

-- ============================================================
-- ADD account_id TO EVERY PARENT TENANT TABLE
--
-- Nullable for now — backfill runs below, then NOT NULL applied at
-- the end. Indexes too: every "list mine" query becomes "list my
-- account's", so account_id is the new hot lookup key.
-- ============================================================
ALTER TABLE contacts                       ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE tags                           ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE custom_fields                  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE contact_notes                  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE conversations                  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE whatsapp_config                ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE message_templates              ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE pipelines                      ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE deals                          ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE broadcasts                     ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE automations                    ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE automation_logs                ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE automation_pending_executions  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE flows                          ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE flow_runs                      ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;

-- ============================================================
-- BACKFILL
--
-- Order is load-bearing:
--   0. Heal orphaned auth.users that never got a profile row.
--   1. Create one account per existing profile (the existing user
--      is the owner).
--   2. Stamp profile.account_id / account_role from the row above.
--   3. Propagate account_id to every domain table via the profile.
--   4. Apply NOT NULL on every account_id column.
--
-- Wrapped in a DO block so a partially-applied migration (e.g.
-- accounts already exist but propagation didn't finish) re-converges
-- on re-run rather than duplicating accounts.
-- ============================================================
DO $$
DECLARE
  v_table TEXT;
  v_tables TEXT[] := ARRAY[
    'contacts', 'tags', 'custom_fields', 'contact_notes',
    'conversations', 'whatsapp_config', 'message_templates',
    'pipelines', 'deals', 'broadcasts',
    'automations', 'automation_logs', 'automation_pending_executions',
    'flows', 'flow_runs'
  ];
BEGIN
  -- (0) Heal orphaned users. The pre-017 signup trigger (migration
  -- 001) inserted the profile inside an `EXCEPTION WHEN OTHERS ...
  -- RAISE WARNING; RETURN NEW` block, so a signup could leave an
  -- auth.users row with no matching profiles row. Those orphans would
  -- be skipped by step (1) below, get no account, and — if they own
  -- any domain rows (pre-017 RLS only required auth.uid() = user_id,
  -- not a profile) — leave account_id NULL and abort the SET NOT NULL
  -- step. Backfilling the missing profile first keys the whole backfill
  -- off auth.users instead of profiles, so every authenticated user is
  -- migrated and no domain row can be left without an account.
  -- full_name / email are NOT NULL on profiles, hence the COALESCE.
  INSERT INTO public.profiles (user_id, full_name, email)
  SELECT u.id,
         COALESCE(u.raw_user_meta_data->>'full_name', ''),
         COALESCE(u.email, '')
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
  );

  -- (1) Create one account per existing profile whose user does not
  -- yet own one. Idempotent: skips users that already have an account.
  INSERT INTO accounts (name, owner_user_id)
  SELECT COALESCE(NULLIF(p.full_name, ''), p.email, 'My account'),
         p.user_id
  FROM profiles p
  WHERE NOT EXISTS (
    SELECT 1 FROM accounts a WHERE a.owner_user_id = p.user_id
  );

  -- (2) Stamp profile.account_id / account_role for every profile that
  -- hasn't been linked yet.
  UPDATE profiles p
  SET account_id   = a.id,
      account_role = 'owner'
  FROM accounts a
  WHERE a.owner_user_id = p.user_id
    AND p.account_id IS NULL;

  -- (3) Propagate account_id to every domain table. Uses the row's
  -- existing user_id → profiles.user_id → profiles.account_id chain.
  -- Only updates rows where account_id IS NULL so a re-run is cheap.
  FOREACH v_table IN ARRAY v_tables LOOP
    EXECUTE format($f$
      UPDATE %I t
      SET account_id = p.account_id
      FROM profiles p
      WHERE t.user_id = p.user_id
        AND t.account_id IS NULL
    $f$, v_table);
  END LOOP;
END $$;

-- (4) NOT NULL — split out from the DO block so DDL changes happen
-- at the top transactional level. Idempotent: NOT NULL on an
-- already-NOT NULL column is a no-op error-free.
ALTER TABLE profiles                       ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE profiles                       ALTER COLUMN account_role SET NOT NULL;
ALTER TABLE contacts                       ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE tags                           ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE custom_fields                  ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE contact_notes                  ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE conversations                  ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE whatsapp_config                ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE message_templates              ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE pipelines                      ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE deals                          ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE broadcasts                     ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE automations                    ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE automation_logs                ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE automation_pending_executions  ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE flows                          ALTER COLUMN account_id   SET NOT NULL;
ALTER TABLE flow_runs                      ALTER COLUMN account_id   SET NOT NULL;

-- ============================================================
-- INDEXES ON account_id (every parent — these are the new hot keys)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_contacts_account                ON contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_tags_account                    ON tags(account_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_account           ON custom_fields(account_id);
CREATE INDEX IF NOT EXISTS idx_contact_notes_account           ON contact_notes(account_id);
CREATE INDEX IF NOT EXISTS idx_conversations_account           ON conversations(account_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_config_account         ON whatsapp_config(account_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_account       ON message_templates(account_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_account               ON pipelines(account_id);
CREATE INDEX IF NOT EXISTS idx_deals_account                   ON deals(account_id);
CREATE INDEX IF NOT EXISTS idx_broadcasts_account              ON broadcasts(account_id);
CREATE INDEX IF NOT EXISTS idx_automations_account             ON automations(account_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_account         ON automation_logs(account_id);
CREATE INDEX IF NOT EXISTS idx_automation_pending_account      ON automation_pending_executions(account_id);
CREATE INDEX IF NOT EXISTS idx_flows_account                   ON flows(account_id);
CREATE INDEX IF NOT EXISTS idx_flow_runs_account               ON flow_runs(account_id);

-- ============================================================
-- whatsapp_config: one WhatsApp number per ACCOUNT
--
-- Was UNIQUE(user_id). Same number cannot be configured by two
-- accounts; same account cannot register two numbers. If multi-
-- number-per-account is ever wanted, drop the unique and add a
-- "primary" boolean.
-- ============================================================
ALTER TABLE whatsapp_config DROP CONSTRAINT IF EXISTS whatsapp_config_user_id_key;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'whatsapp_config_account_id_key'
  ) THEN
    ALTER TABLE whatsapp_config ADD CONSTRAINT whatsapp_config_account_id_key UNIQUE (account_id);
  END IF;
END $$;

-- ============================================================
-- flow_runs: idempotency key swaps to (account_id, contact_id)
--
-- The "at most one active run per contact" invariant is per-account
-- now — two accounts that happen to share a contact phone number
-- must be able to run their own flows independently.
-- ============================================================
DROP INDEX IF EXISTS idx_one_active_run_per_contact;
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_run_per_contact
  ON flow_runs(account_id, contact_id)
  WHERE status = 'active';

-- ============================================================
-- RLS REWRITE — PARENT TABLES
--
-- Replaces every `auth.uid() = user_id` policy with the membership
-- check. Three policy tiers:
--   - viewer    : SELECT  (read-only)
--   - agent+    : SELECT + INSERT/UPDATE/DELETE (operational data)
--   - admin+    : same  + write paths on settings-class tables
--
-- The legacy `user_id` column stays on every row (still useful for
-- assignment + audit) but is no longer consulted for isolation.
-- ============================================================

-- Make the RLS rewrite re-runnable. CREATE POLICY has no IF NOT EXISTS
-- form, and the DROP statements below only name the *legacy* policies —
-- the new ones (contacts_select, …) would error with 42710 "policy
-- already exists" on a second run. 017 owns every policy on these tables
-- (no later migration adds others), so drop them all first, then the
-- CREATEs below re-establish the full set.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY (ARRAY[
        'contacts', 'tags', 'custom_fields', 'contact_notes',
        'conversations', 'whatsapp_config', 'message_templates',
        'pipelines', 'deals', 'broadcasts', 'automations',
        'automation_logs', 'flows', 'flow_runs', 'contact_tags',
        'contact_custom_values', 'messages', 'pipeline_stages',
        'broadcast_recipients', 'automation_steps', 'flow_nodes',
        'flow_run_events', 'message_reactions', 'profiles',
        'accounts', 'account_invitations'
      ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ---- contacts ---------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own contacts" ON contacts;
CREATE POLICY contacts_select ON contacts FOR SELECT USING (is_account_member(account_id));
CREATE POLICY contacts_insert ON contacts FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY contacts_update ON contacts FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY contacts_delete ON contacts FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ---- tags (settings-class) -------------------------------------
DROP POLICY IF EXISTS "Users can manage own tags" ON tags;
CREATE POLICY tags_select ON tags FOR SELECT USING (is_account_member(account_id));
CREATE POLICY tags_insert ON tags FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
CREATE POLICY tags_update ON tags FOR UPDATE USING (is_account_member(account_id, 'admin'));
CREATE POLICY tags_delete ON tags FOR DELETE USING (is_account_member(account_id, 'admin'));

-- ---- custom_fields (settings-class) ----------------------------
DROP POLICY IF EXISTS "Users can manage own custom fields" ON custom_fields;
CREATE POLICY custom_fields_select ON custom_fields FOR SELECT USING (is_account_member(account_id));
CREATE POLICY custom_fields_insert ON custom_fields FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
CREATE POLICY custom_fields_update ON custom_fields FOR UPDATE USING (is_account_member(account_id, 'admin'));
CREATE POLICY custom_fields_delete ON custom_fields FOR DELETE USING (is_account_member(account_id, 'admin'));

-- ---- contact_notes ---------------------------------------------
DROP POLICY IF EXISTS "Users can manage own notes" ON contact_notes;
CREATE POLICY contact_notes_select ON contact_notes FOR SELECT USING (is_account_member(account_id));
CREATE POLICY contact_notes_insert ON contact_notes FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY contact_notes_update ON contact_notes FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY contact_notes_delete ON contact_notes FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ---- conversations ---------------------------------------------
DROP POLICY IF EXISTS "Users can manage own conversations" ON conversations;
CREATE POLICY conversations_select ON conversations FOR SELECT USING (is_account_member(account_id));
CREATE POLICY conversations_insert ON conversations FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY conversations_update ON conversations FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY conversations_delete ON conversations FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ---- whatsapp_config (settings-class) --------------------------
DROP POLICY IF EXISTS "Users can manage own config" ON whatsapp_config;
CREATE POLICY whatsapp_config_select ON whatsapp_config FOR SELECT USING (is_account_member(account_id));
CREATE POLICY whatsapp_config_insert ON whatsapp_config FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
CREATE POLICY whatsapp_config_update ON whatsapp_config FOR UPDATE USING (is_account_member(account_id, 'admin'));
CREATE POLICY whatsapp_config_delete ON whatsapp_config FOR DELETE USING (is_account_member(account_id, 'admin'));

-- ---- message_templates (settings-class) ------------------------
DROP POLICY IF EXISTS "Users can manage own templates" ON message_templates;
CREATE POLICY message_templates_select ON message_templates FOR SELECT USING (is_account_member(account_id));
CREATE POLICY message_templates_insert ON message_templates FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
CREATE POLICY message_templates_update ON message_templates FOR UPDATE USING (is_account_member(account_id, 'admin'));
CREATE POLICY message_templates_delete ON message_templates FOR DELETE USING (is_account_member(account_id, 'admin'));

-- ---- pipelines (settings-class) --------------------------------
DROP POLICY IF EXISTS "Users can manage own pipelines" ON pipelines;
CREATE POLICY pipelines_select ON pipelines FOR SELECT USING (is_account_member(account_id));
CREATE POLICY pipelines_insert ON pipelines FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
CREATE POLICY pipelines_update ON pipelines FOR UPDATE USING (is_account_member(account_id, 'admin'));
CREATE POLICY pipelines_delete ON pipelines FOR DELETE USING (is_account_member(account_id, 'admin'));

-- ---- deals ------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own deals" ON deals;
CREATE POLICY deals_select ON deals FOR SELECT USING (is_account_member(account_id));
CREATE POLICY deals_insert ON deals FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY deals_update ON deals FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY deals_delete ON deals FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ---- broadcasts -------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own broadcasts" ON broadcasts;
CREATE POLICY broadcasts_select ON broadcasts FOR SELECT USING (is_account_member(account_id));
CREATE POLICY broadcasts_insert ON broadcasts FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY broadcasts_update ON broadcasts FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY broadcasts_delete ON broadcasts FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ---- automations ------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own automations" ON automations;
CREATE POLICY automations_select ON automations FOR SELECT USING (is_account_member(account_id));
CREATE POLICY automations_insert ON automations FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY automations_update ON automations FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY automations_delete ON automations FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ---- automation_logs -------------------------------------------
DROP POLICY IF EXISTS "Users can view own automation logs" ON automation_logs;
CREATE POLICY automation_logs_select ON automation_logs FOR SELECT USING (is_account_member(account_id));
-- Service role inserts logs; no INSERT/UPDATE/DELETE policy for clients.

-- ---- automation_pending_executions -----------------------------
-- Service-role only (no client policies). Account_id is on the row
-- for consistency and so the cron can route account-scoped queries.

-- ---- flows ------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own flows" ON flows;
CREATE POLICY flows_select ON flows FOR SELECT USING (is_account_member(account_id));
CREATE POLICY flows_insert ON flows FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY flows_update ON flows FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY flows_delete ON flows FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ---- flow_runs --------------------------------------------------
DROP POLICY IF EXISTS "Users see own flow runs" ON flow_runs;
CREATE POLICY flow_runs_select ON flow_runs FOR SELECT USING (is_account_member(account_id));
-- Service-role driven; no client INSERT/UPDATE/DELETE.

-- ============================================================
-- RLS REWRITE — CHILD TABLES (parent-join semantics)
-- ============================================================

-- ---- contact_tags ----------------------------------------------
DROP POLICY IF EXISTS "Users can manage contact tags" ON contact_tags;
CREATE POLICY contact_tags_select ON contact_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_tags.contact_id AND is_account_member(c.account_id))
);
CREATE POLICY contact_tags_modify ON contact_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_tags.contact_id AND is_account_member(c.account_id, 'agent'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_tags.contact_id AND is_account_member(c.account_id, 'agent'))
);

-- ---- contact_custom_values -------------------------------------
DROP POLICY IF EXISTS "Users can manage custom values" ON contact_custom_values;
CREATE POLICY contact_custom_values_select ON contact_custom_values FOR SELECT USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_custom_values.contact_id AND is_account_member(c.account_id))
);
CREATE POLICY contact_custom_values_modify ON contact_custom_values FOR ALL USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_custom_values.contact_id AND is_account_member(c.account_id, 'agent'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_custom_values.contact_id AND is_account_member(c.account_id, 'agent'))
);

-- ---- messages --------------------------------------------------
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Service role can insert messages" ON messages;
CREATE POLICY messages_select ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND is_account_member(c.account_id))
);
CREATE POLICY messages_modify ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND is_account_member(c.account_id, 'agent'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND is_account_member(c.account_id, 'agent'))
);
-- Service-role webhook inserts (Meta deliveries) bypass RLS as before.

-- ---- pipeline_stages -------------------------------------------
DROP POLICY IF EXISTS "Users can manage pipeline stages" ON pipeline_stages;
CREATE POLICY pipeline_stages_select ON pipeline_stages FOR SELECT USING (
  EXISTS (SELECT 1 FROM pipelines p WHERE p.id = pipeline_stages.pipeline_id AND is_account_member(p.account_id))
);
CREATE POLICY pipeline_stages_modify ON pipeline_stages FOR ALL USING (
  EXISTS (SELECT 1 FROM pipelines p WHERE p.id = pipeline_stages.pipeline_id AND is_account_member(p.account_id, 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM pipelines p WHERE p.id = pipeline_stages.pipeline_id AND is_account_member(p.account_id, 'admin'))
);

-- ---- broadcast_recipients --------------------------------------
DROP POLICY IF EXISTS "Users can manage broadcast recipients" ON broadcast_recipients;
CREATE POLICY broadcast_recipients_select ON broadcast_recipients FOR SELECT USING (
  EXISTS (SELECT 1 FROM broadcasts b WHERE b.id = broadcast_recipients.broadcast_id AND is_account_member(b.account_id))
);
CREATE POLICY broadcast_recipients_modify ON broadcast_recipients FOR ALL USING (
  EXISTS (SELECT 1 FROM broadcasts b WHERE b.id = broadcast_recipients.broadcast_id AND is_account_member(b.account_id, 'agent'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM broadcasts b WHERE b.id = broadcast_recipients.broadcast_id AND is_account_member(b.account_id, 'agent'))
);

-- ---- automation_steps ------------------------------------------
DROP POLICY IF EXISTS "Users can manage steps of own automations" ON automation_steps;
CREATE POLICY automation_steps_select ON automation_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM automations a WHERE a.id = automation_steps.automation_id AND is_account_member(a.account_id))
);
CREATE POLICY automation_steps_modify ON automation_steps FOR ALL USING (
  EXISTS (SELECT 1 FROM automations a WHERE a.id = automation_steps.automation_id AND is_account_member(a.account_id, 'agent'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM automations a WHERE a.id = automation_steps.automation_id AND is_account_member(a.account_id, 'agent'))
);

-- ---- flow_nodes ------------------------------------------------
DROP POLICY IF EXISTS "Users manage nodes on their flows" ON flow_nodes;
CREATE POLICY flow_nodes_select ON flow_nodes FOR SELECT USING (
  EXISTS (SELECT 1 FROM flows f WHERE f.id = flow_nodes.flow_id AND is_account_member(f.account_id))
);
CREATE POLICY flow_nodes_modify ON flow_nodes FOR ALL USING (
  EXISTS (SELECT 1 FROM flows f WHERE f.id = flow_nodes.flow_id AND is_account_member(f.account_id, 'agent'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM flows f WHERE f.id = flow_nodes.flow_id AND is_account_member(f.account_id, 'agent'))
);

-- ---- flow_run_events -------------------------------------------
DROP POLICY IF EXISTS "Users see events on their runs" ON flow_run_events;
CREATE POLICY flow_run_events_select ON flow_run_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM flow_runs r WHERE r.id = flow_run_events.flow_run_id AND is_account_member(r.account_id))
);

-- ---- message_reactions -----------------------------------------
DROP POLICY IF EXISTS "Users see reactions on their conversations" ON message_reactions;
DROP POLICY IF EXISTS "Users insert reactions on their conversations" ON message_reactions;
DROP POLICY IF EXISTS "Users delete their own agent reactions" ON message_reactions;
DROP POLICY IF EXISTS "Users update their own agent reactions" ON message_reactions;
CREATE POLICY message_reactions_select ON message_reactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.id = message_reactions.message_id
      AND is_account_member(c.account_id)
  )
);
CREATE POLICY message_reactions_modify ON message_reactions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.id = message_reactions.message_id
      AND is_account_member(c.account_id, 'agent')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.id = message_reactions.message_id
      AND is_account_member(c.account_id, 'agent')
  )
);

-- ============================================================
-- RLS — PROFILES (revised)
--
-- A profile row is readable by every member of its account so the
-- Members tab can render. It is only writable by the row's own
-- user (so an admin cannot edit a teammate's name/avatar — that's
-- the teammate's own settings). Role changes happen via the
-- separate /api/account/members endpoint (admin-only, server-side).
-- ============================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (auth.uid() = user_id OR is_account_member(account_id));
CREATE POLICY profiles_update ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY profiles_insert ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS — ACCOUNTS & ACCOUNT_INVITATIONS
--
-- accounts: members read; admins+ update; nobody inserts via
-- client (the signup trigger / redeem RPC own creation).
-- invitations: admins+ full control; everyone else has no
-- visibility. The /api/invitations/[token]/peek endpoint uses the
-- service role to look up by token_hash anonymously.
-- ============================================================
DROP POLICY IF EXISTS accounts_select ON accounts;
DROP POLICY IF EXISTS accounts_update ON accounts;
CREATE POLICY accounts_select ON accounts FOR SELECT
  USING (is_account_member(id));
CREATE POLICY accounts_update ON accounts FOR UPDATE
  USING (is_account_member(id, 'admin'))
  WITH CHECK (is_account_member(id, 'admin'));

DROP POLICY IF EXISTS account_invitations_select ON account_invitations;
DROP POLICY IF EXISTS account_invitations_modify ON account_invitations;
CREATE POLICY account_invitations_select ON account_invitations FOR SELECT
  USING (is_account_member(account_id, 'admin'));
CREATE POLICY account_invitations_modify ON account_invitations FOR ALL
  USING (is_account_member(account_id, 'admin'))
  WITH CHECK (is_account_member(account_id, 'admin'));

-- ============================================================
-- SIGNUP TRIGGER — replace to also create a personal account
--
-- Every new auth.users row now produces:
--   - a fresh `accounts` row owned by them
--   - a `profiles` row linked to that account with role = 'owner'
--
-- The invite-redemption RPC (later PR) will reassign profile.account_id
-- to the inviter's account and delete the orphan personal account if
-- it's still empty.
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_account_id UUID;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');

  INSERT INTO public.accounts (name, owner_user_id)
  VALUES (COALESCE(NULLIF(v_full_name, ''), NEW.email, 'My account'), NEW.id)
  RETURNING id INTO v_account_id;

  INSERT INTO public.profiles (user_id, full_name, email, account_id, account_role)
  VALUES (NEW.id, v_full_name, NEW.email, v_account_id, 'owner');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to bootstrap account/profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- SOURCE: 018_account_member_rpcs.sql
-- ============================================================

-- ============================================================
-- 018_account_member_rpcs.sql — RPCs for member management
--
-- Why RPCs and not direct UPDATEs from the client
--
--   The `profiles_update` RLS policy from migration 017 only
--   allows a user to update their *own* profile row. That is
--   correct for self-service edits (name, avatar) but it would
--   block an admin from changing a teammate's role or moving
--   a removed member to a fresh personal account.
--
--   These three SECURITY DEFINER functions are the supervised
--   escape hatches: they bypass RLS to do exactly the writes the
--   matching API route needs, but every function self-checks the
--   caller's authority via `auth.uid()` first, so the privilege
--   bypass is scoped tightly.
--
-- Error contract
--
--   All functions raise Postgres exceptions with these SQLSTATEs:
--     42501 ("insufficient_privilege") — forbidden
--     22023 ("invalid_parameter_value") — bad input / 400
--   The `toErrorResponse` helper on the API side maps each to
--   the right HTTP status, with the RAISE message surfaced to
--   the caller.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ============================================================
-- set_member_role(p_user_id, p_new_role)
--
-- Admin+ changes another member's role within the caller's
-- account. Cannot promote to / demote from 'owner' (that is the
-- transfer endpoint). Cannot target self.
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_member_role(
  p_user_id UUID,
  p_new_role account_role_enum
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_account_id UUID;
  v_caller_role account_role_enum;
  v_target_account_id UUID;
  v_target_role account_role_enum;
BEGIN
  -- Caller must be authenticated.
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  -- Resolve caller's account + role.
  SELECT account_id, account_role
  INTO v_caller_account_id, v_caller_role
  FROM profiles
  WHERE user_id = auth.uid();

  IF v_caller_account_id IS NULL THEN
    RAISE EXCEPTION 'Caller has no account' USING ERRCODE = '42501';
  END IF;

  -- Caller must be admin+.
  IF v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'This action requires the admin role or higher'
      USING ERRCODE = '42501';
  END IF;

  -- Can't change own role via this endpoint.
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot change your own role'
      USING ERRCODE = '22023';
  END IF;

  -- Resolve target.
  SELECT account_id, account_role
  INTO v_target_account_id, v_target_role
  FROM profiles
  WHERE user_id = p_user_id;

  IF v_target_account_id IS NULL THEN
    RAISE EXCEPTION 'Target user not found' USING ERRCODE = '22023';
  END IF;

  -- Target must be in caller's account.
  IF v_target_account_id <> v_caller_account_id THEN
    RAISE EXCEPTION 'Target user is not a member of your account'
      USING ERRCODE = '42501';
  END IF;

  -- Owner role changes go through transfer_account_ownership.
  IF v_target_role = 'owner' THEN
    RAISE EXCEPTION 'Use transfer_account_ownership to demote an owner'
      USING ERRCODE = '22023';
  END IF;
  IF p_new_role = 'owner' THEN
    RAISE EXCEPTION 'Use transfer_account_ownership to promote to owner'
      USING ERRCODE = '22023';
  END IF;

  UPDATE profiles
  SET account_role = p_new_role
  WHERE user_id = p_user_id;
END;
$$;

ALTER FUNCTION public.set_member_role(UUID, account_role_enum) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.set_member_role(UUID, account_role_enum) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_member_role(UUID, account_role_enum) TO authenticated;

-- ============================================================
-- remove_account_member(p_user_id)
--
-- Admin+ removes another member from the caller's account. The
-- removed user is NOT deleted from auth.users — they keep their
-- login. Instead, a fresh personal account is created on the fly
-- and their profile is reassigned to it as 'owner'. This is the
-- mirror image of the signup trigger: the user effectively
-- "starts over" with an empty account, free to invite their own
-- teammates if they want.
--
-- Cannot target the owner. Cannot target self.
-- ============================================================
CREATE OR REPLACE FUNCTION public.remove_account_member(
  p_user_id UUID
) RETURNS UUID  -- the new personal account id
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_account_id UUID;
  v_caller_role account_role_enum;
  v_target_account_id UUID;
  v_target_role account_role_enum;
  v_target_name TEXT;
  v_target_email TEXT;
  v_new_account_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT account_id, account_role
  INTO v_caller_account_id, v_caller_role
  FROM profiles
  WHERE user_id = auth.uid();

  IF v_caller_account_id IS NULL THEN
    RAISE EXCEPTION 'Caller has no account' USING ERRCODE = '42501';
  END IF;

  IF v_caller_role NOT IN ('owner', 'admin') THEN
    RAISE EXCEPTION 'This action requires the admin role or higher'
      USING ERRCODE = '42501';
  END IF;

  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove yourself; transfer ownership or leave the account instead'
      USING ERRCODE = '22023';
  END IF;

  SELECT account_id, account_role, full_name, email
  INTO v_target_account_id, v_target_role, v_target_name, v_target_email
  FROM profiles
  WHERE user_id = p_user_id;

  IF v_target_account_id IS NULL THEN
    RAISE EXCEPTION 'Target user not found' USING ERRCODE = '22023';
  END IF;

  IF v_target_account_id <> v_caller_account_id THEN
    RAISE EXCEPTION 'Target user is not a member of your account'
      USING ERRCODE = '42501';
  END IF;

  IF v_target_role = 'owner' THEN
    RAISE EXCEPTION 'Cannot remove the account owner; transfer ownership first'
      USING ERRCODE = '22023';
  END IF;

  -- Spin up a fresh personal account for the removed user. Mirror
  -- of handle_new_user's logic — keep them whole, just relocated.
  INSERT INTO accounts (name, owner_user_id)
  VALUES (
    COALESCE(NULLIF(v_target_name, ''), v_target_email, 'My account'),
    p_user_id
  )
  RETURNING id INTO v_new_account_id;

  UPDATE profiles
  SET account_id = v_new_account_id,
      account_role = 'owner'
  WHERE user_id = p_user_id;

  RETURN v_new_account_id;
END;
$$;

ALTER FUNCTION public.remove_account_member(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.remove_account_member(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.remove_account_member(UUID) TO authenticated;

-- ============================================================
-- transfer_account_ownership(p_new_owner_user_id)
--
-- Owner only. Atomically:
--   - demotes the current owner to 'admin'
--   - promotes the target to 'owner'
--   - updates accounts.owner_user_id
--
-- Both writes happen in the same statement-level transaction.
-- ============================================================
CREATE OR REPLACE FUNCTION public.transfer_account_ownership(
  p_new_owner_user_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_account_id UUID;
  v_caller_role account_role_enum;
  v_target_account_id UUID;
  v_target_role account_role_enum;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT account_id, account_role
  INTO v_caller_account_id, v_caller_role
  FROM profiles
  WHERE user_id = auth.uid();

  IF v_caller_account_id IS NULL THEN
    RAISE EXCEPTION 'Caller has no account' USING ERRCODE = '42501';
  END IF;

  IF v_caller_role <> 'owner' THEN
    RAISE EXCEPTION 'Only the account owner can transfer ownership'
      USING ERRCODE = '42501';
  END IF;

  IF p_new_owner_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You are already the owner'
      USING ERRCODE = '22023';
  END IF;

  SELECT account_id, account_role
  INTO v_target_account_id, v_target_role
  FROM profiles
  WHERE user_id = p_new_owner_user_id;

  IF v_target_account_id IS NULL THEN
    RAISE EXCEPTION 'Target user not found' USING ERRCODE = '22023';
  END IF;

  IF v_target_account_id <> v_caller_account_id THEN
    RAISE EXCEPTION 'Target user is not a member of your account'
      USING ERRCODE = '42501';
  END IF;

  -- Demote current owner first so the temporary state where the
  -- account has zero owners is never visible — both writes happen
  -- in the same function transaction.
  UPDATE profiles SET account_role = 'admin'
  WHERE user_id = auth.uid();

  UPDATE profiles SET account_role = 'owner'
  WHERE user_id = p_new_owner_user_id;

  UPDATE accounts SET owner_user_id = p_new_owner_user_id
  WHERE id = v_caller_account_id;
END;
$$;

ALTER FUNCTION public.transfer_account_ownership(UUID) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.transfer_account_ownership(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transfer_account_ownership(UUID) TO authenticated;


-- ============================================================
-- SOURCE: 019_invitation_rpcs.sql
-- ============================================================

-- ============================================================
-- 019_invitation_rpcs.sql — peek + redeem invitation RPCs
--
-- The third and last server-side migration in the multi-user
-- accounts series. Both functions are SECURITY DEFINER for the
-- same reason as the member RPCs in 018: the writes they need to
-- do (or, for peek, the reads) cross RLS boundaries that the
-- regular client policies (correctly) deny.
--
-- peek_invitation   — anonymous read. The /join/<token> page
--   calls this to render "You're being invited to <Account> as
--   <Role>" before the visitor signs in. Returns a uniform
--   `{ ok, reason?, account_name?, role?, expires_at? }` JSON
--   so the API route doesn't have to interpret error rows.
--
-- redeem_invitation — authenticated. Atomically moves the caller
--   from their just-created personal account to the inviter's
--   account, cleans up the orphan personal account, and stamps
--   the invitation accepted. Refuses if the caller's current
--   account holds any domain data (to avoid silent data loss).
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ============================================================
-- peek_invitation(p_token_hash text)
--
-- Anonymous read by token hash. The plaintext token never
-- reaches the DB; the route handler hashes it first.
--
-- Returns a JSON object with one of two shapes:
--   { "ok": true,  "account_name": "...", "role": "...",
--     "expires_at": "2026-..." }
--   { "ok": false, "reason": "not_found" | "expired" | "used" }
--
-- We could collapse all three failure cases to "not_found" to
-- harden against enumeration, but the join page needs the
-- distinction for UX ("This invite has expired — ask <name>
-- for a new one"). Tokens carry 256 bits of entropy, so the
-- enumeration risk is theoretical; rate-limiting the route on
-- the IP layer adds belt-and-braces.
-- ============================================================
CREATE OR REPLACE FUNCTION public.peek_invitation(
  p_token_hash TEXT
) RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv account_invitations%ROWTYPE;
  v_account_name TEXT;
BEGIN
  SELECT * INTO v_inv
  FROM account_invitations
  WHERE token_hash = p_token_hash;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF v_inv.accepted_at IS NOT NULL THEN
    RETURN json_build_object('ok', false, 'reason', 'used');
  END IF;

  IF v_inv.expires_at <= NOW() THEN
    RETURN json_build_object('ok', false, 'reason', 'expired');
  END IF;

  SELECT name INTO v_account_name
  FROM accounts
  WHERE id = v_inv.account_id;

  RETURN json_build_object(
    'ok', true,
    'account_name', v_account_name,
    'role', v_inv.role,
    'expires_at', v_inv.expires_at
  );
END;
$$;

ALTER FUNCTION public.peek_invitation(TEXT) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.peek_invitation(TEXT) FROM PUBLIC;
-- `anon` so the /join/<token> page can call this before the user
-- signs in; `authenticated` so the same page works when already
-- signed in (e.g. existing user clicks a forwarded link).
GRANT EXECUTE ON FUNCTION public.peek_invitation(TEXT) TO anon, authenticated;

-- ============================================================
-- redeem_invitation(p_token_hash text)
--
-- Authenticated. The caller's auth.uid() is used both to scope
-- the move ("which profile am I editing?") and as the safety
-- check ("do you have any data we'd lose?").
--
-- Refusal codes (SQLSTATE):
--   22023 — invite invalid (not_found / used / expired)
--   42501 — caller not authenticated
--   23505 — caller's account has data (would be lost by joining)
--           NOTE: we reuse Postgres's "unique_violation" code here
--           rather than invent a custom SQLSTATE because there's
--           no proper standard SQLSTATE for "conflict"; the route
--           handler maps it to HTTP 409.
--
-- Order of operations
--   1. Lock the invite row (FOR UPDATE) so two concurrent redeems
--      of the same token can't both succeed.
--   2. Read caller's current account_id.
--   3. Verify caller is the sole owner of their current account
--      AND that the account has zero domain rows. (If the caller
--      already joined someone else's account once, their
--      profile.account_id points there, not to a personal account
--      they own — that case fails the "is owner" check and
--      surfaces as 23505.)
--   4. Move profile.account_id + account_role to invite's.
--   5. Mark invitation accepted (token_hash stays, so the same
--      token can't be re-used).
--   6. Delete the old personal account. The ON DELETE CASCADE on
--      `accounts(id) ← profiles.account_id` would normally try to
--      delete the caller's profile too, but step 4 already moved
--      them to the new account, so the cascade is a no-op.
-- ============================================================
CREATE OR REPLACE FUNCTION public.redeem_invitation(
  p_token_hash TEXT
) RETURNS UUID  -- the joined account_id
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_id UUID := auth.uid();
  v_inv account_invitations%ROWTYPE;
  v_old_account_id UUID;
  v_old_account_owner UUID;
  v_has_data BOOLEAN;
BEGIN
  IF v_caller_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_inv
  FROM account_invitations
  WHERE token_hash = p_token_hash
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found' USING ERRCODE = '22023';
  END IF;
  IF v_inv.accepted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invitation has already been redeemed'
      USING ERRCODE = '22023';
  END IF;
  IF v_inv.expires_at <= NOW() THEN
    RAISE EXCEPTION 'Invitation has expired' USING ERRCODE = '22023';
  END IF;

  -- Caller's current account + its owner.
  SELECT p.account_id, a.owner_user_id
  INTO v_old_account_id, v_old_account_owner
  FROM profiles p
  JOIN accounts a ON a.id = p.account_id
  WHERE p.user_id = v_caller_id;

  IF v_old_account_id IS NULL THEN
    -- Defensive — every authenticated user has a profile post-017.
    RAISE EXCEPTION 'Caller has no profile' USING ERRCODE = '42501';
  END IF;

  -- Edge case: the inviter sent themselves a link, or the
  -- caller is somehow already in the inviter's account.
  IF v_old_account_id = v_inv.account_id THEN
    RAISE EXCEPTION 'You are already a member of this account'
      USING ERRCODE = '23505';
  END IF;

  -- Safety: the caller must be the SOLE OWNER of their current
  -- account (i.e. their fresh personal account from signup or a
  -- prior removal). Any other state means they're either:
  --   - a member of another shared account (joining a second
  --     would silently orphan their access to the first), or
  --   - the owner of an account with teammates (they'd abandon
  --     their team to join the inviter's).
  -- Either way, the safe answer is "make a different login".
  IF v_old_account_owner <> v_caller_id THEN
    RAISE EXCEPTION 'You are already in a shared account; sign up with a different email to join this one'
      USING ERRCODE = '23505';
  END IF;

  -- Belt: even if they own their account, refuse if it has any
  -- domain data — joining would orphan their contacts, deals,
  -- broadcasts, automations, flows, templates, etc.
  SELECT EXISTS (
    SELECT 1 FROM contacts WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM conversations WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM broadcasts WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM automations WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM flows WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM pipelines WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM message_templates WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM tags WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM custom_fields WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM contact_notes WHERE account_id = v_old_account_id
    UNION ALL SELECT 1 FROM whatsapp_config WHERE account_id = v_old_account_id
    LIMIT 1
  ) INTO v_has_data;

  IF v_has_data THEN
    RAISE EXCEPTION 'Your account already contains data; sign up with a different email to join this one'
      USING ERRCODE = '23505';
  END IF;

  -- Move the profile first so the cascade-on-delete of the old
  -- account doesn't try to nuke this user's profile too.
  UPDATE profiles
  SET account_id = v_inv.account_id,
      account_role = v_inv.role
  WHERE user_id = v_caller_id;

  UPDATE account_invitations
  SET accepted_at = NOW(),
      accepted_by_user_id = v_caller_id
  WHERE id = v_inv.id;

  -- Clean up the orphan personal account. Empty by the checks
  -- above, so this is purely housekeeping — no cascades fire
  -- because no other rows reference it.
  DELETE FROM accounts WHERE id = v_old_account_id;

  RETURN v_inv.account_id;
END;
$$;

ALTER FUNCTION public.redeem_invitation(TEXT) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.redeem_invitation(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_invitation(TEXT) TO authenticated;


-- ============================================================
-- SOURCE: 020_account_sharing_followups.sql
-- ============================================================

-- ============================================================
-- 020_account_sharing_followups.sql — review-board fixes for
-- the multi-user accounts series (#167-#177).
--
-- Two concerns this migration addresses:
--
--   1. Engine dispatch indexes — the per-inbound automations and
--      flows lookups now scope by `account_id + trigger_type/status
--      + is_active/status='active'`. The pre-017 partial indexes
--      (`idx_automations_active_trigger`, no flows equivalent) were
--      account-blind. For shared accounts with 100+ teammates each
--      authoring rules, the planner ends up post-filtering by
--      account_id. Composite partial indexes drop the post-filter
--      cost to zero on the hot path.
--
--   2. Flow-media storage scoping — migration 016 created the
--      `flow-media` bucket with per-user RLS policies keyed on
--      `auth.uid() = path[0]`. After the multi-user move, flows
--      are account-scoped but the storage paths remained user-
--      scoped: an agent who left the account would orphan every
--      flow node referencing media they had uploaded. This
--      migration switches the write policies to account-scoped
--      paths (`account-<account_id>/...`) while leaving the
--      legacy `<auth.uid()>/...` paths writable by their original
--      uploader for backward compatibility. The bucket is public,
--      so reads are unchanged.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ============================================================
-- COMPOSITE INDEXES — engine dispatch hot path
-- ============================================================

-- `runAutomationsForTrigger` queries
--   automations WHERE account_id = X AND trigger_type = Y AND is_active = TRUE
-- Migration 006 added a partial index on (trigger_type) WHERE is_active.
-- Composite + partial index lets the planner answer all three predicates
-- from one index lookup. The existing partial index can stay as belt-and-
-- braces for any code path that filters only by trigger_type.
CREATE INDEX IF NOT EXISTS idx_automations_account_active_trigger
  ON automations(account_id, trigger_type)
  WHERE is_active = TRUE;

-- `findEntryFlow` queries
--   flows WHERE account_id = X AND status = 'active'
-- Migration 017 only added `idx_flows_account`; this partial composite
-- is tuned for the engine's lookup and skips archived/draft rows.
CREATE INDEX IF NOT EXISTS idx_flows_account_active
  ON flows(account_id)
  WHERE status = 'active';

-- ============================================================
-- FLOW-MEDIA STORAGE — account-scoped writes
--
-- New path convention: `account-<uuid>/<timestamp>-<base>.<ext>`
-- Legacy path convention: `<uuid>/<timestamp>-<base>.<ext>` (where
-- the uuid is auth.uid() — preserved for back-compat).
--
-- Reads stay public (the bucket is public so Meta can fetch media
-- URLs without credentials). Only the write policies change.
--
-- Drop existing per-user policies and replace with account-aware
-- ones that accept either path convention.
-- ============================================================
DROP POLICY IF EXISTS "Users can upload their own flow media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own flow media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own flow media" ON storage.objects;

DROP POLICY IF EXISTS "Members can upload flow media" ON storage.objects;
CREATE POLICY "Members can upload flow media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'flow-media'
    AND (
      -- New: any account member uploading under their account's folder.
      -- `'account-' || account_id` is how we namespace the folder, so
      -- two accounts that happen to be in the same Supabase project
      -- can never accidentally collide.
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
      )
      -- Legacy: the original uploader keeps write access to files they
      -- already uploaded under the pre-020 path convention.
      OR auth.uid()::text = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Members can update flow media" ON storage.objects;
CREATE POLICY "Members can update flow media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'flow-media'
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
      )
      OR auth.uid()::text = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Members can delete flow media" ON storage.objects;
CREATE POLICY "Members can delete flow media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'flow-media'
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
      )
      OR auth.uid()::text = (storage.foldername(name))[1]
    )
  );

-- Public read policy from 016 stays as-is; reads cross both path
-- conventions without modification.


-- ============================================================
-- SOURCE: 021_account_default_currency.sql
-- ============================================================

-- ============================================================
-- 021_account_default_currency
--
-- Make the default deal currency configurable per account.
--
-- Before this, the app hardcoded USD everywhere — deal-value
-- formatters, the new-deal form, and automation-created deals all
-- assumed USD. wacrm is self-hostable and used globally, so a fixed
-- USD default made deal tracking unhelpful for non-US businesses
-- (issue #218).
--
-- We add a single `default_currency` column to `accounts`. New deals
-- and all aggregated totals (pipeline/dashboard) format in this
-- currency; existing deals keep their own saved `deals.currency`.
-- We enforce one currency per account (no FX conversion) — the
-- issue's recommended first pass.
--
-- RLS: no change needed. The existing `accounts_update` policy
-- (017) already restricts writes to admins+, which is exactly who
-- should change an account-wide setting.
-- ============================================================

ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS default_currency TEXT NOT NULL DEFAULT 'INR';

-- Keep the value an ISO-4217-shaped 3-letter uppercase code without
-- pinning to a fixed enum — forks can use any currency Intl supports.
ALTER TABLE accounts
  DROP CONSTRAINT IF EXISTS accounts_default_currency_format;
ALTER TABLE accounts
  ADD CONSTRAINT accounts_default_currency_format
  CHECK (default_currency ~ '^[A-Z]{3}$');


-- ============================================================
-- SOURCE: 022_contact_phone_dedup.sql
-- ============================================================

-- ============================================================
-- 022_contact_phone_dedup
--
-- Prevent the same phone number from becoming multiple contacts
-- within one account (issue #212).
--
-- Until now `contacts.phone` had only a non-unique index, phone was
-- stored un-normalized ("+1 555-123-4567" vs "15551234567" are
-- distinct strings), and only the WhatsApp webhook de-duped. Manual
-- create and CSV import inserted freely, fragmenting conversations,
-- deals, and tags across duplicate rows.
--
-- This migration, in order:
--   1. adds a generated `phone_normalized` column (digits-only,
--      mirroring the app's normalizePhone) that can never drift;
--   2. merges existing duplicates into the oldest row, re-pointing
--      all child records first so nothing is lost;
--   3. adds a UNIQUE index on (account_id, phone_normalized) — the
--      authoritative guarantee that covers every write path.
--
-- Idempotent. **No data loss** — duplicate rows are merged, not
-- dropped: child rows (conversations, messages, deals, notes, tags,
-- custom values, broadcast recipients, automation/flow records) are
-- re-pointed to the surviving (oldest) contact before deletion.
-- ============================================================

-- 1) Normalized phone — STORED generated column, kept in lockstep
--    with `phone` by Postgres. Matches normalizePhone()
--    (src/lib/whatsapp/phone-utils.ts): strip every non-digit.
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS phone_normalized TEXT
  GENERATED ALWAYS AS (regexp_replace(phone, '\D', '', 'g')) STORED;

-- 2) One-time (re-runnable) merge of existing duplicates.
--    SECURITY DEFINER so it can re-point rows across tables
--    regardless of the caller's RLS; it only ever collapses exact
--    normalized duplicates within the same account.
CREATE OR REPLACE FUNCTION public.merge_duplicate_contacts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group   RECORD;
  v_survivor UUID;
  v_losers   UUID[];
  v_merged   INTEGER := 0;
BEGIN
  FOR v_group IN
    SELECT account_id,
           phone_normalized,
           array_agg(id ORDER BY created_at ASC, id ASC) AS ids
    FROM contacts
    WHERE phone_normalized <> ''
    GROUP BY account_id, phone_normalized
    HAVING count(*) > 1
  LOOP
    v_survivor := v_group.ids[1];
    v_losers   := v_group.ids[2:array_length(v_group.ids, 1)];

    -- Plain re-point: these tables have no contact-scoped unique
    -- constraint. `conversations` is ON DELETE CASCADE, so this
    -- re-point is what saves its rows (and their messages) from
    -- being deleted with the loser contact.
    UPDATE conversations                 SET contact_id = v_survivor WHERE contact_id = ANY(v_losers);
    UPDATE contact_notes                 SET contact_id = v_survivor WHERE contact_id = ANY(v_losers);
    UPDATE deals                         SET contact_id = v_survivor WHERE contact_id = ANY(v_losers);
    UPDATE broadcast_recipients          SET contact_id = v_survivor WHERE contact_id = ANY(v_losers);
    UPDATE automation_logs               SET contact_id = v_survivor WHERE contact_id = ANY(v_losers);
    UPDATE automation_pending_executions SET contact_id = v_survivor WHERE contact_id = ANY(v_losers);

    -- Conflict-guarded re-point for UNIQUE(contact_id, tag_id):
    -- move only tags the survivor doesn't already have, drop the rest.
    UPDATE contact_tags ct SET contact_id = v_survivor
      WHERE ct.contact_id = ANY(v_losers)
        AND NOT EXISTS (
          SELECT 1 FROM contact_tags s
          WHERE s.contact_id = v_survivor AND s.tag_id = ct.tag_id
        );
    DELETE FROM contact_tags WHERE contact_id = ANY(v_losers);

    -- Same guard for UNIQUE(contact_id, custom_field_id). Survivor's
    -- own value wins on conflict.
    UPDATE contact_custom_values cv SET contact_id = v_survivor
      WHERE cv.contact_id = ANY(v_losers)
        AND NOT EXISTS (
          SELECT 1 FROM contact_custom_values s
          WHERE s.contact_id = v_survivor AND s.custom_field_id = cv.custom_field_id
        );
    DELETE FROM contact_custom_values WHERE contact_id = ANY(v_losers);

    -- flow_runs has a partial UNIQUE on active runs per contact.
    -- Re-point only NON-active runs (exempt from the partial index)
    -- to preserve history; any active loser run is left to be
    -- NULLed by its FK's ON DELETE SET NULL when the loser is
    -- removed below — avoids colliding with the survivor's active run.
    UPDATE flow_runs SET contact_id = v_survivor
      WHERE contact_id = ANY(v_losers) AND status <> 'active';

    DELETE FROM contacts WHERE id = ANY(v_losers);

    v_merged := v_merged + COALESCE(array_length(v_losers, 1), 0);
  END LOOP;

  RETURN v_merged;
END;
$$;

ALTER FUNCTION public.merge_duplicate_contacts() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.merge_duplicate_contacts() FROM PUBLIC;

-- Collapse whatever duplicates exist right now.
SELECT public.merge_duplicate_contacts();

-- 3) Authoritative guarantee. Partial index defends against any
--    empty normalized value (phone is NOT NULL, but belt-and-braces).
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_account_phone_normalized
  ON contacts (account_id, phone_normalized)
  WHERE phone_normalized <> '';


-- ============================================================
-- SOURCE: 023_chat_media.sql
-- ============================================================

-- ============================================================
-- 023_chat_media.sql
--
-- Adds the `chat-media` Supabase Storage bucket used when an agent
-- sends a photo / video / document / voice note from the inbox
-- composer (issue #213). Today media can only be RECEIVED from
-- customers or sent via the Flows `send_media` node — never typed
-- and sent live in a 1:1 thread.
--
-- Mirrors the `flow-media` bucket (migration 016) and its
-- account-scoped storage RLS (migration 020), with two differences:
--
--   1. A separate bucket so chat attachments and flow-builder media
--      stay conceptually distinct (and so a future per-bucket size /
--      retention policy can diverge without touching flows).
--
--   2. The allowed MIME list adds the audio types Meta accepts for
--      outbound voice notes — audio/ogg (Opus), audio/mpeg, audio/aac,
--      audio/mp4, audio/amr. Browser recordings (WebM/Opus) are
--      transcoded to audio/ogg BEFORE upload, so WebM never lands
--      here and isn't allow-listed.
--
-- Path convention (same as flow-media post-020):
--   chat-media/account-<account_id>/<timestamp>-<basename>.<ext>
-- The bucket is public so Meta can fetch the URL without auth; writes
-- are scoped to account members via the path's first segment.
--
-- Size limit 16 MB — Meta's tightest universal cap (video). Documents
-- can technically be 100 MB on Meta, but we hold the universal cap to
-- match flow-media and keep one limit to reason about.
--
-- Idempotent — safe to re-run.
-- ============================================================

-- ============================================================
-- 1. chat-media storage bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-media',
  'chat-media',
  TRUE,
  16777216, -- 16 MB (Meta video cap; documents/images/audio fit under this)
  ARRAY[
    -- Images
    'image/png', 'image/jpeg', 'image/webp',
    -- Videos
    'video/mp4', 'video/3gpp',
    -- Documents
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    -- Audio (voice notes) — only Meta-accepted outbound types. Browser
    -- WebM/Opus is transcoded to audio/ogg before upload.
    'audio/ogg',
    'audio/mpeg',
    'audio/aac',
    'audio/mp4',
    'audio/amr'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================
-- 2. Storage RLS — account-scoped writes, public reads
--
-- Same predicate shape as migration 020's flow-media policies:
-- writes are allowed when the path's first segment is
-- `account-<account_id>` for an account the caller belongs to.
-- Reads are public (the bucket is public so Meta can fetch links).
--
-- Drop-then-create (Postgres has no CREATE POLICY IF NOT EXISTS).
-- ============================================================
DROP POLICY IF EXISTS "Chat media is publicly readable" ON storage.objects;
CREATE POLICY "Chat media is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-media');

DROP POLICY IF EXISTS "Members can upload chat media" ON storage.objects;
CREATE POLICY "Members can upload chat media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Members can update chat media" ON storage.objects;
CREATE POLICY "Members can update chat media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'chat-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Members can delete chat media" ON storage.objects;
CREATE POLICY "Members can delete chat media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'chat-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
    )
  );


-- ============================================================
-- SOURCE: 024_member_presence.sql
-- ============================================================

-- ============================================================
-- 024_member_presence.sql — team member presence (online / away)
--
-- Adds a lightweight presence layer so the Team members roster (and
-- the inbox Assign dropdown) can show who is actively using the
-- dashboard, idle, or gone. Implements wacrm#269.
--
-- Design
--
--   The active client heartbeats its own row through the
--   `touch_presence` RPC roughly every 30s, storing only 'online'
--   or 'away'. "Offline" is NOT stored — viewers derive it from
--   staleness (`now() - last_seen_at` beyond a threshold), so a
--   closed tab / logout resolves to offline automatically without
--   relying on an unreliable unload write.
--
--   A dedicated table keeps the high-write heartbeat off the
--   otherwise-stable `profiles` row and scopes Realtime cleanly.
--
-- Visibility
--
--   Any account member can read presence for their account — the
--   same visibility as the read-only roster (`is_account_member`).
--   Writes go ONLY through the SECURITY DEFINER RPC, which derives
--   the account from the caller's profile (never client-supplied).
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ---- table -------------------------------------------------
CREATE TABLE IF NOT EXISTS member_presence (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id   UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'away')),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS member_presence_account_idx
  ON member_presence(account_id);

-- ---- RLS ---------------------------------------------------
ALTER TABLE member_presence ENABLE ROW LEVEL SECURITY;

-- Account members may read every presence row for their account.
-- No client INSERT/UPDATE/DELETE policy exists: all writes flow
-- through touch_presence() below.
DROP POLICY IF EXISTS member_presence_select ON member_presence;
CREATE POLICY member_presence_select ON member_presence FOR SELECT
  USING (is_account_member(account_id));

-- ---- heartbeat RPC -----------------------------------------
-- Upserts the caller's presence row. SECURITY DEFINER so it can
-- write despite the absence of a client write policy; the account
-- is resolved from the caller's own profile, so a client can never
-- spoof which account it appears in.
CREATE OR REPLACE FUNCTION public.touch_presence(
  p_status TEXT DEFAULT 'online'
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('online', 'away') THEN
    RAISE EXCEPTION 'Invalid presence status: %', p_status
      USING ERRCODE = '22023';
  END IF;

  SELECT account_id INTO v_account_id
  FROM profiles
  WHERE user_id = auth.uid();

  IF v_account_id IS NULL THEN
    RAISE EXCEPTION 'No account for caller' USING ERRCODE = '22023';
  END IF;

  INSERT INTO member_presence (user_id, account_id, status, last_seen_at)
  VALUES (auth.uid(), v_account_id, p_status, now())
  ON CONFLICT (user_id) DO UPDATE
    SET status       = excluded.status,
        last_seen_at = now(),
        account_id   = excluded.account_id;
END;
$$;

-- ---- realtime ----------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'member_presence'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE member_presence;
  END IF;
END $$;


-- ============================================================
-- SOURCE: 025_filter_contacts_by_tags.sql
-- ============================================================

-- ============================================================
-- 025_filter_contacts_by_tags.sql — server-side tag filter
--
-- Why an RPC
--
--   The Contacts page filters by tag by resolving the selected
--   tags to contact ids and paging the result. Doing that on the
--   client (SELECT contact_id FROM contact_tags WHERE tag_id IN …,
--   then .in('id', ids) on contacts) hits two PostgREST limits for
--   accounts where a tag covers many contacts:
--     - the unbounded contact_tags select is silently capped
--       (~1000 rows), dropping contacts from the filter, and
--     - the follow-up .in('id', ids) pushes every matching id into
--       one IN-clause (the ~1000-value cap the broadcast sender
--       already pages around) and bloats the request URL.
--
--   Both break the total count and pagination. This function does
--   the join, de-duplication (OR across tags), ordering, windowed
--   total count, and LIMIT/OFFSET in one query so the result is
--   always complete and correctly counted.
--
-- Security
--
--   SECURITY INVOKER (the default): the function runs as the
--   caller, so the existing RLS on `contacts` and `contact_tags`
--   (account membership, migration 017) scopes the result to the
--   caller's account. No privilege bypass — unlike the SECURITY
--   DEFINER member RPCs in 018/019.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

CREATE OR REPLACE FUNCTION public.filter_contacts_by_tags(
  p_tag_ids UUID[],
  p_search TEXT DEFAULT NULL,
  p_limit INT DEFAULT 25,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (contact contacts, total_count BIGINT)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH matched AS (
    -- Distinct contacts having ANY of the selected tags (OR),
    -- narrowed by the same name/phone/email search as the list.
    SELECT DISTINCT c.id, c.created_at
    FROM contacts c
    JOIN contact_tags ct ON ct.contact_id = c.id
    WHERE ct.tag_id = ANY(p_tag_ids)
      AND (
        p_search IS NULL
        OR c.name ILIKE '%' || p_search || '%'
        OR c.phone ILIKE '%' || p_search || '%'
        OR c.email ILIKE '%' || p_search || '%'
      )
  ),
  page AS (
    -- count(*) OVER() is evaluated before LIMIT, so it is the full
    -- match total regardless of the page being returned.
    SELECT id, count(*) OVER() AS total_count
    FROM matched
    ORDER BY created_at DESC, id
    LIMIT p_limit OFFSET p_offset
  )
  SELECT c AS contact, page.total_count
  FROM page
  JOIN contacts c ON c.id = page.id
  ORDER BY c.created_at DESC, c.id;
$$;

ALTER FUNCTION public.filter_contacts_by_tags(UUID[], TEXT, INT, INT) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.filter_contacts_by_tags(UUID[], TEXT, INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.filter_contacts_by_tags(UUID[], TEXT, INT, INT) TO authenticated;


-- ============================================================
-- SOURCE: 026_api_keys.sql
-- ============================================================

-- ============================================================
-- 026_api_keys.sql — Public API credentials (groundwork)
--
-- Adds the `api_keys` table backing the public REST API
-- (`/api/v1/*`). A key authenticates a *machine* caller (a script,
-- an n8n/Zapier-style automation, a cron) against one account, the
-- same way the cookie session authenticates a *human* in the
-- dashboard.
--
-- Design notes
--   - Account-scoped, never user-scoped. A key belongs to the
--     account; `created_by` only records who minted it (audit), and
--     is ON DELETE SET NULL so removing a teammate doesn't cascade-
--     delete the keys their automations still depend on.
--   - We store only the SHA-256 *hash* of the key, never plaintext.
--     A leaked DB snapshot (backup, log, support export) therefore
--     can't be replayed against the API — the caller would need the
--     original key, which is returned exactly once at creation. Same
--     pattern as `account_invitations.token_hash` (migration 017/019).
--   - `key_prefix` is a short, non-secret display string
--     (`wacrm_live_a1b2c3d4`) so the dashboard can show "which key
--     is this" in a list without ever resurfacing the secret.
--   - Authorization is by `scopes[]` (scopes-only model), resolved
--     in the application layer (`src/lib/api-keys/scopes.ts`). The
--     DB doesn't constrain the scope vocabulary — a future scope is
--     a code change, not a migration.
--
-- RLS
--   `api_keys` is a settings-class table: any member may *read* the
--   roster of keys for their account; only admin+ may create/revoke
--   (mirrors the `tags` / `custom_fields` policies in 017). The
--   public-API auth path itself reads keys with the service-role
--   client (RLS-bypassing) because an API caller has no Supabase
--   session and therefore no `auth.uid()` for a policy to match.
--
-- Idempotent — safe to run multiple times. Table uses IF NOT
-- EXISTS; policies are dropped before recreate (Postgres has no
-- CREATE POLICY IF NOT EXISTS).
-- ============================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id   uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name         text NOT NULL,
  key_prefix   text NOT NULL,             -- display only, e.g. "wacrm_live_a1b2c3d4"
  key_hash     text NOT NULL UNIQUE,      -- SHA-256 hex of the full plaintext key
  scopes       text[] NOT NULL DEFAULT '{}',
  last_used_at timestamptz,
  expires_at   timestamptz,               -- NULL = never expires
  revoked_at   timestamptz,               -- NULL = active
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- account_id: every "list this account's keys" query filters on it.
CREATE INDEX IF NOT EXISTS api_keys_account_id_idx ON api_keys (account_id);
-- key_hash: the hot path is the per-request auth lookup by hash. The
-- UNIQUE constraint already creates an index, but spell it out so the
-- intent (this is the lookup key) is documented and survives a future
-- drop of the UNIQUE constraint.
CREATE INDEX IF NOT EXISTS api_keys_key_hash_idx ON api_keys (key_hash);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- SELECT: any member of the account (viewer+) can see the roster.
-- key_hash is in the table but the dashboard never selects it.
DROP POLICY IF EXISTS api_keys_select ON api_keys;
CREATE POLICY api_keys_select ON api_keys FOR SELECT
  USING (is_account_member(account_id));

-- INSERT / UPDATE / DELETE: admin+ only (settings-class). Revoking a
-- key is an UPDATE that sets `revoked_at`; we keep DELETE available
-- too for operators who'd rather hard-delete.
DROP POLICY IF EXISTS api_keys_insert ON api_keys;
CREATE POLICY api_keys_insert ON api_keys FOR INSERT
  WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS api_keys_update ON api_keys;
CREATE POLICY api_keys_update ON api_keys FOR UPDATE
  USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS api_keys_delete ON api_keys;
CREATE POLICY api_keys_delete ON api_keys FOR DELETE
  USING (is_account_member(account_id, 'admin'));


-- ============================================================
-- SOURCE: 027_ai_summaries.sql
-- ============================================================

-- ============================================================
-- Migration 027: AI Summaries
-- Adds an `ai_summary` column to the `conversations` table
-- to cache LLM-generated summaries.
-- ============================================================

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ai_summary TEXT;


-- ============================================================
-- SOURCE: 028_ai_auto_reply.sql
-- ============================================================

-- Add AI Auto-Reply settings to whatsapp_config table
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS ai_auto_reply_enabled BOOLEAN DEFAULT false;
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS ai_auto_reply_prompt TEXT DEFAULT 'You are a helpful customer support assistant for this business.';


-- ============================================================
-- SOURCE: 029_ai_improvements.sql
-- ============================================================

-- Add is_bot_paused to conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_bot_paused BOOLEAN DEFAULT false;

-- Add ai_knowledge_base to whatsapp_config
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS ai_knowledge_base TEXT DEFAULT '';


-- ============================================================
-- SOURCE: 030_ai_sentiment_lead_scoring.sql
-- ============================================================

-- Migration to add AI analysis columns to conversations table

ALTER TABLE conversations
ADD COLUMN ai_sentiment TEXT CHECK (ai_sentiment IN ('positive', 'neutral', 'negative')),
ADD COLUMN ai_lead_score TEXT CHECK (ai_lead_score IN ('cold', 'warm', 'hot'));


-- ============================================================
-- SOURCE: 031_tasks.sql
-- ============================================================

-- Migration to add tasks table for follow-ups and AI recommendations

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_contact_id ON tasks(contact_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SOURCE: 032_sales_features.sql
-- ============================================================

-- Migration to add meetings and quotes tables for Sales CRM features

-- ============================================================
-- MEETINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_link TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_contact_id ON meetings(contact_id);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own meetings" ON meetings;
CREATE POLICY "Users can manage own meetings" ON meetings FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- QUOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  valid_until DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_contact_id ON quotes(contact_id);
CREATE INDEX IF NOT EXISTS idx_quotes_deal_id ON quotes(deal_id);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own quotes" ON quotes;
CREATE POLICY "Users can manage own quotes" ON quotes FOR ALL USING (auth.uid() = user_id);


-- ============================================================
-- SOURCE: 033_meeting_notes_and_cron.sql
-- ============================================================

-- Migration to add meeting notes and pg_cron automated reminders

-- 1. Add columns to meetings table for tracking notes and reminders
ALTER TABLE meetings 
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS reminder_morning_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_evening_sent BOOLEAN DEFAULT false;

-- 2. Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 3. Schedule the Cron Job
-- Note: the cron job makes an HTTP POST request to your API route
-- You must update the URL below to match your production domain before deploying to prod.
-- For local testing, pg_net cannot hit 'localhost', so you must use a tool like ngrok
-- or hit the endpoint manually.

SELECT cron.schedule(
  'meeting_reminders',
  '0 * * * *', -- Run every hour at minute 0
  $$
    SELECT net.http_post(
        url:='https://your-production-domain.com/api/cron/meeting-reminders',
        headers:='{"Content-Type": "application/json"}',
        body:='{}'
    );
  $$
);


-- ============================================================
-- SOURCE: 034_flow_delay_node.sql
-- ============================================================

-- ============================================================
-- Add 'delay' node to flow builder and 'paused' status to flow runs
-- ============================================================

-- 1. flow_runs.status — add 'paused'
ALTER TABLE flow_runs
  DROP CONSTRAINT IF EXISTS flow_runs_status_check;

ALTER TABLE flow_runs
  ADD CONSTRAINT flow_runs_status_check
  CHECK (status IN (
    'active',           -- currently awaiting customer input
    'completed',        -- reached an end node naturally
    'handed_off',       -- ended via a handoff node
    'timed_out',        -- swept by the cron after fallback_policy.on_timeout_hours
    'paused_by_agent',  -- an agent manually replied; flow yielded
    'failed',           -- runner hit an unrecoverable error
    'paused'            -- waiting for a delay node to expire
  ));

-- 2. flow_runs.resume_at — column for the delay node
ALTER TABLE flow_runs
  ADD COLUMN IF NOT EXISTS resume_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_flow_runs_paused_resume
  ON flow_runs(resume_at)
  WHERE status = 'paused';

-- 3. flow_nodes.node_type — add 'delay'
ALTER TABLE flow_nodes
  DROP CONSTRAINT IF EXISTS flow_nodes_node_type_check;

ALTER TABLE flow_nodes
  ADD CONSTRAINT flow_nodes_node_type_check
  CHECK (node_type IN (
    'start',
    'send_buttons',
    'send_list',
    'send_message',
    'send_media',
    'collect_input',
    'condition',
    'set_tag',
    'handoff',
    'http_fetch',
    'delay',
    'end'
  ));


-- ============================================================
-- SOURCE: 035_agent_scorecard_and_intelligence.sql
-- ============================================================

-- ============================================================
-- 035_agent_scorecard_and_intelligence.sql
-- ============================================================

-- 1. Create conversation_metrics table
CREATE TABLE IF NOT EXISTS conversation_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_response_time_ms BIGINT,
  resolution_time_ms BIGINT,
  csat_score INTEGER CHECK (csat_score BETWEEN 1 AND 5),
  csat_submitted_at TIMESTAMPTZ,
  message_count_agent INTEGER DEFAULT 0,
  message_count_bot INTEGER DEFAULT 0,
  message_count_customer INTEGER DEFAULT 0,
  resolved_by TEXT CHECK (resolved_by IN ('agent', 'bot')),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_metrics_account ON conversation_metrics(account_id);
CREATE INDEX IF NOT EXISTS idx_conversation_metrics_agent ON conversation_metrics(assigned_agent_id);

-- Enable RLS for conversation_metrics
ALTER TABLE conversation_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS conversation_metrics_select ON conversation_metrics;
DROP POLICY IF EXISTS conversation_metrics_all ON conversation_metrics;

CREATE POLICY conversation_metrics_select ON conversation_metrics
  FOR SELECT USING (is_account_member(account_id));
CREATE POLICY conversation_metrics_all ON conversation_metrics
  FOR ALL USING (is_account_member(account_id, 'agent')) WITH CHECK (is_account_member(account_id, 'agent'));


-- 2. Create conversation_topics table
CREATE TABLE IF NOT EXISTS conversation_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  confidence REAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_topics_account ON conversation_topics(account_id);
CREATE INDEX IF NOT EXISTS idx_conversation_topics_conv ON conversation_topics(conversation_id);

-- Enable RLS for conversation_topics
ALTER TABLE conversation_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS conversation_topics_select ON conversation_topics;
DROP POLICY IF EXISTS conversation_topics_all ON conversation_topics;

CREATE POLICY conversation_topics_select ON conversation_topics
  FOR SELECT USING (is_account_member(account_id));
CREATE POLICY conversation_topics_all ON conversation_topics
  FOR ALL USING (is_account_member(account_id, 'agent')) WITH CHECK (is_account_member(account_id, 'agent'));


-- 3. Create ai_insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('faq', 'churn_risk', 'topic_trend')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_account ON ai_insights(account_id);

-- Enable RLS for ai_insights
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_insights_select ON ai_insights;
DROP POLICY IF EXISTS ai_insights_all ON ai_insights;

CREATE POLICY ai_insights_select ON ai_insights
  FOR SELECT USING (is_account_member(account_id));
CREATE POLICY ai_insights_all ON ai_insights
  FOR ALL USING (is_account_member(account_id, 'agent')) WITH CHECK (is_account_member(account_id, 'agent'));


-- 4. Add topic and auto-tag columns to conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS ai_topic TEXT,
  ADD COLUMN IF NOT EXISTS ai_auto_tags TEXT[];


-- 5. Trigger to update metrics on new messages
CREATE OR REPLACE FUNCTION update_conversation_metrics_on_message()
RETURNS TRIGGER AS $$
DECLARE
  v_account_id UUID;
  v_assigned_agent_id UUID;
  v_last_customer_msg_at TIMESTAMPTZ;
  v_first_resp_time_ms BIGINT;
BEGIN
  -- Get account_id and current assigned agent from conversations
  SELECT account_id, assigned_agent_id INTO v_account_id, v_assigned_agent_id
  FROM conversations
  WHERE id = NEW.conversation_id;

  -- Ensure we have a conversation_metrics row
  INSERT INTO conversation_metrics (account_id, conversation_id, assigned_agent_id)
  VALUES (v_account_id, NEW.conversation_id, v_assigned_agent_id)
  ON CONFLICT (conversation_id) DO UPDATE
  SET assigned_agent_id = COALESCE(EXCLUDED.assigned_agent_id, conversation_metrics.assigned_agent_id);

  -- Increment message counts based on sender_type
  IF NEW.sender_type = 'customer' THEN
    UPDATE conversation_metrics
    SET message_count_customer = message_count_customer + 1
    WHERE conversation_id = NEW.conversation_id;

    -- If this customer message is a number between 1 and 5, check if we should record CSAT
    IF NEW.content_type = 'text' AND NEW.content_text ~ '^[1-5]$' THEN
      UPDATE conversation_metrics
      SET 
        csat_score = NEW.content_text::integer,
        csat_submitted_at = NOW()
      WHERE conversation_id = NEW.conversation_id
        AND csat_score IS NULL
        AND closed_at >= NOW() - INTERVAL '24 hours';
    END IF;

  ELSIF NEW.sender_type = 'agent' THEN
    UPDATE conversation_metrics
    SET message_count_agent = message_count_agent + 1
    WHERE conversation_id = NEW.conversation_id;

    -- Calculate first response time if not already set
    SELECT first_response_time_ms INTO v_first_resp_time_ms
    FROM conversation_metrics
    WHERE conversation_id = NEW.conversation_id;

    IF v_first_resp_time_ms IS NULL THEN
      -- Find the first customer message in this conversation
      SELECT MIN(created_at) INTO v_last_customer_msg_at
      FROM messages
      WHERE conversation_id = NEW.conversation_id AND sender_type = 'customer';

      IF v_last_customer_msg_at IS NOT NULL THEN
        UPDATE conversation_metrics
        SET first_response_time_ms = EXTRACT(EPOCH FROM (NEW.created_at - v_last_customer_msg_at)) * 1000
        WHERE conversation_id = NEW.conversation_id;
      END IF;
    END IF;

  ELSIF NEW.sender_type = 'bot' THEN
    UPDATE conversation_metrics
    SET message_count_bot = message_count_bot + 1
    WHERE conversation_id = NEW.conversation_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_metrics ON messages;
CREATE TRIGGER trigger_update_conversation_metrics
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_metrics_on_message();


-- 6. Trigger to update metrics on conversation status/agent updates
CREATE OR REPLACE FUNCTION update_conversation_metrics_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_agent_msg_count INTEGER;
BEGIN
  -- Ensure the metrics row exists
  INSERT INTO conversation_metrics (account_id, conversation_id, assigned_agent_id)
  VALUES (NEW.account_id, NEW.id, NEW.assigned_agent_id)
  ON CONFLICT (conversation_id) DO UPDATE
  SET assigned_agent_id = COALESCE(EXCLUDED.assigned_agent_id, conversation_metrics.assigned_agent_id);

  -- If conversation is closed
  IF NEW.status = 'closed' AND OLD.status <> 'closed' THEN
    -- Check if agent ever sent a message in this conversation
    SELECT COUNT(*) INTO v_agent_msg_count
    FROM messages
    WHERE conversation_id = NEW.id AND sender_type = 'agent';

    UPDATE conversation_metrics
    SET 
      closed_at = NOW(),
      resolved_by = CASE WHEN v_agent_msg_count > 0 THEN 'agent' ELSE 'bot' END,
      resolution_time_ms = EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) * 1000
    WHERE conversation_id = NEW.id;
  END IF;

  -- Sync assigned agent
  IF NEW.assigned_agent_id IS DISTINCT FROM OLD.assigned_agent_id THEN
    UPDATE conversation_metrics
    SET assigned_agent_id = NEW.assigned_agent_id
    WHERE conversation_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_metrics_status ON conversations;
CREATE TRIGGER trigger_update_conversation_metrics_status
AFTER UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_conversation_metrics_on_status_change();


-- ============================================================
-- SOURCE: 036_sla_and_followup.sql
-- ============================================================

-- Add SLA configuration to whatsapp_config
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS sla_enabled BOOLEAN DEFAULT true;
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS sla_first_reply_min INTEGER DEFAULT 5;
ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS sla_subsequent_reply_min INTEGER DEFAULT 15;

-- Add last message sender type tracking to conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_message_sender_type TEXT CHECK (last_message_sender_type IN ('customer', 'agent', 'bot'));

-- Create/update the trigger function on messages to record last_message_sender_type
CREATE OR REPLACE FUNCTION update_conversation_metrics_on_message()
RETURNS TRIGGER AS $$
DECLARE
  v_account_id UUID;
  v_assigned_agent_id UUID;
  v_last_customer_msg_at TIMESTAMPTZ;
  v_first_resp_time_ms BIGINT;
BEGIN
  -- Get account_id and current assigned agent from conversations
  SELECT account_id, assigned_agent_id INTO v_account_id, v_assigned_agent_id
  FROM conversations
  WHERE id = NEW.conversation_id;

  -- Ensure we have a conversation_metrics row
  INSERT INTO conversation_metrics (account_id, conversation_id, assigned_agent_id)
  VALUES (v_account_id, NEW.conversation_id, v_assigned_agent_id)
  ON CONFLICT (conversation_id) DO UPDATE
  SET assigned_agent_id = COALESCE(EXCLUDED.assigned_agent_id, conversation_metrics.assigned_agent_id);

  -- Update conversations table with last_message_sender_type
  UPDATE conversations
  SET last_message_sender_type = NEW.sender_type
  WHERE id = NEW.conversation_id;

  -- Increment message counts based on sender_type
  IF NEW.sender_type = 'customer' THEN
    UPDATE conversation_metrics
    SET message_count_customer = message_count_customer + 1
    WHERE conversation_id = NEW.conversation_id;

    -- If this customer message is a number between 1 and 5, check if we should record CSAT
    IF NEW.content_type = 'text' AND NEW.content_text ~ '^[1-5]$' THEN
      UPDATE conversation_metrics
      SET 
        csat_score = NEW.content_text::integer,
        csat_submitted_at = NOW()
      WHERE conversation_id = NEW.conversation_id
        AND csat_score IS NULL
        AND closed_at >= NOW() - INTERVAL '24 hours';
    END IF;

  ELSIF NEW.sender_type = 'agent' THEN
    UPDATE conversation_metrics
    SET message_count_agent = message_count_agent + 1
    WHERE conversation_id = NEW.conversation_id;

    -- Calculate first response time if not already set
    SELECT first_response_time_ms INTO v_first_resp_time_ms
    FROM conversation_metrics
    WHERE conversation_id = NEW.conversation_id;

    IF v_first_resp_time_ms IS NULL THEN
      -- Find the first customer message in this conversation
      SELECT MIN(created_at) INTO v_last_customer_msg_at
      FROM messages
      WHERE conversation_id = NEW.conversation_id AND sender_type = 'customer';

      IF v_last_customer_msg_at IS NOT NULL THEN
        UPDATE conversation_metrics
        SET first_response_time_ms = EXTRACT(EPOCH FROM (NEW.created_at - v_last_customer_msg_at)) * 1000
        WHERE conversation_id = NEW.conversation_id;
      END IF;
    END IF;

  ELSIF NEW.sender_type = 'bot' THEN
    UPDATE conversation_metrics
    SET message_count_bot = message_count_bot + 1
    WHERE conversation_id = NEW.conversation_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Backfill existing conversations with their last message sender type
UPDATE conversations c
SET last_message_sender_type = COALESCE(
  (SELECT sender_type FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1),
  'customer'
);


-- ============================================================
-- SOURCE: 037_saas_platform.sql
-- ============================================================

-- ============================================================
-- 037_saas_platform.sql — SaaS Platform Layer
--
-- Adds subscription plans, account status, usage tracking, and
-- a platform super-admin flag to turn wacrm into a multi-tenant
-- SaaS platform where the operator can manage all client accounts.
--
-- Plans:
--   free       — 500 contacts, 1 000 messages/month
--   starter    — 2 000 contacts, 5 000 messages/month
--   pro        — 10 000 contacts, 30 000 messages/month
--   enterprise — unlimited (-1)
--
-- Status lifecycle:
--   active → suspended (by admin) → active
--   active → cancelled (irrecoverable except by admin reset)
--
-- Idempotent — safe to run multiple times.
-- ============================================================

-- ============================================================
-- 1. PLAN + STATUS ENUM / COLUMNS ON ACCOUNTS
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_plan_enum') THEN
    CREATE TYPE account_plan_enum AS ENUM ('free', 'starter', 'pro', 'enterprise');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status_enum') THEN
    CREATE TYPE account_status_enum AS ENUM ('active', 'suspended', 'cancelled');
  END IF;
END $$;

ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS plan            account_plan_enum   NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS status          account_status_enum NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS trial_ends_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notes           TEXT,           -- operator internal notes / invoice refs
  ADD COLUMN IF NOT EXISTS max_contacts    INTEGER         NOT NULL DEFAULT 500,
  ADD COLUMN IF NOT EXISTS max_messages_pm INTEGER         NOT NULL DEFAULT 1000; -- per month

-- ============================================================
-- 2. PLATFORM SUPER-ADMIN FLAG ON PROFILES
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_platform_admin BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- 3. MONTHLY USAGE TRACKING
--
-- One row per (account, calendar month). Counters are incremented
-- by server-side API routes — not via client triggers — so they
-- use service-role and bypass RLS.
-- ============================================================
CREATE TABLE IF NOT EXISTS account_usage (
  id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id        UUID         NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  month             DATE         NOT NULL,   -- always the 1st of the month
  messages_sent     INTEGER      NOT NULL DEFAULT 0,
  contacts_count    INTEGER      NOT NULL DEFAULT 0,  -- snapshot, not delta
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(account_id, month)
);

CREATE INDEX IF NOT EXISTS idx_account_usage_account ON account_usage(account_id, month DESC);

ALTER TABLE account_usage ENABLE ROW LEVEL SECURITY;

-- Platform admin can see all usage; account members can see their own.
DROP POLICY IF EXISTS account_usage_select ON account_usage;
CREATE POLICY account_usage_select ON account_usage FOR SELECT USING (
  is_account_member(account_id)
);

-- ============================================================
-- 4. SUSPENDED ACCOUNT GUARD
--
-- A SECURITY DEFINER function that returns TRUE if the current
-- user's account is active. Used by the middleware to gate
-- dashboard access and by plan-limit helpers in API routes.
-- ============================================================
CREATE OR REPLACE FUNCTION is_account_active(target_account_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM accounts
    WHERE id = target_account_id AND status = 'active'
  );
$$;

ALTER FUNCTION is_account_active(UUID) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION is_account_active(UUID) TO authenticated, service_role;

-- ============================================================
-- 5. BACKFILL — ensure every existing account has sensible defaults
-- (plan + status were added with defaults so this is a no-op if
--  the column already has the default, but explicit for clarity)
-- ============================================================
UPDATE accounts
SET
  plan   = 'free',
  status = 'active'
WHERE plan IS NULL OR status IS NULL;

-- ============================================================
-- 6. INDEXES for operator queries (list all accounts by plan/status)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_accounts_plan   ON accounts(plan);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_created ON accounts(created_at DESC);

-- ============================================================
-- 7. PLATFORM ADMIN RLS
--
-- Platform admins need to read/write all accounts and profiles.
-- We do this via a helper that checks the caller's own profile
-- for is_platform_admin = true (SECURITY DEFINER so it can
-- read profiles without recursion).
-- ============================================================
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT is_platform_admin FROM profiles WHERE user_id = auth.uid()
  ), false);
$$;

ALTER FUNCTION is_platform_admin() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION is_platform_admin() TO authenticated, service_role;

-- Extend existing accounts RLS to allow platform admins full access
DROP POLICY IF EXISTS accounts_select ON accounts;
DROP POLICY IF EXISTS accounts_update ON accounts;
DROP POLICY IF EXISTS accounts_platform_admin ON accounts;

CREATE POLICY accounts_select ON accounts FOR SELECT
  USING (is_account_member(id) OR is_platform_admin());

CREATE POLICY accounts_update ON accounts FOR UPDATE
  USING (is_account_member(id, 'admin') OR is_platform_admin())
  WITH CHECK (is_account_member(id, 'admin') OR is_platform_admin());

-- Platform admin can also INSERT new accounts (admin-created clients)
DROP POLICY IF EXISTS accounts_insert ON accounts;
CREATE POLICY accounts_insert ON accounts FOR INSERT
  WITH CHECK (is_platform_admin());

-- Platform admin can see all profiles (needed for the clients list)
DROP POLICY IF EXISTS profiles_select ON profiles;
CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (auth.uid() = user_id OR is_account_member(account_id) OR is_platform_admin());


-- ============================================================
-- SOURCE: 038_invoices_and_alerts.sql
-- ============================================================

-- ============================================================
-- 038_invoices_and_alerts.sql — Growth Features Additions
--
-- Adds tables for manual invoicing and usage alert tracking.
-- ============================================================

-- ============================================================
-- 1. INVOICES
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status_enum') THEN
    CREATE TYPE invoice_status_enum AS ENUM ('unpaid', 'paid', 'overdue');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS invoices (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id        UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount            NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status            invoice_status_enum NOT NULL DEFAULT 'unpaid',
  issue_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date          DATE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_account ON invoices(account_id, issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Platform Admin full access; Account members can only read their own invoices
DROP POLICY IF EXISTS invoices_select ON invoices;
CREATE POLICY invoices_select ON invoices FOR SELECT USING (
  is_account_member(account_id) OR is_platform_admin()
);

DROP POLICY IF EXISTS invoices_insert ON invoices;
CREATE POLICY invoices_insert ON invoices FOR INSERT WITH CHECK (
  is_platform_admin()
);

DROP POLICY IF EXISTS invoices_update ON invoices;
CREATE POLICY invoices_update ON invoices FOR UPDATE USING (
  is_platform_admin()
) WITH CHECK (
  is_platform_admin()
);

DROP POLICY IF EXISTS invoices_delete ON invoices;
CREATE POLICY invoices_delete ON invoices FOR DELETE USING (
  is_platform_admin()
);

-- ============================================================
-- 2. USAGE ALERTS
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type_enum') THEN
    CREATE TYPE alert_type_enum AS ENUM (
      'contact_80', 'contact_100',
      'message_80', 'message_100'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS account_alerts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id        UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  alert_type        alert_type_enum NOT NULL,
  month             DATE NOT NULL, -- The billing month this alert was fired for (1st of the month)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Ensure we only record one alert of a specific type per account per month
  UNIQUE(account_id, alert_type, month)
);

CREATE INDEX IF NOT EXISTS idx_alerts_account ON account_alerts(account_id, month DESC);

ALTER TABLE account_alerts ENABLE ROW LEVEL SECURITY;

-- Service role will insert these, so we only need SELECT policies
DROP POLICY IF EXISTS alerts_select ON account_alerts;
CREATE POLICY alerts_select ON account_alerts FOR SELECT USING (
  is_account_member(account_id) OR is_platform_admin()
);


-- ============================================================
-- SOURCE: 039_24h_ai_reminder_cron.sql
-- ============================================================

-- Migration to add automated 24h AI follow-up reminders

-- 1. Ensure pg_cron and pg_net are enabled (should already be, but good practice)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Define the webhook URL and secret
-- The URL uses the Supabase Edge Function or internal URL. 
-- In development, Next.js runs on a different port, but in production, we typically use the public URL.
-- To ensure this is dynamic across environments, you can manually update the pg_cron job in Supabase dashboard 
-- with your production domain, but we'll use a placeholder/env standard here.

DO $$
BEGIN
  -- We'll schedule the cron job to run every 5 minutes.
  -- It sends a POST request to your Next.js application at /api/cron/24h-reminder.
  
  PERFORM cron.schedule(
    'ai-24h-reminder',
    '*/5 * * * *',
    $$
    SELECT net.http_post(
      url:='https://your-production-domain.com/api/cron/24h-reminder',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_CRON_SECRET_HERE"}'::jsonb
    )
    $$
  );
END $$;


-- ============================================================
-- SOURCE: 040_dynamic_pricing_plans.sql
-- ============================================================

-- ============================================================
-- 040_dynamic_pricing_plans.sql
-- ============================================================

-- 1. Create the new pricing_plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  monthly_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  annual_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_contacts INTEGER NOT NULL DEFAULT 500,
  max_messages_pm INTEGER NOT NULL DEFAULT 1000,
  user_limits INTEGER NOT NULL DEFAULT 1,
  automation_limits INTEGER NOT NULL DEFAULT 0,
  api_limits INTEGER NOT NULL DEFAULT 0,
  chatbot_limits INTEGER NOT NULL DEFAULT 0,
  storage_limits_mb INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  badge_color TEXT NOT NULL DEFAULT 'bg-muted text-muted-foreground',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY pricing_plans_select ON pricing_plans FOR SELECT USING (true);
CREATE POLICY pricing_plans_all ON pricing_plans FOR ALL USING (is_platform_admin());

-- Insert defaults
INSERT INTO pricing_plans (slug, name, description, max_contacts, max_messages_pm, badge_color, sort_order)
VALUES 
  ('free', 'Free', 'Try the platform with basic limits.', 500, 1000, 'bg-muted text-muted-foreground', 1),
  ('starter', 'Starter', 'For small teams getting started.', 2000, 5000, 'bg-blue-500/15 text-blue-400', 2),
  ('pro', 'Pro', 'For growing businesses.', 10000, 30000, 'bg-violet-500/15 text-violet-400', 3),
  ('enterprise', 'Enterprise', 'Unlimited — custom invoicing.', -1, -1, 'bg-amber-500/15 text-amber-400', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. Alter `accounts.plan` from ENUM to TEXT
ALTER TABLE accounts ALTER COLUMN plan DROP DEFAULT;
ALTER TABLE accounts ALTER COLUMN plan TYPE TEXT USING plan::TEXT;
ALTER TABLE accounts ALTER COLUMN plan SET DEFAULT 'free';

-- 3. Add a foreign key to pricing_plans.slug
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_plan FOREIGN KEY (plan) REFERENCES pricing_plans(slug) ON UPDATE CASCADE;

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  plan_slug TEXT NOT NULL REFERENCES pricing_plans(slug) ON UPDATE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- active, past_due, canceled
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, annual
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  gateway_subscription_id TEXT, -- e.g., sub_12345 from Razorpay/Stripe
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_select ON subscriptions FOR SELECT USING (is_account_member(account_id) OR is_platform_admin());
CREATE POLICY subscriptions_all ON subscriptions FOR ALL USING (is_platform_admin());

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS platform_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'paid', -- open, paid, void, uncollectible
  invoice_pdf_url TEXT,
  gateway_invoice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE platform_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY platform_invoices_select ON platform_invoices FOR SELECT USING (is_account_member(account_id) OR is_platform_admin());
CREATE POLICY platform_invoices_all ON platform_invoices FOR ALL USING (is_platform_admin());

-- 6. Leads table for Marketing Ingestion
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  lead_source TEXT,
  campaign_name TEXT,
  landing_page_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  team_size TEXT,
  message_volume TEXT,
  current_crm TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY leads_select ON leads FOR SELECT USING (is_platform_admin());
CREATE POLICY leads_all ON leads FOR ALL USING (is_platform_admin());


-- ============================================================
-- SOURCE: 041_blog_cms.sql
-- ============================================================

-- ============================================================
-- 041_blog_cms.sql
-- Creates the blog_posts table for the Admin CMS
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Uncategorized',
  author_name TEXT NOT NULL,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY blog_posts_select_published ON blog_posts
  FOR SELECT USING (status = 'published');

-- Platform Admins can read everything
CREATE POLICY blog_posts_select_admin ON blog_posts
  FOR SELECT USING (is_platform_admin());

-- Platform Admins have full access (insert/update/delete)
CREATE POLICY blog_posts_all_admin ON blog_posts
  FOR ALL USING (is_platform_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);


-- ============================================================
-- SOURCE: 042_lead_capture_fields.sql
-- ============================================================

-- ============================================================
-- 042_lead_capture_fields.sql
-- ============================================================
-- Extends the existing `contacts` table (the CRM Lead table) 
-- to natively support advanced SaaS marketing and UTM fields 
-- without requiring a secondary database.
-- ============================================================

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS team_size TEXT,
  ADD COLUMN IF NOT EXISTS monthly_message_volume TEXT,
  ADD COLUMN IF NOT EXISTS current_crm_used TEXT,
  
  -- Marketing & Tracking
  ADD COLUMN IF NOT EXISTS lead_source TEXT,
  ADD COLUMN IF NOT EXISTS campaign_name TEXT,
  ADD COLUMN IF NOT EXISTS landing_page_url TEXT,
  
  -- UTM Parameters
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  
  -- Technical Context
  ADD COLUMN IF NOT EXISTS device_type TEXT;


-- ============================================================
-- SOURCE: 043_agent_data_isolation.sql
-- ============================================================

-- ============================================================
-- 043_agent_data_isolation.sql
-- Implements strict Agent Data Isolation
-- Admins see all, Agents see only data where user_id = auth.uid()
-- ============================================================

-- Add account_id to tasks if missing (from 031_tasks.sql)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;

-- Backfill tasks.account_id via profiles
UPDATE tasks t
SET account_id = p.account_id
FROM profiles p
WHERE t.user_id = p.user_id
  AND t.account_id IS NULL;

-- Not Null after backfill
ALTER TABLE tasks ALTER COLUMN account_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_account ON tasks(account_id);

-- Replace old policies
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY (ARRAY[
        'contacts', 'contact_notes', 'conversations', 'deals',
        'broadcasts', 'tasks', 'automation_logs', 'flow_runs',
        'contact_tags', 'contact_custom_values', 'messages', 'message_reactions'
      ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ---------------- contacts ----------------
CREATE POLICY contacts_select ON contacts FOR SELECT USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY contacts_insert ON contacts FOR INSERT WITH CHECK (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY contacts_update ON contacts FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY contacts_delete ON contacts FOR DELETE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);

-- ---------------- contact_notes ----------------
CREATE POLICY contact_notes_select ON contact_notes FOR SELECT USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY contact_notes_insert ON contact_notes FOR INSERT WITH CHECK (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY contact_notes_update ON contact_notes FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY contact_notes_delete ON contact_notes FOR DELETE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);

-- ---------------- conversations ----------------
CREATE POLICY conversations_select ON conversations FOR SELECT USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY conversations_insert ON conversations FOR INSERT WITH CHECK (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY conversations_update ON conversations FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY conversations_delete ON conversations FOR DELETE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);

-- ---------------- deals ----------------
CREATE POLICY deals_select ON deals FOR SELECT USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY deals_insert ON deals FOR INSERT WITH CHECK (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY deals_update ON deals FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY deals_delete ON deals FOR DELETE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);

-- ---------------- broadcasts ----------------
CREATE POLICY broadcasts_select ON broadcasts FOR SELECT USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY broadcasts_insert ON broadcasts FOR INSERT WITH CHECK (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY broadcasts_update ON broadcasts FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY broadcasts_delete ON broadcasts FOR DELETE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);

-- ---------------- tasks ----------------
CREATE POLICY tasks_select ON tasks FOR SELECT USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY tasks_insert ON tasks FOR INSERT WITH CHECK (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY tasks_update ON tasks FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);
CREATE POLICY tasks_delete ON tasks FOR DELETE USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);

-- ---------------- automation_logs ----------------
CREATE POLICY automation_logs_select ON automation_logs FOR SELECT USING (
  is_account_member(account_id, 'admin') OR (is_account_member(account_id, 'agent') AND user_id = auth.uid())
);

-- ---------------- flow_runs ----------------
-- flow_runs doesn't have a user_id, it relies on contact ownership
CREATE POLICY flow_runs_select ON flow_runs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM contacts c
    WHERE c.id = flow_runs.contact_id
      AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid()))
  )
);

-- ---------------- child tables ----------------
CREATE POLICY contact_tags_select ON contact_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_tags.contact_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
);
CREATE POLICY contact_tags_modify ON contact_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_tags.contact_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
) WITH CHECK (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_tags.contact_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
);

CREATE POLICY contact_custom_values_select ON contact_custom_values FOR SELECT USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_custom_values.contact_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
);
CREATE POLICY contact_custom_values_modify ON contact_custom_values FOR ALL USING (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_custom_values.contact_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
) WITH CHECK (
  EXISTS (SELECT 1 FROM contacts c WHERE c.id = contact_custom_values.contact_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
);

CREATE POLICY messages_select ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
);
CREATE POLICY messages_modify ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
) WITH CHECK (
  EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid())))
);

CREATE POLICY message_reactions_select ON message_reactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.id = message_reactions.message_id
      AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid()))
  )
);
CREATE POLICY message_reactions_modify ON message_reactions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.id = message_reactions.message_id
      AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid()))
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    WHERE m.id = message_reactions.message_id
      AND (is_account_member(c.account_id, 'admin') OR (is_account_member(c.account_id, 'agent') AND c.user_id = auth.uid()))
  )
);


-- ============================================================
-- SOURCE: 044_admin_tools.sql
-- ============================================================

-- ============================================================
-- 044_admin_tools.sql
-- Adds phone number masking configuration to the accounts table.
-- ============================================================

ALTER TABLE accounts
ADD COLUMN IF NOT EXISTS mask_agent_phones BOOLEAN NOT NULL DEFAULT false;

-- Notify PostgREST schema cache to reload so the new column is exposed
NOTIFY pgrst, 'reload schema';


-- ============================================================
-- SOURCE: 045_business_hours.sql
-- ============================================================

-- 045_business_hours.sql

-- Add business_hours JSONB to accounts
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{
  "timezone": "UTC",
  "schedule": {
    "monday": { "active": true, "start": "09:00", "end": "17:00" },
    "tuesday": { "active": true, "start": "09:00", "end": "17:00" },
    "wednesday": { "active": true, "start": "09:00", "end": "17:00" },
    "thursday": { "active": true, "start": "09:00", "end": "17:00" },
    "friday": { "active": true, "start": "09:00", "end": "17:00" },
    "saturday": { "active": false, "start": "09:00", "end": "17:00" },
    "sunday": { "active": false, "start": "09:00", "end": "17:00" }
  }
}';


-- ============================================================
-- SOURCE: 046_business_hours_timestamps.sql
-- ============================================================

-- 046_business_hours_timestamps.sql

ALTER TABLE conversation_metrics 
ADD COLUMN IF NOT EXISTS first_customer_msg_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS first_agent_reply_at TIMESTAMPTZ;

-- We need to update the trigger to populate these fields.
CREATE OR REPLACE FUNCTION update_conversation_metrics_on_message()
RETURNS TRIGGER AS $$
DECLARE
  v_account_id UUID;
  v_assigned_agent_id UUID;
  v_first_response_time_ms BIGINT;
  v_last_customer_msg_at TIMESTAMPTZ;
  v_existing_reply_at TIMESTAMPTZ;
BEGIN
  -- Get assigned agent and account_id
  SELECT account_id, assigned_agent_id INTO v_account_id, v_assigned_agent_id
  FROM conversations WHERE id = NEW.conversation_id;

  -- Ensure row exists
  INSERT INTO conversation_metrics (account_id, conversation_id, assigned_agent_id)
  VALUES (v_account_id, NEW.conversation_id, v_assigned_agent_id)
  ON CONFLICT (conversation_id) DO NOTHING;

  -- Update message counts and timestamps
  IF NEW.sender_type = 'customer' THEN
    UPDATE conversation_metrics
    SET message_count_customer = message_count_customer + 1,
        first_customer_msg_at = COALESCE(first_customer_msg_at, NEW.created_at)
    WHERE conversation_id = NEW.conversation_id;
  ELSIF NEW.sender_type = 'bot' THEN
    UPDATE conversation_metrics
    SET message_count_bot = message_count_bot + 1
    WHERE conversation_id = NEW.conversation_id;
  ELSIF NEW.sender_type = 'agent' THEN
    -- Get last customer message time to calculate response time
    SELECT created_at INTO v_last_customer_msg_at
    FROM messages
    WHERE conversation_id = NEW.conversation_id AND sender_type = 'customer'
    ORDER BY created_at DESC LIMIT 1;

    -- Check if we already have a first reply
    SELECT first_agent_reply_at INTO v_existing_reply_at 
    FROM conversation_metrics 
    WHERE conversation_id = NEW.conversation_id;

    -- Update counts and calculate response time if not already set
    IF v_last_customer_msg_at IS NOT NULL AND v_existing_reply_at IS NULL THEN
      v_first_response_time_ms := EXTRACT(EPOCH FROM (NEW.created_at - v_last_customer_msg_at)) * 1000;
      UPDATE conversation_metrics
      SET message_count_agent = message_count_agent + 1,
          first_response_time_ms = COALESCE(first_response_time_ms, v_first_response_time_ms),
          first_agent_reply_at = COALESCE(first_agent_reply_at, NEW.created_at)
      WHERE conversation_id = NEW.conversation_id;
    ELSE
      UPDATE conversation_metrics
      SET message_count_agent = message_count_agent + 1
      WHERE conversation_id = NEW.conversation_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SOURCE: 047_agent_suspension.sql
-- ============================================================

-- 047_agent_suspension.sql

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;

-- RPC to let an admin suspend a member
CREATE OR REPLACE FUNCTION suspend_account_member(p_user_id UUID, p_is_suspended BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_role account_role_enum;
  v_target_account UUID;
BEGIN
  -- 1. Get caller's role and target's account
  SELECT account_role INTO v_caller_role
  FROM profiles WHERE user_id = auth.uid();

  SELECT account_id INTO v_target_account
  FROM profiles WHERE user_id = p_user_id;

  -- 2. Caller must be admin or owner
  IF v_caller_role NOT IN ('admin', 'owner') THEN
    RAISE EXCEPTION USING errcode = '42501', message = 'Must be an admin to suspend members';
  END IF;

  -- 3. Target must be in the same account (or we check account match)
  -- For safety, ensure the caller is in the same account
  IF v_target_account IS NULL OR v_target_account != (SELECT account_id FROM profiles WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION USING errcode = '42501', message = 'Member not found in your account';
  END IF;

  -- 4. Cannot suspend the owner
  IF (SELECT account_role FROM profiles WHERE user_id = p_user_id) = 'owner' THEN
    RAISE EXCEPTION USING errcode = '22023', message = 'Cannot suspend the account owner';
  END IF;

  -- 5. Cannot suspend yourself
  IF auth.uid() = p_user_id THEN
    RAISE EXCEPTION USING errcode = '22023', message = 'Cannot suspend yourself';
  END IF;

  UPDATE profiles SET is_suspended = p_is_suspended WHERE user_id = p_user_id;
END;
$$;


-- ============================================================
-- SOURCE: 048_fix_agent_assignment.sql
-- ============================================================

-- ============================================================
-- Fix for Agent Data Isolation
-- Allows agents to see conversations assigned to them
-- and the contacts associated with those conversations.
-- ============================================================

-- 1. Update conversations policies to allow access if assigned_agent_id = auth.uid()
DROP POLICY IF EXISTS conversations_select ON conversations;
CREATE POLICY conversations_select ON conversations FOR SELECT USING (
  is_account_member(account_id, 'admin') OR 
  (is_account_member(account_id, 'agent') AND (user_id = auth.uid() OR assigned_agent_id = auth.uid()))
);

DROP POLICY IF EXISTS conversations_update ON conversations;
CREATE POLICY conversations_update ON conversations FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR 
  (is_account_member(account_id, 'agent') AND (user_id = auth.uid() OR assigned_agent_id = auth.uid()))
);

DROP POLICY IF EXISTS conversations_insert ON conversations;
CREATE POLICY conversations_insert ON conversations FOR INSERT WITH CHECK (
  is_account_member(account_id, 'admin') OR 
  (is_account_member(account_id, 'agent') AND (user_id = auth.uid() OR assigned_agent_id = auth.uid()))
);

-- 2. Update contacts policies so agents can see the contact if they are assigned to its conversation
DROP POLICY IF EXISTS contacts_select ON contacts;
CREATE POLICY contacts_select ON contacts FOR SELECT USING (
  is_account_member(account_id, 'admin') OR 
  (is_account_member(account_id, 'agent') AND (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.contact_id = contacts.id 
      AND c.assigned_agent_id = auth.uid()
    )
  ))
);

DROP POLICY IF EXISTS contacts_update ON contacts;
CREATE POLICY contacts_update ON contacts FOR UPDATE USING (
  is_account_member(account_id, 'admin') OR 
  (is_account_member(account_id, 'agent') AND (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.contact_id = contacts.id 
      AND c.assigned_agent_id = auth.uid()
    )
  ))
);

-- 3. Update messages policy so agents can read/send messages in their assigned conversations
DROP POLICY IF EXISTS messages_select ON messages;
CREATE POLICY messages_select ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = messages.conversation_id 
    AND (
      is_account_member(c.account_id, 'admin') OR 
      (is_account_member(c.account_id, 'agent') AND (c.user_id = auth.uid() OR c.assigned_agent_id = auth.uid()))
    )
  )
);

DROP POLICY IF EXISTS messages_modify ON messages;
CREATE POLICY messages_modify ON messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = messages.conversation_id 
    AND (
      is_account_member(c.account_id, 'admin') OR 
      (is_account_member(c.account_id, 'agent') AND (c.user_id = auth.uid() OR c.assigned_agent_id = auth.uid()))
    )
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations c 
    WHERE c.id = messages.conversation_id 
    AND (
      is_account_member(c.account_id, 'admin') OR 
      (is_account_member(c.account_id, 'agent') AND (c.user_id = auth.uid() OR c.assigned_agent_id = auth.uid()))
    )
  )
);


-- ============================================================
-- SOURCE: 049_team_notes_and_routing.sql
-- ============================================================

-- ============================================================
-- 049_team_notes_and_routing.sql
-- 
-- 1. Adds internal notes capability (is_internal)
-- 2. Adds auto-assignment toggle to whatsapp_config
-- 3. Creates the auto_assign_conversation RPC
-- ============================================================

-- 1. Add is_internal to messages
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS is_internal BOOLEAN NOT NULL DEFAULT false;

-- 2. Add auto_assign_enabled to whatsapp_config
ALTER TABLE whatsapp_config
  ADD COLUMN IF NOT EXISTS auto_assign_enabled BOOLEAN NOT NULL DEFAULT false;

-- 3. Create the Smart Auto-Assignment RPC
-- Finds the active agent with the fewest open conversations in the account
CREATE OR REPLACE FUNCTION auto_assign_conversation(p_conversation_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id UUID;
  v_selected_agent_id UUID;
BEGIN
  -- 1. Get the account_id for the conversation
  SELECT account_id INTO v_account_id
  FROM conversations
  WHERE id = p_conversation_id;

  IF v_account_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- 2. Find the active agent with the fewest open conversations
  SELECT p.user_id INTO v_selected_agent_id
  FROM profiles p
  LEFT JOIN conversations c 
    ON c.assigned_agent_id = p.user_id 
    AND c.status = 'open' 
    AND c.account_id = v_account_id
  WHERE p.account_id = v_account_id
    AND p.is_suspended = false
  GROUP BY p.user_id
  ORDER BY COUNT(c.id) ASC, RANDOM()
  LIMIT 1;

  -- 3. If an agent is found, assign the conversation
  IF v_selected_agent_id IS NOT NULL THEN
    UPDATE conversations
    SET assigned_agent_id = v_selected_agent_id
    WHERE id = p_conversation_id;
  END IF;

  RETURN v_selected_agent_id;
END;
$$;

ALTER FUNCTION auto_assign_conversation(UUID) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION auto_assign_conversation(UUID) TO authenticated, service_role;


-- ============================================================
-- SOURCE: 050_fix_metrics_trigger.sql
-- ============================================================

-- 050_fix_metrics_trigger.sql
-- Fixes an issue where the trigger function attempted to access NEW.account_id 
-- on the messages table (which does not exist).

CREATE OR REPLACE FUNCTION update_conversation_metrics_on_message()
RETURNS TRIGGER AS $$
DECLARE
  v_account_id UUID;
  v_assigned_agent_id UUID;
  v_first_response_time_ms BIGINT;
  v_last_customer_msg_at TIMESTAMPTZ;
  v_existing_reply_at TIMESTAMPTZ;
BEGIN
  -- Get assigned agent and account_id from the parent conversation
  SELECT account_id, assigned_agent_id INTO v_account_id, v_assigned_agent_id
  FROM conversations WHERE id = NEW.conversation_id;

  -- Ensure row exists
  INSERT INTO conversation_metrics (account_id, conversation_id, assigned_agent_id)
  VALUES (v_account_id, NEW.conversation_id, v_assigned_agent_id)
  ON CONFLICT (conversation_id) DO NOTHING;

  -- Update message counts and timestamps
  IF NEW.sender_type = 'customer' THEN
    UPDATE conversation_metrics
    SET message_count_customer = message_count_customer + 1,
        first_customer_msg_at = COALESCE(first_customer_msg_at, NEW.created_at)
    WHERE conversation_id = NEW.conversation_id;
  ELSIF NEW.sender_type = 'bot' THEN
    UPDATE conversation_metrics
    SET message_count_bot = message_count_bot + 1
    WHERE conversation_id = NEW.conversation_id;
  ELSIF NEW.sender_type = 'agent' THEN
    -- Get last customer message time to calculate response time
    SELECT created_at INTO v_last_customer_msg_at
    FROM messages
    WHERE conversation_id = NEW.conversation_id AND sender_type = 'customer'
    ORDER BY created_at DESC LIMIT 1;

    -- Check if we already have a first reply
    SELECT first_agent_reply_at INTO v_existing_reply_at 
    FROM conversation_metrics 
    WHERE conversation_id = NEW.conversation_id;

    -- Update counts and calculate response time if not already set
    IF v_last_customer_msg_at IS NOT NULL AND v_existing_reply_at IS NULL THEN
      v_first_response_time_ms := EXTRACT(EPOCH FROM (NEW.created_at - v_last_customer_msg_at)) * 1000;
      UPDATE conversation_metrics
      SET message_count_agent = message_count_agent + 1,
          first_response_time_ms = COALESCE(first_response_time_ms, v_first_response_time_ms),
          first_agent_reply_at = COALESCE(first_agent_reply_at, NEW.created_at)
      WHERE conversation_id = NEW.conversation_id;
    ELSE
      UPDATE conversation_metrics
      SET message_count_agent = message_count_agent + 1
      WHERE conversation_id = NEW.conversation_id;
    END IF;
  END IF;

  -- Update CSAT if this is a CSAT rating message
  IF NEW.content_type = 'text' AND NEW.content_text ~ '^[1-5]$' THEN
    UPDATE conversation_metrics
    SET 
      csat_score = NEW.content_text::integer,
      csat_submitted_at = NOW()
    WHERE conversation_id = NEW.conversation_id
      AND csat_score IS NULL
      AND closed_at >= NOW() - INTERVAL '24 hours';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SOURCE: 051_pending_orders.sql
-- ============================================================

-- ============================================================
-- 051_pending_orders.sql
-- Creates a table to store manual checkout / bank transfer orders.
-- ============================================================

CREATE TABLE IF NOT EXISTS pending_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    plan TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_transfer', -- pending_transfer, completed, cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;

-- Allow insert from anon/authenticated (marketing site checkout)
DROP POLICY IF EXISTS pending_orders_insert ON pending_orders;
CREATE POLICY pending_orders_insert ON pending_orders FOR INSERT WITH CHECK (true);

-- Allow platform admin to view
DROP POLICY IF EXISTS pending_orders_select ON pending_orders;
CREATE POLICY pending_orders_select ON pending_orders FOR SELECT USING (is_platform_admin());

-- Allow platform admin to update
DROP POLICY IF EXISTS pending_orders_update ON pending_orders;
CREATE POLICY pending_orders_update ON pending_orders FOR UPDATE USING (is_platform_admin());


-- ============================================================
-- SOURCE: 052_trial_on_signup.sql
-- ============================================================

-- ============================================================
-- 052_trial_on_signup.sql
-- Automatically starts a 7-day trial for new signups and backfills
-- existing free accounts to start their 7-day trial now.
-- ============================================================

-- Update handle_new_user to set trial_ends_at
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_account_id UUID;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');

  INSERT INTO public.accounts (name, owner_user_id, trial_ends_at)
  VALUES (
    COALESCE(NULLIF(v_full_name, ''), NEW.email, 'My account'), 
    NEW.id,
    NOW() + INTERVAL '7 days'
  )
  RETURNING id INTO v_account_id;

  INSERT INTO public.profiles (user_id, full_name, email, account_id, account_role)
  VALUES (NEW.id, v_full_name, NEW.email, v_account_id, 'owner');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to bootstrap account/profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Backfill existing accounts that are on free plan and don't have a trial end date
UPDATE public.accounts
SET trial_ends_at = NOW() + INTERVAL '7 days'
WHERE plan = 'free' AND trial_ends_at IS NULL;


-- ============================================================
-- SOURCE: 053_trusted_clients.sql
-- ============================================================

-- ============================================================
-- 053_trusted_clients.sql
-- 
-- Adds a saas_trusted_clients table for the super admin
-- to manage the 'Trusted By' section on the marketing page.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.saas_trusted_clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  url text,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Turn on RLS
ALTER TABLE public.saas_trusted_clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view active trusted clients" ON public.saas_trusted_clients;
DROP POLICY IF EXISTS "Platform admins can manage trusted clients" ON public.saas_trusted_clients;

-- Allow public read access (for marketing page)
CREATE POLICY "Public can view active trusted clients" 
ON public.saas_trusted_clients 
FOR SELECT 
USING (is_active = true);

-- Allow full access for platform admins
CREATE POLICY "Platform admins can manage trusted clients" 
ON public.saas_trusted_clients 
FOR ALL 
USING (public.is_platform_admin());

-- Seed with initial placeholders so the site doesn't appear empty immediately
INSERT INTO public.saas_trusted_clients (name, url, order_index)
VALUES 
  ('Acme Corp', null, 0),
  ('GlobalTech', null, 1),
  ('EduSmart', null, 2),
  ('RealEstate Co', null, 3),
  ('HealthPlus', null, 4)
ON CONFLICT DO NOTHING;

-- Notify PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';


-- ============================================================
-- SOURCE: 054_trusted_clients_testimonials.sql
-- ============================================================

-- ============================================================
-- 054_trusted_clients_testimonials.sql
-- 
-- Extends the saas_trusted_clients table to include testimonials.
-- ============================================================

ALTER TABLE public.saas_trusted_clients
  ADD COLUMN IF NOT EXISTS testimonial_text text,
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS author_role text;

-- Notify PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';


-- ============================================================
-- SOURCE: 055_saas_pricing_plans.sql
-- ============================================================

-- ============================================================
-- 055_saas_pricing_plans.sql — Dynamic Pricing Plans
-- ============================================================

CREATE TABLE IF NOT EXISTS public.saas_pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    monthly_price NUMERIC NOT NULL DEFAULT 0,
    annual_price NUMERIC NOT NULL DEFAULT 0,
    discount_percent NUMERIC NOT NULL DEFAULT 0,
    max_contacts INTEGER NOT NULL DEFAULT 0,
    max_messages_pm INTEGER NOT NULL DEFAULT 0,
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Setup RLS
ALTER TABLE public.saas_pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active plans" ON public.saas_pricing_plans;
CREATE POLICY "Public can read active plans" ON public.saas_pricing_plans
  FOR SELECT USING (is_active = true OR is_platform_admin());

DROP POLICY IF EXISTS "Platform admins full access" ON public.saas_pricing_plans;
CREATE POLICY "Platform admins full access" ON public.saas_pricing_plans
  USING (is_platform_admin())
  WITH CHECK (is_platform_admin());

-- Seed initial plans if they don't exist
INSERT INTO public.saas_pricing_plans (slug, name, description, monthly_price, annual_price, discount_percent, max_contacts, max_messages_pm, features, sort_order)
VALUES
('free', 'Free', 'Try the platform with basic limits.', 0, 0, 0, 500, 1000, '["Basic CRM features", "1 Team Member"]', 1),
('starter', 'Starter', 'For small teams getting started.', 2499, 24990, 0, 2000, 5000, '["Advanced CRM Workflows", "Shared Team Inbox"]', 2),
('pro', 'Pro', 'For growing businesses.', 5999, 59990, 0, 10000, 30000, '["Advanced CRM Workflows", "Shared Team Inbox", "AI Chatbot Builder", "Dedicated Account Manager"]', 3),
('enterprise', 'Enterprise', 'Unlimited — custom invoicing.', 0, 0, 0, -1, -1, '["Everything in Pro", "Unlimited Contacts", "Custom SLAs"]', 4)
ON CONFLICT (slug) DO NOTHING;

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_saas_pricing_plans_updated_at ON public.saas_pricing_plans;
CREATE TRIGGER trigger_saas_pricing_plans_updated_at
BEFORE UPDATE ON public.saas_pricing_plans
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- SOURCE: 056_seed_seo_blogs.sql
-- ============================================================

-- ============================================================
-- 056_seed_seo_blogs.sql — Seed SEO Optimized Blogs in HTML
-- ============================================================

-- Clear existing blogs to keep it clean and SEO-focused as requested
DELETE FROM public.blog_posts;

INSERT INTO public.blog_posts (
  slug,
  title,
  excerpt,
  content,
  category,
  author_name,
  status,
  seo_title,
  seo_description,
  published_at
) VALUES
(
  'ultimate-guide-whatsapp-marketing-conversions',
  'The Ultimate Guide to WhatsApp Marketing: Double Your Conversions',
  'Discover how to leverage the Meta WhatsApp Business API to run high-converting broadcasts, automate lead nurturing, and double your sales. Learn the step-by-step framework for compliant, personalized messaging that gets a 98% open rate.',
  '<h1>The Ultimate Guide to WhatsApp Marketing: Double Your Conversions</h1>
<p>In the fast-evolving digital landscape, businesses are constantly searching for channels that cut through the noise. Traditional email marketing campaigns struggle with average open rates of 15% to 20%, and SMS is increasingly ignored or flagged as spam. Enter WhatsApp marketing.</p>
<p>With over 2 billion active monthly users globally and an astronomical open rate of 98%, WhatsApp has emerged as the single most powerful marketing tool for modern businesses. In this comprehensive guide, we will walk you through how to construct a WhatsApp marketing strategy using the official Meta WhatsApp Business API that drives conversions, builds relationships, and scales your sales pipeline.</p>

<hr />

<h2>1. Why WhatsApp is the Future of Marketing</h2>
<p>The numbers behind WhatsApp marketing speak for themselves. According to industry studies:</p>
<ul>
  <li><strong>98% Open Rates:</strong> Nearly every message sent on WhatsApp is opened by the recipient, usually within the first 10 minutes of delivery.</li>
  <li><strong>45% to 60% Click-Through Rates (CTR):</strong> Users are highly engaged and far more likely to tap on links or interactive quick-reply buttons.</li>
  <li><strong>80% Conversion Rates:</strong> Businesses using WhatsApp for sales conversations report significantly higher conversion rates compared to traditional web forms and emails.</li>
</ul>
<p>This performance is driven by the personal nature of the channel. WhatsApp is where people talk to their friends and family; when a business enters this space respectfully and with highly relevant content, it builds immediate trust.</p>

<hr />

<h2>2. Understanding the Meta WhatsApp Business API</h2>
<p>Before launching your first campaign, you must understand the distinction between the standard WhatsApp Business App and the <strong>Meta WhatsApp Business API</strong>.</p>
<p>The standard Business App is designed for local, micro-businesses and is restricted to a single smartphone and a few web logins. It also limits broadcast lists to 256 contacts who must have your number saved in their address book.</p>
<p>The <strong>Meta WhatsApp Business API</strong>, on the other hand, is built for scale. It allows you to:</p>
<ul>
  <li>Connect multiple customer support and sales agents to a single WhatsApp number.</li>
  <li>Send broadcast messages to thousands of contacts in a single click, regardless of whether they have saved your contact details.</li>
  <li>Integrate no-code chatbots and visual workflow automations to handle inbound queries 24/7.</li>
  <li>Access deep metrics on message delivery, read rates, and button clicks.</li>
</ul>
<p>NGTech WCRM is built directly on this official API, giving you all the tools you need to tap into these enterprise-grade features.</p>

<hr />

<h2>3. The Compliant WhatsApp Opt-In Framework</h2>
<p>To prevent spam and protect the user experience, Meta enforces strict compliance rules. You cannot message anyone without an active opt-in. A compliant opt-in framework is not just a legal requirement; it ensures your list is composed of warm, interested leads.</p>
<p>Here are the best ways to gather WhatsApp opt-ins:</p>
<ul>
  <li><strong>Website Lead Forms:</strong> Add a checkbox to your landing pages, checkout flows, and contact forms allowing users to opt into WhatsApp notifications.</li>
  <li><strong>Click-to-WhatsApp Ads:</strong> Run Meta ads on Facebook and Instagram that open a chat thread directly with your business number.</li>
  <li><strong>QR Codes on Packaging:</strong> Include a QR code on shipping boxes or retail receipts that triggers a predefined "Hello" message when scanned.</li>
  <li><strong>Chat Widgets:</strong> Place a WhatsApp chat bubble on your website (like the NGTech glassmorphic widget) that invites users to start a conversation.</li>
</ul>
<p>Remember, a clean list protects your WhatsApp sender quality rating. If too many users block or report your messages, Meta will restrict your daily sending capacity.</p>

<hr />

<h2>4. Designing High-Converting Broadcast Templates</h2>
<p>Every outbound message sent by a business using the API must utilize a pre-approved template. Meta reviews these templates to ensure they adhere to community guidelines.</p>
<p>To write templates that convert:</p>
<ul>
  <li><strong>Keep it Short and Conversational:</strong> Do not treat a WhatsApp message like a long-form email newsletter. Get straight to the point.</li>
  <li><strong>Use Rich Media:</strong> Incorporate images, PDF brochures, or short video demos. Visuals improve engagement by up to 40%.</li>
  <li><strong>Implement Quick Replies and Call-To-Action (CTA) Buttons:</strong> Meta templates support up to three buttons. Use them to make responding effortless. Instead of writing "Reply YES to order," add a button that says "Buy Now" or "Book a Demo".</li>
  <li><strong>Leverage Personalization:</strong> Use dynamic placeholders (e.g., <code>{{1}}</code> for customer name, <code>{{2}}</code> for order details) to make every message feel custom-tailored.</li>
</ul>

<h3>Example of a High-Converting Template:</h3>
<blockquote>
  <p><strong>Header:</strong> [Product Launch Image]<br />
  <strong>Body:</strong> Hey {{1}}! We just launched our brand new {{2}}. It is designed to help teams like yours save up to 10 hours a week. Since you are a valued member of our community, we are offering you an early bird discount.<br />
  <strong>Footer:</strong> Valid until Sunday.<br />
  <strong>Buttons:</strong> [Buy Now (Link)] | [Book Demo (Link)]</p>
</blockquote>

<hr />

<h2>5. Segmenting Your Audience for Maximum Impact</h2>
<p>Blasting your entire list with the same offer is a fast track to getting blocked. Segmenting your audience is critical to sustaining a high-quality rating.</p>
<p>With NGTech WCRM, you can tag contacts based on their actions, lifecycle stage, and purchase history. Here are 3 campaigns you should segment and automate:</p>

<h3>A. The Abandoned Cart Sequence</h3>
<p>Send a message 30 to 60 minutes after abandonment. Offer assistance or a time-sensitive discount code. This sequence typically recovers 15% to 30% of lost sales.</p>

<h3>B. Customer Feedback & NPS Surveys</h3>
<p>Trigger surveys 7 days post-delivery. Ask a simple rating question using quick-reply buttons (e.g., "Rate your experience: Good / Neutral / Bad").</p>

<h3>C. Retargeting Broadcasts</h3>
<p>Target customers who bought a specific product 30 days ago. Recommend complementary items or subscription models to increase lifetime value.</p>

<hr />

<h2>6. Automating Leads with Chatbots (Without Losing the Human Touch)</h2>
<p>While automation is necessary to manage large volumes, customers still crave human connection. The ideal WhatsApp marketing strategy balances automated efficiency with human empathy.</p>
<p>Use a no-code visual workflow builder to qualify leads. For example, when a user clicks a WhatsApp ad:</p>
<ol>
  <li>The chatbot greets them and presents 3 options: "Pricing", "Features", or "Speak to Agent".</li>
  <li>If they choose "Pricing", the bot displays the plans.</li>
  <li>If they choose "Speak to Agent", the bot routes the chat immediately to the active sales rep using a shared inbox.</li>
</ol>
<p>By letting the bot handle repetitive inquiries, your human team can focus their energy on high-value conversations that require negotiation and personal touch.</p>

<hr />

<h2>7. Metrics to Measure and Optimize</h2>
<p>To continuously improve your campaigns, track the following metrics inside your NGTech WCRM dashboard:</p>
<ul>
  <li><strong>Delivery Rate:</strong> The percentage of sent messages that successfully reached the customer''s device. A low rating indicates many dead numbers.</li>
  <li><strong>Read Rate:</strong> The percentage of delivered messages that were opened.</li>
  <li><strong>Click-Through Rate (CTR):</strong> The percentage of users who clicked your template CTA buttons.</li>
  <li><strong>Conversion Rate:</strong> The final percentage of users who performed the desired action (e.g., completed a purchase or booked a demo).</li>
  <li><strong>Opt-Out Rate:</strong> Monitor how many people select "Stop/Unsubscribe" to ensure you aren''t sending too many messages.</li>
</ul>

<hr />

<h2>Conclusion: Start Your Journey Today</h2>
<p>WhatsApp marketing is no longer optional; it is the most direct, high-engagement channel available to connect with customers. By moving away from congested email folders and onto the personal screens of your customers, you position your business to build stronger relationships and drive explosive sales growth.</p>
<p>Are you ready to double your conversions? Sign up for a free trial of NGTech WCRM today and connect your official Meta WhatsApp Business API in minutes.</p>',
  'WhatsApp Marketing',
  'Sandeep Kumar',
  'published',
  'The Ultimate Guide to WhatsApp Marketing in 2026',
  'Learn how to run WhatsApp broadcast campaigns, get a 98% open rate, design compliant templates, and drive conversions with the official Meta WhatsApp API.',
  now()
),
(
  'why-your-team-needs-whatsapp-shared-inbox',
  'Why Your Team Needs a WhatsApp Shared Inbox: Scaling Customer Service',
  'Tired of managing customer chats from a single phone? A Shared Team Inbox allows multiple agents to manage customer service inquiries from one WhatsApp number. Here is why it is the game-changer your team needs to improve customer satisfaction (CSAT) and resolve tickets 3x faster.',
  '<h1>Why Your Team Needs a WhatsApp Shared Inbox: Scaling Customer Service</h1>
<p>If you are running a growing business, you already know that customer communication is everything. In today''s mobile-first market, customers don''t want to wait hours for an email response or sit on hold listening to elevator music. They want to message you on WhatsApp—and they expect an answer in minutes.</p>
<p>But as chat volumes grow, many businesses hit a massive operational wall: the single-device bottleneck.</p>
<p>Managing support and sales chats from a single mobile device or standard WhatsApp Business web session is chaotic, slow, and impossible to scale. In this article, we will explore why a <strong>WhatsApp Shared Team Inbox</strong> is the ultimate solution to scale your customer service, improve team collaboration, and skyrocket customer satisfaction (CSAT) scores.</p>

<hr />

<h2>1. The Bottleneck: The Danger of Single-Device Management</h2>
<p>When a business starts out, a single employee managing customer service from a dedicated company phone works fine. But as the customer base expands, this setup introduces serious risks:</p>
<ul>
  <li><strong>No Accountability:</strong> You cannot track which agent answered which customer, leading to confusion and duplicate messages.</li>
  <li><strong>Data Silos:</strong> Conversations are trapped on one physical device. If that device is lost, broken, or the employee leaves the company, years of customer relationships go with it.</li>
  <li><strong>No Collaboration:</strong> Agents cannot transfer chats, tag colleagues, or discuss customer issues privately without logging out or physically passing a phone around.</li>
  <li><strong>Slow Response Times:</strong> During peak hours, a single agent gets overwhelmed, causing response times to slip from minutes to hours.</li>
</ul>
<p>These challenges hurt your brand reputation and drive customers straight to competitors who reply faster.</p>

<hr />

<h2>2. What is a WhatsApp Shared Team Inbox?</h2>
<p>A <strong>Shared Team Inbox</strong> is a centralized, cloud-based platform that allows multiple agents to log in and manage conversations coming through a single WhatsApp phone number.</p>
<p>Unlike the standard WhatsApp application, a shared inbox is powered by the official Meta WhatsApp Business API. It removes physical device dependencies, turning WhatsApp into a collaborative workspace similar to modern help desks like Zendesk or Intercom.</p>

<hr />

<h2>3. Core Benefits of Implementing a Shared Inbox</h2>
<p>Transitioning to a shared inbox transforms how your team operates on a daily basis. Here are the primary operational benefits:</p>

<h3>A. Multiple Agent Access Under One Number</h3>
<p>Your customers only ever need to know one contact number for your business. Behind the scenes, you can have 5, 10, or 50 support agents, sales reps, and managers logged in simultaneously from their own laptops or mobile devices. They can all view, edit, and reply to chats in real-time.</p>

<h3>B. Smart Workload Allocation & Auto-Assignment</h3>
<p>Without system organization, chats are either cherry-picked by agents or ignored. A robust Shared Team Inbox features auto-assignment logic. When a new message arrives:</p>
<ul>
  <li>It can be routed to the agent with the fewest open tickets.</li>
  <li>It can be assigned in a round-robin rotation to distribute work evenly.</li>
  <li>It can be sent to the specific account owner who handles that customer relationship.</li>
</ul>
<p>This ensures no message ever falls through the cracks and every ticket is owned by a specific human.</p>

<h3>C. Private Team Collaboration</h3>
<p>When a customer asks a complex technical or billing question, the handling agent shouldn''t have to scramble outside the system. With a Shared Inbox, agents can use <strong>Internal Notes</strong>:</p>
<ul>
  <li>Leave a private comment directly within the chat timeline.</li>
  <li>Mention (@username) a teammate or supervisor for help.</li>
  <li>The customer never sees these internal discussions, keeping your support experience clean and professional.</li>
</ul>

<hr />

<h2>4. Key Features that Drive Efficiency</h2>
<p>A premium Shared Inbox is more than just a text box. It includes specialized productivity tools designed to help support teams work faster.</p>
<ul>
  <li><strong>Quick Replies & Canned Messages:</strong> Save text shortcuts (like <code>/pricing</code> or <code>/address</code>) to instantly insert pre-written, formatted messages with links and contact cards, saving hours of manual typing.</li>
  <li><strong>Visual Tags and Contact Segmentation:</strong> Tag chats as "High Priority", "Billing Issue", "Lead", or "Spam". Filter the inbox by tags to ensure your team addresses high-value clients and urgent issues first.</li>
  <li><strong>SLA (Service Level Agreement) Tracking:</strong> Set response timers (e.g., "All incoming messages must receive a response within 15 minutes"). If a ticket remains unanswered, the system will highlight the chat in red and notify a team lead.</li>
</ul>

<hr />

<h2>5. Analytics: Measuring and Improving Support Quality</h2>
<p>You cannot improve what you do not measure. A shared inbox provides managers with deep, actionable analytics:</p>
<ul>
  <li><strong>First Response Time (FRT):</strong> How long does a customer wait before getting a reply?</li>
  <li><strong>Resolution Time:</strong> How long does it take to fully solve a customer''s issue?</li>
  <li><strong>Agent Workload:</strong> How many tickets is each agent handling and resolving daily?</li>
  <li><strong>Chat Volume Trends:</strong> What hours of the day receive the most chats, helping you schedule staff effectively.</li>
</ul>
<p>By monitoring these metrics, you can make data-driven decisions to optimize staffing, train underperforming agents, and continuously elevate your customer experience.</p>

<hr />

<h2>Conclusion: Stop Swapping Phones, Start Collaborating</h2>
<p>Managing customer interactions on a single physical phone is like running a modern e-commerce warehouse with a paper notepad. It is inefficient, error-prone, and restricts your business growth.</p>
<p>A WhatsApp Shared Team Inbox organizes your operations, unites your team, and gives your customers the lightning-fast, professional service they deserve.</p>
<p>Ready to take your customer service to the next level? Sign up for NGTech WCRM today and set up your Shared Team Inbox in under 10 minutes.</p>',
  'Customer Support',
  'Sandeep Kumar',
  'published',
  'Why Your Team Needs a WhatsApp Shared Inbox',
  'Stop managing customer service from a single phone. Learn how a WhatsApp Shared Inbox allows multiple agents to manage chats, assign tickets, and resolve customer queries 3x faster.',
  now()
),
(
  'build-no-code-whatsapp-chatbot-guide',
  'How to Build a No-Code WhatsApp Chatbot: The Complete Tutorial',
  'Save time and support costs. Learn how to map, build, and deploy a visual, no-code WhatsApp chatbot in under 30 minutes to qualify leads and answer FAQs 24/7.',
  '<h1>How to Build a No-Code WhatsApp Chatbot: The Complete Tutorial</h1>
<p>Imagine if your business had a sales rep who worked 24 hours a day, 7 days a week, spoke multiple languages, never took a sick day, and instantly answered customer queries without making a single mistake.</p>
<p>That is exactly what a WhatsApp chatbot does.</p>
<p>With over 2 billion users, WhatsApp is where your customers are. By automating your responses, you can qualify leads, answer FAQs, book appointments, and process orders instantly. And the best part? You don''t need to write a single line of code. In this step-by-step tutorial, we will show you how to design, build, and deploy a visual no-code WhatsApp chatbot for your business.</p>

<hr />

<h2>1. What is a No-Code WhatsApp Chatbot?</h2>
<p>A <strong>no-code WhatsApp chatbot</strong> is an automated conversational system that runs on your official WhatsApp Business number. It uses conditional logic and decision trees to interact with users.</p>
<p>Instead of writing complex code, you build these bots using a <strong>Visual Workflow Builder</strong>—a drag-and-drop canvas where you connect blocks (like "Send Message", "Wait for Input", "Verify Database", or "Route to Agent") to construct a conversational flow.</p>

<hr />

<h2>2. Planning Your Chatbot Strategy</h2>
<p>The biggest mistake businesses make is building a chatbot without a plan. Before touching the builder, you must outline the customer journey.</p>
<p>Ask yourself these three questions:</p>
<ol>
  <li><strong>What is the primary goal?</strong> (e.g., Qualify leads, answer FAQs, or collect order feedback?)</li>
  <li><strong>What are the common entry points?</strong> (e.g., A visitor clicking a "Chat on WhatsApp" button, a QR code, or an automated message trigger?)</li>
  <li><strong>When should a human step in?</strong> (Define the exact handoff criteria. Bots are great for filtering, but complex negotiations require human touch.)</li>
</ol>

<hr />

<h2>3. Step-by-Step Guide to Building Your First Flow</h2>
<p>Let''s build a standard Lead Qualification bot. This flow will greet new visitors, gather their name and email, evaluate their interest, and route warm leads to your team.</p>

<h3>Step 1: Set up the Trigger Node</h3>
<p>The trigger node starts the conversation. You can set it to activate on every inbound message from a new contact, when a user sends a specific keyword (like "demo" or "price"), or when a user lands on a thread from a specific Facebook/Instagram ad.</p>

<h3>Step 2: Create the Welcoming Node</h3>
<p>Add a "Send Message" block. Keep it warm and friendly: <em>"Hello! Welcome to NGTech WCRM. 🚀 I''m your virtual assistant. To help me direct you to the right person, may I know your first name?"</em></p>

<h3>Step 3: Capture and Store User Input</h3>
<p>Add a "Wait for User Input" block. Save their response to a variable called <code>{{contact.first_name}}</code>. Storing this variable allows the bot to personalize the rest of the conversation.</p>

<h3>Step 4: Ask Qualifying Questions</h3>
<p>Ask for their business email or size: <em>"Thanks {{contact.first_name}}! What is your company email address?"</em>. Save this to <code>{{contact.email}}</code>.</p>

<h3>Step 5: Present Interactive Options</h3>
<p>Instead of making users type long answers, use Meta''s <strong>Quick Reply Buttons</strong> or <strong>List Menus</strong>. List menus can hold up to 10 options. Ask: <em>"What feature are you most interested in?"</em></p>

<h3>Step 6: Define Handoff Logic</h3>
<p>If a user selects a product category, add an "Assign Conversation" block to route the chat to the Sales Team pipeline. Send a confirmation message: <em>"Perfect! I''ve routed your request to our product experts. An agent will reply to you here in less than 2 minutes."</em></p>

<hr />

<h2>4. Best Practices for Chatbot Conversational Design</h2>
<p>A poorly designed chatbot is frustrating. To create a premium user experience:</p>
<ul>
  <li><strong>Always disclose that it is a bot:</strong> Start with: <em>"Hi! I''m the NGTech AI Assistant..."</em> Honesty builds trust.</li>
  <li><strong>Keep text blocks short:</strong> Do not send walls of text. Break up information into small, digestible paragraphs.</li>
  <li><strong>Offer a clear exit option:</strong> Always include an option to "Speak to a Human" or "Go back to Main Menu" in every node.</li>
  <li><strong>Use Emojis strategically:</strong> Emojis make the conversation feel friendly and visually structure lists.</li>
  <li><strong>Handle errors gracefully:</strong> If the bot doesn''t understand an input, write a fallback: <em>"Oops, I didn''t quite catch that. Please select one of the options below:"</em></li>
</ul>

<hr />

<h2>5. Integrating APIs for Dynamic Bots</h2>
<p>Once you master basic decision trees, you can build dynamic, transactional bots by connecting them to external APIs:</p>
<ul>
  <li><strong>Shopify/WooCommerce Integration:</strong> When a user types their order ID, the bot pings your store database and returns the live shipping status.</li>
  <li><strong>Appointment Booking:</strong> Connect your bot to Calendly or Google Calendar. The user can view open slots and confirm a booking directly inside WhatsApp.</li>
  <li><strong>Lead Synchronization:</strong> Send captured lead data (name, email, phone) to HubSpot, Salesforce, or your own internal database in real-time.</li>
</ul>

<hr />

<h2>Conclusion: Start Automating Today</h2>
<p>Building a WhatsApp chatbot is no longer a privilege reserved for tech giants with massive engineering budgets. With a visual, no-code builder, you can deploy a functional bot in less than an hour.</p>
<p>By automating routine qualifying questions and FAQ responses, you free up your team to focus on closing deals and resolving complex support queries.</p>
<p>Ready to build your first bot? Start a free trial of NGTech WCRM today and design your visual workflows on our drag-and-drop canvas.</p>',
  'Automations',
  'Sandeep Kumar',
  'published',
  'How to Build a No-Code WhatsApp Chatbot',
  'Save time and support costs. Learn how to map, build, and deploy a visual, no-code WhatsApp chatbot in under 30 minutes to qualify leads and answer FAQs 24/7.',
  now()
),
(
  'whatsapp-business-api-vs-app-comparison',
  'WhatsApp Business API vs. Business App: Which is Right for You?',
  'Confused about the differences between the standard WhatsApp Business App and the official Meta WhatsApp API? We break down the key differences in broadcast limits, agent onboarding, messaging costs, green badge verification, and compliance rules.',
  '<h1>WhatsApp Business API vs. Business App: Which is Right for You?</h1>
<p>If you are a business owner looking to communicate with customers on their favorite messaging app, you have probably run into two terms: the <strong>WhatsApp Business App</strong> and the <strong>WhatsApp Business API</strong>.</p>
<p>While they sound similar, they are designed for entirely different stages of business growth. Using the wrong one can lead to operational bottlenecks, missed sales, or even having your phone number permanently banned by Meta.</p>
<p>In this detailed comparison, we will break down the features, limitations, costs, and setup processes of both options so you can choose the one that aligns with your business goals.</p>

<hr />

<h2>1. What is the WhatsApp Business App?</h2>
<p>The WhatsApp Business App is a free, standalone mobile application designed for micro-businesses, local shops, and independent freelancers. It functions similarly to the personal WhatsApp messenger you use every day, but includes a few basic business tools:</p>
<ul>
  <li><strong>Business Profile:</strong> Showcase your address, operating hours, website, and catalog.</li>
  <li><strong>Labels:</strong> Organize your contacts and chats (e.g., "New Customer", "Pending Payment").</li>
  <li><strong>Quick Replies:</strong> Save text shortcuts for frequently sent answers.</li>
  <li><strong>Greeting & Away Messages:</strong> Set automatic greeting messages for first-time customers.</li>
</ul>
<p><strong>The Limitations:</strong> You can only link up to 4 web browsers, your broadcast list is capped at 256 contacts, and your broadcasts will only be delivered if the customer has your number saved in their address book.</p>

<hr />

<h2>2. What is the WhatsApp Business API?</h2>
<p>The WhatsApp Business API (also known as the WhatsApp Business Platform) was launched by Meta in 2018. It is not an app you download; it is a system backend that allows businesses to connect WhatsApp to their own software, CRMs, and customer support databases.</p>
<p>Because it has no interface of its own, businesses use platforms like <strong>NGTech WCRM</strong> to interact with it.</p>
<p><strong>The Capabilities:</strong> Connect unlimited agents, send bulk broadcasts to thousands of contacts (whether they saved your number or not), use interactive template buttons, deploy visual chatbots, and apply for the green verification tick badge next to your business name.</p>

<hr />

<h2>3. Direct Head-to-Head Comparison</h2>
<table border="1" cellpadding="5" cellspacing="0" width="100%">
  <thead>
    <tr>
      <th>Feature</th>
      <th>WhatsApp Business App</th>
      <th>WhatsApp Business API (via WCRM)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Pricing</strong></td>
      <td>Free</td>
      <td>Pay-per-conversation + CRM Platform fee</td>
    </tr>
    <tr>
      <td><strong>Broadcasting Limit</strong></td>
      <td>256 contacts per list</td>
      <td>Unlimited (scales with quality rating)</td>
    </tr>
    <tr>
      <td><strong>Delivered to Unsaved Contacts?</strong></td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td><strong>Multi-Agent Support</strong></td>
      <td>Max 5 devices (1 phone + 4 web)</td>
      <td>Unlimited concurrent agents</td>
    </tr>
    <tr>
      <td><strong>Chatbots & Automation</strong></td>
      <td>Basic welcome/away messages only</td>
      <td>Full visual workflow builders, API lookups, and AI</td>
    </tr>
    <tr>
      <td><strong>Official Green Tick?</strong></td>
      <td>No</td>
      <td>Yes (subject to Meta approval)</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>4. Analyzing the Cost Structures</h2>
<p>Understanding the pricing model is critical before making your selection.</p>
<h3>WhatsApp Business App:</h3>
<p>100% Free. You do not pay for sending messages or receiving replies.</p>
<h3>WhatsApp Business API:</h3>
<p>Meta charges on a 24-hour conversational window model based on categories: Utility, Marketing, and Service conversations. Plus, the CRM platform license fee for using NGTech WCRM.</p>

<hr />

<h2>5. Decision Matrix: Which One Should You Choose?</h2>
<h3>Choose the WhatsApp Business App if:</h3>
<ul>
  <li>You are a solo entrepreneur or run a tiny team with under 3 employees.</li>
  <li>You receive fewer than 20 customer inquiries a day.</li>
  <li>You do not need to send mass marketing broadcasts to unsaved contacts.</li>
</ul>
<h3>Choose the WhatsApp Business API if:</h3>
<ul>
  <li>You need a dedicated support team of 3 or more agents to manage chats simultaneously.</li>
  <li>You want to run marketing broadcasts to thousands of leads to drive sales.</li>
  <li>You want to automate customer routing and qualify leads using chatbots.</li>
</ul>

<hr />

<h2>Conclusion: Preparing to Scale</h2>
<p>For small, local shops, the free WhatsApp Business App is an excellent starting point. But the moment you decide to run marketing broadcasts, integrate workflows, or onboard a team, the limitations of the app will stunt your growth.</p>
<p>Upgrading to the official Meta WhatsApp Business API through NGTech WCRM unlocks the full power of conversational commerce, enabling you to build stronger customer connections and scale your sales pipeline without boundaries.</p>
<p>Ready to migrate? Start a free trial of NGTech WCRM today, and our team will help you configure your Meta Business Manager and API number in minutes.</p>',
  'Sales Automation',
  'Sandeep Kumar',
  'published',
  'WhatsApp Business API vs. Business App Comparison Guide',
  'Which version of WhatsApp is right for your business? We compare the limits, broadcasts, multi-agent features, and cost structures of the Business App and API.',
  now()
);


-- ============================================================
-- SOURCE: 057_embedded_signup_support.sql
-- ============================================================

-- ============================================================
-- 057_embedded_signup_support.sql
-- Adds support for multi-step Embedded Signup and connection archiving.
-- ============================================================

-- 1. Add fields to whatsapp_config to safely preserve old connections 
--    and store expanded connection metadata.
ALTER TABLE whatsapp_config 
  ADD COLUMN IF NOT EXISTS archived_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS business_id TEXT,
  ADD COLUMN IF NOT EXISTS display_phone_number TEXT,
  ADD COLUMN IF NOT EXISTS connection_status TEXT DEFAULT 'connected',
  ADD COLUMN IF NOT EXISTS connected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS disconnected_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;

-- 2. Create the temporary session table for Embedded Signup onboarding.
--    This stores the Meta token and phone numbers while the user selects
--    which number to connect, ensuring the token never reaches the frontend.
CREATE TABLE IF NOT EXISTS whatsapp_signup_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  access_token_encrypted TEXT NOT NULL,
  waba_id TEXT NOT NULL,
  business_id TEXT,
  phone_numbers JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_phone_number_id TEXT,
  display_phone_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour'
);

ALTER TABLE whatsapp_signup_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own signup sessions" ON whatsapp_signup_sessions;
CREATE POLICY "Users can manage own signup sessions" ON whatsapp_signup_sessions FOR ALL USING (
  is_account_member(account_id, 'admin')
);

-- Index for auto-cleanup of expired sessions
CREATE INDEX IF NOT EXISTS idx_whatsapp_signup_sessions_expires_at 
  ON whatsapp_signup_sessions(expires_at);

-- Prevent multiple active signup sessions for a single account
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_signup 
  ON whatsapp_signup_sessions (account_id) 
  WHERE status IN ('pending', 'verified');

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_signup_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM whatsapp_signup_sessions
  WHERE expires_at < NOW();
END;
$$;


-- ============================================================
-- SOURCE: 058_ai_assistant_settings.sql
-- ============================================================

-- 058_ai_assistant_settings.sql

-- 1. Create the new ai_assistant_settings table
CREATE TABLE IF NOT EXISTS ai_assistant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  provider VARCHAR(50) DEFAULT 'gemini',
  model VARCHAR(100) DEFAULT 'gemini-1.5-pro',
  system_prompt TEXT DEFAULT 'You are a helpful customer support assistant for this business.',
  knowledge_base TEXT DEFAULT '',
  personality TEXT,
  allowed_topics TEXT,
  restricted_topics TEXT,
  human_handoff_rules TEXT,
  respect_business_hours BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (account_id)
);

-- 2. Enable RLS and add policies
ALTER TABLE ai_assistant_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_assistant_settings_select ON ai_assistant_settings;
CREATE POLICY ai_assistant_settings_select ON ai_assistant_settings FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS ai_assistant_settings_insert ON ai_assistant_settings;
CREATE POLICY ai_assistant_settings_insert ON ai_assistant_settings FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS ai_assistant_settings_update ON ai_assistant_settings;
CREATE POLICY ai_assistant_settings_update ON ai_assistant_settings FOR UPDATE USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS ai_assistant_settings_delete ON ai_assistant_settings;
CREATE POLICY ai_assistant_settings_delete ON ai_assistant_settings FOR DELETE USING (is_account_member(account_id, 'admin'));

-- 3. Add updated_at trigger
DROP TRIGGER IF EXISTS set_ai_settings_updated_at ON ai_assistant_settings;
CREATE TRIGGER set_ai_settings_updated_at 
  BEFORE UPDATE ON ai_assistant_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Migrate existing data from whatsapp_config
INSERT INTO ai_assistant_settings (
  account_id,
  enabled,
  system_prompt,
  knowledge_base,
  provider,
  model,
  respect_business_hours
)
SELECT 
  account_id,
  COALESCE(ai_auto_reply_enabled, false),
  COALESCE(ai_auto_reply_prompt, 'You are a helpful customer support assistant for this business.'),
  COALESCE(ai_knowledge_base, ''),
  'gemini',
  'gemini-1.5-pro',
  true
FROM whatsapp_config
ON CONFLICT (account_id) DO NOTHING;


-- ============================================================
-- SOURCE: 059_ai_assistant_v2.sql
-- ============================================================

-- 059_ai_assistant_v2.sql

-- 1. Extend ai_assistant_settings with JSONB configurations
ALTER TABLE ai_assistant_settings
  ADD COLUMN IF NOT EXISTS advanced_settings JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS knowledge_base_structured JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_rules JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS handoff_rules JSONB DEFAULT '{}'::jsonb;

-- 2. Create ai_analytics_events table
CREATE TABLE IF NOT EXISTS ai_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  provider VARCHAR(50),
  model VARCHAR(100),
  response_time_ms INTEGER,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  estimated_cost NUMERIC(10, 6) DEFAULT 0.0,
  is_handoff BOOLEAN DEFAULT false,
  is_error BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_ai_analytics_events_account_date 
  ON ai_analytics_events(account_id, created_at);

-- RLS for analytics
ALTER TABLE ai_analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_analytics_events_select ON ai_analytics_events;
CREATE POLICY ai_analytics_events_select ON ai_analytics_events FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS ai_analytics_events_insert ON ai_analytics_events;
CREATE POLICY ai_analytics_events_insert ON ai_analytics_events FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

-- 3. Create ai_knowledge_documents table
CREATE TABLE IF NOT EXISTS ai_knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_documents_account 
  ON ai_knowledge_documents(account_id);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS set_ai_knowledge_documents_updated_at ON ai_knowledge_documents;
CREATE TRIGGER set_ai_knowledge_documents_updated_at 
  BEFORE UPDATE ON ai_knowledge_documents 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for documents
ALTER TABLE ai_knowledge_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_knowledge_documents_select ON ai_knowledge_documents;
CREATE POLICY ai_knowledge_documents_select ON ai_knowledge_documents FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS ai_knowledge_documents_insert ON ai_knowledge_documents;
CREATE POLICY ai_knowledge_documents_insert ON ai_knowledge_documents FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS ai_knowledge_documents_delete ON ai_knowledge_documents;
CREATE POLICY ai_knowledge_documents_delete ON ai_knowledge_documents FOR DELETE USING (is_account_member(account_id, 'admin'));

-- Note: No update policy needed for documents right now, mostly insert/delete.


-- ============================================================
-- SOURCE: 060_departments.sql
-- ============================================================

-- 060_departments.sql

-- 1. Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_departments_account ON departments(account_id);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS departments_select ON departments;
CREATE POLICY departments_select ON departments FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS departments_insert ON departments;
CREATE POLICY departments_insert ON departments FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS departments_update ON departments;
CREATE POLICY departments_update ON departments FOR UPDATE USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS departments_delete ON departments;
CREATE POLICY departments_delete ON departments FOR DELETE USING (is_account_member(account_id, 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_departments_updated_at ON departments;
CREATE TRIGGER set_departments_updated_at 
  BEFORE UPDATE ON departments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Create department_members table (Many-to-Many)
CREATE TABLE IF NOT EXISTS department_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_department_members_dept ON department_members(department_id);
CREATE INDEX IF NOT EXISTS idx_department_members_user ON department_members(user_id);

ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
-- For security, members can be seen by account members
DROP POLICY IF EXISTS department_members_select ON department_members;
CREATE POLICY department_members_select ON department_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM departments d WHERE d.id = department_members.department_id AND is_account_member(d.account_id))
);

DROP POLICY IF EXISTS department_members_modify ON department_members;
CREATE POLICY department_members_modify ON department_members FOR ALL USING (
  EXISTS (SELECT 1 FROM departments d WHERE d.id = department_members.department_id AND is_account_member(d.account_id, 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM departments d WHERE d.id = department_members.department_id AND is_account_member(d.account_id, 'admin'))
);

-- 3. Add department_id to conversations
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

-- 4. Update the Smart Auto-Assignment RPC to respect department routing
CREATE OR REPLACE FUNCTION auto_assign_conversation(p_conversation_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id UUID;
  v_department_id UUID;
  v_selected_agent_id UUID;
BEGIN
  -- 1. Get the account_id and department_id for the conversation
  SELECT account_id, department_id INTO v_account_id, v_department_id
  FROM conversations
  WHERE id = p_conversation_id;

  IF v_account_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- 2. Find the active agent with the fewest open conversations
  -- If v_department_id is NOT NULL, restrict to agents in that department.
  SELECT p.user_id INTO v_selected_agent_id
  FROM profiles p
  LEFT JOIN conversations c 
    ON c.assigned_agent_id = p.user_id 
    AND c.status = 'open' 
    AND c.account_id = v_account_id
  WHERE p.account_id = v_account_id
    AND p.is_suspended = false
    AND (
      v_department_id IS NULL OR 
      EXISTS (
        SELECT 1 FROM department_members dm 
        WHERE dm.department_id = v_department_id 
        AND dm.user_id = p.user_id
      )
    )
  GROUP BY p.user_id
  ORDER BY COUNT(c.id) ASC, RANDOM()
  LIMIT 1;

  -- 3. If an agent is found, assign the conversation
  IF v_selected_agent_id IS NOT NULL THEN
    UPDATE conversations
    SET assigned_agent_id = v_selected_agent_id
    WHERE id = p_conversation_id;
  END IF;

  RETURN v_selected_agent_id;
END;
$$;

ALTER FUNCTION auto_assign_conversation(UUID) OWNER TO postgres;

-- 5. Seed requested departments for all existing accounts
INSERT INTO departments (account_id, name)
SELECT id, 'Sales' FROM accounts;

INSERT INTO departments (account_id, name)
SELECT id, 'Technical Consultant' FROM accounts;

INSERT INTO departments (account_id, name)
SELECT id, 'Customer Support' FROM accounts;

INSERT INTO departments (account_id, name)
SELECT id, 'Accounts' FROM accounts;

INSERT INTO departments (account_id, name)
SELECT id, 'Management' FROM accounts;


-- ============================================================
-- SOURCE: 061_analytics_v2.sql
-- ============================================================

-- 061_analytics_v2.sql

-- 1. Add ai_language to conversations to store the latest detected language
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS ai_language VARCHAR(50);

-- 2. Add language and intent_category to ai_analytics_events
ALTER TABLE ai_analytics_events
  ADD COLUMN IF NOT EXISTS language VARCHAR(50),
  ADD COLUMN IF NOT EXISTS intent_category VARCHAR(100);


-- ============================================================
-- SOURCE: 062_enterprise_departments.sql
-- ============================================================

-- 062_enterprise_departments.sql

-- 1. Upgrade departments table with enterprise fields
ALTER TABLE departments
  ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS queue_strategy TEXT DEFAULT 'round_robin',
  ADD COLUMN IF NOT EXISTS priority INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_configuration JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}'::jsonb;

-- 2. Add an index for status to speed up routing queries
CREATE INDEX IF NOT EXISTS idx_departments_status ON departments(status);

-- 3. Update department_members to include a role (agent, supervisor, manager)
ALTER TABLE department_members
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'agent';

-- 4. Create an audit log table for departments
CREATE TABLE IF NOT EXISTS department_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dept_audit_logs_dept ON department_audit_logs(department_id);

ALTER TABLE department_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dept_audit_logs_select ON department_audit_logs;
CREATE POLICY dept_audit_logs_select ON department_audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM departments d WHERE d.id = department_audit_logs.department_id AND is_account_member(d.account_id))
);

DROP POLICY IF EXISTS dept_audit_logs_insert ON department_audit_logs;
CREATE POLICY dept_audit_logs_insert ON department_audit_logs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM departments d WHERE d.id = department_audit_logs.department_id AND is_account_member(d.account_id, 'admin'))
);


-- ============================================================
-- SOURCE: 063_department_routing_logic.sql
-- ============================================================

-- 063_department_routing_logic.sql

-- Update the Smart Auto-Assignment RPC to respect department routing strategies:
-- 1. round_robin: Assigns to the agent who has been assigned a conversation least recently.
-- 2. least_busy: Assigns to the agent with the fewest open conversations.
-- 3. manager_first: Assigns to a manager in the department, falling back to least_busy agent.
-- 4. vip: Assigns only to a supervisor or manager in the department (least_busy among them), falling back to least_busy agent.
-- 5. manual: Does not auto-assign (leaves assigned_agent_id NULL).

CREATE OR REPLACE FUNCTION auto_assign_conversation(p_conversation_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id UUID;
  v_department_id UUID;
  v_queue_strategy TEXT;
  v_selected_agent_id UUID;
BEGIN
  -- 1. Get the account_id and department_id for the conversation
  SELECT account_id, department_id INTO v_account_id, v_department_id
  FROM conversations
  WHERE id = p_conversation_id;

  IF v_account_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- 2. Determine queue strategy
  IF v_department_id IS NOT NULL THEN
    SELECT queue_strategy INTO v_queue_strategy
    FROM departments
    WHERE id = v_department_id;
  END IF;
  
  -- Default to 'least_busy' if no department or strategy is set
  v_queue_strategy := COALESCE(v_queue_strategy, 'least_busy');

  IF v_queue_strategy = 'manual' THEN
    -- Leave it unassigned for manual picking
    RETURN NULL;
  END IF;

  -- 3. Select agent based on strategy
  IF v_queue_strategy = 'round_robin' THEN
    -- Find agent whose last assigned conversation is the oldest (or who has never been assigned)
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN (
      SELECT assigned_agent_id, MAX(created_at) as last_assigned_at
      FROM conversations
      WHERE account_id = v_account_id
      GROUP BY assigned_agent_id
    ) c ON c.assigned_agent_id = p.user_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND (
        v_department_id IS NULL OR 
        EXISTS (
          SELECT 1 FROM department_members dm 
          WHERE dm.department_id = v_department_id 
          AND dm.user_id = p.user_id
        )
      )
    ORDER BY c.last_assigned_at ASC NULLS FIRST, RANDOM()
    LIMIT 1;
    
  ELSIF v_queue_strategy = 'least_busy' THEN
    -- Default: fewest open conversations
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND (
        v_department_id IS NULL OR 
        EXISTS (
          SELECT 1 FROM department_members dm 
          WHERE dm.department_id = v_department_id 
          AND dm.user_id = p.user_id
        )
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
    
  ELSIF v_queue_strategy = 'manager_first' THEN
    -- Try to assign to a manager first, then least busy
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND (
        v_department_id IS NULL OR 
        EXISTS (
          SELECT 1 FROM department_members dm 
          WHERE dm.department_id = v_department_id 
          AND dm.user_id = p.user_id
          AND dm.role = 'manager'
        )
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
    
    -- If no manager found, fallback to least_busy
    IF v_selected_agent_id IS NULL THEN
      SELECT p.user_id INTO v_selected_agent_id
      FROM profiles p
      LEFT JOIN conversations c 
        ON c.assigned_agent_id = p.user_id 
        AND c.status = 'open' 
        AND c.account_id = v_account_id
      WHERE p.account_id = v_account_id
        AND p.is_suspended = false
        AND (
          v_department_id IS NULL OR 
          EXISTS (
            SELECT 1 FROM department_members dm 
            WHERE dm.department_id = v_department_id 
            AND dm.user_id = p.user_id
          )
        )
      GROUP BY p.user_id
      ORDER BY COUNT(c.id) ASC, RANDOM()
      LIMIT 1;
    END IF;
    
  ELSIF v_queue_strategy = 'vip' THEN
    -- Try to assign to a supervisor or manager first (least busy)
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND (
        v_department_id IS NULL OR 
        EXISTS (
          SELECT 1 FROM department_members dm 
          WHERE dm.department_id = v_department_id 
          AND dm.user_id = p.user_id
          AND dm.role IN ('manager', 'supervisor')
        )
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
    
    -- If no supervisor/manager found, fallback to least_busy
    IF v_selected_agent_id IS NULL THEN
      SELECT p.user_id INTO v_selected_agent_id
      FROM profiles p
      LEFT JOIN conversations c 
        ON c.assigned_agent_id = p.user_id 
        AND c.status = 'open' 
        AND c.account_id = v_account_id
      WHERE p.account_id = v_account_id
        AND p.is_suspended = false
        AND (
          v_department_id IS NULL OR 
          EXISTS (
            SELECT 1 FROM department_members dm 
            WHERE dm.department_id = v_department_id 
            AND dm.user_id = p.user_id
          )
        )
      GROUP BY p.user_id
      ORDER BY COUNT(c.id) ASC, RANDOM()
      LIMIT 1;
    END IF;
  ELSE
    -- Default to least_busy just in case
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND (
        v_department_id IS NULL OR 
        EXISTS (
          SELECT 1 FROM department_members dm 
          WHERE dm.department_id = v_department_id 
          AND dm.user_id = p.user_id
        )
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
  END IF;

  -- 4. If an agent is found, assign the conversation
  IF v_selected_agent_id IS NOT NULL THEN
    UPDATE conversations
    SET assigned_agent_id = v_selected_agent_id
    WHERE id = p_conversation_id;
  END IF;

  RETURN v_selected_agent_id;
END;
$$;


-- ============================================================
-- SOURCE: 064_enterprise_routing_engine.sql
-- ============================================================

-- 064_enterprise_routing_engine.sql

-- 1. Update conversations table with new routing and AI tracking fields
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS routing_status TEXT DEFAULT 'unassigned',
  ADD COLUMN IF NOT EXISTS ai_processing_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS routing_method TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ai_classification_confidence NUMERIC,
  ADD COLUMN IF NOT EXISTS ai_detected_intent TEXT,
  ADD COLUMN IF NOT EXISTS ai_detected_sentiment TEXT,
  ADD COLUMN IF NOT EXISTS routing_time_ms INT;

-- Status indexes for quick filtering
CREATE INDEX IF NOT EXISTS idx_conversations_routing_status ON conversations(routing_status);
CREATE INDEX IF NOT EXISTS idx_conversations_ai_proc_status ON conversations(ai_processing_status);

-- 2. Update AI Assistant Settings with confidence threshold
ALTER TABLE ai_assistant_settings
  ADD COLUMN IF NOT EXISTS routing_confidence_threshold NUMERIC DEFAULT 90;

-- 3. Create the Audit Log Table for Routing
CREATE TABLE IF NOT EXISTS conversation_routing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be null for AI/System
  event_type TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  reason TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routing_logs_conv ON conversation_routing_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_routing_logs_acc ON conversation_routing_logs(account_id);

ALTER TABLE conversation_routing_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS routing_logs_select ON conversation_routing_logs;
CREATE POLICY routing_logs_select ON conversation_routing_logs FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS routing_logs_insert ON conversation_routing_logs;
CREATE POLICY routing_logs_insert ON conversation_routing_logs FOR INSERT WITH CHECK (is_account_member(account_id));

-- 4. Update the Routing Engine RPC (auto_assign_conversation)
-- This enforces that conversations must be in the 'department_queue' (or already assigned) to be routed.
-- If no department is set, it cannot be auto-assigned to an agent.

CREATE OR REPLACE FUNCTION auto_assign_conversation(p_conversation_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id UUID;
  v_department_id UUID;
  v_routing_status TEXT;
  v_queue_strategy TEXT;
  v_selected_agent_id UUID;
BEGIN
  -- 1. Get conversation details
  SELECT account_id, department_id, routing_status 
  INTO v_account_id, v_department_id, v_routing_status
  FROM conversations
  WHERE id = p_conversation_id;

  IF v_account_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- ENFORCEMENT: Never assign if it is unassigned/needs manual review and has no department
  IF v_department_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- 2. Determine queue strategy
  SELECT queue_strategy INTO v_queue_strategy
  FROM departments
  WHERE id = v_department_id;
  
  v_queue_strategy := COALESCE(v_queue_strategy, 'least_busy');

  IF v_queue_strategy = 'manual' THEN
    -- Leave it unassigned for manual picking in the department queue
    RETURN NULL;
  END IF;

  -- 3. Select agent based on strategy
  IF v_queue_strategy = 'round_robin' THEN
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN (
      SELECT assigned_agent_id, MAX(created_at) as last_assigned_at
      FROM conversations
      WHERE account_id = v_account_id
      GROUP BY assigned_agent_id
    ) c ON c.assigned_agent_id = p.user_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND EXISTS (
        SELECT 1 FROM department_members dm 
        WHERE dm.department_id = v_department_id 
        AND dm.user_id = p.user_id
      )
    ORDER BY c.last_assigned_at ASC NULLS FIRST, RANDOM()
    LIMIT 1;
    
  ELSIF v_queue_strategy = 'least_busy' THEN
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND EXISTS (
        SELECT 1 FROM department_members dm 
        WHERE dm.department_id = v_department_id 
        AND dm.user_id = p.user_id
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
    
  ELSIF v_queue_strategy = 'manager_first' THEN
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND EXISTS (
        SELECT 1 FROM department_members dm 
        WHERE dm.department_id = v_department_id 
        AND dm.user_id = p.user_id
        AND dm.role = 'manager'
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
    
    IF v_selected_agent_id IS NULL THEN
      SELECT p.user_id INTO v_selected_agent_id
      FROM profiles p
      LEFT JOIN conversations c 
        ON c.assigned_agent_id = p.user_id 
        AND c.status = 'open' 
        AND c.account_id = v_account_id
      WHERE p.account_id = v_account_id
        AND p.is_suspended = false
        AND EXISTS (
          SELECT 1 FROM department_members dm 
          WHERE dm.department_id = v_department_id 
          AND dm.user_id = p.user_id
        )
      GROUP BY p.user_id
      ORDER BY COUNT(c.id) ASC, RANDOM()
      LIMIT 1;
    END IF;
    
  ELSIF v_queue_strategy = 'vip' THEN
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND EXISTS (
        SELECT 1 FROM department_members dm 
        WHERE dm.department_id = v_department_id 
        AND dm.user_id = p.user_id
        AND dm.role IN ('manager', 'supervisor')
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
    
    IF v_selected_agent_id IS NULL THEN
      SELECT p.user_id INTO v_selected_agent_id
      FROM profiles p
      LEFT JOIN conversations c 
        ON c.assigned_agent_id = p.user_id 
        AND c.status = 'open' 
        AND c.account_id = v_account_id
      WHERE p.account_id = v_account_id
        AND p.is_suspended = false
        AND EXISTS (
          SELECT 1 FROM department_members dm 
          WHERE dm.department_id = v_department_id 
          AND dm.user_id = p.user_id
        )
      GROUP BY p.user_id
      ORDER BY COUNT(c.id) ASC, RANDOM()
      LIMIT 1;
    END IF;
  ELSE
    SELECT p.user_id INTO v_selected_agent_id
    FROM profiles p
    LEFT JOIN conversations c 
      ON c.assigned_agent_id = p.user_id 
      AND c.status = 'open' 
      AND c.account_id = v_account_id
    WHERE p.account_id = v_account_id
      AND p.is_suspended = false
      AND EXISTS (
        SELECT 1 FROM department_members dm 
        WHERE dm.department_id = v_department_id 
        AND dm.user_id = p.user_id
      )
    GROUP BY p.user_id
    ORDER BY COUNT(c.id) ASC, RANDOM()
    LIMIT 1;
  END IF;

  -- 4. Assign and log
  IF v_selected_agent_id IS NOT NULL THEN
    UPDATE conversations
    SET assigned_agent_id = v_selected_agent_id,
        routing_status = 'assigned',
        routing_method = v_queue_strategy
    WHERE id = p_conversation_id;
    
    -- Insert audit log
    INSERT INTO conversation_routing_logs (
      conversation_id, account_id, event_type, previous_value, new_value, reason
    ) VALUES (
      p_conversation_id, v_account_id, 'agent_assigned', NULL, v_selected_agent_id::text, 'auto_assign_conversation'
    );
  END IF;

  RETURN v_selected_agent_id;
END;
$$;


-- ============================================================
-- SOURCE: 065_customer_360_workspace.sql
-- ============================================================

-- ============================================================
-- 065_customer_360_workspace.sql
-- Complete Customer 360 Workspace Schema
-- ============================================================

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_account ON support_tickets(account_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_contact ON support_tickets(contact_id);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Account members can manage tickets" ON support_tickets FOR ALL USING (is_account_member(account_id));


-- ============================================================
-- CUSTOMER PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS customer_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_projects_account ON customer_projects(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_projects_contact ON customer_projects(contact_id);

ALTER TABLE customer_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Account members can manage projects" ON customer_projects FOR ALL USING (is_account_member(account_id));


-- ============================================================
-- APPOINTMENTS (Enhancement of meetings)
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_account ON appointments(account_id);
CREATE INDEX IF NOT EXISTS idx_appointments_contact ON appointments(contact_id);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Account members can manage appointments" ON appointments FOR ALL USING (is_account_member(account_id));


-- ============================================================
-- CUSTOMER ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customer_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    order_number TEXT,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_orders_account ON customer_orders(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_contact ON customer_orders(contact_id);

ALTER TABLE customer_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Account members can manage orders" ON customer_orders FOR ALL USING (is_account_member(account_id));


-- ============================================================
-- CUSTOMER INVOICES & PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS customer_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    order_id UUID REFERENCES customer_orders(id) ON DELETE SET NULL,
    invoice_number TEXT,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_invoices_account ON customer_invoices(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_invoices_contact ON customer_invoices(contact_id);

ALTER TABLE customer_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Account members can manage customer invoices" ON customer_invoices FOR ALL USING (is_account_member(account_id));


CREATE TABLE IF NOT EXISTS customer_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES customer_invoices(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_payments_account ON customer_payments(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_payments_contact ON customer_payments(contact_id);

ALTER TABLE customer_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Account members can manage customer payments" ON customer_payments FOR ALL USING (is_account_member(account_id));


-- ============================================================
-- UNIFIED ACTIVITY HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS customer_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL, -- e.g., 'quote_sent', 'ticket_created', 'stage_changed'
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_activities_account ON customer_activities(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_activities_contact ON customer_activities(contact_id);

ALTER TABLE customer_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Account members can manage activities" ON customer_activities FOR ALL USING (is_account_member(account_id));


-- ============================================================
-- SOURCE: 066_customer_timeline_engine.sql
-- ============================================================

-- ============================================================
-- 066_customer_timeline_engine.sql
-- Core Activity Logger and Customer 360 Timeline Engine
-- ============================================================

-- 1. Enhance the customer_activities table
ALTER TABLE customer_activities 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'system',
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS is_milestone BOOLEAN DEFAULT FALSE;

-- Ensure an index on category for fast filtering
CREATE INDEX IF NOT EXISTS idx_customer_activities_category ON customer_activities(category);
CREATE INDEX IF NOT EXISTS idx_customer_activities_milestone ON customer_activities(is_milestone);
CREATE INDEX IF NOT EXISTS idx_customer_activities_created_at ON customer_activities(created_at DESC);

-- 2. Central Activity Logger RPC
-- This is the single source of truth for logging events, callable from Edge Functions or Triggers.
CREATE OR REPLACE FUNCTION log_customer_activity(
    p_account_id UUID,
    p_contact_id UUID,
    p_actor_id UUID,
    p_category TEXT,
    p_activity_type TEXT,
    p_title TEXT,
    p_description TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_is_milestone BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO customer_activities (
        account_id, contact_id, actor_id, category, activity_type, title, description, metadata, is_milestone
    ) VALUES (
        p_account_id, p_contact_id, p_actor_id, p_category, p_activity_type, p_title, p_description, p_metadata, p_is_milestone
    ) RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. Database Triggers for Core Modules
-- Automates logging so future developers don't have to manually log standard events.
-- ============================================================

-- A. CONTACT CREATED (Milestone)
CREATE OR REPLACE FUNCTION trg_log_contact_created() RETURNS TRIGGER AS $$
BEGIN
    PERFORM log_customer_activity(
        NEW.account_id,
        NEW.id,
        auth.uid(),
        'system',
        'contact_created',
        'Contact Created',
        'A new lead profile was created in the system.',
        jsonb_build_object('name', NEW.name, 'phone', NEW.phone, 'source', 'crm'),
        TRUE -- Milestone
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_contact_created ON contacts;
CREATE TRIGGER trigger_log_contact_created
    AFTER INSERT ON contacts
    FOR EACH ROW EXECUTE FUNCTION trg_log_contact_created();


-- B. DEAL CREATED & WON (Milestone)
CREATE OR REPLACE FUNCTION trg_log_deal_events() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_customer_activity(
            NEW.account_id,
            NEW.contact_id,
            auth.uid(),
            'sales',
            'deal_created',
            'Deal Created',
            'A new deal "' || NEW.title || '" was added to the pipeline.',
            jsonb_build_object('deal_id', NEW.id, 'value', NEW.value, 'currency', NEW.currency),
            FALSE
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        IF NEW.status = 'won' THEN
            PERFORM log_customer_activity(
                NEW.account_id,
                NEW.contact_id,
                auth.uid(),
                'sales',
                'deal_won',
                'Deal Won! 🎉',
                'The deal "' || NEW.title || '" was successfully closed.',
                jsonb_build_object('deal_id', NEW.id, 'value', NEW.value, 'currency', NEW.currency),
                TRUE -- Milestone
            );
        ELSIF NEW.status = 'lost' THEN
            PERFORM log_customer_activity(
                NEW.account_id,
                NEW.contact_id,
                auth.uid(),
                'sales',
                'deal_lost',
                'Deal Lost',
                'The deal "' || NEW.title || '" was closed as lost.',
                jsonb_build_object('deal_id', NEW.id),
                FALSE
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_deal_events ON deals;
CREATE TRIGGER trigger_log_deal_events
    AFTER INSERT OR UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION trg_log_deal_events();


-- C. APPOINTMENTS (Meetings)
CREATE OR REPLACE FUNCTION trg_log_appointment_events() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_customer_activity(
            NEW.account_id,
            NEW.contact_id,
            auth.uid(),
            'meetings',
            'meeting_scheduled',
            'Meeting Scheduled',
            'Appointment "' || NEW.title || '" scheduled for ' || to_char(NEW.scheduled_at, 'Mon DD, YYYY HH12:MI AM'),
            jsonb_build_object('appointment_id', NEW.id, 'duration', NEW.duration_minutes),
            FALSE
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        PERFORM log_customer_activity(
            NEW.account_id,
            NEW.contact_id,
            auth.uid(),
            'meetings',
            'meeting_' || NEW.status,
            'Meeting ' || initcap(NEW.status),
            'Appointment "' || NEW.title || '" was marked as ' || NEW.status || '.',
            jsonb_build_object('appointment_id', NEW.id),
            FALSE
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_appointment_events ON appointments;
CREATE TRIGGER trigger_log_appointment_events
    AFTER INSERT OR UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION trg_log_appointment_events();


-- D. SUPPORT TICKETS
CREATE OR REPLACE FUNCTION trg_log_ticket_events() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_customer_activity(
            NEW.account_id,
            NEW.contact_id,
            auth.uid(),
            'support',
            'ticket_created',
            'Ticket Created',
            'Support ticket "' || NEW.title || '" was opened.',
            jsonb_build_object('ticket_id', NEW.id, 'priority', NEW.priority),
            FALSE
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'resolved' THEN
        PERFORM log_customer_activity(
            NEW.account_id,
            NEW.contact_id,
            auth.uid(),
            'support',
            'ticket_resolved',
            'Ticket Resolved',
            'Support ticket "' || NEW.title || '" was successfully resolved.',
            jsonb_build_object('ticket_id', NEW.id),
            FALSE
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_ticket_events ON support_tickets;
CREATE TRIGGER trigger_log_ticket_events
    AFTER INSERT OR UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION trg_log_ticket_events();


-- E. TASKS
CREATE OR REPLACE FUNCTION trg_log_task_events() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_customer_activity(
            NEW.account_id,
            NEW.contact_id,
            auth.uid(),
            'tasks',
            'task_created',
            'Task: ' || NEW.title,
            COALESCE(NEW.description, 'A new task was created.'),
            jsonb_build_object('task_id', NEW.id, 'status', NEW.status),
            FALSE
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'completed' THEN
        PERFORM log_customer_activity(
            NEW.account_id,
            NEW.contact_id,
            auth.uid(),
            'tasks',
            'task_completed',
            'Task Completed: ' || NEW.title,
            'Action taken: ' || COALESCE(NEW.description, 'Task was marked as done.'),
            jsonb_build_object('task_id', NEW.id, 'status', NEW.status, 'completed_at', NOW()),
            FALSE
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_task_events ON tasks;
CREATE TRIGGER trigger_log_task_events
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION trg_log_task_events();


-- ============================================================
-- SOURCE: 068_add_ai_health_columns.sql
-- ============================================================

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

-- ============================================================
-- SOURCE: 069_contact_notes_media.sql
-- ============================================================

-- ============================================================
-- 069_contact_notes_media.sql
--
-- Adds support for attaching files to contact notes in the CRM.
-- - Adds `media_url`, `media_name`, and `media_type` columns.
-- - Drops the NOT NULL constraint on `note_text` so a note can
--   exist purely to hold a file attachment.
-- ============================================================

ALTER TABLE contact_notes
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_name TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT;

ALTER TABLE contact_notes
  ALTER COLUMN note_text DROP NOT NULL;


-- ============================================================
-- SOURCE: 070_pricing_enabled_menus.sql
-- ============================================================

-- ============================================================
-- 070_pricing_enabled_menus.sql
-- ============================================================

-- Add the column with a default for basic features
ALTER TABLE public.saas_pricing_plans
ADD COLUMN IF NOT EXISTS enabled_menus JSONB NOT NULL DEFAULT '["/dashboard", "/team-performance", "/inbox", "/contacts", "/pipelines", "/broadcasts", "/ai-assistant"]'::jsonb;

-- Update the existing plans to have appropriate default menus

-- 1) Basic plans (Free, Starter) - No automations or flows
UPDATE public.saas_pricing_plans
SET enabled_menus = '["/dashboard", "/team-performance", "/inbox", "/contacts", "/pipelines", "/broadcasts", "/ai-assistant"]'::jsonb
WHERE slug IN ('free', 'starter');

-- 2) Premium plans (Pro, Enterprise) - All features included
UPDATE public.saas_pricing_plans
SET enabled_menus = '["/dashboard", "/team-performance", "/inbox", "/contacts", "/pipelines", "/broadcasts", "/automations", "/ai-assistant", "/flows"]'::jsonb
WHERE slug IN ('pro', 'enterprise');


-- ============================================================
-- SOURCE: 071_whatsapp_commerce.sql
-- ============================================================

-- ============================================================
-- 071_whatsapp_commerce.sql
-- WhatsApp Catalog and Commerce Integration
-- ============================================================

-- 1. Add Meta Catalog ID and App Secret to whatsapp_config
ALTER TABLE whatsapp_config
  ADD COLUMN IF NOT EXISTS catalog_id TEXT,
  ADD COLUMN IF NOT EXISTS app_secret TEXT;

-- 2. Update messages.content_type to allow 'order'
ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_content_type_check;

ALTER TABLE messages
  ADD CONSTRAINT messages_content_type_check
  CHECK (content_type IN (
    'text', 'image', 'document', 'audio', 'video',
    'location', 'template', 'interactive', 'order'
  ));

-- 3. Create whatsapp_orders table
CREATE TABLE IF NOT EXISTS whatsapp_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  catalog_id TEXT,
  total_price NUMERIC,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_account ON whatsapp_orders(account_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_contact ON whatsapp_orders(contact_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_conversation ON whatsapp_orders(conversation_id);

ALTER TABLE whatsapp_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS whatsapp_orders_select ON whatsapp_orders;
CREATE POLICY whatsapp_orders_select ON whatsapp_orders FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS whatsapp_orders_insert ON whatsapp_orders;
CREATE POLICY whatsapp_orders_insert ON whatsapp_orders FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS whatsapp_orders_update ON whatsapp_orders;
CREATE POLICY whatsapp_orders_update ON whatsapp_orders FOR UPDATE USING (is_account_member(account_id));

DROP POLICY IF EXISTS whatsapp_orders_delete ON whatsapp_orders;
CREATE POLICY whatsapp_orders_delete ON whatsapp_orders FOR DELETE USING (is_account_member(account_id, 'admin'));

-- 4. Create whatsapp_order_items table
CREATE TABLE IF NOT EXISTS whatsapp_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES whatsapp_orders(id) ON DELETE CASCADE,
  product_retailer_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  item_price NUMERIC,
  currency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_order_items_order ON whatsapp_order_items(order_id);

ALTER TABLE whatsapp_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS whatsapp_order_items_select ON whatsapp_order_items;
CREATE POLICY whatsapp_order_items_select ON whatsapp_order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM whatsapp_orders WHERE whatsapp_orders.id = whatsapp_order_items.order_id AND is_account_member(whatsapp_orders.account_id))
);

-- Note: No insert/update/delete policies needed for non-service roles, as webhooks (Service Role) will populate this.

-- 5. Create tenant_webhooks table for outbound ERP sync
CREATE TABLE IF NOT EXISTS tenant_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT,
  events TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_webhooks_account ON tenant_webhooks(account_id);

ALTER TABLE tenant_webhooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_webhooks_select ON tenant_webhooks;
CREATE POLICY tenant_webhooks_select ON tenant_webhooks FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS tenant_webhooks_insert ON tenant_webhooks;
CREATE POLICY tenant_webhooks_insert ON tenant_webhooks FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS tenant_webhooks_update ON tenant_webhooks;
CREATE POLICY tenant_webhooks_update ON tenant_webhooks FOR UPDATE USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS tenant_webhooks_delete ON tenant_webhooks;
CREATE POLICY tenant_webhooks_delete ON tenant_webhooks FOR DELETE USING (is_account_member(account_id, 'admin'));

-- 6. Add updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at ON whatsapp_orders;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON whatsapp_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON tenant_webhooks;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tenant_webhooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- SOURCE: 072_orders_menu.sql
-- ============================================================

-- ============================================================
-- 072_orders_menu.sql
-- Enable the Orders menu for all SaaS packages
-- ============================================================

-- Ensure the 'enabled_menus' JSON array includes '/orders'
UPDATE public.saas_pricing_plans
SET enabled_menus = (
  SELECT jsonb_agg(DISTINCT elem)
  FROM jsonb_array_elements(enabled_menus || '["/orders"]'::jsonb) AS elem
);


-- ============================================================
-- SOURCE: 073_sequences.sql
-- ============================================================

-- ============================================================
-- 073_sequences.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Timezone-aware scheduling limits
  timezone TEXT NOT NULL DEFAULT 'UTC',
  send_window_start TIME, -- e.g. '09:00:00'
  send_window_end TIME,   -- e.g. '18:00:00'

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sequences_account ON sequences(account_id);

CREATE TABLE IF NOT EXISTS sequence_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  delay_days INTEGER NOT NULL DEFAULT 0,
  delay_hours INTEGER NOT NULL DEFAULT 0,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  template_name TEXT NOT NULL,
  template_language TEXT NOT NULL DEFAULT 'en_US',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sequence_steps_seq ON sequence_steps(sequence_id, position);

CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 1,
  next_run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'running', 'completed', 'cancelled_by_reply', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sequence_id, contact_id) -- A contact can only be in a specific sequence once at a time
);

CREATE INDEX IF NOT EXISTS idx_seq_enroll_active_due ON sequence_enrollments(next_run_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_seq_enroll_contact ON sequence_enrollments(contact_id);

-- RLS
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage account sequences" ON sequences;
CREATE POLICY "Users can manage account sequences" ON sequences FOR ALL
  USING (account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage account sequence steps" ON sequence_steps;
CREATE POLICY "Users can manage account sequence steps" ON sequence_steps FOR ALL
  USING (sequence_id IN (SELECT id FROM sequences WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Users can view/manage account enrollments" ON sequence_enrollments;
CREATE POLICY "Users can view/manage account enrollments" ON sequence_enrollments FOR ALL
  USING (sequence_id IN (SELECT id FROM sequences WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid())));

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_seq ON sequences;
CREATE TRIGGER set_updated_at_seq BEFORE UPDATE ON sequences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
DROP TRIGGER IF EXISTS set_updated_at_seq_enroll ON sequence_enrollments;
CREATE TRIGGER set_updated_at_seq_enroll BEFORE UPDATE ON sequence_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RPC: Concurrency-safe claim for cron workers
-- ============================================================
CREATE OR REPLACE FUNCTION claim_due_sequence_enrollments(p_limit INT)
RETURNS SETOF sequence_enrollments
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE sequence_enrollments
  SET status = 'running', updated_at = NOW()
  WHERE id IN (
    SELECT e.id
    FROM sequence_enrollments e
    JOIN sequences s ON e.sequence_id = s.id
    WHERE e.status = 'active'
      AND s.is_active = TRUE
      AND e.next_run_at <= NOW()
      AND (
         s.send_window_start IS NULL 
         OR s.send_window_end IS NULL
         OR (
            (NOW() AT TIME ZONE s.timezone)::time >= s.send_window_start
            AND (NOW() AT TIME ZONE s.timezone)::time <= s.send_window_end
         )
      )
    ORDER BY e.next_run_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT p_limit
  )
  RETURNING *;
END;
$$;

-- Enable the Sequences menu for all SaaS packages
UPDATE public.saas_pricing_plans
SET enabled_menus = (
  SELECT jsonb_agg(DISTINCT elem)
  FROM jsonb_array_elements(enabled_menus || '["/sequences"]'::jsonb) AS elem
);


-- ============================================================
-- SOURCE: 074_ai_calls.sql
-- ============================================================

-- ============================================================
-- 074_ai_calls.sql
-- Schema for Retell AI Voice Calling integration
-- ============================================================

-- 1. Tenant Retell Configuration
CREATE TABLE IF NOT EXISTS retell_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  api_key TEXT, -- Should ideally be encrypted via pgcrypto in production
  agent_id TEXT,
  from_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(account_id)
);

CREATE INDEX IF NOT EXISTS idx_retell_config_account ON retell_config(account_id);

-- 2. AI Call Logs
CREATE TABLE IF NOT EXISTS ai_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  retell_call_id TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  duration_seconds INTEGER,
  transcript TEXT,
  summary TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(retell_call_id)
);

CREATE INDEX IF NOT EXISTS idx_ai_calls_account ON ai_calls(account_id);
CREATE INDEX IF NOT EXISTS idx_ai_calls_contact ON ai_calls(contact_id);

-- RLS
ALTER TABLE retell_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage account retell_config" ON retell_config;
CREATE POLICY "Users can manage account retell_config" ON retell_config FOR ALL
  USING (account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage account ai_calls" ON ai_calls;
CREATE POLICY "Users can manage account ai_calls" ON ai_calls FOR ALL
  USING (account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()));

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_retell_config ON retell_config;
CREATE TRIGGER set_updated_at_retell_config BEFORE UPDATE ON retell_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
DROP TRIGGER IF EXISTS set_updated_at_ai_calls ON ai_calls;
CREATE TRIGGER set_updated_at_ai_calls BEFORE UPDATE ON ai_calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- SOURCE: 075_secure_retell_config.sql
-- ============================================================

-- Retell credentials are accessed only through authenticated server routes.
-- Service-role calls bypass RLS; browser clients receive no direct access.
DROP POLICY IF EXISTS "Users can manage account retell_config" ON retell_config;

-- Prevent enrollments that combine a sequence with a contact belonging to a
-- different tenant. The worker runs as service role and is unaffected.
DROP POLICY IF EXISTS "Users can view/manage account enrollments" ON sequence_enrollments;

CREATE POLICY "Users can view account enrollments" ON sequence_enrollments FOR SELECT
  USING (sequence_id IN (SELECT id FROM sequences WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can insert account enrollments" ON sequence_enrollments FOR INSERT
  WITH CHECK (
    sequence_id IN (SELECT id FROM sequences WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()))
    AND contact_id IN (SELECT id FROM contacts WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()))
  );

CREATE POLICY "Users can update account enrollments" ON sequence_enrollments FOR UPDATE
  USING (sequence_id IN (SELECT id FROM sequences WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid())))
  WITH CHECK (
    sequence_id IN (SELECT id FROM sequences WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()))
    AND contact_id IN (SELECT id FROM contacts WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid()))
  );

CREATE POLICY "Users can delete account enrollments" ON sequence_enrollments FOR DELETE
  USING (sequence_id IN (SELECT id FROM sequences WHERE account_id IN (SELECT account_id FROM profiles WHERE user_id = auth.uid())));


-- ============================================================
-- SOURCE: 076_ai_knowledge_vector_products.sql
-- ============================================================

-- 076_ai_knowledge_vector_products.sql

-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create ai_knowledge_chunks table for embeddings
CREATE TABLE IF NOT EXISTS ai_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  document_id UUID REFERENCES ai_knowledge_documents(id) ON DELETE CASCADE,
  source_type VARCHAR(50) DEFAULT 'document', -- 'document', 'website', 'text'
  source_url TEXT,
  content TEXT NOT NULL,
  embedding vector(768), -- Google text-embedding-004 uses 768 dimensions by default. OpenAI uses 1536. We'll use 768 for gemini fallback.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_chunks_account 
  ON ai_knowledge_chunks(account_id);

-- 3. Create match_knowledge_chunks RPC
CREATE OR REPLACE FUNCTION match_knowledge_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_account_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_type VARCHAR(50),
  source_url TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_knowledge_chunks.id,
    ai_knowledge_chunks.content,
    ai_knowledge_chunks.source_type,
    ai_knowledge_chunks.source_url,
    1 - (ai_knowledge_chunks.embedding <=> query_embedding) AS similarity
  FROM ai_knowledge_chunks
  WHERE ai_knowledge_chunks.account_id = p_account_id
    AND 1 - (ai_knowledge_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_knowledge_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RLS for ai_knowledge_chunks
ALTER TABLE ai_knowledge_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_knowledge_chunks_select ON ai_knowledge_chunks;
CREATE POLICY ai_knowledge_chunks_select ON ai_knowledge_chunks FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS ai_knowledge_chunks_insert ON ai_knowledge_chunks;
CREATE POLICY ai_knowledge_chunks_insert ON ai_knowledge_chunks FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS ai_knowledge_chunks_delete ON ai_knowledge_chunks;
CREATE POLICY ai_knowledge_chunks_delete ON ai_knowledge_chunks FOR DELETE USING (is_account_member(account_id, 'admin'));

-- 4. Create products table (for both products and services)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC,
  currency VARCHAR(10) DEFAULT 'USD',
  type VARCHAR(50) DEFAULT 'product', -- 'product', 'service'
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  sync_id TEXT, -- ID from Meta Commerce Catalog if synced
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_account ON products(account_id);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS products_select ON products;
CREATE POLICY products_select ON products FOR SELECT USING (is_account_member(account_id));

DROP POLICY IF EXISTS products_insert ON products;
CREATE POLICY products_insert ON products FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS products_update ON products;
CREATE POLICY products_update ON products FOR UPDATE USING (is_account_member(account_id, 'admin'));

DROP POLICY IF EXISTS products_delete ON products;
CREATE POLICY products_delete ON products FOR DELETE USING (is_account_member(account_id, 'admin'));


-- ============================================================
-- SOURCE: 077_knowledge_bucket.sql
-- ============================================================

-- 077_knowledge_bucket.sql

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-documents', 'knowledge-documents', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Add policies for the bucket
-- Allow account members to read their own documents
CREATE POLICY "Account members can read their own knowledge documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'knowledge-documents' 
  AND (auth.uid() IN (
    SELECT user_id FROM profiles WHERE account_id::text = (string_to_array(name, '/'))[1]
  ))
);

-- Allow admins to insert documents
CREATE POLICY "Admins can upload knowledge documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'knowledge-documents' 
  AND (auth.uid() IN (
    SELECT user_id FROM profiles WHERE account_id::text = (string_to_array(name, '/'))[1] AND is_account_member(account_id, 'admin')
  ))
);

-- Allow admins to delete documents
CREATE POLICY "Admins can delete knowledge documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'knowledge-documents' 
  AND (auth.uid() IN (
    SELECT user_id FROM profiles WHERE account_id::text = (string_to_array(name, '/'))[1] AND is_account_member(account_id, 'admin')
  ))
);


-- ============================================================
-- SOURCE: 078_update_free_trial_description.sql
-- ============================================================

-- Update the description of the free tier pricing plan to indicate 7 days
UPDATE public.saas_pricing_plans
SET description = '7-day free trial with basic limits.'
WHERE slug = 'free';

