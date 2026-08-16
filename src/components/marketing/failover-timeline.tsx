import React from 'react';
import { 
  Zap, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  RefreshCw, 
  MessageSquare, 
  ShieldCheck,
  Clock
} from 'lucide-react';

export function FailoverTimelineSection() {
  const steps = [
    {
      num: '01',
      title: 'Customer Inquiry Received',
      desc: 'Customer sends a high-intent pricing or support question on WhatsApp Business API.',
      time: '0ms',
      status: 'Inbound Message',
      icon: MessageSquare,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
    },
    {
      num: '02',
      title: 'Primary LLM Attempt (Gemini 3.6)',
      desc: 'System attempts primary model. Vendor API returns 429 Rate Limit error or 15s timeout.',
      time: '+120ms',
      status: 'Primary Error (429)',
      icon: AlertTriangle,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
    },
    {
      num: '03',
      title: 'Instant Cross-Provider Failover',
      desc: 'AIWCRM failover router intercepts error and auto-switches to backup model (Groq Llama 3.3).',
      time: '+450ms',
      status: 'Auto Failover Triggered',
      icon: Zap,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
    },
    {
      num: '04',
      title: 'Response Delivered to Customer',
      desc: 'Backup model generates structured answer and sends to WhatsApp. Zero customer downtime.',
      time: '+850ms',
      status: 'Zero Downtime Reply',
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    },
    {
      num: '05',
      title: 'Admin WhatsApp Alert & Self-Healing',
      desc: 'Instant WhatsApp notification sent to Admin. After 3 failures, system auto-heals settings.',
      time: '+1200ms',
      status: 'Self-Healing Active',
      icon: Bell,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[400px] bg-amber-500/10 blur-[170px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="h-4 w-4" /> Patent-Pending Self-Healing Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
            Sub-1s Self-Healing{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-500">
              AI Failover Engine.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            What happens when an AI vendor goes down? AIWCRM automatically switches models in under 1 second to ensure 100% conversation continuity.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-border ml-4 sm:ml-32 space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                
                {/* Time Indicator (Desktop Left) */}
                <div className="hidden sm:block absolute -left-28 top-1 text-right font-mono text-xs font-bold text-muted-foreground">
                  {step.time}
                </div>

                {/* Node Bullet */}
                <div className="absolute -left-[17px] top-1.5 h-8 w-8 rounded-full bg-card border-2 border-border flex items-center justify-center text-foreground group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors shadow-xs">
                  <Icon className="h-4 w-4" />
                </div>

                {/* Timeline Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xs space-y-2 hover:border-primary/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Phase {step.num}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${step.color}`}>
                      {step.status}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
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
