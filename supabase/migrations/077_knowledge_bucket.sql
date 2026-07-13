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
