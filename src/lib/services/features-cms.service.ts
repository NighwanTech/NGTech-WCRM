export type FeatureStatus = 'live' | 'beta' | 'coming_soon' | 'deprecated';
export type PublishStatus = 'published' | 'draft' | 'scheduled' | 'archived';
export type FeatureCategory =
  | 'AI Platform'
  | 'Sales CRM'
  | 'Customer Support'
  | 'Marketing'
  | 'Automation'
  | 'Analytics'
  | 'Developer Platform'
  | 'Security';

export type SectionBlockType =
  | 'hero'
  | 'dashboard_showcase'
  | 'product_tour'
  | 'problems'
  | 'solution'
  | 'kpi_stats'
  | 'ai_advantages'
  | 'comparison_table'
  | 'use_cases'
  | 'integrations'
  | 'faq'
  | 'cta'
  | 'custom_rich_text';

export interface FeatureSectionBlock {
  id: string;
  type: SectionBlockType;
  enabled: boolean;
  order: number;
  theme?: 'light' | 'dark' | 'gradient' | 'glass';
  animation?: 'zoom' | 'fade' | 'slide';
  content: Record<string, any>;
}

export interface FeatureRecord {
  id: string;
  name: string;
  slug: string;
  category: FeatureCategory;
  status: FeatureStatus;
  publish_status: PublishStatus;
  short_description: string;
  long_description?: string;
  featured_toggle: boolean;
  available_in_plans: string[]; // e.g. ['Free', 'Starter', 'Pro', 'Enterprise']
  supported_industries: string[]; // e.g. ['Manufacturing', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'BFSI']
  meta_title: string;
  meta_description: string;
  focus_keyword?: string;
  secondary_keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  schema_type?: string;
  ai_search_summary?: string;
  sections_config: FeatureSectionBlock[];
  related_slugs?: string[];
  created_at?: string;
  updated_at?: string;
}

// ─── MASTER FALLBACK FEATURES CATALOG (40+ FEATURES) ───
export const FALLBACK_FEATURES_CATALOG: FeatureRecord[] = [
  // 1. SHARED INBOX (Customer Support)
  {
    id: 'feat_shared_inbox',
    name: 'Shared Team Inbox',
    slug: 'shared-inbox',
    category: 'Customer Support',
    status: 'live',
    publish_status: 'published',
    short_description: 'Connect multi-agent teams to a single WhatsApp Business number with collision detection, internal notes, and auto-routing.',
    featured_toggle: true,
    available_in_plans: ['Starter', 'Pro', 'Enterprise'],
    supported_industries: ['Manufacturing', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'BFSI', 'Hospitality', 'Services'],
    meta_title: 'WhatsApp Shared Team Inbox | WCRM Enterprise Platform',
    meta_description: 'Multi-agent WhatsApp Shared Inbox. Manage conversations together, assign leads to agents, and collaborate with private notes.',
    sections_config: [
      {
        id: 'sec_hero_1',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Multi-Agent WhatsApp Shared Team Inbox',
          subheadline: 'Stop fighting over a single WhatsApp phone. Equip your sales, support, and ops teams with a unified multiplayer inbox built for enterprise scale.',
          cta_primary: 'Start 7-Day Free Trial',
          cta_primary_url: '/free-trial?feature=shared-inbox',
          cta_secondary: 'Book Live Demo',
          cta_secondary_url: '/book-demo',
          image_asset: 'inbox-mockup'
        }
      },
      {
        id: 'sec_problems_1',
        type: 'problems',
        enabled: true,
        order: 2,
        theme: 'dark',
        animation: 'fade',
        content: {
          title: 'The Cost of Chaos on Single-Device WhatsApp',
          items: [
            { icon: 'AlertTriangle', title: 'Lost & Missed Customer Queries', desc: 'Queries get buried on personal smartphones with zero visibility for managers.' },
            { icon: 'Users', title: 'Duplicate Agent Replies', desc: 'Multiple reps reply to the same customer simultaneously creating confusion.' },
            { icon: 'Clock', title: 'Slow 4-Hour Response Times', desc: 'Manual ticket delegation leads to frustrated prospects and lead drop-offs.' }
          ]
        }
      },
      {
        id: 'sec_kpi_1',
        type: 'kpi_stats',
        enabled: true,
        order: 3,
        theme: 'gradient',
        animation: 'slide',
        content: {
          title: 'Proven Business Impact Across 500+ Enterprises',
          stats: [
            { label: 'Faster Response Rate', value: '80%' },
            { label: 'Less Manual Work', value: '60%' },
            { label: 'Lead Conversion Lift', value: '3.2x' }
          ]
        }
      },
      {
        id: 'sec_solves_1',
        type: 'solution',
        enabled: true,
        order: 4,
        theme: 'light',
        animation: 'zoom',
        content: {
          title: 'How WCRM Re-invents WhatsApp Support',
          steps: [
            { step: '01', title: 'Multi-Agent Assignment', desc: 'Auto-route inbound chats based on round-robin or agent workload.' },
            { step: '02', title: 'Collision Detection', desc: 'Live visual typing indicators prevent double-replying.' },
            { step: '03', title: 'Internal Private Notes', desc: 'Tag team members with @mentions inside customer threads.' }
          ]
        }
      },
      {
        id: 'sec_ai_1',
        type: 'ai_advantages',
        enabled: true,
        order: 5,
        theme: 'glass',
        animation: 'fade',
        content: {
          title: 'AI Capabilities Built Into Shared Inbox',
          capabilities: [
            { title: '0-Token Greeting Cache', desc: 'Instantly greets buyers without spending AI model token budgets.' },
            { title: 'Smart Summarization', desc: 'Summarizes long 50-message chat threads into a 2-line executive briefing.' },
            { title: 'Sentiment Scoring', desc: 'Highlights urgent or angry buyers in red for priority escalation.' }
          ]
        }
      },
      {
        id: 'sec_comp_1',
        type: 'comparison_table',
        enabled: true,
        order: 6,
        theme: 'dark',
        animation: 'zoom',
        content: {
          title: 'Standard WhatsApp App vs WCRM Shared Inbox',
          rows: [
            { feature: 'Multi-Agent Access', legacy: '1 Phone / Web App', wacrm: 'Unlimited Agents & Departments' },
            { feature: 'Collision Detection', legacy: '❌ None', wacrm: '✅ Live Typing Indicator Alerts' },
            { feature: 'Internal Chat Notes', legacy: '❌ None', wacrm: '✅ Private @Mention Threads' },
            { feature: 'AI Auto-Routing', legacy: '❌ None', wacrm: '✅ 0-Latency BYOK AI Router' }
          ]
        }
      },
      {
        id: 'sec_faq_1',
        type: 'faq',
        enabled: true,
        order: 7,
        theme: 'light',
        animation: 'fade',
        content: {
          title: 'Shared Inbox Frequently Asked Questions',
          faqs: [
            { q: 'How many agents can use the same phone number?', a: 'Unlimited agents can log in simultaneously across desktop, tablet, and mobile devices.' },
            { q: 'Can reps see each other’s conversations?', a: 'Yes! Admins can configure Role-Based Access Controls (RBAC) to restrict team visibility by department or territory.' },
            { q: 'Does it work with official Meta Cloud API?', a: 'Yes, WCRM integrates directly with the Meta Cloud API for guaranteed 100% uptime with zero ban risk.' }
          ]
        }
      },
      {
        id: 'sec_cta_1',
        type: 'cta',
        enabled: true,
        order: 8,
        theme: 'gradient',
        animation: 'zoom',
        content: {
          title: 'Transform Your Team WhatsApp Experience Today',
          subheadline: 'Set up your Shared Team Inbox in under 5 minutes with our 7-day risk-free trial.',
          button_text: 'Claim 7-Day Free Trial Now →',
          button_url: '/free-trial?feature=shared-inbox'
        }
      }
    ],
    related_slugs: ['multi-agent', 'team-inbox', 'live-chat', 'crm-pipeline']
  },

  // 2. BYOK MULTI-LLM AI ENGINE (AI Platform)
  {
    id: 'feat_byok',
    name: 'Bring Your Own Key (BYOK) AI Platform',
    slug: 'byok',
    category: 'AI Platform',
    status: 'live',
    publish_status: 'published',
    short_description: 'Connect OpenAI, Gemini, Claude, Groq, or DeepSeek API keys directly with zero platform token markups.',
    featured_toggle: true,
    available_in_plans: ['Free', 'Starter', 'Pro', 'Enterprise'],
    supported_industries: ['Manufacturing', 'Education', 'Healthcare', 'Real Estate', 'Retail', 'BFSI'],
    meta_title: 'BYOK Multi-LLM AI Engine | Zero Token Markup WCRM',
    meta_description: 'Plug your OpenAI, Gemini 3.6, or Claude API keys directly into WCRM. Pay 0% platform token markup.',
    sections_config: [
      {
        id: 'sec_hero_byok',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Bring Your Own Key (BYOK) Multi-Model AI Engine',
          subheadline: 'Eliminate AI vendor lock-in and 3x platform markups. Use your existing OpenAI, Gemini 3.6, Claude, Groq, or DeepSeek API keys with self-healing auto-failover.',
          cta_primary: 'Try BYOK Engine Free',
          cta_primary_url: '/free-trial?feature=byok',
          cta_secondary: 'View AI Models',
          cta_secondary_url: '/ai-platform',
          image_asset: 'ai-routing-network'
        }
      },
      {
        id: 'sec_kpi_byok',
        type: 'kpi_stats',
        enabled: true,
        order: 2,
        theme: 'gradient',
        animation: 'slide',
        content: {
          title: 'Zero Token Markup Economy',
          stats: [
            { label: 'Platform AI Markup', value: '0%' },
            { label: 'Model Failover Latency', value: '<1s' },
            { label: 'Token Cost Savings', value: '60%' }
          ]
        }
      },
      {
        id: 'sec_ai_byok',
        type: 'ai_advantages',
        enabled: true,
        order: 3,
        theme: 'dark',
        animation: 'fade',
        content: {
          title: 'Supported AI Models in BYOK Engine',
          capabilities: [
            { title: 'Google Gemini 3.6 & 1.5 Pro', desc: 'Sub-100ms reasoning for multi-step product recommendations.' },
            { title: 'OpenAI GPT-4o & o3-mini', desc: 'Complex lead qualification and structured JSON extraction.' },
            { title: 'Groq LLaMA 3.3 70B', desc: 'Ultra-fast 500 token/sec response generation.' },
            { title: 'DeepSeek R1 & Anthropic Claude 3.5', desc: 'Enterprise deep context reasoning and multi-lingual translation.' }
          ]
        }
      },
      {
        id: 'sec_cta_byok',
        type: 'cta',
        enabled: true,
        order: 4,
        theme: 'gradient',
        animation: 'zoom',
        content: {
          title: 'Start Saving 60% on AI Tokens Right Now',
          subheadline: 'Plug in your OpenAI or Gemini key and automate WhatsApp inquiries with zero markup.',
          button_text: 'Plug In Your Key & Start Trial →',
          button_url: '/free-trial?feature=byok'
        }
      }
    ],
    related_slugs: ['ai-router', 'ai-auto-failover', 'ai-chatbot', 'zero-token-greeting']
  },

  // 3. VISUAL CRM PIPELINE (Sales CRM)
  {
    id: 'feat_crm_pipeline',
    name: 'Visual Kanban Deal Pipeline',
    slug: 'crm-pipeline',
    category: 'Sales CRM',
    status: 'live',
    publish_status: 'published',
    short_description: 'Drag-and-drop WhatsApp deal stages from Lead Inbound to Closed Won with automated follow-ups.',
    featured_toggle: true,
    available_in_plans: ['Starter', 'Pro', 'Enterprise'],
    supported_industries: ['Manufacturing', 'Real Estate', 'Education', 'BFSI', 'Retail', 'Services'],
    meta_title: 'WhatsApp Kanban CRM Deal Pipeline | WCRM',
    meta_description: 'Track WhatsApp sales deals with drag-and-drop Kanban pipeline stages, revenue attribution, and auto-reminders.',
    sections_config: [
      {
        id: 'sec_hero_kanban',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Visual Kanban Deal Pipeline for WhatsApp',
          subheadline: 'Turn WhatsApp conversations into structured revenue pipelines. Drag and drop deal cards, assign deal values, and automate stage-based follow-ups.',
          cta_primary: 'Explore Sales CRM',
          cta_primary_url: '/free-trial?feature=crm-pipeline',
          cta_secondary: 'Book Demo',
          cta_secondary_url: '/book-demo',
          image_asset: 'dashboard-mockup'
        }
      },
      {
        id: 'sec_kpi_kanban',
        type: 'kpi_stats',
        enabled: true,
        order: 2,
        theme: 'gradient',
        animation: 'slide',
        content: {
          title: 'Accelerate Sales Velocity',
          stats: [
            { label: 'Sales Cycle Reduction', value: '45%' },
            { label: 'Lead Follow-Up Rate', value: '100%' },
            { label: 'Deal Win Rate Boost', value: '2.8x' }
          ]
        }
      },
      {
        id: 'sec_cta_kanban',
        type: 'cta',
        enabled: true,
        order: 3,
        theme: 'gradient',
        animation: 'zoom',
        content: {
          title: 'Close More Deals on WhatsApp Today',
          subheadline: 'Organize your entire sales pipeline in a clean visual Kanban view.',
          button_text: 'Start Free Trial →',
          button_url: '/free-trial?feature=crm-pipeline'
        }
      }
    ],
    related_slugs: ['lead-management', 'contacts', 'deals', 'tasks']
  },

  // 4. RETELL VOICE AI (AI Platform)
  {
    id: 'feat_voice_ai',
    name: 'Retell Voice AI Agent Integration',
    slug: 'voice-ai',
    category: 'AI Platform',
    status: 'live',
    publish_status: 'published',
    short_description: 'Human-like AI phone call handling, voice notes, call transcripts, and sentiment analysis synced to WhatsApp.',
    featured_toggle: true,
    available_in_plans: ['Pro', 'Enterprise'],
    supported_industries: ['Education', 'Healthcare', 'Real Estate', 'BFSI', 'Hospitality', 'Services'],
    meta_title: 'Retell Voice AI Agent for WhatsApp CRM | WCRM',
    meta_description: 'Automate incoming and outgoing phone calls with human-like Retell Voice AI agents integrated directly into WhatsApp.',
    sections_config: [
      {
        id: 'sec_hero_voice',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Retell Voice AI Agent Integration',
          subheadline: 'Combine text and voice seamlessly. Deploy human-grade Retell Voice AI agents that answer phone calls, record transcripts, and trigger WhatsApp follow-ups.',
          cta_primary: 'Try Voice AI Now',
          cta_primary_url: '/free-trial?feature=voice-ai',
          cta_secondary: 'Listen to Call Samples',
          cta_secondary_url: '/book-demo',
          image_asset: 'inbox-mockup'
        }
      },
      {
        id: 'sec_kpi_voice',
        type: 'kpi_stats',
        enabled: true,
        order: 2,
        theme: 'gradient',
        animation: 'slide',
        content: {
          title: 'Voice Call Automation Telemetry',
          stats: [
            { label: 'Voice Response Latency', value: '<600ms' },
            { label: 'Call Resolution Rate', value: '78%' },
            { label: 'Cost Reduction', value: '70%' }
          ]
        }
      },
      {
        id: 'sec_cta_voice',
        type: 'cta',
        enabled: true,
        order: 3,
        theme: 'gradient',
        animation: 'zoom',
        content: {
          title: 'Deploy Retell Voice AI for Your Business',
          subheadline: 'Never miss an inbound phone call or WhatsApp inquiry again.',
          button_text: 'Activate Voice AI Trial →',
          button_url: '/free-trial?feature=voice-ai'
        }
      }
    ],
    related_slugs: ['ai-platform', 'byok', 'ai-chatbot', 'shared-inbox']
  },

  // 5. BROADCAST CAMPAIGN ENGINE (Marketing)
  {
    id: 'feat_broadcast_campaigns',
    name: 'Meta WhatsApp Broadcast Campaigns',
    slug: 'broadcast-campaigns',
    category: 'Marketing',
    status: 'live',
    publish_status: 'published',
    short_description: 'Send high-volume targeted WhatsApp template campaigns with open/click tracking and 0% markup.',
    featured_toggle: true,
    available_in_plans: ['Starter', 'Pro', 'Enterprise'],
    supported_industries: ['Retail', 'Manufacturing', 'Education', 'Healthcare', 'Real Estate', 'BFSI'],
    meta_title: 'WhatsApp Broadcast Software & Campaigns | WCRM',
    meta_description: 'Send high-volume WhatsApp template broadcasts with audience segmentation, rich CTA buttons, and real-time open tracking.',
    sections_config: [
      {
        id: 'sec_hero_bc',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Meta WhatsApp Broadcast & Targeted Campaigns',
          subheadline: 'Reach 100,000+ customers directly on WhatsApp with 98% open rates. Send rich media templates with interactive CTA buttons and live analytics.',
          cta_primary: 'Launch Broadcast Trial',
          cta_primary_url: '/free-trial?feature=broadcast-campaigns',
          cta_secondary: 'View Templates',
          cta_secondary_url: '/book-demo',
          image_asset: 'dashboard-mockup'
        }
      },
      {
        id: 'sec_kpi_bc',
        type: 'kpi_stats',
        enabled: true,
        order: 2,
        theme: 'gradient',
        animation: 'slide',
        content: {
          title: 'Broadcast Campaign Performance',
          stats: [
            { label: 'Average Open Rate', value: '98%' },
            { label: 'Click-Through Rate', value: '45%' },
            { label: 'ROAS Improvement', value: '4.5x' }
          ]
        }
      },
      {
        id: 'sec_cta_bc',
        type: 'cta',
        enabled: true,
        order: 3,
        theme: 'gradient',
        animation: 'zoom',
        content: {
          title: 'Run High-Converting WhatsApp Broadcasts Today',
          subheadline: 'Zero platform fees on Meta message rates.',
          button_text: 'Start Free Trial →',
          button_url: '/free-trial?feature=broadcast-campaigns'
        }
      }
    ],
    related_slugs: ['campaign-management', 'broadcast-analytics', 'meta-api', 'customer-journey']
  },

  // 6. WORKFLOW AUTOMATION (Automation)
  {
    id: 'feat_workflow_automation',
    name: 'Visual No-Code Workflow Builder',
    slug: 'workflow-automation',
    category: 'Automation',
    status: 'live',
    publish_status: 'published',
    short_description: 'Drag-and-drop triggers, conditions, AI routing, and webhook actions without writing code.',
    featured_toggle: true,
    available_in_plans: ['Starter', 'Pro', 'Enterprise'],
    supported_industries: ['Manufacturing', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'BFSI'],
    meta_title: 'WhatsApp Automation & Visual Workflow Builder | WCRM',
    meta_description: 'Automate WhatsApp customer journeys with visual triggers, AI routing nodes, custom webhooks, and automatic lead tagging.',
    sections_config: [
      {
        id: 'sec_hero_wf',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Visual No-Code Workflow Automation Builder',
          subheadline: 'Build complex multi-step automated workflows in minutes. Connect inbound WhatsApp messages to webhook triggers, AI qualification, and CRM stage updates.',
          cta_primary: 'Build Your First Workflow',
          cta_primary_url: '/free-trial?feature=workflow-automation',
          cta_secondary: 'Explore Triggers',
          cta_secondary_url: '/book-demo',
          image_asset: 'ai-routing-network'
        }
      },
      {
        id: 'sec_cta_wf',
        type: 'cta',
        enabled: true,
        order: 2,
        theme: 'gradient',
        animation: 'zoom',
        content: {
          title: 'Automate Your Entire Business on WhatsApp',
          subheadline: 'Save 35+ hours per rep every single month.',
          button_text: 'Start Free Trial →',
          button_url: '/free-trial?feature=workflow-automation'
        }
      }
    ],
    related_slugs: ['webhooks', 'api', 'automation', 'smart-routing']
  },
  // 7. ANALYTICS & TELEMETRY (Analytics)
  {
    id: 'feat_analytics',
    name: 'Executive Analytics & Telemetry',
    slug: 'analytics',
    category: 'Analytics',
    status: 'live',
    publish_status: 'published',
    short_description: 'Real-time conversation ROI dashboards, SLA response heatmaps, team resolution speed, and revenue attribution.',
    featured_toggle: true,
    available_in_plans: ['Pro', 'Enterprise'],
    supported_industries: ['Manufacturing', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'BFSI'],
    meta_title: 'WhatsApp Conversation Analytics & SLAs | WCRM Enterprise',
    meta_description: 'Track WhatsApp response time SLAs, team resolution speed, and broadcast campaign ROI in real-time.',
    sections_config: [
      {
        id: 'sec_hero_analytics',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Executive Telemetry & Conversation ROI Analytics',
          subheadline: 'Eliminate blind spots. Monitor resolution speed, agent productivity, and campaign revenue attribution in real-time.',
          cta_primary: 'Start 7-Day Free Trial',
          cta_primary_url: '/free-trial?feature=analytics',
          cta_secondary: 'Book Demo',
          cta_secondary_url: '/book-demo',
          image_asset: 'dashboard-mockup'
        }
      }
    ],
    related_slugs: ['shared-inbox', 'crm-pipeline', 'broadcast-campaigns']
  },
  // 8. DEVELOPER PLATFORM (Developer Platform)
  {
    id: 'feat_developer_platform',
    name: 'Developer REST APIs & Webhooks',
    slug: 'api',
    category: 'Developer Platform',
    status: 'live',
    publish_status: 'published',
    short_description: 'Sub-50ms real-time event webhooks, REST APIs for message sending, CRM deal sync, and Node/Python/Go SDKs.',
    featured_toggle: true,
    available_in_plans: ['Starter', 'Pro', 'Enterprise'],
    supported_industries: ['Manufacturing', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'BFSI'],
    meta_title: 'WhatsApp Developer REST API & Webhooks | WCRM Platform',
    meta_description: 'Programmatic access to send Meta WhatsApp templates, receive sub-50ms webhooks, and sync CRM deals.',
    sections_config: [
      {
        id: 'sec_hero_api',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Enterprise Developer REST APIs & Webhooks',
          subheadline: 'Programmatically control your WhatsApp channel with sub-50ms latency, 99.99% SLA, and native SDKs.',
          cta_primary: 'Explore API Docs',
          cta_primary_url: '/api-docs',
          cta_secondary: 'Start 7-Day Free Trial',
          cta_secondary_url: '/free-trial?feature=api',
          image_asset: 'automation-mockup'
        }
      }
    ],
    related_slugs: ['workflow-automation', 'byok', 'security']
  },
  // 9. ENTERPRISE SECURITY (Security)
  {
    id: 'feat_enterprise_security',
    name: 'Enterprise Security & Meta Compliance',
    slug: 'security',
    category: 'Security',
    status: 'live',
    publish_status: 'published',
    short_description: 'Role-based access control (RBAC), session audit logging, end-to-end encryption, and 100% official Meta API compliance.',
    featured_toggle: true,
    available_in_plans: ['Enterprise'],
    supported_industries: ['Manufacturing', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'BFSI'],
    meta_title: 'Enterprise WhatsApp Security & Meta Compliance | WCRM',
    meta_description: 'Role-based access control (RBAC), audit logging, SOC2 data security, and 100% Meta Official API compliance.',
    sections_config: [
      {
        id: 'sec_hero_security',
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: 'Enterprise Security, RBAC & Meta Compliance',
          subheadline: 'Protect your business with granular role permissions, session audit logs, and zero phone ban risk.',
          cta_primary: 'Start 7-Day Free Trial',
          cta_primary_url: '/free-trial?feature=security',
          cta_secondary: 'Book Demo',
          cta_secondary_url: '/book-demo',
          image_asset: 'dashboard-mockup'
        }
      }
    ],
    related_slugs: ['api', 'shared-inbox', 'analytics']
  }
];

// Helper to fill generic fallback for remaining 35+ slugs dynamically so no route ever errors 404
export function getFeatureFallbackBySlug(slug: string): FeatureRecord {
  const existing = FALLBACK_FEATURES_CATALOG.find(f => f.slug === slug);
  if (existing) return existing;

  const formattedName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const resolvedImage =
    slug.includes('ai') || slug.includes('byok') || slug.includes('llm') || slug.includes('bot') || slug.includes('failover') || slug.includes('greeting') || slug.includes('voice') || slug.includes('memory')
      ? 'ai-mockup'
      : slug.includes('inbox') || slug.includes('multi-agent') || slug.includes('chat') || slug.includes('support') || slug.includes('team')
      ? 'inbox-mockup'
      : slug.includes('pipeline') || slug.includes('kanban')
      ? 'pipeline-mockup'
      : slug.includes('crm') || slug.includes('contact') || slug.includes('lead') || slug.includes('deal') || slug.includes('task')
      ? 'crm-mockup'
      : slug.includes('broadcast') || slug.includes('campaign') || slug.includes('marketing')
      ? 'broadcast-mockup'
      : slug.includes('workflow') || slug.includes('automation') || slug.includes('trigger') || slug.includes('webhook') || slug.includes('api')
      ? 'automation-mockup'
      : slug.includes('journey') || slug.includes('routing') || slug.includes('flow')
      ? 'flow-mockup'
      : 'dashboard-mockup';

  const resolvedCategory: FeatureCategory =
    slug.includes('analytics') || slug.includes('reporting')
      ? 'Analytics'
      : slug.includes('security') || slug.includes('privacy') || slug.includes('compliance')
      ? 'Security'
      : slug.includes('api') || slug.includes('webhook') || slug.includes('developer')
      ? 'Developer Platform'
      : slug.includes('ai') || slug.includes('byok')
      ? 'AI Platform'
      : slug.includes('crm') || slug.includes('lead') || slug.includes('deal')
      ? 'Sales CRM'
      : slug.includes('broadcast') || slug.includes('campaign')
      ? 'Marketing'
      : slug.includes('workflow') || slug.includes('automation')
      ? 'Automation'
      : 'Customer Support';

  return {
    id: `feat_${slug.replace(/-/g, '_')}`,
    name: formattedName,
    slug: slug,
    category: resolvedCategory,
    status: 'live',
    publish_status: 'published',
    short_description: `Enterprise ${formattedName} solution for official Meta WhatsApp Cloud API with multi-agent inbox, BYOK AI routing, and live CRM telemetry.`,
    featured_toggle: false,
    available_in_plans: ['Free', 'Starter', 'Pro', 'Enterprise'],
    supported_industries: ['Manufacturing', 'Healthcare', 'Education', 'Retail', 'Real Estate', 'BFSI'],
    meta_title: `${formattedName} | WCRM Enterprise Platform`,
    meta_description: `Discover how WCRM ${formattedName} accelerates lead conversion, automates WhatsApp support, and cuts AI token costs with 0% platform markup.`,
    sections_config: [
      {
        id: `sec_hero_${slug}`,
        type: 'hero',
        enabled: true,
        order: 1,
        theme: 'glass',
        animation: 'zoom',
        content: {
          title: `Enterprise ${formattedName}`,
          subheadline: `Scale your business operations on official Meta WhatsApp API with WCRM ${formattedName}. Designed for multi-agent teams and high-volume automation.`,
          cta_primary: 'Start 7-Day Free Trial',
          cta_primary_url: `/free-trial?feature=${slug}`,
          cta_secondary: 'Book Demo',
          cta_secondary_url: '/book-demo',
          image_asset: resolvedImage
        }
      },
      {
        id: `sec_kpi_${slug}`,
        type: 'kpi_stats',
        enabled: true,
        order: 2,
        theme: 'gradient',
        animation: 'slide',
        content: {
          title: `${formattedName} Business Outcomes`,
          stats: [
            { label: 'Response Time Reduction', value: '80%' },
            { label: 'Manual Work Saved', value: '60%' },
            { label: 'Conversion Rate Lift', value: '3x' }
          ]
        }
      },
      {
        id: `sec_cta_${slug}`,
        type: 'cta',
        enabled: true,
        order: 3,
        theme: 'gradient',
        animation: 'zoom',
        content: {
          title: `Deploy ${formattedName} for Your Team Today`,
          subheadline: 'Set up in under 5 minutes with zero technical overhead.',
          button_text: 'Claim Your 7-Day Free Trial →',
          button_url: `/free-trial?feature=${slug}`
        }
      }
    ],
    related_slugs: ['shared-inbox', 'byok', 'crm-pipeline', 'voice-ai']
  };
}

export class FeaturesCmsService {
  static async getAllFeatures(): Promise<FeatureRecord[]> {
    return FALLBACK_FEATURES_CATALOG;
  }

  static async getFeatureBySlug(slug: string): Promise<FeatureRecord> {
    return getFeatureFallbackBySlug(slug);
  }

  static async searchFeatures(query: string, category?: string, industry?: string): Promise<FeatureRecord[]> {
    const all = await this.getAllFeatures();
    return all.filter((f) => {
      const matchQuery =
        !query ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.short_description.toLowerCase().includes(query.toLowerCase()) ||
        f.slug.includes(query.toLowerCase());
      const matchCat = !category || category === 'All' || f.category === category;
      const matchInd =
        !industry || industry === 'All' || (f.supported_industries && f.supported_industries.includes(industry));
      return matchQuery && matchCat && matchInd;
    });
  }
}
