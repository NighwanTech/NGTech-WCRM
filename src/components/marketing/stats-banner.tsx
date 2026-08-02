import React from 'react';
import { TrendingUp, Clock, PiggyBank, ShieldCheck } from 'lucide-react';

export function StripeStatsBanner() {
  const stats = [
    {
      value: '+45%',
      label: 'Lead Conversion Rate',
      sub: 'Real-time AI intent scoring & instant qualification',
      icon: TrendingUp,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      value: '<100ms',
      label: 'Greeting Response Time',
      sub: 'Zero Token Cache for instant customer welcome',
      icon: Clock,
      color: 'text-blue-400',
      badgeBg: 'bg-blue-500/10 border-blue-500/30'
    },
    {
      value: '-60%',
      label: 'AI Token Expense',
      sub: 'Bring Your Own Key (BYOK) with 0% platform markup',
      icon: PiggyBank,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      value: '99.9%',
      label: 'Conversational Uptime',
      sub: 'Self-healing cross-provider auto-failover engine',
      icon: ShieldCheck,
      color: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 border-purple-500/30'
    },
  ];

  return (
    <section className="py-16 bg-slate-950 text-white border-y border-slate-800/80 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-emerald-500/10 blur-[150px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center text-center p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-300 shadow-lg space-y-3 group"
              >
                {/* Icon & Label Header */}
                <div className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border ${stat.badgeBg} backdrop-blur-sm`}>
                  <Icon className={`h-4 w-4 ${stat.color} shrink-0`} />
                  <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
                    {stat.label}
                  </span>
                </div>

                {/* Big Bold Stat Value */}
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>

                {/* Clear Subtext */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xs">
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
