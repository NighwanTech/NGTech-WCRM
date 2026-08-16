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

export function IntegrationOrbitSection() {
  const integrations = [
    { name: 'Meta WhatsApp Cloud API', tag: 'Official Partner', desc: 'Direct Meta Cloud API connection with zero latency', icon: '💬', status: 'ready' },
    { name: 'Meta Ads Manager Pro', tag: 'Graph API', desc: 'Direct ad campaign launcher, creative AI & instant forms', icon: '📢', status: 'ready' },
    { name: 'Google Gemini 3.6', tag: 'Native LLM', desc: 'BYOK & system default Gemini models with 0% markup', icon: '♊', status: 'ready' },
    { name: 'OpenAI GPT-4o & o3', tag: 'Native LLM', desc: 'BYOK support for all OpenAI models with 0% markup', icon: '🤖', status: 'ready' },
    { name: 'Anthropic Claude 3.5', tag: 'Native LLM', desc: 'BYOK support for Claude Sonnet & Opus', icon: '🧠', status: 'ready' },
    { name: 'Groq (Llama 3.3 70B)', tag: 'Native LLM', desc: 'Sub-second inference for auto-failover engine', icon: '⚡', status: 'ready' },
    { name: 'Retell & ElevenLabs Voice', tag: 'Voice AI', desc: 'Native Hindi/English conversational voice calling & CRM sync', icon: '📞', status: 'ready' },
    { name: 'Razorpay UPI & 18% GST', tag: 'Finance & Invoicing', desc: 'Statutory 18% GST invoices & 1-click WhatsApp payment links', icon: '💳', status: 'ready' },
    { name: 'Google Sheets 2-Way Sync', tag: 'Native App', desc: 'Real-time 2-way lead, deals & contact sync', icon: '📊', status: 'ready' },
    { name: 'Real-Time Webhooks & SDKs', tag: 'Developer API', desc: 'Sub-50ms event webhooks and Node/Python REST APIs', icon: '🔌', status: 'ready' },
    { name: 'CRM Migration (HubSpot/Zoho)', tag: '1-Click Importer', desc: 'Instant pipeline, custom properties & contact importer', icon: '🔄', status: 'ready' },
    { name: 'Shopify Store App', tag: 'E-Commerce', desc: 'Native 1-click cart recovery & order updates', icon: '🛍️', status: 'coming_soon' },
  ];

  return (
    <section className="py-16 sm:py-20 bg-card/40 border-y border-border/50 relative overflow-hidden text-center">
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[170px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="h-4 w-4" /> Connected SaaS Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
            Connect Your Stack with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              Zero Friction.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Connect your favorite AI engines, official Meta APIs, payment gateways, and developer tools into one unified platform.
          </p>
        </div>

        {/* Orbit Central Core + Surrounding Nodes */}
        <div className="relative max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-background border border-border/80 shadow-2xl space-y-8">
          
          {/* Central Logo Node */}
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 shadow-xl shadow-emerald-500/10 space-x-3 mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
              AI
            </div>
            <div className="text-left">
              <p className="font-black text-foreground text-base">AIWCRM Platform Core</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Central Messaging, Finance & AI Gateway</p>
            </div>
          </div>

          {/* Connected Integration Satellites Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {integrations.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-card border shadow-xs space-y-2 transition-all ${
                  item.status === 'coming_soon'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-border/60 hover:border-emerald-500/40 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  {item.status === 'coming_soon' ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold uppercase tracking-wide border border-amber-500/30">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                      {item.tag}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-foreground">{item.name}</h4>
                <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
