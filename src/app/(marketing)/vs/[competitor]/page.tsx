import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Bot,
  Kanban,
  MessageSquare,
  Send,
  PhoneCall,
  Activity,
  ChevronRight,
  Star,
  Layers,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { getSiteUrl, SITE_CONFIG } from '@/lib/site-config'

export interface CompetitorData {
  slug: string
  name: string
  tagline: string
  badge: string
  markup: string
  voiceAi: boolean
  failover: boolean
  kanban: boolean
  gstInvoicing: boolean
  metaAdsOs: boolean
  zeroTokenGreeting: boolean
  metaOfficial: boolean
  typicalCost: string
  pricingNote: string
  summary: string
  strengths: string[]
  limitations: string[]
  differentiators: { title: string; us: string; them: string }[]
  faqs: { q: string; a: string }[]
}

export const COMPETITORS: Record<string, CompetitorData> = {
  hubspot: {
    slug: 'hubspot',
    name: 'HubSpot',
    tagline: 'AIWCRM vs HubSpot — Unified WhatsApp OS & GST Invoicing vs Expensive Disconnected Hubs',
    badge: 'HubSpot Alternative',
    markup: 'Extremely High Enterprise Tiers ($500 - $1,500/mo)',
    voiceAi: false,
    failover: false,
    kanban: true,
    gstInvoicing: false,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: false,
    typicalCost: '$500 - $1,200 / month (Requires separate WhatsApp & Invoicing tools)',
    pricingNote: 'HubSpot charges steep per-seat fees with expensive tier upgrades for automated workflows, lacking native two-way WhatsApp Cloud API and 18% GST statutory billing.',
    summary: 'While HubSpot is a renowned traditional inbound CRM, it relies on third-party marketplace plugins for WhatsApp messaging and lacks native Indian GST invoicing, Meta Ads Graph automation, and BYOK multi-LLM zero-markup vaults.',
    strengths: ['Established inbound marketing blog tools', 'Mature contact properties schema', 'Extensive third-party app marketplace'],
    limitations: [
      'No native two-way WhatsApp Cloud API (requires expensive third-party integrations)',
      'No statutory 18% CGST/SGST/IGST tax invoicing or Razorpay collections',
      'No BYOK AI model routing (locks you into proprietary AI tokens)',
      'Per-seat pricing scales exponentially as your team grows',
    ],
    differentiators: [
      { title: 'WhatsApp Cloud API', us: 'Native official Meta Cloud API with shared team inbox', them: 'Third-party marketplace add-ons with separate monthly bills' },
      { title: 'GST & Statutory Invoicing', us: 'Built-in 18% GST tax invoices, HSN codes & Razorpay links', them: 'None (Requires separate QuickBooks / Zoho Books connector)' },
      { title: 'Meta Ads Manager Pro', us: 'Native Graph API ad creation, creative AI & <2s lead intake', them: 'Read-only ad performance tracking; no direct ad generation' },
      { title: 'AI Model Cost', us: 'BYOK (0% Token Markup) with Gemini 3.6, GPT-4o, Groq', them: 'Proprietary credit tiers with high platform margins' },
    ],
    faqs: [
      { q: 'Can I migrate my contacts from HubSpot to AIWCRM?', a: 'Yes! AIWCRM includes a 1-click CSV contact and deal pipeline importer that maps all custom properties, deal stages, and notes in under 2 minutes.' },
      { q: 'Why is AIWCRM more affordable than HubSpot for sales teams?', a: 'AIWCRM bundles WhatsApp, Meta Ads, Lead Hub, CRM, Proposals, and GST Invoicing into one transparent flat-rate plan rather than charging escalating per-hub and per-seat fees.' },
    ],
  },
  salesforce: {
    slug: 'salesforce',
    name: 'Salesforce',
    tagline: 'AIWCRM vs Salesforce — Agile Business Operating System vs Bloated Legacy CRM',
    badge: 'Salesforce Alternative',
    markup: 'Heavy Consulting & Per-User Licensing ($150+/user/mo)',
    voiceAi: false,
    failover: false,
    kanban: true,
    gstInvoicing: false,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: false,
    typicalCost: '$150 - $300 / user / month + 6-figure implementation costs',
    pricingNote: 'Salesforce requires certified consultants for setup, custom Apex code for basic automations, and expensive third-party CTI connectors for WhatsApp and Voice.',
    summary: 'Salesforce is an enterprise behemoth with high implementation friction. AIWCRM offers rapid same-day deployment, native WhatsApp Cloud API, Retell Voice AI, and built-in 18% GST invoicing at 80% lower total cost of ownership.',
    strengths: ['Deep customization and Apex enterprise triggers', 'Extensive legacy corporate ecosystem', 'Complex organizational role hierarchies'],
    limitations: [
      'Requires months of specialized consulting to deploy and configure',
      'Exorbitant annual contracts with heavy per-user licensing fees',
      'No native two-way WhatsApp Cloud API or Meta ad launcher',
      'Complex legacy interface with steep learning curves for sales reps',
    ],
    differentiators: [
      { title: 'Time to Value', us: 'Deploy same-day with pre-built 12 workspaces', them: '3 to 6 months implementation cycle with SI consultants' },
      { title: 'WhatsApp & Voice AI', us: 'Built-in WhatsApp Cloud API & Retell Voice AI calling', them: 'Requires expensive AppExchange connectors & telecom contracts' },
      { title: 'Total Cost of Ownership', us: 'Transparent flat plans starting at ₹4,999/mo', them: '₹12,000+ per user/mo plus implementation & admin overhead' },
      { title: 'GST Billing Engine', us: 'Statutory 18% GST tax invoices & collections ledger', them: 'Requires external ERP sync (SAP / Oracle / NetSuite)' },
    ],
    faqs: [
      { q: 'Is AIWCRM secure enough for enterprise compliance compared to Salesforce?', a: 'Yes! AIWCRM features bank-grade AES-256 encryption, 4-tier PBAC permissions, SHA-256 cryptographic audit logs, and compliance with the Indian DPDP Act and GDPR.' },
      { q: 'Can we switch from Salesforce without losing deal pipeline history?', a: 'Yes, our migration assistant imports deals, stages, contacts, and historical activity records seamlessly.' },
    ],
  },
  zoho: {
    slug: 'zoho',
    name: 'Zoho CRM',
    tagline: 'AIWCRM vs Zoho CRM — Native Multi-LLM AI & Sub-2s Webhooks vs Fragmented Zoho Suite',
    badge: 'Zoho CRM Alternative',
    markup: 'Add-on Zoho Marketplace Extensions',
    voiceAi: false,
    failover: false,
    kanban: true,
    gstInvoicing: true,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    typicalCost: '₹3,000 - ₹8,000 / month across Zoho One modules',
    pricingNote: 'Zoho requires stitching together multiple separate apps (Zoho CRM, Zoho Desk, Zoho Books, Zoho Social, Zoho Flow) with clunky cross-app sync delays.',
    summary: 'While Zoho is popular in India, its ecosystem is fragmented across 40+ separate apps with slow sync times. AIWCRM provides a single, unified database where marketing, WhatsApp chats, CRM deals, GST invoices, and AI Copilot run with zero synchronization latency.',
    strengths: ['Affordable pricing for basic Indian SMEs', 'Zoho Books integration for statutory accounting', 'Deluge script customization'],
    limitations: [
      'Fragmented UX across multiple siloed apps (CRM, Books, Desk, Campaigns)',
      'Slow webhook execution and rate-limited API sync across modules',
      'No native BYOK multi-model AI vault (locks you into Zia AI limitations)',
      'Basic WhatsApp integration lacking modern autonomous AI agents',
    ],
    differentiators: [
      { title: 'Unified Data Architecture', us: 'Single database for Marketing, Sales, GST & AI', them: '4+ separate apps (CRM, Books, Desk, Flow) with sync lag' },
      { title: 'AI Copilot & Multi-LLM', us: 'BYOK (Gemini 3.6, Claude 3.5, GPT-4o, Groq) with 0% markup', them: 'Zia AI with rigid proprietary capabilities' },
      { title: 'Meta Ads Manager Pro', us: 'Autonomous ad generation, copy hooks & <2s lead intake', them: 'Basic social media scheduler without Graph API ad creation' },
      { title: 'Voice AI Integration', us: 'Retell & ElevenLabs conversational voice agents', them: 'Standard telephony dialer without conversational LLM intelligence' },
    ],
    faqs: [
      { q: 'How does AIWCRM compare to Zoho Books + Zoho CRM?', a: 'AIWCRM eliminates the friction of switching between two different tabs. Invoices are generated directly from deal cards and sent over WhatsApp in 1 click.' },
    ],
  },
  monday: {
    slug: 'monday',
    name: 'Monday.com',
    tagline: 'AIWCRM vs Monday.com — Purpose-Built Sales & WhatsApp OS vs Generic Spreadsheet Boards',
    badge: 'Monday.com Alternative',
    markup: 'Tier-Gated Automation Limits ($30+/seat/mo)',
    voiceAi: false,
    failover: false,
    kanban: true,
    gstInvoicing: false,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: false,
    typicalCost: '$30 - $60 / user / month (With strict action limits)',
    pricingNote: 'Monday.com is primarily a project management tool adapted into a CRM, lacking native WhatsApp Cloud API, GST invoicing, and Meta ad campaign managers.',
    summary: 'Monday.com excels at project task tracking, but lacks the core revenue infrastructure needed by sales and finance teams: official WhatsApp Cloud API, 18% GST invoicing, AI voice calls, and automated Meta lead triage.',
    strengths: ['Colorful and flexible project table boards', 'Easy drag-and-drop column configurator', 'Basic visual automations'],
    limitations: [
      'Project management tool pretending to be a revenue CRM',
      'No native two-way WhatsApp shared team inbox',
      'No statutory GST tax invoice generation or payment gateways',
      'Strict monthly automation action limits that force expensive tier upgrades',
    ],
    differentiators: [
      { title: 'Core DNA', us: 'Enterprise Business Operating System for Sales & Revenue', them: 'Project management and team task tracker' },
      { title: 'Customer Communication', us: 'Shared WhatsApp inbox, template broadcasts & voice calls', them: 'Email-centric and board comments only' },
      { title: 'Financial Settlement', us: 'GST invoices, aging ledger & Razorpay UPI collection', them: 'None (Requires external integration)' },
      { title: 'Automation Limits', us: 'Unlimited workflow node executions', them: 'Strict caps (e.g. 250 actions/month on standard plans)' },
    ],
    faqs: [
      { q: 'Can Monday.com send official WhatsApp broadcasts?', a: 'No, Monday.com does not have an official Meta Cloud API BSP integration; it requires third-party Zapier/Make bridges.' },
    ],
  },
  freshworks: {
    slug: 'freshworks',
    name: 'Freshworks',
    tagline: 'AIWCRM vs Freshworks — Zero AI Markups & GST Invoicing vs Siloed Freshsales / Freshdesk',
    badge: 'Freshworks Alternative',
    markup: 'Freddy AI Add-on Credits ($29+/user/mo)',
    voiceAi: false,
    failover: false,
    kanban: true,
    gstInvoicing: false,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    typicalCost: '$29 - $69 / user / month + Freddy AI session packs',
    pricingNote: 'Freshworks splits functionality between Freshsales, Freshchat, and Freshdesk, charging high markups on Freddy AI sessions.',
    summary: 'Freshworks splits customer interactions across multiple products (Freshsales, Freshchat, Freshdesk) and charges extra for Freddy AI credits. AIWCRM unifies marketing, shared inbox, sales deals, and GST billing into one platform with BYOK zero-markup AI.',
    strengths: ['Clean modern UI for customer support ticketing', 'Built-in Freshcaller VoIP calling', 'Omnichannel chat widget'],
    limitations: [
      'Split across separate products (Freshsales, Freshchat, Freshdesk)',
      'Expensive Freddy AI credit packages with platform token markups',
      'No native 18% GST statutory tax invoicing engine',
      'No Meta Ads Manager Graph API integration for direct ad launching',
    ],
    differentiators: [
      { title: 'Product Architecture', us: 'Single unified Enterprise OS for Marketing, Sales & Finance', them: 'Multiple siloed products requiring separate subscriptions' },
      { title: 'AI Token Pricing', us: 'BYOK (0% Markup) with sub-second multi-model auto-failover', them: 'Proprietary Freddy AI session charges & token caps' },
      { title: 'GST Billing Engine', us: 'Statutory 18% GST invoices, HSN codes & Razorpay links', them: 'None (Requires external accounting software)' },
      { title: 'Meta Ads Manager Pro', us: 'Direct Meta Graph ad creation, creative AI & instant forms', them: 'None' },
    ],
    faqs: [
      { q: 'Why is AIWCRM better for Indian businesses than Freshworks?', a: 'AIWCRM is natively engineered for Indian business realities: 18% GST invoicing, Razorpay UPI payments, Retell Hindi Voice AI, and WhatsApp-first lead routing.' },
    ],
  },
  interakt: {
    slug: 'interakt',
    name: 'Interakt',
    tagline: 'AIWCRM vs Interakt — 0% Token Markup vs High Platform AI Markup',
    badge: 'Interakt Alternative',
    markup: '2x - 3x AI Markup',
    voiceAi: false,
    failover: false,
    kanban: false,
    gstInvoicing: false,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    typicalCost: '₹3,500 - ₹9,000 / month + conversation markups',
    pricingNote: 'Interakt adds substantial platform markups on AI conversations and lacks BYOK custom model routing and sales pipelines.',
    summary: 'Interakt is popular for basic WhatsApp broadcast marketing, but AIWCRM provides true enterprise BYOK multi-LLM routing with 0% token markup, Retell Voice AI integration, visual sales Kanban pipelines, and 18% GST invoicing.',
    strengths: ['Quick onboarding for basic WhatsApp broadcasts', 'Shopify e-commerce integration'],
    limitations: ['2x to 3x token markups on AI replies', 'No visual deals Kanban or commercial pipeline', 'No GST invoicing or credit notes'],
    differentiators: [
      { title: 'AI Cost', us: 'BYOK Wholesale Rates (0% Markup)', them: '2x - 3x platform markup' },
      { title: 'Sales Pipeline', us: 'Visual Kanban deals & win probabilities', them: 'Basic contact list view only' },
      { title: 'Voice AI Calling', us: 'Retell & ElevenLabs Hindi voice agents', them: 'No voice AI capability' },
      { title: 'Statutory Finance', us: '18% GST invoices & Razorpay collections', them: 'None' },
    ],
    faqs: [
      { q: 'Can I port my existing WhatsApp number from Interakt to AIWCRM?', a: 'Yes! Under official Meta Cloud API rules, you can migrate your active phone number and verification green badge in under 5 minutes with zero downtime.' },
    ],
  },
  doubletick: {
    slug: 'doubletick',
    name: 'DoubleTick',
    tagline: 'AIWCRM vs DoubleTick — Multi-Model AI Routing & Voice AI',
    badge: 'DoubleTick Alternative',
    markup: 'Platform Markup Applies',
    voiceAi: false,
    failover: false,
    kanban: true,
    gstInvoicing: false,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    typicalCost: '₹4,000 - ₹10,000 / month',
    pricingNote: 'DoubleTick provides basic WhatsApp CRM features but restricts you to single AI models with platform markup.',
    summary: 'While DoubleTick offers sales tracking, AIWCRM gives you full BYOK model control across OpenAI, Gemini 3.6, Claude, Groq, and DeepSeek with sub-1s auto-failover, 18% GST billing, and voice calling.',
    strengths: ['Mobile app interface', 'Official Meta Cloud API support'],
    limitations: ['Single AI provider locking with markup', 'No GST tax invoice generation', 'No Meta Graph ad creation tool'],
    differentiators: [
      { title: 'AI Architecture', us: '5 LLM providers with automatic failover', them: 'Single model with proprietary markup' },
      { title: 'Finance & Invoicing', us: '18% GST invoices & collections ledger', them: 'None' },
      { title: 'Meta Ads OS', us: 'Full ad campaign generator & Instant Forms', them: 'Basic lead intake only' },
      { title: 'Voice AI', us: 'Retell AI voice calling with Hindi accent', them: 'No voice AI capability' },
    ],
    faqs: [
      { q: 'Does AIWCRM have mobile responsiveness?', a: 'Yes! AIWCRM is 100% responsive on all mobile browsers and tablets with real-time push notifications.' },
    ],
  },
  wati: {
    slug: 'wati',
    name: 'Wati',
    tagline: 'AIWCRM vs Wati — 0% Token Markup & Retell Voice AI',
    badge: 'Wati Alternative',
    markup: 'Vendor Markup on AI',
    voiceAi: false,
    failover: false,
    kanban: true,
    gstInvoicing: false,
    metaAdsOs: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    typicalCost: '$49 - $299 / month + conversation charges',
    pricingNote: 'Wati charges per-agent seats and vendor markups on automated AI replies, with USD-based billing.',
    summary: 'AIWCRM offers unlimited team seats, BYOK direct provider rates (0% markup), Retell Voice phone calls, 18% GST invoicing, and sub-100ms 0-token catalog replies.',
    strengths: ['Early WhatsApp Business API BSP', 'No-code chatbot builder'],
    limitations: ['Expensive USD pricing for Indian businesses', 'Vendor markup on AI responses', 'No GST invoicing or collections engine'],
    differentiators: [
      { title: 'Pricing Currency', us: 'Transparent INR billing with 18% GST', them: 'USD-based billing with foreign exchange fees' },
      { title: 'AI Tokens', us: 'BYOK (0% Markup) with Multi-LLM Vault', them: 'Vendor markups on chatbot tokens' },
      { title: 'Finance Engine', us: 'Statutory GST tax invoices & collections', them: 'None' },
      { title: 'Voice Calling', us: 'Retell & ElevenLabs Voice AI agents', them: 'None' },
    ],
    faqs: [
      { q: 'Can we migrate templates from Wati to AIWCRM?', a: 'Yes, because both platforms use the official Meta Cloud API, all your approved templates and phone numbers transfer instantly via Meta Business Manager.' },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
  const { competitor: competitorParam } = await params
  const competitor = COMPETITORS[competitorParam.toLowerCase()]
  if (!competitor) return {}

  const pageUrl = getSiteUrl(`/vs/${competitor.slug}`)

  return {
    title: `${SITE_CONFIG.name} vs ${competitor.name} — Feature & Pricing Comparison`,
    description: competitor.summary,
    keywords: [
      `${SITE_CONFIG.name} vs ${competitor.name}`,
      `${competitor.name} Alternative`,
      `Best ${competitor.name} Alternative India`,
      'Enterprise Operating System vs CRM',
      'BYOK WhatsApp CRM',
      '18% GST Invoicing CRM',
    ],
    openGraph: {
      title: `${SITE_CONFIG.name} vs ${competitor.name} — Feature & Pricing Comparison`,
      description: competitor.summary,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      locale: 'en_IN',
      type: 'website',
      images: [{ url: getSiteUrl(SITE_CONFIG.defaultOgImage) }],
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(COMPETITORS).map((competitor) => ({ competitor }))
}

export default async function CompetitorComparisonPage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor: competitorParam } = await params
  const competitor = COMPETITORS[competitorParam.toLowerCase()]
  if (!competitor) {
    notFound()
  }

  const comparisonRows = [
    { feature: 'Unified 12-Capability Platform OS', us: true, competitor: false, detail: 'Marketing, Lead Hub, CRM, Sales, GST Invoicing, CS & AI' },
    { feature: '0% Platform Token Markup (BYOK Vault)', us: true, competitor: false, detail: 'Connect OpenAI, Gemini, Claude, Groq or DeepSeek directly' },
    { feature: 'Native WhatsApp Cloud API Shared Inbox', us: true, competitor: competitor.metaOfficial, detail: 'Sub-2s latency, collision detection & multi-agent routing' },
    { feature: '18% GST Tax Invoicing & Collections', us: true, competitor: competitor.gstInvoicing, detail: 'HSN/SAC codes, Razorpay links & aging matrix' },
    { feature: 'Meta Ads Manager Pro (Graph API)', us: true, competitor: competitor.metaAdsOs, detail: 'Direct ad set launching, creative AI & instant form sync' },
    { feature: 'Retell & ElevenLabs Voice AI Calling', us: true, competitor: competitor.voiceAi, detail: 'Natural Hindi/English conversational voice agents' },
    { feature: 'Visual Drag-and-Drop Deals Kanban', us: true, competitor: competitor.kanban, detail: 'Win probabilities, deal health scoring & stage cadences' },
    { feature: '3-Tier PBAC Security Matrix & Crypto Audit', us: true, competitor: false, detail: '4-tier permission levels & SHA-256 tamper-proof ledger' },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground py-12 sm:py-16 font-sans selection:bg-primary/30">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Header */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/platform" className="hover:text-primary">Platform</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/vs" className="hover:text-primary">Compare</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">vs {competitor.name}</span>
        </nav>

        {/* Hero Section */}
        <header className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>{competitor.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
            Why Modern Enterprises Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              {SITE_CONFIG.name}
            </span>{' '}
            Over {competitor.name}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {competitor.summary}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/free-trial"
              className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 text-xs transition-all shadow-md gap-2"
            >
              Start 7-Day Free Trial <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/book-demo"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background hover:bg-muted px-8 text-xs font-bold text-foreground shadow-sm transition-all"
            >
              Book Enterprise Demo
            </Link>
          </div>
        </header>

        {/* Key Differentiators Cards */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Key Differentiators
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
              Strategic Differences{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
                at a Glance.
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              How AIWCRM eliminates the gaps left by traditional single-point software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitor.differentiators.map((diff, i) => (
              <div key={i} className="p-5 rounded-2xl border bg-card space-y-3 shadow-xs">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  {diff.title}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    <strong className="block text-[10px] uppercase font-mono text-emerald-800 dark:text-emerald-400">AIWCRM:</strong>
                    {diff.us}
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                    <strong className="block text-[10px] uppercase font-mono text-rose-800 dark:text-rose-400">{competitor.name}:</strong>
                    {diff.them}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison Table Matrix */}
        <section aria-labelledby="matrix-heading" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> Direct Matrix
            </div>
            <h2 id="matrix-heading" className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
              Feature-by-Feature{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
                Platform Showdown.
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Side-by-side comparison of platform capabilities and architecture.
            </p>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 p-4 border-b bg-muted/40 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-6">Platform Capability</div>
              <div className="col-span-3 text-center text-primary font-bold">{SITE_CONFIG.name}</div>
              <div className="col-span-3 text-center text-muted-foreground">{competitor.name}</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/60">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 items-center hover:bg-muted/10 transition-colors text-xs">
                  <div className="col-span-6 space-y-0.5">
                    <p className="font-bold text-foreground text-xs">{row.feature}</p>
                    <p className="text-[11px] text-muted-foreground hidden sm:block">{row.detail}</p>
                  </div>

                  {/* Our Platform */}
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                      <Check className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Included</span>
                    </div>
                  </div>

                  {/* Competitor */}
                  <div className="col-span-3 flex justify-center items-center">
                    {row.competitor ? (
                      <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                        <Check className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Yes</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive font-bold text-[11px]">
                        <X className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">No</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing & TCO Card */}
        <section className="p-6 sm:p-8 rounded-3xl border bg-muted/20 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase border border-emerald-500/30">
                Total Cost of Ownership Advantage
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-2">
                Pricing & License{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
                  Transparency.
                </span>
              </h3>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-bold text-emerald-600">~60%</span>
              <span className="text-[10px] text-muted-foreground block">Lower TCO with AIWCRM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Typical {competitor.name} Cost:</span>
              <p className="text-muted-foreground leading-relaxed">{competitor.typicalCost}</p>
              <p className="text-[11px] text-muted-foreground font-sans">{competitor.pricingNote}</p>
            </div>

            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
              <span className="font-bold text-primary uppercase tracking-wider text-[10px]">AIWCRM Value Model:</span>
              <p className="text-foreground font-semibold">Starting from ₹4,999 / month flat</p>
              <p className="text-[11px] text-muted-foreground">Includes all 12 platform capabilities + zero token markup on your own LLM keys (BYOK wholesale rates).</p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        {competitor.faqs && competitor.faqs.length > 0 && (
          <section className="space-y-4 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> Switching FAQs
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
                Frequently Asked{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
                  Questions.
                </span>
              </h2>
            </div>
            <div className="space-y-3 text-xs">
              {competitor.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl border bg-card space-y-1.5">
                  <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed pl-5.5">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dual CTA Footer */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
            Ready to Replace {competitor.name} with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              AIWCRM?
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Get started in under 5 minutes with our automated 1-click contact & pipeline migration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/free-trial"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-6 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
            >
              Start Free Trial Now
            </Link>
            <Link
              href="/book-demo"
              className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-6 text-xs font-bold text-foreground shadow-sm transition-all hover:bg-muted"
            >
              Book Comparison Demo
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}
