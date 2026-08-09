import React from 'react';
import Link from 'next/link';
import { ArrowRight, Cpu, Sparkles, Zap, KeyRound, ShieldCheck, CheckCircle2, Bot, RefreshCw, MessageSquareText } from 'lucide-react';
import { EnterpriseAiEngineSection } from '@/components/marketing/enterprise-ai-engine';
import { AiFailoverVisualSection } from '@/components/marketing/ai-failover-visual';

export const metadata = {
  title: "Multi-Model AI Platform, Meta Ads Engine & Auto-Failover | AIWCRM",
  description: "Deploy Gemini 3.6, OpenAI, Claude, Groq & DeepSeek with BYOK pricing, zero downtime auto-failover, AI Meta Ads Creation, and 0-token greeting cache. India's most advanced WhatsApp AI platform.",
  keywords: [
    "AIWCRM AI Platform",
    "AI Meta Ads WhatsApp",
    "Multi-Model AI Router",
    "BYOK AI WhatsApp CRM",
    "AI Auto-Failover WhatsApp",
    "Gemini 3.6 WhatsApp Integration",
    "Zero Token Greeting Cache",
    "Enterprise AI WhatsApp India",
    "LLM AI Optimization AIO"
  ],
  openGraph: {
    title: "Multi-Model AI Platform, Meta Ads Engine & Auto-Failover | AIWCRM",
    description: "AI Meta Ads Creation, BYOK Multi-LLM AI with auto-failover and 0-token greeting cache. India's leading AI WhatsApp CRM.",
    url: 'https://www.aiwcrm.com/ai-platform',
    siteName: 'AIWCRM',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function AiPlatformPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-card/60 to-background border-b border-border/50 text-center relative overflow-hidden">
        <div className="container mx-auto max-w-5xl px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="h-4 w-4" /> Next-Generation AI Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Multi-LLM AI Platform with BYOK & Zero Downtime Auto-Failover
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Eliminate AI vendor lock-in and high platform markups. Run Google Gemini 3.6, OpenAI GPT-4o, Claude, Groq, or DeepSeek with complete cost control and self-healing reliability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/free-trial"
              className="flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 text-sm transition-all shadow-lg gap-2"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/book-demo"
              className="flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 text-sm font-bold text-foreground hover:bg-muted"
            >
              Book Technical Demo
            </Link>
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Bring Your Own Key (BYOK)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use your existing API keys from OpenAI, Google, Anthropic, or Groq. Pay vendors directly with zero platform markup on AI token consumption.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Zero Downtime Auto-Failover</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If your primary model times out or rate limits, WCRM automatically switches to a backup model in &lt;1s and alerts the admin via WhatsApp.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
            <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 w-fit">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Zero Token Greeting Cache</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Responds to "Hi", "Hello", and "Thanks" instantly using custom 0-token brand welcome messages, cutting monthly AI API costs by up to 60%.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise AI Engine Component */}
      <EnterpriseAiEngineSection />

      {/* AI Failover Visual Component */}
      <AiFailoverVisualSection />
    </div>
  );
}
