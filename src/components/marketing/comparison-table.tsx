import React from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export function EnterpriseComparisonTable() {
  const comparisons = [
    {
      feature: 'AI Model Choice & Ecosystem',
      typical: 'Single Fixed AI Provider (Closed)',
      wcrm: 'Multiple AI Providers (Gemini, OpenAI, Claude, Groq, DeepSeek, Custom)',
    },
    {
      feature: 'AI Pricing & Token Costs',
      typical: 'High Vendor Markups Per Message',
      wcrm: 'Bring Your Own Key (BYOK) — 0% Platform Token Markup',
    },
    {
      feature: 'AI Downtime & Failover',
      typical: 'Manual Model Switching (Bot fails on rate limit)',
      wcrm: 'Zero Downtime Auto-Failover (Switches backup provider in <1s)',
    },
    {
      feature: 'CRM & Pipeline Engine',
      typical: 'Basic Chat Inbox Wrapper Only',
      wcrm: 'Complete CRM (Kanban Pipelines, Deals, Lead Scoring, Tasks)',
    },
    {
      feature: 'Voice AI Integration',
      typical: 'No Voice Call Capabilities',
      wcrm: 'Multi-Provider Voice AI: Retell AI + ElevenLabs (native Hindi voices, sub-310ms latency)',
    },
    {
      feature: 'Workflow Automation',
      typical: 'Basic Keyword Auto-Replies',
      wcrm: 'Advanced No-Code Workflow Engine (Triggers, Conditions, Actions)',
    },
    {
      feature: 'Greeting Token Optimization',
      typical: 'No Greeting Cache (Uses tokens for "Hi")',
      wcrm: 'Zero Token Greeting Cache (0-token fast replies for "Hi"/"Thanks")',
    },
  ];

  return (
    <section className="py-24 bg-card/40 border-y border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Capability Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Why WCRM is Different
          </h2>
          <p className="text-base text-muted-foreground">
            A transparent architectural comparison highlighting enterprise capabilities.
          </p>
        </div>

        {/* Modern Comparison Table */}
        <div className="rounded-3xl border border-border/80 bg-background shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30">
                  <th className="py-5 px-6 text-sm font-bold text-foreground">Capability</th>
                  <th className="py-5 px-6 text-sm font-bold text-muted-foreground/80 w-1/3">Typical WhatsApp CRM</th>
                  <th className="py-5 px-6 text-sm font-black text-emerald-400 bg-emerald-500/10 border-l border-emerald-500/30 w-1/3">
                    WCRM Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {comparisons.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">
                      {item.feature}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-500/70 shrink-0" />
                      <span>{item.typical}</span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-foreground bg-emerald-500/5 border-l border-emerald-500/20">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{item.wcrm}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
