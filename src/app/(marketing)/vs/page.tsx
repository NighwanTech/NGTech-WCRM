import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  DollarSign,
  Bot,
  Kanban,
  MessageSquare,
  Building,
  ChevronRight,
  TrendingDown,
} from 'lucide-react'
import { getSiteUrl, SITE_CONFIG } from '@/lib/site-config'
import { COMPETITORS } from './[competitor]/page'

export const metadata: Metadata = {
  title: 'AIWCRM vs Alternatives & Competitor Comparisons',
  description: 'See how AIWCRM compares against HubSpot, Salesforce, Zoho CRM, Monday.com, Freshworks, and traditional WhatsApp tools with authentic feature & TCO breakdowns.',
  openGraph: {
    title: 'AIWCRM vs Competitors — Transparent Comparison Hub',
    description: 'Compare AIWCRM with HubSpot, Salesforce, Zoho CRM, Monday.com, and Freshworks.',
    url: getSiteUrl('/vs'),
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
}

export default function CompareHubPage() {
  const competitorList = Object.values(COMPETITORS)

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-500" /> Market Comparisons & TCO
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
          How AIWCRM Compares to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            Alternative Platforms.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Transparent, authentic breakdowns of feature capabilities, architecture differences, and total cost of ownership (TCO).
        </p>
      </div>

      {/* Competitor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitorList.map((comp) => (
          <Link
            key={comp.slug}
            href={`/vs/${comp.slug}`}
            className="p-6 rounded-2xl border bg-card hover:border-primary/50 transition-all space-y-4 group block shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                  AIWCRM vs {comp.name}
                </span>
                <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {comp.badge}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {comp.summary}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground text-[11px]">Typical Cost:</span>
                <span className="font-bold text-destructive text-[11px] truncate max-w-[160px]">{comp.typicalCost}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground text-[11px]">AI Token Markup:</span>
                <span className="font-bold text-emerald-600 text-[11px]">0% on AIWCRM</span>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                <span>View Full Showdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Summary Matrix Banner */}
      <div className="p-8 rounded-3xl border bg-muted/20 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-500" /> Strategic Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
            Why AIWCRM Wins for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              Modern Revenue Teams.
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">The only unified platform built natively for WhatsApp Cloud API, Retell Voice AI, and 18% GST billing</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">1. Zero Token Markup</span>
            <div className="font-bold text-emerald-600">BYOK Multi-LLM Vault</div>
          </div>
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">2. Native WhatsApp</span>
            <div className="font-bold text-foreground">Official Meta Cloud API</div>
          </div>
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">3. GST Compliance</span>
            <div className="font-bold text-foreground">18% Statutory Invoices</div>
          </div>
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase">4. Conversational Voice</span>
            <div className="font-bold text-emerald-600">Retell + ElevenLabs</div>
          </div>
        </div>
      </div>

      {/* Dual CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
          Switch to AIWCRM with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            Zero Disruption.
          </span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Migrate your contacts, pipeline, WhatsApp number, and verified badges seamlessly in under 15 minutes.
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
