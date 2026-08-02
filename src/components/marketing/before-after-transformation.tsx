import React from 'react';
import { XCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function BeforeAfterTransformationSection() {
  const legacyIssues = [
    { title: 'Slow Manual Support Replies', desc: 'Customer inquiries wait hours for manual replies, leading to lost sales and poor CSAT.' },
    { title: 'Fragmented Personal Phones', desc: 'Leads scattered across team phones with zero manager visibility or SLA tracking.' },
    { title: '3x AI Vendor Token Markups', desc: 'Platforms charge heavy markups per AI response, creating bloated monthly bills.' },
    { title: 'Single Bot Point of Failure', desc: 'When the primary AI provider rate limits or crashes, your bot stops responding.' },
    { title: 'Unqualified Lead Chaos', desc: 'Sales reps waste hours talking to cold inquiries instead of closing hot deals.' },
  ];

  const wcrmSolutions = [
    { title: '<100ms Instant Fast Replies', desc: 'Zero Token Greeting Cache intercepts "Hi" and "Thanks" instantly with 0 AI token cost.' },
    { title: 'Centralized Multi-Agent Inbox', desc: 'Assign chats, add private internal notes, and monitor team response SLA telemetry.' },
    { title: 'Bring Your Own Key (BYOK)', desc: 'Plug in your own Gemini, OpenAI, or Groq keys with zero platform token markups.' },
    { title: 'Zero Downtime Auto-Failover', desc: 'Auto-switches to backup provider in <1s on error and notifies Admin on WhatsApp.' },
    { title: 'Automated AI Lead Scoring', desc: 'AI scores incoming lead intent (HOT 🔥) and auto-assigns senior sales counselors.' },
  ];

  return (
    <section className="py-24 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Business Transformation
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Before vs. After WCRM
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            See how switching to WCRM transforms chaotic messaging into an automated, high-revenue customer engagement engine.
          </p>
        </div>

        {/* Split Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT: Legacy / Before Column */}
          <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/30 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
              <h3 className="text-xl font-extrabold text-rose-500 flex items-center gap-2">
                <XCircle className="h-6 w-6 shrink-0" /> Before WCRM (Legacy Tools)
              </h3>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-bold">
                High Overhead
              </span>
            </div>

            <div className="space-y-4">
              {legacyIssues.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: WCRM / After Column */}
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 space-y-6 text-left relative">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4">
              <h3 className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 shrink-0" /> After WCRM (Intelligent Platform)
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                High ROI Engine
              </span>
            </div>

            <div className="space-y-4">
              {wcrmSolutions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/free-trial"
                className="flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg gap-2 w-full"
              >
                Transform Your Customer Engagement Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
