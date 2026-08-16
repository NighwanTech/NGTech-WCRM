import React from 'react'
import Link from 'next/link'
import {
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Building,
  Briefcase,
  DollarSign,
  Heart,
  Bot,
  Rocket,
  TrendingUp,
  Plug,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
} from 'lucide-react'

export const metadata = {
  title: 'Platform Architecture & Capabilities | AIWCRM Enterprise OS',
  description: 'Explore the 3-layer architecture and 12 core platform capabilities of the AIWCRM Enterprise Business Operating System.',
}

export default function PlatformOverviewPage() {
  const lifecycleSteps = [
    { num: '01', title: 'Visitor', desc: 'Anonymous web visitor or social viewer', icon: Globe },
    { num: '02', title: 'Marketing Campaign', desc: 'Meta Ads & WhatsApp discovery', icon: Layers },
    { num: '03', title: 'Inbound Lead', desc: 'Sub-2s zero latency webhook capture', icon: Users },
    { num: '04', title: 'Customer 360', desc: 'Unified interaction timeline & memory', icon: Building },
    { num: '05', title: 'Proposal & SOW', desc: 'AI commercial scope builder', icon: FileTextIcon },
    { num: '06', title: '18% GST Quote', desc: 'Tax calculation & WhatsApp send', icon: DollarSign },
    { num: '07', title: 'Tax Invoice', desc: 'Razorpay UPI payment link', icon: CreditCardIcon },
    { num: '08', title: 'Settlement', desc: 'Automated bank & ledger reconciliation', icon: CheckCircle2 },
    { num: '09', title: 'Customer Success', desc: 'Onboarding milestones & NPS surveys', icon: Heart },
    { num: '10', title: 'Renewal & Upsell', desc: 'Predictive churn alerts & expansion', icon: TrendingUp },
  ]

  const capabilities = [
    { title: 'Marketing', href: '/features#marketing', desc: 'Meta Ads Manager Pro, AI creative studio, lookalike audience segments, and budget spend ceilings.', icon: Layers },
    { title: 'Universal Lead Hub', href: '/features#lead-hub', desc: 'Omnichannel lead ingestion (Web, Meta, Sheets, WhatsApp, API) with automated qualification and round-robin routing.', icon: Users },
    { title: 'CRM & Customer 360', href: '/features#crm', desc: 'Shared two-way inbox, complete timeline, phone privacy masking, and private team collaboration notes.', icon: Building },
    { title: 'Enterprise Sales', href: '/features#sales', desc: 'Commercial deal pipelines, win probabilities, AI proposal generator, and sales playbook cadences.', icon: Briefcase },
    { title: 'Finance & Invoicing', href: '/features#finance', desc: '18% GST tax invoices, Razorpay collections, aging ledger matrix, and multi-channel payment reminders.', icon: DollarSign },
    { title: 'Customer Success', href: '/features#success', desc: 'Client health scoring, renewal tracking, satisfaction surveys, and automated milestone reviews.', icon: Heart },
    { title: 'AI Studio & Copilot', href: '/ai-platform', desc: 'BYOK multi-model vault, Prompt Studio, RAG Vector Knowledge Base, and human-in-the-loop decision center.', icon: Bot },
    { title: 'Visual Automation', href: '/features#automation', desc: 'Drag-and-drop workflow builder, event bus triggers, scheduled crons, and action execution engines.', icon: Rocket },
    { title: 'Revenue Analytics', href: '/features#analytics', desc: 'Agent scorecards, department leaderboards, revenue forecasting, and executive business reports.', icon: TrendingUp },
    { title: 'Integrations Hub', href: '/features#integrations', desc: 'WhatsApp Cloud API, Meta Graph, Shopify, Google Sheets, WooCommerce, and REST APIs.', icon: Plug },
    { title: 'Settings & Governance', href: '/security', desc: '3-tier PBAC permission matrix, SHA-256 audit logs, remote session kill, and DPDP compliance.', icon: ShieldCheck },
  ]

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          <Zap className="w-3.5 h-3.5" /> Enterprise Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
          The Enterprise Business{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            Operating System.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          AIWCRM unifies marketing, lead intake, CRM, sales pipeline, GST invoicing, and AI automation into a single, cohesive operating layer for growing businesses.
        </p>
      </div>

      {/* 3-Layer Enterprise Architecture Diagram */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-foreground">3-Layer Platform Architecture</h2>
          <p className="text-xs text-muted-foreground">How AIWCRM powers end-to-end business operations with zero data fragmentation</p>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {/* Layer 1 */}
          <div className="p-5 rounded-2xl border bg-card/80 shadow-sm space-y-2 border-primary/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary uppercase">Layer 1 • Business Teams & Roles</span>
              <span className="text-[10px] text-muted-foreground font-mono">Role-Based Persona Access</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Marketing Directors', 'Sales Representatives', 'Finance Officers', 'Support Agents', 'Operations Leads', 'Executive Leadership'].map((t) => (
                <span key={t} className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-5 rounded-2xl border bg-card/80 shadow-sm space-y-2 border-blue-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-500 uppercase">Layer 2 • Business Capabilities & Workspaces</span>
              <span className="text-[10px] text-muted-foreground font-mono">Modular Business OS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              {['Meta Ads & Marketing', 'Universal Lead Hub', 'CRM & Customer 360', 'Enterprise Sales & Deals', 'Finance & GST Invoices', 'Customer Success', 'Visual Automation', 'Revenue Analytics'].map((m) => (
                <div key={m} className="p-2 rounded-lg bg-muted/30 border text-foreground font-medium text-center">
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Layer 3 */}
          <div className="p-5 rounded-2xl border bg-card/80 shadow-sm space-y-2 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Layer 3 • AI Engine, Automation & Security Vault</span>
              <span className="text-[10px] text-muted-foreground font-mono">Enterprise Foundation</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Multi-LLM BYOK Routing (Gemini/OpenAI/Claude)', 'Retell Voice AI', 'SHA-256 Crypto Audit Chain', 'PBAC Permission Guard', '18% GST Statutory Engine', 'Zero-Latency Webhook Bus'].map((f) => (
                <span key={f} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Journey Progression Lifecycle */}
      <div className="space-y-6 pt-6 border-t">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-foreground">Continuous Customer Revenue Lifecycle</h2>
          <p className="text-xs text-muted-foreground">Every touchpoint synchronized in real-time across your entire organization</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {lifecycleSteps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="p-4 rounded-xl border bg-card/60 hover:bg-card transition-all space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-primary">{step.num}</span>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <h4 className="text-xs font-bold text-foreground">{step.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-snug">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Primary Platform Capabilities Grid */}
      <div className="space-y-6 pt-6 border-t">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-foreground">Explore Platform Capabilities</h2>
          <p className="text-xs text-muted-foreground">Purpose-built modular tools engineered for scalable growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon
            return (
              <Link
                key={cap.title}
                href={cap.href}
                className="p-5 rounded-2xl border bg-card hover:border-primary/50 transition-all space-y-2 group block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cap.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary pt-1">
                  Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Standardized Dual CTA Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Ready to Unify Your Revenue Operations?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Start your 14-day free trial or book a custom enterprise demo tailored to your industry workflow.
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

function FileTextIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
  )
}

function CreditCardIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
  )
}
