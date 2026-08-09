-- ============================================================
-- 083_fix_meta_ads_tenant_isolation.sql
--
-- Fixes broken FK references in 081 & 082 migrations where tables referenced
-- non-existent `workspaces(id)` instead of `accounts(id)`.
-- Applies strict Row Level Security (RLS) using `is_account_member(account_id)`.
-- ============================================================

DO $$
BEGIN
  -- Fix meta_ad_accounts if workspace_id column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='meta_ad_accounts' AND column_name='workspace_id') THEN
    ALTER TABLE meta_ad_accounts DROP CONSTRAINT IF EXISTS meta_ad_accounts_workspace_id_fkey;
    ALTER TABLE meta_ad_accounts RENAME COLUMN workspace_id TO account_id;
  END IF;

  -- Fix meta_campaign_cache if workspace_id column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='meta_campaign_cache' AND column_name='workspace_id') THEN
    ALTER TABLE meta_campaign_cache DROP CONSTRAINT IF EXISTS meta_campaign_cache_workspace_id_fkey;
    ALTER TABLE meta_campaign_cache RENAME COLUMN workspace_id TO account_id;
  END IF;

  -- Fix meta_lead_form_mappings if workspace_id column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='meta_lead_form_mappings' AND column_name='workspace_id') THEN
    ALTER TABLE meta_lead_form_mappings DROP CONSTRAINT IF EXISTS meta_lead_form_mappings_workspace_id_fkey;
    ALTER TABLE meta_lead_form_mappings RENAME COLUMN workspace_id TO account_id;
  END IF;
END $$;

-- Enable RLS and add correct policies using is_account_member(account_id)

-- 1. meta_ad_accounts
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='meta_ad_accounts') THEN
    ALTER TABLE meta_ad_accounts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS meta_ad_accounts_select ON meta_ad_accounts;
    DROP POLICY IF EXISTS meta_ad_accounts_all ON meta_ad_accounts;

    CREATE POLICY meta_ad_accounts_select ON meta_ad_accounts FOR SELECT USING (is_account_member(account_id));
    CREATE POLICY meta_ad_accounts_all ON meta_ad_accounts FOR ALL USING (is_account_member(account_id, 'admin'));
  END IF;
END $$;

-- 2. meta_campaign_cache
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='meta_campaign_cache') THEN
    ALTER TABLE meta_campaign_cache ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS meta_campaign_cache_select ON meta_campaign_cache;
    DROP POLICY IF EXISTS meta_campaign_cache_all ON meta_campaign_cache;

    CREATE POLICY meta_campaign_cache_select ON meta_campaign_cache FOR SELECT USING (is_account_member(account_id));
    CREATE POLICY meta_campaign_cache_all ON meta_campaign_cache FOR ALL USING (is_account_member(account_id, 'admin'));
  END IF;
END $$;

-- 3. meta_lead_form_mappings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='meta_lead_form_mappings') THEN
    ALTER TABLE meta_lead_form_mappings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS meta_lead_form_mappings_select ON meta_lead_form_mappings;
    DROP POLICY IF EXISTS meta_lead_form_mappings_all ON meta_lead_form_mappings;

    CREATE POLICY meta_lead_form_mappings_select ON meta_lead_form_mappings FOR SELECT USING (is_account_member(account_id));
    CREATE POLICY meta_lead_form_mappings_all ON meta_lead_form_mappings FOR ALL USING (is_account_member(account_id, 'admin'));
  END IF;
END $$;
