'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Factory,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Building,
  Landmark,
  Hotel,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Send,
  Code2,
  FileText,
  PhoneCall,
  Clock,
  DollarSign,
  Calendar,
  Compass,
  Lock,
  Bot,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { INDUSTRIES_DATA, IndustryData } from '@/lib/data/industry-solutions-data';

const ICON_MAP: Record<string, any> = {
  Factory,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Building,
  Landmark,
  Hotel,
  Building2,
  Code2,
  Send,
  FileText,
  PhoneCall,
  Clock,
  DollarSign,
  Calendar,
  Compass,
  Lock,
  Bot,
  ShieldCheck
};

export { INDUSTRIES_DATA, type IndustryData };

export function IndustrySolutionsClient({ initialIndustry }: { initialIndustry?: string }) {
  const defaultId = (initialIndustry && INDUSTRIES_DATA[initialIndustry.toLowerCase()]) ? initialIndustry.toLowerCase() : 'manufacturing';
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  useEffect(() => {
    if (initialIndustry && INDUSTRIES_DATA[initialIndustry.toLowerCase()]) {
      setSelectedId(initialIndustry.toLowerCase());
    }
  }, [initialIndustry]);

  const current = INDUSTRIES_DATA[selectedId] || INDUSTRIES_DATA.manufacturing;
  const IconComponent = ICON_MAP[current.iconName] || Factory;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* 1. ENTERPRISE SOLUTIONS PAGE HERO */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-background border-b border-border/40">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>Enterprise Industry Vertical Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.06] max-w-5xl mx-auto">
            Tailored Industry Workflows for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              High-Growth Enterprises.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed">
            Pre-built Meta Cloud API WhatsApp chatbots, AI Meta Ads creation, ERP inventory webhooks, and BYOK AI multi-model routing engineered for 7 high-impact industry verticals.
          </p>

          {/* Industry Navigation Tabs */}
          <div className="pt-6 flex flex-wrap justify-center gap-2.5 max-w-5xl mx-auto">
            {Object.values(INDUSTRIES_DATA).map((ind) => {
              const Icon = ICON_MAP[ind.iconName] || Building2;
              const isActive = ind.id === selectedId;
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedId(ind.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-card/80 text-muted-foreground border-border/60 hover:border-emerald-500/40 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{ind.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. SELECTED INDUSTRY FEATURE DISPLAY */}
      <section className="py-16 bg-muted/20 border-b border-border/40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/40">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> {current.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground flex items-center gap-3 leading-tight">
                <IconComponent className="h-8 w-8 text-emerald-500 shrink-0" />
                <span>{current.heroHeadline}</span>
              </h2>
              <p className="text-base text-muted-foreground max-w-3xl">
                {current.heroDesc}
              </p>
            </div>
            <Link
              href="/book-demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shrink-0"
            >
              <span>Schedule {current.name} Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {current.metrics.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-1">
                <div className="text-3xl font-black text-emerald-500">{m.value}</div>
                <div className="text-sm font-bold text-foreground">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Solution Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-foreground">Core Industry Workflows</h3>
              <div className="space-y-4">
                {current.solutions.map((sol, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-border/60 bg-card/40 space-y-1">
                    <div className="font-extrabold text-base text-emerald-500 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {sol.feature}
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">{sol.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Interactive Chat Simulation */}
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-card to-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                  <Bot className="h-4 w-4" />
                  <span>{current.chatDemo.aiTitle}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{current.chatDemo.telemetry}</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/60 text-foreground ml-8 text-right">
                  {current.chatDemo.userMsg}
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mr-8">
                  {current.chatDemo.aiReply}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA & FOOTER NAVIGATION */}
      <section className="py-16 sm:py-20 bg-background text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
          Ready to Automate Your {current.name} Workflows with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            AIWCRM?
          </span>
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/free-trial"
            className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg"
          >
            Start Free 7-Day Trial
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full border border-border bg-card font-bold text-xs hover:bg-muted transition-all"
          >
            Talk to Solutions Architect
          </Link>
        </div>
      </section>
    </div>
  );
}
