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
