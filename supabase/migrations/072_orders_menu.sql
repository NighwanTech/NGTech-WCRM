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
