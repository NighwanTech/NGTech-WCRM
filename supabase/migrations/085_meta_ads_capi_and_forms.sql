-- Migration 085: CAPI Pixel ID and Lead Form Mappings enhancements

-- 1. Add CAPI Pixel ID to meta_ad_accounts
ALTER TABLE public.meta_ad_accounts
ADD COLUMN IF NOT EXISTS capi_pixel_id TEXT;

-- 2. Add missing columns to meta_lead_form_mappings
ALTER TABLE public.meta_lead_form_mappings
ADD COLUMN IF NOT EXISTS field_mapping JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
