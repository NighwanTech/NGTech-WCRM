'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CtaSectionProps {
  content: {
    title?: string;
    subheadline?: string;
    button_text?: string;
    button_url?: string;
  };
}

export function CtaSection({ content }: CtaSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 text-white text-center relative overflow-hidden border-b border-border/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-4 space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
          <Sparkles className="h-4 w-4" /> 7-Day Risk-Free Trial · No Credit Card Required
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {content.title || 'Ready to Scale Your WhatsApp Operation?'}
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {content.subheadline || 'Join 500+ enterprises using WCRM to automate customer support, sales pipelines, and BYOK AI completions.'}
        </p>

        <div className="pt-2">
          <Link
            href={content.button_url || '/free-trial'}
            className="inline-flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-10 text-sm transition-all shadow-xl shadow-emerald-500/25 gap-2"
          >
            {content.button_text || 'Claim Your 7-Day Free Trial Now →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
