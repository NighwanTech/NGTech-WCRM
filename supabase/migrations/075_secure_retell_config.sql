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
