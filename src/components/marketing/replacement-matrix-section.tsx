'use client';

import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Zap,
  TrendingUp,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export function ReplacementMatrixSection() {
  const comparisonItems = [
    {
      capability: 'AI Model & Token Billing',
      legacy: '30% - 50% vendor markups on every AI response. Exorbitant monthly bills.',
      aiwcrm: 'Bring Your Own Key (BYOK). Pay raw provider costs with 0% token markup.',
      benefit: 'Saves up to 60% on AI expenses'
    },
    {
      capability: 'Voice AI Calling Integration',
      legacy: 'Separate third-party voice tools with zero CRM lead telemetry or context sharing.',
      aiwcrm: 'Multi-Provider Retell + ElevenLabs Voice AI with native Hindi & 10 CRM fields auto-extracted.',
      benefit: 'Automates phone call qualification'
    },
    {
      capability: 'Meta Lead Ads Sync',
      legacy: 'Manual CSV exports or delayed email notifications taking hours to follow up.',
      aiwcrm: 'Autonomous 0-latency Meta Lead Ads OS initiating WhatsApp chat in <2 seconds.',
      benefit: '3.5x higher ad conversion'
    },
    {
      capability: 'CRM & Pipeline Automation',
      legacy: 'Basic messaging tool with no sales stages, deal values, or Kanban tracking.',
      aiwcrm: 'Visual Kanban sales pipelines, predictive lead scoring, and automated deal triggers.',
      benefit: '100% pipeline visibility'
    },
    {
      capability: 'System Uptime & Failover',
      legacy: 'Single point of failure. If OpenAI or WhatsApp hits rate limit, entire app breaks.',
      aiwcrm: 'Self-healing Auto-Failover Engine switching models in <1 second with 99.99% SLA.',
      benefit: 'Zero business downtime'
    },
    {
      capability: 'Enterprise Security & Governance',
      legacy: 'Shared credentials, unencrypted database storage, no role-based permission controls.',
      aiwcrm: 'AES-256 vault, DPDP Act & GDPR compliance, enterprise RBAC, and SOC2 audit trails.',
      benefit: 'Bank-grade compliance'
    }
  ];

  return (
    <section className="py-24 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-500" /> Platform Transformation Matrix
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
            Replace Fragmented Tools with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              One Unified AI Platform.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Stop paying multiple SaaS subscriptions and dealing with broken integrations. AIWCRM consolidates your entire customer stack into one connected enterprise platform.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-muted/40 border-b border-border/60 p-4 sm:p-6 text-xs font-extrabold uppercase tracking-wider gap-4">
            <div className="md:col-span-3 text-muted-foreground">Platform Capability</div>
            <div className="md:col-span-4 text-rose-500 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> Traditional Legacy Setup
            </div>
            <div className="md:col-span-5 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AIWCRM Enterprise Ecosystem
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/60">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 text-xs sm:text-sm gap-4 items-center hover:bg-muted/20 transition-colors">
                
                {/* Capability Title */}
                <div className="md:col-span-3 font-extrabold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {item.capability}
                </div>

                {/* Legacy Setup */}
                <div className="md:col-span-4 text-muted-foreground bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item.legacy}</span>
                </div>

                {/* AIWCRM Ecosystem */}
                <div className="md:col-span-5 text-foreground bg-emerald-500/10 dark:bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/30 flex items-start gap-2 justify-between">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">{item.aiwcrm}</span>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                        ✓ {item.benefit}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-900/40 via-slate-900 to-blue-900/40 p-8 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white">Ready to streamline your enterprise operations?</h3>
            <p className="text-xs text-slate-300">Migrate your pipeline and data in under 10 minutes with free technical support.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/free-trial"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
