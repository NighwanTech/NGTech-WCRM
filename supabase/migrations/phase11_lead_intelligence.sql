-- ==============================================================================
-- AIWCRM ENTERPRISE REVENUE OS — PHASE 11: LEAD INTELLIGENCE & OMNICHANNEL SQL
-- Non-Breaking PostgreSQL Schema Extensions
-- ==============================================================================

-- 1. Raw Lead Intake Payloads Table (Universal Intake)
CREATE TABLE IF NOT EXISTS public.meta_leadgen_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    leadgen_id TEXT UNIQUE,
    source_type TEXT DEFAULT 'META_INSTANT_FORM', -- META_INSTANT_FORM, WEBSITE, EXCEL, GOOGLE_SHEETS, WHATSAPP, API
    form_id TEXT,
    page_id TEXT,
    campaign_id TEXT,
    adset_id TEXT,
    ad_id TEXT,
    field_data JSONB DEFAULT '{}'::jsonb,
    processed_status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSED, MERGED, FAILED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lead Intelligence Scores Table
CREATE TABLE IF NOT EXISTS public.lead_intelligence_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    lead_score INT DEFAULT 85,
    buying_intent TEXT DEFAULT 'HIGH', -- HIGH, MEDIUM, LOW
    urgency_level TEXT DEFAULT 'IMMEDIATE', -- IMMEDIATE, HIGH, NORMAL, LOW
    estimated_revenue NUMERIC(12, 2) DEFAULT 0.00,
    close_probability INT DEFAULT 75,
    recommended_salesperson TEXT,
    next_best_action TEXT,
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer AI Memory Table
CREATE TABLE IF NOT EXISTS public.customer_ai_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    interested_products TEXT[] DEFAULT '{}',
    budget_range TEXT,
    language_preference TEXT DEFAULT 'Hindi / English',
    pain_points TEXT[] DEFAULT '{}',
    past_objections TEXT[] DEFAULT '{}',
    preferred_communication_time TEXT,
    decision_maker_status TEXT DEFAULT 'PRIMARY_DECISION_MAKER',
    memory_context JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WhatsApp AI Conversations Table
CREATE TABLE IF NOT EXISTS public.whatsapp_ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    campaign_id TEXT,
    ai_enabled BOOLEAN DEFAULT true,
    chat_status TEXT DEFAULT 'ACTIVE', -- ACTIVE, ESCALATED_TO_HUMAN, RESOLVED, CLOSED
    last_message_text TEXT,
    messages_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Lead Routing Rules Table
CREATE TABLE IF NOT EXISTS public.lead_routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    routing_method TEXT DEFAULT 'ROUND_ROBIN', -- ROUND_ROBIN, TERRITORY, PRODUCT, LANGUAGE, BUDGET
    criteria JSONB DEFAULT '{}'::jsonb,
    target_team TEXT,
    target_user_ids UUID[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ad Account Knowledge Base Documents Table
CREATE TABLE IF NOT EXISTS public.ad_account_knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    document_type TEXT DEFAULT 'PRODUCT_SPEC', -- PRODUCT_SPEC, PRICING, FAQ, BRAND_VOICE, SALES_PDF, CASE_STUDY
    title TEXT NOT NULL,
    content_text TEXT NOT NULL,
    file_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Universal Lead Activity Timeline Table
CREATE TABLE IF NOT EXISTS public.lead_activity_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- LEAD_CREATED, AI_QUALIFIED, WHATSAPP_SENT, CUSTOMER_REPLIED, SALES_ASSIGNED, QUOTATION_SENT, INVOICE_PAID, CLOSED_WON
    title TEXT NOT NULL,
    description TEXT,
    actor_type TEXT DEFAULT 'SYSTEM', -- SYSTEM, AI_AGENT, SALES_REP, CUSTOMER
    actor_name TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for Lightning Fast Performance
CREATE INDEX IF NOT EXISTS idx_leadgen_events_account ON public.meta_leadgen_events(account_id);
CREATE INDEX IF NOT EXISTS idx_lead_scores_contact ON public.lead_intelligence_scores(contact_id);
CREATE INDEX IF NOT EXISTS idx_customer_memory_contact ON public.customer_ai_memory(contact_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conv_contact ON public.whatsapp_ai_conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_activity_timeline_contact ON public.lead_activity_timeline(contact_id);
