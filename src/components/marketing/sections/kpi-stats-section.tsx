'use client';

import React from 'react';

interface KpiStatsSectionProps {
  content: {
    title?: string;
    stats?: Array<{ label: string; value: string }>;
  };
  theme?: string;
}

export function KpiStatsSection({ content }: KpiStatsSectionProps) {
  const stats = content.stats || [
    { label: 'Faster Response Rate', value: '80%' },
    { label: 'Less Manual Work', value: '60%' },
    { label: 'Lead Conversion Boost', value: '3x' }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-card/80 via-background to-card/80 border-b border-border/50 text-left">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground text-center">
          {content.title || 'Proven Business Outcomes'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card border border-border/80 text-center space-y-2 shadow-lg hover:border-emerald-500/50 transition-colors"
            >
              <p className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                {s.value}
              </p>
              <p className="text-sm font-bold text-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
