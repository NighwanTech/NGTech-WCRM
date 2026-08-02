'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface ComparisonTableSectionProps {
  content: {
    title?: string;
    rows?: Array<{ feature: string; legacy: string; wacrm: string }>;
  };
}

export function ComparisonTableSection({ content }: ComparisonTableSectionProps) {
  const rows = content.rows || [
    { feature: 'Multi-Agent Access', legacy: '1 Phone / Web App', wacrm: 'Unlimited Agents & Departments' },
    { feature: 'AI Token Markups', legacy: '3x Vendor Markups', wacrm: '0% BYOK Direct Key Pricing' },
    { feature: 'Auto-Failover Reliability', legacy: '❌ 429 Downtime Crashes', wacrm: '✅ Sub-1s Self-Healing Failover' },
    { feature: 'CRM Pipeline Automation', legacy: '❌ Manual Spreadsheets', wacrm: '✅ Visual Kanban Deal Pipeline' }
  ];

  return (
    <section className="py-20 bg-background border-b border-border/50 text-left">
      <div className="container mx-auto max-w-5xl px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">Visual Comparison</span>
          <h2 className="text-3xl font-black text-foreground">{content.title || 'Traditional Method vs WCRM'}</h2>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card shadow-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-mono text-muted-foreground">
                <th className="px-6 py-4 text-left font-bold">CAPABILITY / FEATURE</th>
                <th className="px-6 py-4 text-left font-bold text-rose-400">TRADITIONAL WAY</th>
                <th className="px-6 py-4 text-left font-bold text-emerald-400">WCRM ENTERPRISE PLATFORM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground">{r.feature}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.legacy}</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold bg-emerald-500/5">{r.wacrm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
