-- Update the description of the free tier pricing plan to indicate 7 days
UPDATE public.saas_pricing_plans
SET description = '7-day free trial with basic limits.'
WHERE slug = 'free';
