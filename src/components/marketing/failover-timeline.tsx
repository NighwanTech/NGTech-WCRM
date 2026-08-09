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
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      num: '02',
      title: 'Primary LLM Attempt (Gemini 3.5)',
      desc: 'System attempts primary model. Vendor API returns 429 Rate Limit error or 15s timeout.',
      time: '+120ms',
      status: 'Primary Error (429)',
      icon: AlertTriangle,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    },
    {
      num: '03',
      title: 'Instant Cross-Provider Failover',
      desc: 'WCRM failover router intercepts error and auto-switches to backup model (Groq Llama 3.3).',
      time: '+450ms',
      status: 'Auto Failover Triggered',
      icon: Zap,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      num: '04',
      title: 'Response Delivered to Customer',
      desc: 'Backup model generates structured answer and sends to WhatsApp. Zero customer downtime.',
      time: '+850ms',
      status: 'Zero Downtime Reply',
      icon: CheckCircle2,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      num: '05',
      title: 'Admin WhatsApp Alert & Self-Healing',
      desc: 'Instant WhatsApp notification sent to Admin. After 3 failures, system auto-heals settings.',
      time: '+1200ms',
      status: 'Self-Healing Active',
      icon: Bell,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
  ];

  return (
    <section className="py-12 sm:py-14 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[400px] bg-amber-500/10 blur-[170px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="h-4 w-4" /> Patent-Pending Self-Healing Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            AI Auto-Failover Process Timeline
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            What happens when an AI vendor goes down? WCRM ensures 100% conversational uptime with zero manual intervention.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                
                {/* Time Indicator (Desktop Left) */}
                <div className="hidden sm:block absolute -left-28 top-1 text-right font-mono text-xs font-bold text-slate-500">
                  {step.time}
                </div>

                {/* Node Bullet */}
                <div className="absolute -left-[17px] top-1.5 h-8 w-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-emerald-500 group-hover:text-emerald-400 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>

                {/* Timeline Card */}
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Phase {step.num}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${step.color}`}>
                      {step.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
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
