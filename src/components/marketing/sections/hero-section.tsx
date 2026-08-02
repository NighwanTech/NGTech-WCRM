'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { FeatureImage } from '@/components/ui/feature-image';

interface HeroSectionProps {
  content: {
    title?: string;
    subheadline?: string;
    cta_primary?: string;
    cta_primary_url?: string;
    cta_secondary?: string;
    cta_secondary_url?: string;
    image_asset?: string;
  };
  theme?: string;
  badgeStatus?: string;
  plans?: string[];
}

export function HeroSection({ content, theme = 'glass', badgeStatus = 'live', plans = ['Starter', 'Pro', 'Enterprise'] }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-background border-b border-border/40 text-left">
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-4xl space-y-6">
          
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Official Meta WhatsApp Cloud API
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 text-[11px] font-mono font-bold uppercase">
              Status: {badgeStatus}
            </span>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-muted-foreground pl-2">
              <span>Plans:</span>
              {plans.map((p, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-muted text-foreground font-bold">{p}</span>
              ))}
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.06]">
            {content.title || 'Enterprise Feature Capability'}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl font-normal">
            {content.subheadline || 'Scale your business operations on official Meta WhatsApp API with zero platform token markups.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={content.cta_primary_url || '/free-trial'}
              className="flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 text-xs transition-all shadow-lg shadow-emerald-500/20 gap-2"
            >
              {content.cta_primary || 'Start 7-Day Free Trial'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={content.cta_secondary_url || '/book-demo'}
              className="flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 text-xs font-bold text-foreground hover:bg-muted"
            >
              {content.cta_secondary || 'Book Technical Demo'}
            </Link>
          </div>
        </div>

        {/* Browser Mockup Asset */}
        <div className="pt-6 relative">
          <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-3 sm:p-4 shadow-2xl overflow-hidden group">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3 px-2">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">app.wacrm.in / features</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10">Live UI</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/40 relative min-h-[300px] bg-muted/20">
              <img
                src={content.image_asset ? `/${content.image_asset.replace(/^\//, '').replace(/\.png$/, '')}.png` : '/dashboard-mockup.png'}
                alt={content.title || 'Feature Dashboard Mockup'}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/dashboard-mockup.png';
                }}
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500 rounded-2xl"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
