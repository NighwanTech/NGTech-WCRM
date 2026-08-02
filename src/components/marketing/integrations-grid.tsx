import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Code2, 
  Database, 
  Webhook, 
  ShoppingBag, 
  CreditCard,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

export function IntegrationsGridSection() {
  const integrations = [
    { name: 'Meta WhatsApp Cloud API', tag: 'Official Partner', desc: 'Direct Cloud API connection with zero message latency', status: 'available', icon: '💬' },
    { name: 'Google Gemini 3.6', tag: 'Native LLM', desc: 'BYOK & system default Gemini models', status: 'available', icon: '♊' },
    { name: 'OpenAI GPT-4o & o3', tag: 'Native LLM', desc: 'BYOK support for all OpenAI models', status: 'available', icon: '🤖' },
    { name: 'Anthropic Claude 3.5', tag: 'Native LLM', desc: 'BYOK support for Claude Sonnet & Opus', status: 'available', icon: '🧠' },
    { name: 'Groq (Ultra-Fast Llama)', tag: 'Native LLM', desc: 'Sub-second inference for auto-failover', status: 'available', icon: '⚡' },
    { name: 'DeepSeek R1 / V3', tag: 'Native LLM', desc: 'BYOK support for DeepSeek reasoning AI', status: 'available', icon: '🐳' },
    { name: 'Google Sheets Sync', tag: 'Native App', desc: 'Real-time 2-way lead & contact sync', status: 'available', icon: '📊' },
    { name: 'Real-Time Webhooks', tag: 'Developer API', desc: 'Receive instant webhook notifications for all messages', status: 'available', icon: '🔌' },
    { name: 'REST Developer APIs', tag: 'Developer API', desc: 'Full programmatic access to CRM data & messaging', status: 'available', icon: '⚡' },
    { name: 'Shopify Store App', tag: 'E-Commerce', desc: 'Native 1-click cart recovery & order updates', status: 'coming_soon', icon: '🛍️' },
    { name: 'WooCommerce Plugin', tag: 'E-Commerce', desc: 'Native plugin for order alerts & COD verification', status: 'coming_soon', icon: '📦' },
    { name: 'Razorpay / PayU Links', tag: 'Payments', desc: 'Generate and send in-chat payment links', status: 'coming_soon', icon: '💳' },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Enterprise Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Integrate with Your Tech Stack
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Connect WCRM to your existing AI providers, webhooks, REST APIs, and business systems.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-card border shadow-md space-y-3 flex flex-col justify-between transition-all duration-300 ${
                item.status === 'coming_soon' 
                  ? 'border-amber-500/20 bg-amber-500/5' 
                  : 'border-border/60 hover:border-emerald-500/40 hover:shadow-lg'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  {item.status === 'coming_soon' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-extrabold tracking-wide uppercase">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      {item.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono">
                {item.status === 'coming_soon' ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> In Development
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Production Ready
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Developer API CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Need a custom enterprise integration?</h3>
            <p className="text-xs text-muted-foreground">Our REST APIs and Webhooks allow your engineering team to build custom workflows in minutes.</p>
          </div>
          <Link
            href="/api-docs"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shrink-0"
          >
            Explore Developer API Docs <Code2 className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
