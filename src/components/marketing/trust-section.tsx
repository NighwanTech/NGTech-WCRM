import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  KeyRound, 
  Lock, 
  Users, 
  BarChart2, 
  Clock,
  Sparkles
} from 'lucide-react';

export function EnterpriseTrustSection() {
  const trustIndicators = [
    { title: '99.9% Uptime SLA', desc: 'Enterprise High Availability Infrastructure', icon: Clock, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { title: 'Enterprise Security', desc: 'AES-256 GCM Encrypted Data Pipeline', icon: Lock, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { title: 'AI Powered Platform', desc: 'Multi-LLM Context Intelligence Engine', icon: Sparkles, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { title: 'Multi AI Models', desc: 'Gemini 3.6, OpenAI, Groq, Claude & DeepSeek', icon: Cpu, color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' },
    { title: 'BYOK Supported', desc: 'Bring Your Own Keys with 0% Token Markup', icon: KeyRound, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { title: 'Meta WhatsApp API', desc: 'Official Cloud API Business Solution Partner', icon: CheckCircle2, color: 'text-green-400 border-green-500/30 bg-green-500/10' },
    { title: 'Role Based Access (RBAC)', desc: 'Granular Department & Team Controls', icon: Users, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
    { title: 'Real Time Analytics', desc: 'Live Campaign ROI & Response SLA Telemetry', icon: BarChart2, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
    { title: '24/7 Priority Support', desc: 'Dedicated Solution Engineers & Onboarding', icon: ShieldCheck, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
  ];

  return (
    <section className="py-16 border-y border-border/50 bg-card/40 backdrop-blur-md relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 text-center">
        <div>
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-emerald-500 mb-2">
            Trusted Enterprise Grade Infrastructure
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto">
            Built for Scale, Reliability & Maximum Conversion
          </p>
        </div>

        {/* 3x3 Spacious Grid Layout - Prevents Text Overflow Completely */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl mx-auto text-left">
          {trustIndicators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm flex items-start gap-4 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:-translate-y-0.5 group min-w-0"
              >
                <div className={`p-3 rounded-2xl border ${item.color} shrink-0 mt-0.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-emerald-400 transition-colors break-words">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed break-words">
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
