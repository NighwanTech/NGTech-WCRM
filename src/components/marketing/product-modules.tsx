'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Building2, 
  Users, 
  Kanban, 
  GitBranch, 
  Send, 
  Bot, 
  Sparkles, 
  Mic, 
  FileText, 
  BarChart3, 
  Code2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileKey,
  Radio,
  Presentation,
  KeyRound,
  Lock,
  Layers,
  Palette,
  Zap,
  Activity,
  Cpu,
  Terminal,
  Check,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

export function ProductModulesSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const modules = [
    { 
      id: 'inbox', 
      title: 'WhatsApp Shared Team Inbox', 
      tag: 'Multi-Agent Support',
      desc: 'Centralize customer conversations from multiple WhatsApp numbers into one collaborative workspace with round-robin department routing, agent collision prevention, SLA response timers, and internal team notes.',
      icon: MessageSquare,
      highlights: [
        'Multi-agent chat distribution & round-robin load balancing',
        'Internal private notes & real-time collision prevention',
        'Automated SLA response timers & supervisor alerts',
        'Multi-number management under a single master inbox'
      ],
      specs: [
        { label: 'SLA Guarantee', value: '<2 Minutes' },
        { label: 'Max Agents', value: 'Unlimited' },
        { label: 'Collision Sync', value: 'Real-Time' },
        { label: 'Encryption', value: 'AES-256' }
      ],
      telemetry: {
        event: 'INBOUND_CHAT_ROUTED',
        summary: 'chat_id: wa_918092225777 · assigned: Ramesh (Senior Rep) · SLA: 01:45 remaining'
      },
      demoText: 'Agent Ramesh Sharma assigned to Inquiry #1084 (BPTPIA Admission Counseling)'
    },
    { 
      id: 'crm', 
      title: 'Enterprise CRM & Customer 360', 
      tag: 'Customer 360',
      desc: 'Construct a unified 360 profile for every lead automatically populated from WhatsApp chats, voice call transcripts, ad form submissions, and transaction histories with custom lead attributes.',
      icon: Building2,
      highlights: [
        'Full interaction history, call recordings & chat timelines',
        'Custom lead attributes, lifecycle stages & dynamic tags',
        'Automated contact deduplication & phone variant merging',
        '1-Click CSV, Zoho & HubSpot data import & sync'
      ],
      specs: [
        { label: 'Profile Latency', value: '<100ms' },
        { label: 'Deduplication', value: 'Automated' },
        { label: 'Custom Fields', value: '500+ Fields' },
        { label: 'Data Retention', value: 'Unlimited' }
      ],
      telemetry: {
        event: 'PROFILE_UPDATED_360',
        summary: 'contact: Vikram Mehta · interactions: 14 Events · tags: [HOT_LEAD, VISIT_SCHEDULED]'
      },
      demoText: 'Contact Profile #4092 updated with 14 interaction events & 3 AI tags'
    },
    { 
      id: 'meta-ads', 
      title: 'AI Meta Ads & Direct Lead Sync', 
      tag: 'Meta Ads & AI Creation',
      desc: 'Connect Facebook and Instagram Instant Lead Forms directly to WhatsApp via 0-latency webhooks. Initiate automated WhatsApp greetings in under 2 seconds and track true multi-touch campaign ROAS.',
      icon: Presentation,
      highlights: [
        'AI-powered Meta ad creative & copy generator',
        'Instant zero-latency IG & FB Lead Form sync',
        'Sub-2 second automated WhatsApp greeting dispatch',
        'Closed-loop Meta campaign ROAS & ROI attribution'
      ],
      specs: [
        { label: 'Webhook Latency', value: '<1.8 Seconds' },
        { label: 'Meta API', value: 'Official Cloud API' },
        { label: 'Ad Generator', value: 'Gemini / GPT-4o' },
        { label: 'Attribution', value: 'Multi-Touch ROAS' }
      ],
      telemetry: {
        event: 'META_LEAD_FORM_DISPATCHED',
        summary: 'campaign: BTech_Admission_2026 · form: Instant_Counseling_Form · latency: 1.2s'
      },
      demoText: 'AI Ad Generated & Meta Lead Form Synced: 42 new inquiries routed to WhatsApp'
    },
    { 
      id: 'kanban', 
      title: 'Visual Deals & Kanban Pipelines', 
      tag: 'Sales Automation',
      desc: 'Visualize your sales funnel with multi-stage drag-and-drop Kanban deal boards. Automatically shift deal stages when customers complete voice calls, click payment links, or reply on WhatsApp.',
      icon: Kanban,
      highlights: [
        'Multi-pipeline Kanban boards with drag-and-drop mechanics',
        'Automated stage movement triggered by customer actions',
        'Deal value tracking, win probability & revenue forecasts',
        'Task reminders & automated stale deal re-engagement'
      ],
      specs: [
        { label: 'Pipeline Sync', value: 'Real-Time' },
        { label: 'Custom Stages', value: 'Unlimited' },
        { label: 'Auto-Movement', value: 'AI & Webhooks' },
        { label: 'Export Support', value: 'CSV / Excel' }
      ],
      telemetry: {
        event: 'KANBAN_DEAL_MOVED',
        summary: 'deal: BTech_CSE_Ananya · stage: Campus Visit Scheduled · value: ₹1,30,000'
      },
      demoText: 'Deal Moved to Campus Visit Scheduled (Deal Value: ₹1,30,000)'
    },
    { 
      id: 'finance', 
      title: '18% GST Invoicing & Collections Matrix', 
      tag: 'Finance & GST',
      desc: 'Issue statutory GST tax invoices with HSN/SAC codes, integrated Razorpay UPI links, aging matrix tracking (0-30, 31-60 days), and multi-channel WhatsApp payment reminder cadences.',
      icon: DollarSign,
      highlights: [
        'Automated 18% CGST/SGST/IGST calculation & PDF generator',
        'Aging debtor collections matrix with overdue tracking',
        'Multi-channel WhatsApp automated payment reminders',
        '1-Click Razorpay UPI & Netbanking payment collection'
      ],
      specs: [
        { label: 'GST Compliance', value: '18% Statutory' },
        { label: 'Collections Sync', value: 'Live Aging' },
        { label: 'Payment Gateway', value: 'Razorpay UPI' },
        { label: 'Invoice PDF', value: 'Auto-Branded' }
      ],
      telemetry: {
        event: 'GST_INVOICE_GENERATED',
        summary: 'inv_no: INV-2026-0842 · subtotal: ₹1,50,000 · gst_18: ₹27,000 · total: ₹1,77,000'
      },
      demoText: 'GST Invoice #INV-2026-0842 Generated & WhatsApp Payment Link Dispatched (₹1,77,000)'
    },
    { 
      id: 'ai-studio', 
      title: 'Multi-Model AI & Zero-Markup BYOK', 
      tag: 'AI Intelligence',
      desc: 'Plug OpenAI (GPT-4o), Gemini 3.6, Claude 3.5, or Groq (Llama 3.3) keys into AIWCRM. Pay providers directly at raw rates with 0% token markup, saving 60% with sub-second auto-failover.',
      icon: Bot,
      highlights: [
        'Bring Your Own Key (BYOK) architecture with 0% token markup',
        'Sub-second AI Auto-Failover cascade across 5 providers',
        'Real-time customer intent classification (HOT 🔥, WARM, COLD)',
        'Domain-specific knowledge base RAG & prompt tuning'
      ],
      specs: [
        { label: 'Token Markup', value: '0% (BYOK)' },
        { label: 'Failover Latency', value: '<1000ms' },
        { label: 'Supported LLMs', value: 'GPT-4o, Gemini, Groq' },
        { label: 'Intent Accuracy', value: '98.4%' }
      ],
      telemetry: {
        event: 'AI_RESPONSE_GENERATED',
        summary: 'model: Gemini 3.6 Flash · tokens: 342 · markup_fee: ₹0.00 · intent: HOT 🔥'
      },
      demoText: 'Intent Score: 94% (HOT 🔥) — Generated via Gemini 3.6 (0% Token Markup)'
    },
    { 
      id: 'voice', 
      title: 'Multi-Provider Voice AI (Retell + ElevenLabs)', 
      tag: 'Voice AI Platform',
      desc: 'Deploy AI voice agents using Retell AI or ElevenLabs with native Hindi support. AIWCRM handles call orchestration, transcript generation, and extracts 10 CRM fields automatically post-call.',
      icon: Mic,
      highlights: [
        'Retell AI & ElevenLabs multi-provider voice calling',
        'Native Indian voices (Priya, Arjun) with natural Hindi cadence',
        'Sub-800ms conversational voice response latency',
        'Automated post-call CRM intelligence & 10-field extraction'
      ],
      specs: [
        { label: 'Voice Latency', value: '<800ms Speed' },
        { label: 'Languages', value: 'Hindi, Hinglish, English' },
        { label: 'CRM Sync Fields', value: '10 Fields' },
        { label: 'Audio Security', value: 'TLS / SRTP' }
      ],
      telemetry: {
        event: 'VOICE_CALL_COMPLETED',
        summary: 'provider: ElevenLabs Hindi · duration: 01m 42s · extracted: [budget, visit_date]'
      },
      demoText: 'ElevenLabs Voice Call Complete — Native Hindi Agent · 10 CRM Fields Synced'
    },
    { 
      id: 'automation', 
      title: 'No-Code Visual Flow Builder', 
      tag: 'Workflow Engine',
      desc: 'Design multi-step business automations without writing code. Trigger workflows based on inbound WhatsApp messages, deal movements, voice call completions, or webhooks.',
      icon: GitBranch,
      highlights: [
        'Visual drag-and-drop node graph canvas with custom logic',
        'Conditional branching based on contact tags & replies',
        'Automated delayed follow-ups & reminder drips',
        'Outbound webhooks to external ERPs (Tally, SAP, Shopify)'
      ],
      specs: [
        { label: 'Execution Speed', value: '<50ms Node' },
        { label: 'Max Workflows', value: 'Unlimited' },
        { label: 'Logic Support', value: 'Multi-Condition' },
        { label: 'Webhooks Sync', value: 'Bi-Directional' }
      ],
      telemetry: {
        event: 'WORKFLOW_DISPATCHED',
        summary: 'workflow: Admission_Drip_V2 · trigger: Fee Structure · status: Completed in 34ms'
      },
      demoText: 'Workflow Triggered: Keyword "Admission Fee" matched → Sent PDF & Voice Call Scheduled'
    },
    { 
      id: 'broadcast', 
      title: 'Official Meta WhatsApp Broadcasts', 
      tag: 'Official Cloud API',
      desc: 'Send official Meta Cloud API pre-approved template broadcasts to thousands of contacts with dynamic parameters, rich media headers (PDFs, images), audience segmentation, and read receipts.',
      icon: Send,
      highlights: [
        'Official Meta Cloud API direct integration (0% BSP markups)',
        'Pre-approved WhatsApp template submission & management',
        'Dynamic parameter mapping & personalized contact tags',
        'Real-time broadcast delivery, read & response telemetry'
      ],
      specs: [
        { label: 'Throughput', value: '1,000 Msg / Min' },
        { label: 'Meta API', value: 'Direct Cloud API' },
        { label: 'Read Receipts', value: 'Real-Time' },
        { label: 'Ban Risk', value: '0% (Official)' }
      ],
      telemetry: {
        event: 'BROADCAST_BATCH_SENT',
        summary: 'campaign: Admission_Alert · recipients: 4,500 · delivered: 98.2% · read: 84.7%'
      },
      demoText: 'Broadcast Delivered to 4,500 Contacts (98.2% Delivery · 84.7% Open Rate)'
    },
    { 
      id: 'governance', 
      title: 'Enterprise RBAC & Security Governance', 
      tag: 'Governance & RBAC',
      desc: 'Enforce 6-tier Role-Based Access Control (Owner, Admin, Manager, Agent, Client, Viewer) and Policy-Based Access Control (PBAC). Restrict data exports, obscure phone numbers, and enforce IP whitelisting.',
      icon: ShieldCheck,
      highlights: [
        '6-tier enterprise role hierarchy & permission customization',
        'Phone number masking & sensitive PII protection for agents',
        'Granular module-level action permissions (View, Edit, Export)',
        'IP whitelisting & multi-factor authentication (MFA)'
      ],
      specs: [
        { label: 'Role Hierarchy', value: '6-Tier System' },
        { label: 'Phone Masking', value: 'Configurable' },
        { label: 'IP Whitelisting', value: 'Subnet Rules' },
        { label: 'Compliance', value: 'SOC-2 Ready' }
      ],
      telemetry: {
        event: 'RBAC_SECURITY_EVALUATED',
        summary: 'actor: Agent_Sharma · action: EXPORT_CSV · result: DENIED (Restricted Policy)'
      },
      demoText: 'RBAC Policy Applied: Manager role assigned with CSV Export restriction'
    },
    { 
      id: 'audit', 
      title: 'Security Audit Logging & Real-Time Trail', 
      tag: 'Compliance & Audit',
      desc: 'Maintain a tamper-proof audit trail capturing logins, setting modifications, permission changes, message exports, and API key usages with detailed IP address and user-agent metadata.',
      icon: FileKey,
      highlights: [
        'Immutable real-time audit event logging ledger',
        'Detailed IP address, user-agent & timestamp tracking',
        'Security anomaly alerts & automated admin notifications',
        'DPDP Act India & GDPR compliance report generation'
      ],
      specs: [
        { label: 'Log Integrity', value: 'Cryptographic Hash' },
        { label: 'Archival Retention', value: '7 Years' },
        { label: 'SIEM Export', value: 'Syslog / Webhook' },
        { label: 'Privacy Standard', value: 'DPDP & GDPR' }
      ],
      telemetry: {
        event: 'AUDIT_LOG_ENTRY_WRITTEN',
        summary: 'actor: admin@nighwantech.com · event: API_KEY_ROTATED · IP: 49.36.128.14'
      },
      demoText: 'Audit Event Logged: User Admin rotated BYOK Vault API key (IP: 49.36.128.14)'
    },
    { 
      id: 'webhooks', 
      title: 'Webhook Operations & Signature Verification', 
      tag: 'Developer Platform',
      desc: 'Connect core IT systems, ERPs, and custom apps to AIWCRM using high-speed REST webhooks with HMAC-SHA256 signature verification, exponential backoff retries, and delivery telemetry.',
      icon: Radio,
      highlights: [
        'Cryptographic HMAC-SHA256 request signature verification',
        'Automatic exponential backoff retries on endpoint failure',
        'Real-time delivery logs, HTTP status codes & latency stats',
        'Custom payload mapping & JSON path transformation'
      ],
      specs: [
        { label: 'Signature Algorithm', value: 'HMAC-SHA256' },
        { label: 'Retry Strategy', value: 'Exponential Backoff' },
        { label: 'Avg Latency', value: '<38ms Speed' },
        { label: 'Throughput', value: '10,000 / Sec' }
      ],
      telemetry: {
        event: 'WEBHOOK_PAYLOAD_DISPATCHED',
        summary: 'endpoint: api.company.com/v1/order-sync · status: 200 OK · latency: 38ms'
      },
      demoText: 'Webhook Verified: order.created dispatched (200 OK in 38ms)'
    },
    { 
      id: 'branding', 
      title: 'Organization Branding & Multi-Workspace', 
      tag: 'Custom Branding',
      desc: 'Deliver a white-labeled experience for multi-brand enterprises or agencies with organization logo, primary brand colors, custom domain identity (crm.yourcompany.com), and ⌘K global search.',
      icon: Palette,
      highlights: [
        'Organization logo & primary brand theme customization',
        'Multi-tenant workspace switching for agencies & holdings',
        'Custom domain support (crm.yourcompany.com)',
        '⌘K Global Command Palette for instant keyboard search'
      ],
      specs: [
        { label: 'Workspaces', value: 'Unlimited' },
        { label: 'Custom Domain', value: 'CNAME SSL Active' },
        { label: 'White-Labeling', value: 'Logo & Colors' },
        { label: 'Command Search', value: '⌘K Instant Index' }
      ],
      telemetry: {
        event: 'WORKSPACE_BRANDING_SYNCED',
        summary: 'domain: crm.nighwantech.com · theme: Emerald · status: SSL Active'
      },
      demoText: 'Workspace Branding Active: Custom Theme & SSL Active (crm.nighwantech.com)'
    },
  ];

  const currentMod = modules[activeIdx];
  const CurrentIcon = currentMod.icon;

  return (
    <section className="py-20 bg-card/40 border-y border-border/50 relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-500/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Enterprise Product Suite
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
            12 Unified Modules for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              Total Revenue Operations.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Click through our core modules to explore governance, security, automation, Meta ads, and live telemetry.
          </p>
        </div>

        {/* Interactive Linear-Style Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: 12 Compact Module Buttons (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              const isActive = activeIdx === idx;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer group ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-card border-emerald-500 text-foreground shadow-md shadow-emerald-500/10 translate-x-1 ring-1 ring-emerald-500/30' 
                      : 'bg-card/70 hover:bg-card border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border transition-colors shrink-0 ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' 
                        : 'bg-muted/50 border-border/60 text-muted-foreground group-hover:text-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold truncate group-hover:text-emerald-500 transition-colors">
                        {mod.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {mod.tag}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${isActive ? 'text-emerald-500 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Compact, High-Contrast Pinned Card (7 Cols) */}
          <div className="lg:col-span-7 sticky top-28 bg-card/95 border border-border/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Card Header Bar */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <CurrentIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      MODULE #{activeIdx + 1 < 10 ? `0${activeIdx + 1}` : activeIdx + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                      {currentMod.title}
                    </h3>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                  {currentMod.tag}
                </div>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                {currentMod.desc}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentMod.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-left space-y-0.5">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{spec.label}</p>
                    <p className="text-xs font-extrabold text-foreground font-mono truncate">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Core Capabilities */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" /> Core Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-foreground font-semibold">
                  {currentMod.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/30 border border-border/50 p-2 rounded-lg">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate leading-tight text-[11px] sm:text-xs">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sleek Dark Obsidian Console */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-foreground">
                    <Terminal className="h-3.5 w-3.5 text-emerald-500" /> Live Event Console
                  </span>
                  <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                    SYSTEM ACTIVE
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-slate-100 font-mono text-xs shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-300 pb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-extrabold text-emerald-400">
                        EVENT: {currentMod.telemetry.event}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400">REAL-TIME ENGINE</span>
                  </div>

                  <p className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5 truncate">
                    <Activity className="h-3 w-3 text-emerald-400 shrink-0 animate-pulse" /> 
                    {currentMod.demoText}
                  </p>

                  <div className="bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-[10px] text-slate-300 truncate">
                    <span className="text-slate-500 font-bold uppercase mr-1">PAYLOAD:</span> 
                    {currentMod.telemetry.summary}
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60 mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/free-trial"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Launch Module in Free Trial</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-muted/60 hover:bg-muted text-foreground text-xs font-bold border border-border/80 transition-colors"
                >
                  <span>Docs Manual</span>
                </Link>
              </div>

              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" /> Instant Setup
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
