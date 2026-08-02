import React from 'react';
import { TrendingUp, Clock, PiggyBank, HeartHandshake, DollarSign, Sparkles } from 'lucide-react';

export function OutcomesSection() {
  const outcomes = [
    { metric: '+45%', label: 'Increase in Lead Conversion', desc: 'Real-time AI lead qualification ensures zero missed leads.', icon: TrendingUp, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { metric: '-85%', label: 'Reduce Customer Response Time', desc: 'Instant AI auto-replies and 0-token greeting cache.', icon: Clock, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { metric: '-60%', label: 'Reduce AI Token Costs', desc: 'Achieved through BYOK pricing and 0-token greeting cache.', icon: PiggyBank, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { metric: '98%', label: 'Customer Satisfaction (CSAT)', desc: 'Fast, accurate brand replies 24 hours a day, 7 days a week.', icon: HeartHandshake, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { metric: '3.5x', label: 'Sales Pipeline Growth', desc: 'Multi-stage deal tracking and automated follow-up sequences.', icon: DollarSign, color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' },
  ];

  return (
    <section className="py-24 bg-card/40 border-y border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Proven Enterprise Impact
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Measurable Business Outcomes
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            See how high-growth businesses achieve higher ROI, faster response times, and lower operational overhead with WCRM.
          </p>
        </div>

        {/* 5 Outcomes Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-card border border-border/70 shadow-lg space-y-4 flex flex-col justify-between text-center hover:scale-[1.03] transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className={`p-3.5 rounded-2xl border ${item.color} w-fit mx-auto`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-4xl font-black text-foreground tracking-tight group-hover:text-emerald-400 transition-colors">
                    {item.metric}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
