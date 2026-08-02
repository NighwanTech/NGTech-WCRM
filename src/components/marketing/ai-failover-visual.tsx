import React from 'react';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  RefreshCw, 
  MessageSquare, 
  ShieldCheck 
} from 'lucide-react';

export function AiFailoverVisualSection() {
  const failoverSteps = [
    { title: '1. Customer Message', desc: 'Customer sends question on WhatsApp', icon: MessageSquare, badge: 'Inbound Message', color: 'border-blue-500/30 text-blue-400' },
    { title: '2. Gemini 3.5 Primary', desc: 'Primary AI model processes query', icon: Sparkles, badge: 'Primary Attempt', color: 'border-emerald-500/30 text-emerald-400' },
    { title: '3. API Timeout / Rate Limit', desc: 'Vendor returns 429 quota error or 15s timeout', icon: AlertTriangle, badge: 'Primary Failure', color: 'border-rose-500/30 text-rose-400' },
    { title: '4. Automatically Switch', desc: 'WCRM triggers instant failover router (<1s)', icon: Zap, badge: 'Auto Failover', color: 'border-amber-500/30 text-amber-400' },
    { title: '5. Groq Llama 3.3 Backup', desc: 'Backup model generates response instantly', icon: RefreshCw, badge: 'Backup Engine', color: 'border-purple-500/30 text-purple-400' },
    { title: '6. Response Delivered', desc: 'Customer receives reply with ZERO delay', icon: CheckCircle2, badge: 'Zero Downtime', color: 'border-green-500/30 text-green-400' },
    { title: '7. Admin Notification', desc: 'Instant WhatsApp alert sent to Admin phone', icon: Bell, badge: 'WhatsApp Alert', color: 'border-teal-500/30 text-teal-400' },
    { title: '8. Auto Recovery (Self-Healing)', desc: 'Auto-updates primary settings after 3x fails', icon: ShieldCheck, badge: 'Self Healing', color: 'border-cyan-500/30 text-cyan-400' },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="h-4 w-4" /> Patent-Pending Zero Downtime Engine
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            AI Auto-Failover Visual Pipeline
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Never lose a customer conversation due to LLM rate limits or API downtime. WCRM automatically fails over between Gemini, OpenAI, and Groq seamlessly.
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-blue-500/10 border border-emerald-500/30 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Zero Downtime AI Guarantee</h3>
              <p className="text-xs text-muted-foreground">If Gemini fails, Groq takes over in &lt;1s. Admin receives instant WhatsApp notification.</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow-md shrink-0">
            100% Conversational Uptime
          </span>
        </div>

        {/* 8-Step Interactive Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {failoverSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-card border ${step.color} shadow-md space-y-3 flex flex-col justify-between hover:scale-[1.02] transition-transform group`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-background border border-border">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-background border border-border">
                      {step.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {step.desc}
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
