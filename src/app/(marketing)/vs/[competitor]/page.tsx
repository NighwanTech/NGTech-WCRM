import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  Star
} from 'lucide-react';
import { getSiteUrl, SITE_CONFIG } from '@/lib/site-config';

interface CompetitorData {
  slug: string;
  name: string;
  tagline: string;
  badge: string;
  markup: string;
  voiceAi: boolean;
  failover: boolean;
  kanban: boolean;
  zeroTokenGreeting: boolean;
  metaOfficial: boolean;
  pricingNote: string;
  summary: string;
}

const COMPETITORS: Record<string, CompetitorData> = {
  interakt: {
    slug: 'interakt',
    name: 'Interakt',
    tagline: 'AI WCRM vs Interakt — 0% Token Markup vs High Platform Markup',
    badge: 'Interakt Alternative',
    markup: '2x - 3x AI Markup',
    voiceAi: false,
    failover: false,
    kanban: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    pricingNote: 'Interakt adds substantial platform markups on AI conversations and lacks BYOK custom model routing.',
    summary: 'Interakt is popular for basic WhatsApp marketing, but AI WCRM provides true enterprise BYOK multi-LLM routing with 0% token markup, Retell Voice AI integration, and visual sales Kanban pipelines.',
  },
  doubletick: {
    slug: 'doubletick',
    name: 'DoubleTick',
    tagline: 'AI WCRM vs DoubleTick — Multi-Model AI Routing & Voice AI',
    badge: 'DoubleTick Alternative',
    markup: 'Platform Markup Applies',
    voiceAi: false,
    failover: false,
    kanban: true,
    zeroTokenGreeting: false,
    metaOfficial: true,
    pricingNote: 'DoubleTick provides WhatsApp CRM features but restricts you to single AI models with platform markup.',
    summary: 'While DoubleTick offers sales tracking, AI WCRM gives you full BYOK model control across OpenAI, Gemini 3.6, Claude, Groq, and DeepSeek with sub-1s auto-failover and 0-token greeting cache.',
  },
  gupshup: {
    slug: 'gupshup',
    name: 'Gupshup',
    tagline: 'AI WCRM vs Gupshup — Visual Sales Kanban & BYOK AI Engine',
    badge: 'Gupshup Alternative',
    markup: 'Enterprise Custom Pricing',
    voiceAi: false,
    failover: false,
    kanban: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    pricingNote: 'Gupshup focuses on high-volume developer APIs but lacks native visual sales Kanban pipelines and BYOK model freedom.',
    summary: 'AI WCRM gives business teams a visual drag-and-drop sales Kanban, shared inbox collision detection, and instant BYOK key management alongside sub-50ms REST APIs.',
  },
  wati: {
    slug: 'wati',
    name: 'Wati',
    tagline: 'AI WCRM vs Wati — 0% Token Markup & Retell Voice AI',
    badge: 'Wati Alternative',
    markup: 'Vendor Markup on AI',
    voiceAi: false,
    failover: false,
    kanban: true,
    zeroTokenGreeting: false,
    metaOfficial: true,
    pricingNote: 'Wati charges per-agent seats and vendor markups on automated AI replies.',
    summary: 'AI WCRM offers unlimited team seats, BYOK direct provider rates (0% markup), Retell Voice phone calls, and sub-100ms 0-token catalog replies.',
  },
  aisensy: {
    slug: 'aisensy',
    name: 'AiSensy',
    tagline: 'AI WCRM vs AiSensy — Enterprise BYOK Multi-LLM Routing',
    badge: 'AiSensy Alternative',
    markup: 'Platform Markup',
    voiceAi: false,
    failover: false,
    kanban: false,
    zeroTokenGreeting: false,
    metaOfficial: true,
    pricingNote: 'AiSensy is designed for basic broadcast campaigns but lacks multi-LLM auto failover and voice call sync.',
    summary: 'AI WCRM delivers end-to-end sales, support, and marketing automation with self-healing AI failover and 99.99% uptime SLA.',
  },
};

export async function generateMetadata({ params }: { params: { competitor: string } }): Promise<Metadata> {
  const competitor = COMPETITORS[params.competitor.toLowerCase()];
  if (!competitor) return {};

  const pageUrl = getSiteUrl(`/vs/${competitor.slug}`);

  return {
    title: `${SITE_CONFIG.name} vs ${competitor.name} — Feature & Pricing Comparison`,
    description: competitor.summary,
    keywords: [
      `${SITE_CONFIG.name} vs ${competitor.name}`,
      `${competitor.name} Alternative`,
      `Best ${competitor.name} Alternative India`,
      'BYOK WhatsApp CRM',
      'WhatsApp AI CRM Comparison',
      '0% Token Markup WhatsApp',
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
  };
}

export async function generateStaticParams() {
  return Object.keys(COMPETITORS).map((competitor) => ({ competitor }));
}

export default function CompetitorComparisonPage({ params }: { params: { competitor: string } }) {
  const competitor = COMPETITORS[params.competitor.toLowerCase()];
  if (!competitor) {
    notFound();
  }

  const comparisonRows = [
    { feature: '0% Platform Token Markup (BYOK)', us: true, competitor: false, detail: 'Connect OpenAI, Gemini, Claude, Groq or DeepSeek directly' },
    { feature: 'Multi-LLM Self-Healing Auto Failover', us: true, competitor: competitor.failover, detail: 'Sub-1s failover when model hits rate limit' },
    { feature: '0-Token Instant Greeting Cache', us: true, competitor: competitor.zeroTokenGreeting, detail: '<100ms catalog replies with 0 token consumption' },
    { feature: 'Retell Voice AI Agent Phone Call Sync', us: true, competitor: competitor.voiceAi, detail: 'Human-like voice call handling synced to WhatsApp' },
    { feature: 'Visual Drag-and-Drop Sales Kanban', us: true, competitor: competitor.kanban, detail: 'Pipeline lead stages with revenue attribution' },
    { feature: 'Multi-Agent Collision Detection', us: true, competitor: false, detail: 'Prevents reps from sending duplicate replies' },
    { feature: '100% Meta Official Cloud API', us: true, competitor: competitor.metaOfficial, detail: 'Zero number ban risk & SOC2 security' },
    { feature: 'Sub-50ms Developer REST APIs & Webhooks', us: true, competitor: false, detail: 'Sub-50ms real-time event delivery' },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Header */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/features" className="hover:text-emerald-400">Features</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-bold">vs {competitor.name}</span>
        </nav>

        {/* Hero Section */}
        <header className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>{competitor.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
            Why Modern Enterprises Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {SITE_CONFIG.name}
            </span>{' '}
            Over {competitor.name}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {competitor.summary}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/free-trial"
              className="flex h-13 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 text-sm transition-all shadow-lg shadow-emerald-500/25 gap-2"
            >
              Start 7-Day Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/book-demo"
              className="flex h-13 items-center justify-center rounded-full border border-border bg-card hover:bg-muted px-8 text-sm font-bold text-foreground transition-all"
            >
              Book Live Product Demo
            </Link>
          </div>
        </header>

        {/* Feature Comparison Table Matrix */}
        <section aria-labelledby="matrix-heading" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 id="matrix-heading" className="text-2xl sm:text-3xl font-black text-foreground">
              Feature-by-Feature Showdown
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Side-by-side comparison of platform capabilities and AI architecture.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 p-5 border-b border-border bg-muted/30 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-6 sm:col-span-6">Platform Feature</div>
              <div className="col-span-3 sm:col-span-3 text-center text-emerald-400 font-extrabold">{SITE_CONFIG.name}</div>
              <div className="col-span-3 sm:col-span-3 text-center text-rose-400">{competitor.name}</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/60">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-muted/10 transition-colors text-xs">
                  <div className="col-span-6 sm:col-span-6 space-y-1">
                    <p className="font-extrabold text-foreground text-sm">{row.feature}</p>
                    <p className="text-[11px] text-muted-foreground hidden sm:block">{row.detail}</p>
                  </div>

                  {/* Our Platform */}
                  <div className="col-span-3 sm:col-span-3 flex justify-center items-center">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">Included</span>
                    </div>
                  </div>

                  {/* Competitor */}
                  <div className="col-span-3 sm:col-span-3 flex justify-center items-center">
                    {row.competitor ? (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Yes</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-rose-400 font-bold">
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">No</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing & AI Markup Highlight */}
        <section className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase border border-emerald-500/30">
                0% Token Markup Differentiator
              </span>
              <h3 className="text-2xl font-black text-white mt-2">Why Pay 3x AI Token Markups?</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400 font-mono">0%</span>
              <span className="text-xs text-slate-400 block font-mono">Platform Token Markup on AI WCRM</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {competitor.pricingNote} With <strong>{SITE_CONFIG.name}</strong>, you plug in your own API keys for OpenAI, Google Gemini 3.6, Claude 3.5, Groq, or DeepSeek and pay direct provider rates — cutting your monthly AI operational spend by up to 60%.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-mono block">AI Token Cost</span>
              <span className="text-emerald-400 font-extrabold text-sm">Direct Provider Rate</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-mono block">Greeting Cache</span>
              <span className="text-emerald-400 font-extrabold text-sm">0 Tokens Needed</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-mono block">AI Failover SLA</span>
              <span className="text-emerald-400 font-extrabold text-sm">&lt;1 Second Auto-Failover</span>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="text-center space-y-6 pt-8">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Ready to Switch to {SITE_CONFIG.name}?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Test all features with full Meta Cloud API protection and 0% AI markup for 7 days — completely free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/free-trial"
              className="flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-10 text-sm transition-all shadow-xl shadow-emerald-500/25 gap-2"
            >
              Start Free Trial Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
