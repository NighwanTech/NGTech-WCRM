import React from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Sparkles,
  Zap,
  DollarSign,
  ShieldCheck,
  Globe,
  ArrowRight,
  TrendingDown,
  Layers,
  Bot,
  Flame,
  KeyRound,
} from 'lucide-react'

export const metadata = {
  title: 'Why AIWCRM | Unified AI Business Operating System',
  description: 'Discover why high-growth enterprises replace 7+ fragmented SaaS tools with AIWCRM: WhatsApp-native, 18% GST ready, 60% lower TCO, and zero-trust PBAC security.',
}

export default function WhyAiwcrmPage() {
  const pillars = [
    {
      title: 'One Unified Operating System',
      badge: 'Zero Fragmentation',
      desc: 'Eliminate the cost and data silos of subscribing to separate CRM, Meta Ads tools, proposal builders, WhatsApp mailers, and GST invoicing software. Everything runs on one single database.',
      metric: '7 Tools → 1 Unified Platform',
      icon: Layers,
    },
    {
      title: 'WhatsApp & Meta Native',
      badge: 'Real-Time Webhooks',
      desc: 'Deep official Meta Graph API integration with sub-2 second lead sync, official Cloud API templates, catalog commerce, and two-way conversations with zero middleman delays.',
      metric: '<1.8s Lead-to-Chat Speed',
      icon: Zap,
    },
    {
      title: 'BYOK AI Multi-Model Vault',
      badge: 'Zero AI Markups',
      desc: 'Bring your own API keys for OpenAI, Google Gemini, Claude, Groq, or DeepSeek. Pay actual token provider wholesale rates with zero hidden markups from AIWCRM.',
      metric: '60% Reduction in AI Costs',
      icon: KeyRound,
    },
    {
      title: 'Engineered for Indian Businesses',
      badge: 'GST & Statutory Ready',
      desc: 'Built natively with automated 18% CGST/SGST/IGST tax calculation, HSN/SAC code support, Razorpay payment links, and WhatsApp delivery of formal quotations & invoices.',
      metric: '100% Statutory Compliant',
      icon: DollarSign,
    },
    {
      title: 'Enterprise-Grade Security & PBAC',
      badge: 'Zero-Trust Architecture',
      desc: 'Granular 4-tier permission levels (None/Read/Write/Admin), SHA-256 cryptographic audit trails, remote session revocation, and data isolation complying with DPDP & GDPR.',
      metric: 'Bank-Grade AES-256',
      icon: ShieldCheck,
    },
    {
      title: 'Voice AI with Multi-Lingual Support',
      badge: 'Hindi + English',
      desc: 'Autonomous voice calling agents powered by Retell AI and ElevenLabs to execute outbound lead follow-ups and inbound customer triage with natural accents.',
      metric: 'Sub-800ms Voice Latency',
      icon: Bot,
    },
  ]

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          <Sparkles className="w-3.5 h-3.5" /> Why Choose AIWCRM
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
          Built for Velocity, Clarity, and{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            Unmatched Cost Efficiency.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Traditional CRMs force you to patch together dozens of disconnected plugins. AIWCRM gives your marketing, sales, and finance teams a single, unified source of truth.
        </p>
      </div>

      {/* Strategic Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((p) => {
          const Icon = p.icon
          return (
            <div
              key={p.title}
              className="p-6 rounded-2xl border bg-card/70 hover:bg-card hover:border-primary/40 transition-all space-y-3 relative overflow-hidden shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded border text-muted-foreground">
                  {p.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>

              <div className="pt-2 border-t font-mono text-xs font-bold text-primary flex items-center justify-between">
                <span>{p.metric}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          )
        })}
      </div>

      {/* TCO Comparison Banner */}
      <div className="p-8 rounded-3xl border bg-muted/20 space-y-6">
        <div className="text-center space-y-1 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Total Cost of Ownership (TCO) Breakdown</h2>
          <p className="text-xs text-muted-foreground">Compare the cost of multiple point solutions versus AIWCRM Enterprise OS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-xs">
          {/* Traditional Stack */}
          <div className="p-5 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
            <span className="text-xs font-bold text-destructive uppercase tracking-wider block">Fragmented SaaS Stack</span>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex justify-between"><span>Legacy CRM (HubSpot/Salesforce)</span> <span className="font-mono font-bold">₹15,000/mo</span></li>
              <li className="flex justify-between"><span>Meta Ads Management Tool</span> <span className="font-mono font-bold">₹6,000/mo</span></li>
              <li className="flex justify-between"><span>WhatsApp Broadcast Tool</span> <span className="font-mono font-bold">₹4,500/mo</span></li>
              <li className="flex justify-between"><span>GST Invoicing Software</span> <span className="font-mono font-bold">₹3,000/mo</span></li>
              <li className="flex justify-between"><span>Zapier / Integration Connectors</span> <span className="font-mono font-bold">₹5,000/mo</span></li>
              <li className="flex justify-between"><span>AI Token Markups</span> <span className="font-mono font-bold">₹8,000/mo</span></li>
            </ul>
            <div className="pt-3 border-t border-destructive/20 flex justify-between font-bold text-destructive text-sm">
              <span>Estimated Total:</span>
              <span>₹41,500 / month</span>
            </div>
          </div>

          {/* AIWCRM Stack */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">AIWCRM Enterprise OS</span>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex justify-between"><span>Unified 12-Capability Platform</span> <span className="font-mono font-bold text-emerald-600">INCLUDED</span></li>
              <li className="flex justify-between"><span>Meta Ads Manager Pro</span> <span className="font-mono font-bold text-emerald-600">INCLUDED</span></li>
              <li className="flex justify-between"><span>WhatsApp Shared Inbox & Broadcasts</span> <span className="font-mono font-bold text-emerald-600">INCLUDED</span></li>
              <li className="flex justify-between"><span>18% GST Invoicing & Collections</span> <span className="font-mono font-bold text-emerald-600">INCLUDED</span></li>
              <li className="flex justify-between"><span>Visual Workflow Automation</span> <span className="font-mono font-bold text-emerald-600">INCLUDED</span></li>
              <li className="flex justify-between"><span>BYOK Multi-LLM (0% Markup)</span> <span className="font-mono font-bold text-emerald-600">WHOLESALE</span></li>
            </ul>
            <div className="pt-3 border-t border-emerald-500/20 flex justify-between font-bold text-emerald-600 text-sm">
              <span>Starting From:</span>
              <span>₹4,999 / month (Save ~60%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Transform Your Business Operations Today</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Join hundreds of forward-thinking enterprises running on the AIWCRM Operating System.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/free-trial"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-6 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          >
            Start Free Trial
          </Link>
          <Link
            href="/book-demo"
            className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-6 text-xs font-bold text-foreground shadow-sm transition-all hover:bg-muted"
          >
            Book Enterprise Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
