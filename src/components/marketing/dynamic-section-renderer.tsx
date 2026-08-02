'use client';

import React from 'react';
import Link from 'next/link';
import { HeroSection } from './sections/hero-section';
import { KpiStatsSection } from './sections/kpi-stats-section';
import { ComparisonTableSection } from './sections/comparison-table-section';
import { CtaSection } from './sections/cta-section';
import { FeatureSectionBlock } from '@/lib/services/features-cms.service';
import { AlertTriangle, Bot, CheckCircle2, ChevronDown, HelpCircle, Layers, ArrowRight } from 'lucide-react';

interface DynamicSectionRendererProps {
  sections: FeatureSectionBlock[];
  status?: string;
  plans?: string[];
  relatedSlugs?: string[];
}

export function DynamicSectionRenderer({
  sections,
  status = 'live',
  plans = ['Starter', 'Pro', 'Enterprise'],
  relatedSlugs = ['shared-inbox', 'byok', 'crm-pipeline', 'voice-ai']
}: DynamicSectionRendererProps) {
  const sortedSections = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground text-left">
      {sortedSections.map((sec) => {
        switch (sec.type) {
          case 'hero':
            return (
              <HeroSection
                key={sec.id}
                content={sec.content}
                theme={sec.theme}
                badgeStatus={status}
                plans={plans}
              />
            );

          case 'kpi_stats':
            return <KpiStatsSection key={sec.id} content={sec.content} theme={sec.theme} />;

          case 'comparison_table':
            return <ComparisonTableSection key={sec.id} content={sec.content} />;

          case 'cta':
            return <CtaSection key={sec.id} content={sec.content} />;

          case 'problems':
            return (
              <section key={sec.id} className="py-16 bg-card/40 border-b border-border/50 text-left">
                <div className="container mx-auto max-w-5xl px-4 space-y-8">
                  <h2 className="text-3xl font-black text-foreground text-center">
                    {sec.content.title || 'Business Problems Solved'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(sec.content.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-3xl bg-background border border-border/80 space-y-3 shadow-md">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                        <h3 className="font-extrabold text-foreground text-base">{item.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'solution':
            return (
              <section key={sec.id} className="py-20 bg-background border-b border-border/50 text-left">
                <div className="container mx-auto max-w-5xl px-4 space-y-8">
                  <h2 className="text-3xl font-black text-foreground text-center">
                    {sec.content.title || 'How WCRM Handles It'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(sec.content.steps || []).map((step: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-3xl bg-card border border-border/80 space-y-3 shadow-md">
                        <span className="text-2xl font-black text-emerald-400 font-mono">{step.step}</span>
                        <h3 className="font-extrabold text-foreground text-sm">{step.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'ai_advantages':
            return (
              <section key={sec.id} className="py-20 bg-card/30 border-b border-border/50 text-left">
                <div className="container mx-auto max-w-5xl px-4 space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">AI Architecture</span>
                    <h2 className="text-3xl font-black text-foreground">{sec.content.title || 'AI Advantages'}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(sec.content.capabilities || []).map((cap: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-3xl bg-background border border-border space-y-3">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                          <Bot className="h-6 w-6" />
                        </div>
                        <h3 className="font-extrabold text-foreground text-base">{cap.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'faq':
            return (
              <section key={sec.id} className="py-20 bg-background border-b border-border/50 text-left">
                <div className="container mx-auto max-w-4xl px-4 space-y-8">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                      <HelpCircle className="h-3.5 w-3.5" /> Feature FAQs
                    </div>
                    <h2 className="text-3xl font-black text-foreground">{sec.content.title || 'Frequently Asked Questions'}</h2>
                  </div>
                  <div className="space-y-4">
                    {(sec.content.faqs || []).map((faq: any, idx: number) => (
                      <details key={idx} className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm group cursor-pointer" open={idx === 0}>
                        <summary className="font-extrabold text-base text-foreground flex items-center justify-between gap-4 list-none group-hover:text-emerald-400 transition-colors">
                          <span>{faq.q}</span>
                          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                        </summary>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Internal Linking: Related Features Grid */}
      {relatedSlugs && relatedSlugs.length > 0 && (
        <section className="py-16 bg-card/40 border-b border-border/50 text-left">
          <div className="container mx-auto max-w-5xl px-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-foreground">Explore Related Features</h3>
              <Link href="/features" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                View All Features <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              {relatedSlugs.map((rSlug) => (
                <Link
                  key={rSlug}
                  href={`/features/${rSlug}`}
                  className="p-4 rounded-2xl bg-background border border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-center space-y-1 block"
                >
                  <p className="font-extrabold text-foreground capitalize">{rSlug.replace(/-/g, ' ')}</p>
                  <p className="text-[10px] text-emerald-400">Explore Capability →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
