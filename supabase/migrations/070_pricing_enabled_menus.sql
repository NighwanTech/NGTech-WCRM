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
