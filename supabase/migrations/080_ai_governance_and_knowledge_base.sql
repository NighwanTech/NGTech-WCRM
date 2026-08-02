-- Migration 080: AI Governance and Centralized Knowledge Base Store

-- 1. Table for Super Admin Centralized AI Configurations
CREATE TABLE IF NOT EXISTS public.saas_ai_configs (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL UNIQUE,
  api_key TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  usage_quota_monthly BIGINT NOT NULL DEFAULT 1000000,
  tokens_used_this_month BIGINT NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table for Feature Model Routing
CREATE TABLE IF NOT EXISTS public.saas_ai_routing (
  id TEXT PRIMARY KEY DEFAULT 'global-routing',
  copilot_model TEXT NOT NULL DEFAULT 'groq/llama-3.1-8b-instant',
  chatbot_model TEXT NOT NULL DEFAULT 'gemini/gemini-1.5-flash',
  crawler_model TEXT NOT NULL DEFAULT 'openai/gpt-4o-mini',
  fallback_chain JSONB NOT NULL DEFAULT '["groq", "openai", "gemini"]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table for Knowledge Base Documents & FAQs
CREATE TABLE IF NOT EXISTS public.saas_knowledge_base (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'faq',
  source_url TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  publish_status TEXT NOT NULL DEFAULT 'published',
  checksum TEXT NOT NULL DEFAULT '',
  crawled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table for Unanswered Question Gaps
CREATE TABLE IF NOT EXISTS public.saas_knowledge_gaps (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  count INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'unresolved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table for AI Governance Audit Trail
CREATE TABLE IF NOT EXISTS public.saas_ai_audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'Super Admin',
  details TEXT NOT NULL
);

-- Enable RLS & Set Policies
ALTER TABLE public.saas_ai_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_ai_routing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_knowledge_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_ai_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow Service Role & Authenticated Admins full access
CREATE POLICY "Admins full access saas_ai_configs" ON public.saas_ai_configs FOR ALL USING (true);
CREATE POLICY "Admins full access saas_ai_routing" ON public.saas_ai_routing FOR ALL USING (true);
CREATE POLICY "Public read published knowledge" ON public.saas_knowledge_base FOR SELECT USING (publish_status = 'published');
CREATE POLICY "Admins full access saas_knowledge_base" ON public.saas_knowledge_base FOR ALL USING (true);
CREATE POLICY "Admins full access saas_knowledge_gaps" ON public.saas_knowledge_gaps FOR ALL USING (true);
CREATE POLICY "Admins full access saas_ai_audit_logs" ON public.saas_ai_audit_logs FOR ALL USING (true);

-- Seed Initial Knowledge Base Items
INSERT INTO public.saas_knowledge_base (id, title, category, source_url, content, publish_status)
VALUES
('kb-1', 'Sales Pipelines & Kanban Deal Stages', 'feature', '/pipelines', 'In Sales Pipelines (/pipelines), view and drag deal cards across Kanban columns (New Lead, Contacted, Proposal Sent, Closed Won, Closed Lost). Click Add Deal to enter deal values, expected close dates, and assign sales reps.', 'published'),
('kb-2', 'WhatsApp Broadcast Campaigns & Audience Filtering', 'onboarding', '/broadcasts/new', 'In WhatsApp Broadcasts (/broadcasts/new), click New Broadcast Campaign, select target audience tags or CSV lists, attach Meta-approved template messages with dynamic variables {{1}} and {{2}}, and click Send Now or Schedule.', 'published'),
('kb-3', 'Visual No-Code AI Flow Builder', 'feature', '/flows', 'In Automations (/flows), drag trigger nodes (Keyword, New Lead), AI response nodes, delay timers, and condition branches on the visual canvas to build 24/7 automated lead qualification workflows.', 'published'),
('kb-4', 'Shared Multi-Agent Team Inbox & Canned Replies', 'feature', '/inbox', 'In Shared Inbox (/inbox), multiple sales & support agents manage conversations from 1 official WhatsApp number. Type / in the message box for quick canned replies, assign threads to reps, add internal notes, and star priority chats.', 'published'),
('kb-5', 'Contact Management & CSV Import', 'onboarding', '/contacts', 'In Contacts (/contacts), click Import CSV to upload customer phone lists from Excel/CSV. View customer 360 timelines, assign custom tags, filter by audience segments, and manage custom attributes.', 'published'),
('kb-6', 'Automated Drip Sequences & Cadences', 'feature', '/sequences', 'In Drip Sequences (/sequences), create multi-day automated follow-up sequences. Add delay nodes (Wait 1 hour, Wait 2 days) to automatically nurture leads.', 'published'),
('kb-7', 'WhatsApp E-Commerce Orders & Catalogs', 'feature', '/orders', 'In Orders (/orders), view native WhatsApp cart purchases placed inside WhatsApp chats. Send instant Razorpay/UPI payment collection links and update order fulfillment status.', 'published'),
('kb-8', 'WhatsApp Delivery & Message Analytics', 'feature', '/analytics', 'In Advanced Analytics (/analytics), monitor sent, delivered, read, and failed message rates. Analyze campaign ROI, lead conversion charts, and AI response times.', 'published'),
('kb-9', 'Team Performance & SLA Scorecards', 'feature', '/team-performance', 'In Team Performance (/team-performance), track individual agent response speed, resolution rates, SLA compliance scores, and active conversations per rep.', 'published'),
('kb-10', 'AI Assistant General Settings & BYOK Keys', 'feature', '/ai-assistant', 'In AI Assistant (/ai-assistant) -> General Settings tab: Select AI Provider (Gemini, OpenAI, Groq, DeepSeek) and Model (gemini-2.5-pro, gpt-4o, llama-3.1-8b-instant). Toggle Use My Own API Key (BYOK), enter secret key, click Test Connection. Adjust Temperature (0.3), Max Tokens (145), Top P (0.95), Response Language Override (Auto, English, Hindi), Instant Greeting Cache (0-token fast replies), and Custom Welcome Greeting.', 'published'),
('kb-11', 'AI Assistant Personality, System Prompts & Guardrails', 'feature', '/ai-assistant', 'In AI Assistant (/ai-assistant): Use Personality tab to select Business Tone (Professional, Friendly, Empathetic, Sales-Driven) and brand persona. Use System Prompt tab to edit custom system instructions, company context, and safety guardrails.', 'published'),
('kb-12', 'AI Assistant Knowledge Base Training & FAQs', 'feature', '/ai-assistant', 'In AI Assistant (/ai-assistant) -> Knowledge Base tab: Upload training FAQ documents, business context text, and product information for the AI chatbot to automatically learn and use when answering customer queries.', 'published'),
('kb-13', 'AI Rules, Lead Qualification & Human Handoff', 'feature', '/ai-assistant', 'In AI Assistant (/ai-assistant): Use AI Rules tab to configure sentiment scoring thresholds and automatic lead qualification tags (Hot/Warm/Cold). Use Human Handoff tab to configure triggers for transferring live WhatsApp chats from AI Bot to Human Reps.', 'published'),
('kb-14', 'AI Playground Sandbox & Analytics', 'feature', '/ai-assistant', 'In AI Assistant (/ai-assistant): Use Playground tab to test chatbot responses interactively with custom prompts. Use Analytics tab to view real-time AI token usage, sentiment metrics, and cost charts.', 'published'),
('kb-15', 'Hot Leads Filter & AI Lead Scoring', 'feature', '/contacts', 'In Contacts (/contacts), click the 🔥 Hot Leads toggle button at top to instantly filter high-intent contacts with AI lead scores (Hot or Warm) or tags like hot, interested, urgent, and pricing.', 'published'),
('kb-16', 'Direct Phone Call Button & Contact Toolbar', 'feature', '/contacts', 'In Contacts table & Customer Sidebar, click the 📞 Direct Phone Call button (tel:) next to any contact to immediately dial and call the customer directly from your device softphone.', 'published'),
('kb-17', 'Meta Official WhatsApp API Setup', 'onboarding', '/settings?tab=whatsapp', 'Go to Settings -> WhatsApp Config (/settings?tab=whatsapp). Click Meta Embedded Signup to link your official phone number with Meta WhatsApp Business API.', 'published'),
('kb-18', 'Department Team Management & Agent Roles', 'feature', '/settings?tab=departments', 'Go to Settings -> Departments (/settings?tab=departments) or Members (/settings?tab=members) to invite sales and support agents, set roles (Admin, Agent, Manager), and configure auto-routing rules.', 'published'),
('kb-19', 'Settings Rail & Workspace Configuration', 'feature', '/settings', 'In Settings (/settings), access Profile, Security, Appearance (Dark/Light mode), WhatsApp Config, Approved Templates, Custom Fields & Tags, Deals, Team Members, Departments, Developer API Keys & Webhooks, Plan & Subscription, and GST Invoices.', 'published'),
('kb-20', 'Billing, Plan Upgrades & GST Invoices', 'pricing', '/settings?tab=invoices', 'Go to Settings -> Invoices & Billing (/settings?tab=invoices). Compare plans (Starter ₹2,249/mo, Pro ₹5,999/mo, Enterprise) and download official GST tax invoices anytime.', 'published'),
('kb-21', 'Official Contact & Human Support Numbers', 'contact', '/contact', 'Phone Support: +91 8985025794, WhatsApp Direct Support: +91 8092225777, Email: info@nighwantech.com, Website: https://nighwantech.com/', 'published')
ON CONFLICT (id) DO NOTHING;
