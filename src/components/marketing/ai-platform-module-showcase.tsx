'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  KeyRound,
  Sparkles,
  Bot,
  BarChart3,
  GitBranch,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  ShieldCheck,
  Cpu,
  Layers,
  Send,
  FileText
} from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  title: string;
  description: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
  livePreview: {
    title: string;
    type: 'voice' | 'byok' | 'ads' | 'copilot' | 'intelligence' | 'decision';
    data: any;
  };
  ctaText: string;
  ctaHref: string;
}

export function AiPlatformModuleShowcase() {
  const modules: ModuleItem[] = [
    {
      id: 'voice-ai',
      name: 'Voice AI (Retell + ElevenLabs)',
      badge: 'HINDI',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Mic,
      title: 'Real-Time Conversational Voice AI in Hindi, Hinglish & English',
      description: 'Human-like voice agents powered by Retell AI and ElevenLabs. Conduct automated outbound calls, qualify inbound leads, schedule appointments, and log audio transcripts directly into CRM.',
      highlights: [
        'Sub-800ms ultra-low latency conversational response time',
        'Native Hindi, Hinglish, Tamil, Telugu, Marathi & English support',
        'Automated outbound lead dialer & appointment booking',
        'Full audio call recording, transcript extraction & sentiment tagging'
      ],
      metrics: [
        { label: 'Latency', value: '<800ms' },
        { label: 'Languages', value: '12+ Native' },
        { label: 'Call Volume', value: '10,000+/hr' }
      ],
      livePreview: {
        title: 'Live Voice AI Agent Simulation',
        type: 'voice',
        data: {
          caller: 'Customer (+91 98765 43210)',
          agentName: 'AI Voice Counselor (Hindi)',
          transcript: [
            { speaker: 'Customer', text: 'नमस्ते, मुझे B.Tech admissions के बारे में जानकारी चाहिए।' },
            { speaker: 'AI Agent', text: 'नमस्ते! BPTPIA इंस्टीट्यूट में आपका स्वागत है। B.Tech Computer Science की fees ₹85,000/sem है। क्या आप campus visit schedule करना चाहेंगे?' },
            { speaker: 'Customer', text: 'हाँ, शनिवार सुबह 11 बजे का time slot book कर दीजिए।' }
          ],
          telemetry: 'Voice AI Retell Connected · Lead Qualified (HOT) · Calendar Booked'
        }
      },
      ctaText: 'Explore Voice AI Guide',
      ctaHref: '/docs/ai-copilot/multi-provider-voice-ai-guide'
    },
    {
      id: 'byok-vault',
      name: 'BYOK Multi-Model Vault',
      badge: '0% MARKUP',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: KeyRound,
      title: 'Bring Your Own Key (BYOK) & Zero Token Markup Engine',
      description: 'Plug your existing API keys from OpenAI, Google Gemini, Anthropic Claude, Groq, and DeepSeek. Pay AI vendors wholesale prices with 0% platform markup.',
      highlights: [
        'Zero platform markup on AI token consumption',
        'Support for Gemini 3.6, GPT-4o, Claude 3.5, Groq Llama & DeepSeek R1',
        'Automated sub-second failover if a primary LLM API times out',
        '0-Token greeting cache cuts repetitive message costs by 60%'
      ],
      metrics: [
        { label: 'Token Markup', value: '0%' },
        { label: 'Cost Savings', value: 'Up to 60%' },
        { label: 'Failover Speed', value: '<1s' }
      ],
      livePreview: {
        title: 'BYOK Multi-Model Router Status',
        type: 'byok',
        data: [
          { provider: 'Google Gemini 3.6', role: 'Primary AI Brain', status: 'Active (110ms)', cost: '₹0 Platform Markup' },
          { provider: 'OpenAI GPT-4o', role: 'Reasoning Backup', status: 'Standby', cost: 'Direct Wholesale API Rate' },
          { provider: 'Groq (Llama 3.3)', role: 'Ultra-Fast Backup', status: 'Active (80ms)', cost: 'Direct Wholesale API Rate' },
          { provider: 'DeepSeek R1', role: 'Analytical Engine', status: 'Standby', cost: 'Direct Wholesale API Rate' }
        ]
      },
      ctaText: 'View BYOK Setup Guide',
      ctaHref: '/docs/ai-copilot/byok-setup'
    },
    {
      id: 'meta-ads-os',
      name: 'Autonomous Meta Ads OS',
      badge: 'INSTANT',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      icon: Sparkles,
      title: 'AI Meta Ads Creation & Click-to-WhatsApp OS',
      description: 'Generate high-converting Facebook & Instagram ad copy, target audiences, and Click-to-WhatsApp campaigns in 1 click with direct WhatsApp lead capture.',
      highlights: [
        'AI Ad Copy & Creative headline generator for Meta Marketing API',
        'Direct Click-to-WhatsApp ad setup with instant automated greeting',
        'Automated ROAS tracking & budget optimization',
        'Lead form ingestion synced straight into Kanban sales pipelines'
      ],
      metrics: [
        { label: 'Campaign Setup', value: '<60s' },
        { label: 'ROAS Lift', value: '4.2x Avg' },
        { label: 'Lead Capture', value: 'Instant' }
      ],
      livePreview: {
        title: 'Autonomous Meta Ads OS Engine',
        type: 'ads',
        data: {
          adName: 'Click-to-WhatsApp Lead Generation (Real Estate)',
          creativeCopy: '🔥 3 BHK Luxury Apartments in Gurgaon starting @ ₹1.2 Cr. Chat on WhatsApp for instant PDF brochure!',
          targetAudience: 'Homebuyers · Gurgaon · Age 28-55 · High Intent',
          stats: 'CTR: 3.8% · Leads Captured: 142 · Cost/Lead: ₹42'
        }
      },
      ctaText: 'View Meta Ads Manual',
      ctaHref: '/docs/campaign-management/ai-meta-ads-guide'
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant & Copilot',
      badge: 'SMART',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Bot,
      title: 'Multi-Agent Shared Inbox Co-Pilot for Sales & Support',
      description: 'Empower human sales reps with real-time AI suggestions, 1-click transcript summaries, automated document groundings (RAG), and smart draft replies.',
      highlights: [
        '1-Click AI Suggested Replies based on company Knowledge Base',
        'Document RAG support: Upload PDFs, Docx, and website links for grounding',
        'Instant conversation transcript summary for smooth shift handovers',
        'Multi-agent shared team inbox with role-based governance'
      ],
      metrics: [
        { label: 'Reply Speed', value: '3x Faster' },
        { label: 'Agent Productivity', value: '+70%' },
        { label: 'Grounding Accuracy', value: '99.4%' }
      ],
      livePreview: {
        title: 'AI Co-Pilot Shared Inbox Assistant',
        type: 'copilot',
        data: {
          suggestedReply: 'Suggested Reply: "Yes! The warranty covers 2 years including free parts replacement. Would you like to place an order now?"',
          groundedDoc: 'Knowledge Base: Warranty_Policy_2026.pdf (Page 4)',
          sentiment: 'Positive (Confidence 96%)'
        }
      },
      ctaText: 'Explore Co-Pilot Inbox',
      ctaHref: '/features/shared-team-inbox'
    },
    {
      id: 'customer-intelligence',
      name: 'Customer Intelligence',
      badge: 'ANALYTICS',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: BarChart3,
      title: 'Real-Time Intent Scoring & Sentiment Intelligence',
      description: 'Automatically analyze incoming WhatsApp customer sentiment, tag lead intent (HOT / WARM / COLD), detect churning customers, and track team response SLAs.',
      highlights: [
        'Real-time lead scoring & automated HOT tag assignment',
        'Customer sentiment detection (Positive, Neutral, Urgent, Angry)',
        'Executive CSAT dashboard & response SLA tracking',
        'Automated supervisor alert when a high-value client reports dissatisfaction'
      ],
      metrics: [
        { label: 'Intent Accuracy', value: '98.2%' },
        { label: 'SLA Tracking', value: 'Real-Time' },
        { label: 'CSAT Rating', value: '4.9/5' }
      ],
      livePreview: {
        title: 'Customer Sentiment & Intent Intelligence',
        type: 'intelligence',
        data: [
          { lead: 'Rajesh Singhania (Apex Tools)', score: '98/100 (HOT 🔥)', intent: 'High Buying Intent', SLA: '<2 mins' },
          { lead: 'Dr. Anita Deshmukh (Imperial)', score: '92/100 (HOT 🔥)', intent: 'Admission Inquiry', SLA: '<1 min' },
          { lead: 'Karan Mehra (UrbanStyle)', score: '85/100 (WARM 🟡)', intent: 'Cart Abandoned', SLA: '<5 mins' }
        ]
      },
      ctaText: 'View Analytics Dashboard',
      ctaHref: '/features/analytics'
    },
    {
      id: 'decision-center',
      name: 'Decision Center & Engine',
      badge: 'WORKFLOWS',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      icon: GitBranch,
      title: 'Visual No-Code Decision Tree & Automation Engine',
      description: 'Build complex conditional workflows: trigger ERP stock checks, dispatch UPI payment links, route high-value leads to specific agents, and sync Tally/SAP webhooks.',
      highlights: [
        'No-code visual drag-and-drop workflow decision trees',
        'Bi-directional REST API webhooks for Tally, SAP, Salesforce & Shopify',
        'Conditional branching based on budget, location, and past order history',
        'Self-healing automated queue processor for zero message drop'
      ],
      metrics: [
        { label: 'Webhook Speed', value: '<50ms' },
        { label: 'System Uptime', value: '99.99%' },
        { label: 'Execution Rate', value: '100%' }
      ],
      livePreview: {
        title: 'Decision Engine Workflow Execution',
        type: 'decision',
        data: [
          { step: '01 Inbound Keyword', detail: 'Matches "RFQ Quotation" or "Bulk Order"' },
          { step: '02 Decision Node', detail: 'IF Estimated Budget >= ₹100,000' },
          { step: '03 Action Executed', detail: 'Fetch Tally ERP Price PDF + Assign Senior Account Exec' },
          { step: '04 Notification', detail: 'Send Manager WhatsApp Alert & Move Deal to "Quote Sent"' }
        ]
      },
      ctaText: 'Explore Workflow Automation',
      ctaHref: '/features/workflow-automation'
    }
  ];

  const [activeId, setActiveId] = useState<string>('voice-ai');
  const activeModule = modules.find((m) => m.id === activeId) || modules[0];
  const IconComponent = activeModule.icon;

  return (
    <section className="py-20 bg-background border-b border-border/40 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="h-4 w-4" /> Integrated AI Suite
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            AI Platform & Voice Engine Sub-System
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Click any module below to explore how Voice AI, BYOK Multi-LLM routing, Meta Ads OS, Co-Pilot, and Decision Engines power your enterprise sales operations.
          </p>
        </div>

        {/* Sub-Menu Navigation Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = m.id === activeId;
            return (
              <button
                key={m.id}
                onClick={() => setActiveId(m.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between space-y-3 relative group ${
                  isActive
                    ? 'bg-card border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500 scale-[1.02]'
                    : 'bg-card/40 border-border/60 hover:border-emerald-500/40 hover:bg-card/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-emerald-500 text-slate-950' : 'bg-muted text-muted-foreground group-hover:text-foreground'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {m.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className={`text-xs font-extrabold line-clamp-1 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {m.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail & Live Preview Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-500">
                  {activeModule.name}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                  {activeModule.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {activeModule.description}
            </p>

            {/* Highlights List */}
            <div className="space-y-2.5 pt-2">
              {activeModule.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60">
              {activeModule.metrics.map((met, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-0.5">
                  <div className="text-xs text-muted-foreground">{met.label}</div>
                  <div className="text-base sm:text-lg font-black text-emerald-400">{met.value}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href={activeModule.ctaHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg"
              >
                <span>{activeModule.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Live Interactive Preview */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 text-white space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span>{activeModule.livePreview.title}</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            {/* Preview Dynamic Render */}
            {activeModule.livePreview.type === 'voice' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
                  📞 {activeModule.livePreview.data.caller} $\leftrightarrow$ {activeModule.livePreview.data.agentName}
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {activeModule.livePreview.data.transcript.map((t: any, i: number) => (
                    <div key={i} className={`p-2.5 rounded-lg ${t.speaker === 'Customer' ? 'bg-slate-900 text-slate-300 text-right ml-4' : 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 mr-4'}`}>
                      <span className="text-[10px] text-muted-foreground block">{t.speaker}</span>
                      {t.text}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-emerald-400/80 pt-1 border-t border-slate-800">
                  ⚡ {activeModule.livePreview.data.telemetry}
                </div>
              </div>
            )}

            {activeModule.livePreview.type === 'byok' && (
              <div className="space-y-2.5 font-mono text-xs">
                {activeModule.livePreview.data.map((row: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground">{row.provider}</div>
                      <div className="text-[10px] text-slate-400">{row.role}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 font-bold block">{row.status}</span>
                      <span className="text-[9px] text-slate-400">{row.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeModule.livePreview.type === 'ads' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="text-[11px] font-bold text-emerald-400">{activeModule.livePreview.data.adName}</div>
                  <div className="text-[11px] text-slate-300 italic">{activeModule.livePreview.data.creativeCopy}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300">
                  🎯 {activeModule.livePreview.data.targetAudience}
                </div>
                <div className="p-2 rounded bg-slate-900 text-[10px] text-slate-400 text-center">
                  📊 {activeModule.livePreview.data.stats}
                </div>
              </div>
            )}

            {activeModule.livePreview.type === 'copilot' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed">
                  🤖 {activeModule.livePreview.data.suggestedReply}
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  📄 {activeModule.livePreview.data.groundedDoc}
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  💙 {activeModule.livePreview.data.sentiment}
                </div>
              </div>
            )}

            {activeModule.livePreview.type === 'intelligence' && (
              <div className="space-y-2 font-mono text-xs">
                {activeModule.livePreview.data.map((row: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div>
                      <div className="font-bold text-slate-200">{row.lead}</div>
                      <div className="text-[10px] text-slate-400">{row.intent}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-extrabold text-emerald-400">{row.score}</span>
                      <span className="text-[9px] text-slate-400 block">SLA: {row.SLA}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeModule.livePreview.type === 'decision' && (
              <div className="space-y-2 font-mono text-xs">
                {activeModule.livePreview.data.map((row: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                    <div className="text-[10px] font-bold text-emerald-400">{row.step}</div>
                    <div className="text-[11px] text-slate-300">{row.detail}</div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
