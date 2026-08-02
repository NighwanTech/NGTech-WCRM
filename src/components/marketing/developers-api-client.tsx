'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Key,
  Globe,
  ArrowRight,
  Sparkles,
  Server,
  Activity,
  Layers,
  AlertTriangle,
  FileCheck,
  Building2,
  CreditCard,
  Smartphone,
  Award,
  CheckCircle2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export function DevelopersApiClient() {
  const [activeLang, setActiveLang] = useState<'curl' | 'node' | 'python' | 'go'>('node');
  const [activeEndpoint, setActiveEndpoint] = useState<'send' | 'ai'>('send');
  const [copied, setCopied] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const codeSnippets: Record<string, Record<string, string>> = {
    send: {
      curl: `curl -X POST https://api.wacrm.in/v1/messages/send \\
  -H "Authorization: Bearer wacrm_live_99887766" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+919876543210",
    "type": "template",
    "template_name": "payment_reminder_v2",
    "language": "en",
    "components": [
      { "type": "body", "parameters": [{ "type": "text", "text": "₹1,30,000" }] }
    ]
  }'`,
      node: `import { WcrmClient } from '@wacrm/sdk';

const wacrm = new WcrmClient({ apiKey: process.env.WCRM_API_KEY });

const response = await wacrm.messages.send({
  to: '+919876543210',
  type: 'template',
  templateName: 'payment_reminder_v2',
  parameters: { amount: '₹1,30,000' },
});

console.log('Message ID:', response.messageId);`,
      python: `import wacrm

client = wacrm.Client(api_key="wacrm_live_99887766")

response = client.messages.send(
    to="+919876543210",
    template="payment_reminder_v2",
    params={"amount": "₹1,30,000"}
)

print("Status:", response.status)`,
      go: `package main

import (
  "fmt"
  "github.com/wacrm/wacrm-go"
)

func main() {
  client := wacrm.NewClient("wacrm_live_99887766")
  msg, _ := client.Messages.Send(&wacrm.SendParams{
    To: "+919876543210",
    Template: "payment_reminder_v2",
  })
  fmt.Println("Sent:", msg.ID)
}`
    },
    ai: {
      curl: `curl -X POST https://api.wacrm.in/v1/ai/route \\
  -H "Authorization: Bearer wacrm_live_99887766" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Send campus visit prospectus PDF to lead",
    "primary_model": "gemini-3.6-flash",
    "byok_key": "AIzaSyD...",
    "fallback_model": "groq-llama-3.3-70b"
  }'`,
      node: `const aiResponse = await wacrm.ai.route({
  prompt: 'Send campus visit prospectus PDF to lead',
  primaryModel: 'gemini-3.6-flash',
  fallbackModel: 'groq-llama-3.3-70b',
});`,
      python: `response = client.ai.route(
    prompt="Send campus visit prospectus PDF to lead",
    primary_model="gemini-3.6-flash"
)`,
      go: `res, _ := client.AI.Route(&wacrm.AIParams{
  Prompt: "Send campus visit prospectus PDF to lead",
})`
    }
  };

  const currentCode = codeSnippets[activeEndpoint]?.[activeLang] || codeSnippets.send[activeLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metaFaqs = [
    {
      q: 'How long does Meta Business Manager Verification take?',
      a: 'Meta Business Verification typically takes between 24 hours to 3 business days once official documents (GST Certificate, MSME, or Incorporation Certificate) are uploaded to Meta Business Manager.'
    },
    {
      q: 'Can I use an existing WhatsApp Business phone number?',
      a: 'Yes! If the phone number is currently active on the standard WhatsApp or WhatsApp Business mobile app, you can delete the account from the mobile app settings and migrate it directly to the Meta Cloud API.'
    },
    {
      q: 'What are Meta Conversation Charges?',
      a: 'Meta charges per 24-hour conversation window based on the category: Utility Messages, Service Messages, Marketing Messages, and Authentication Messages. WCRM passes Meta rates directly to you with 0% platform markup.'
    },
    {
      q: 'How do I apply for the official WhatsApp Green Tick Verification Badge?',
      a: 'Once your WhatsApp Business Account (WABA) is verified in Meta Business Manager and actively sending messages, WCRM submits a direct Green Tick request to Meta on your behalf.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30 text-left">
      
      {/* ─── 1. HERO HEADER ─── */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-background border-b border-border/40">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Official Meta WhatsApp Cloud API Documentation & Developer Suite
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.06] max-w-4xl mx-auto">
            Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">Official Meta Certified</span> WhatsApp API
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            Complete prerequisites, step-by-step Meta Business verification guide, Green Tick badge application, and interactive REST developer APIs with zero number ban risk.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/free-trial"
              className="flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 text-xs transition-all shadow-lg gap-2"
            >
              Get Started with Meta API <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#verification-guide"
              className="flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 text-xs font-bold text-foreground hover:bg-muted"
            >
              View Verification Steps ↓
            </a>
          </div>
        </div>
      </section>

      {/* ─── 2. SLA TELEMETRY BAR ─── */}
      <section className="py-8 bg-card/40 border-b border-border/50 font-mono text-xs">
        <div className="container mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-background border border-border/80">
            <p className="text-emerald-400 font-extrabold text-xl">&lt; 50ms</p>
            <p className="text-muted-foreground text-[10px]">API LATENCY</p>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-border/80">
            <p className="text-emerald-400 font-extrabold text-xl">99.99%</p>
            <p className="text-muted-foreground text-[10px]">UPTIME SLA</p>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-border/80">
            <p className="text-emerald-400 font-extrabold text-xl">1,000 / sec</p>
            <p className="text-muted-foreground text-[10px]">RATE LIMIT</p>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-border/80">
            <p className="text-emerald-400 font-extrabold text-xl">AES-256</p>
            <p className="text-muted-foreground text-[10px]">ENCRYPTION</p>
          </div>
        </div>
      </section>

      {/* ─── 3. WHY OFFICIAL META API VS UNOFFICIAL BANS ─── */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />
              <h2 className="text-xl font-extrabold text-foreground">Why Use Official Meta Cloud API over Unofficial Bulk Senders?</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unlike unofficial web-automation tools that cause permanent phone number bans, the official Meta Cloud API guarantees <strong className="text-emerald-400">100% deliverability with zero risk of number bans</strong>. It unlocks interactive buttons, list messages, automated multi-agent routing, and eligibility for the official WhatsApp Green Tick Verification Badge.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. META API PREREQUISITES & STEP-BY-STEP VERIFICATION GUIDE ─── */}
      <section id="verification-guide" className="py-20 bg-card/30 border-b border-border/50">
        <div className="container mx-auto max-w-5xl px-4 space-y-16">
          
          {/* Prerequisites */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">Prerequisites & Requirements</span>
              <h2 className="text-3xl font-black text-foreground">What You Need to Get Started</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-background border border-border/80 space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-foreground text-base">1. Verified Meta Business Manager</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your company must be verified in Facebook Business Manager using official legal registration documents (GST Certificate, Certificate of Incorporation, MSME).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-background border border-border/80 space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-foreground text-base">2. Clean Phone Number</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A phone number dedicated to WhatsApp API that is not currently active on WhatsApp personal or Business app (or deleted from the mobile app).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-background border border-border/80 space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-foreground text-base">3. Business Website & Domain</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  An active website matching your legal company name, displaying your business address and privacy policy.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-background border border-border/80 space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-foreground text-base">4. Meta Payment Method</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A credit/debit card connected to your Meta Business Manager to pay Meta for direct conversation charges (Utility vs Marketing messages).
                </p>
              </div>
            </div>
          </div>

          {/* 4-Step Verification Workflow */}
          <div className="space-y-8 pt-8 border-t border-border/50">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">Step-by-Step Onboarding</span>
              <h2 className="text-3xl font-black text-foreground">4 Steps to Connect Meta WhatsApp API</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Submit Documents', desc: 'Upload GST / MSME certificate to Meta Business Manager.' },
                { step: '02', title: 'Create WABA Account', desc: 'Create your WhatsApp Business Account inside Meta portal.' },
                { step: '03', title: 'OTP Verification', desc: 'Add phone number and verify via 6-digit SMS / Voice call OTP.' },
                { step: '04', title: 'Connect to WCRM', desc: 'Plug your System User Token into WCRM for instant automation.' },
              ].map((s, i) => (
                <div key={i} className="p-6 rounded-3xl bg-background border border-border space-y-2">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{s.step}</span>
                  <h3 className="font-extrabold text-foreground text-sm">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Green Tick Badge */}
          <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Official Green Tick Verification Badge</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once your WhatsApp Business Account is verified and sending regular broadcasts, WCRM helps you apply for the official Green Tick verification badge next to your business name on WhatsApp.
            </p>
          </div>

        </div>
      </section>

      {/* ─── 5. INTERACTIVE REST API PLAYGROUND ─── */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2">
                <Code2 className="h-3.5 w-3.5" /> Developer Integration Suite
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">Interactive REST API Playground</h2>
              <p className="text-xs text-muted-foreground">Select an endpoint and language to preview production-ready code.</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-card p-1 rounded-full border border-border">
              {(['node', 'curl', 'python', 'go'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                    activeLang === lang ? 'bg-emerald-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang === 'node' ? 'Node.js' : lang}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Selector Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {[
              { id: 'send', label: 'POST /v1/messages/send', tag: 'Send WhatsApp Template' },
              { id: 'ai', label: 'POST /v1/ai/route', tag: 'BYOK AI Completion' },
            ].map((ep) => (
              <button
                key={ep.id}
                onClick={() => setActiveEndpoint(ep.id as any)}
                className={`px-4 py-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 ${
                  activeEndpoint === ep.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{ep.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{ep.tag}</span>
              </button>
            ))}
          </div>

          {/* Code Window */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 font-mono text-xs text-slate-200 relative shadow-2xl overflow-x-auto">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
            </button>

            <pre className="pt-4 leading-relaxed overflow-x-auto">
              <code>{currentCode}</code>
            </pre>
          </div>

        </div>
      </section>

      {/* ─── 6. REAL-TIME WEBHOOK EVENT PAYLOAD SECTION ─── */}
      <section className="py-20 bg-card/40 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
              Real-Time Webhooks
            </span>
            <h2 className="text-3xl font-black text-foreground">Instant Event Notifications</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Subscribe your application to real-time events (`messages.upsert`, `deal.stage_updated`, `ai.failover_triggered`).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 shadow-2xl">
            <p className="text-slate-400">// Sample Real-Time Webhook Event Payload (POST /webhook)</p>
            <pre className="text-slate-200">
{`{
  "event": "messages.upsert",
  "timestamp": 1785390000,
  "data": {
    "message_id": "wamid.HBgLOTE4OTg1MDI1Nzk0",
    "from": "+918985025794",
    "content": "Send proposal PDF",
    "ai_reply": "Proposal PDF attached! Allocated Account Manager Ramesh.",
    "ai_tokens_used": 0,
    "cache_hit": true
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* ─── 7. META API & VERIFICATION FAQS ─── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-4xl px-4 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
              <HelpCircle className="h-3.5 w-3.5" /> Meta API Verification FAQs
            </div>
            <h2 className="text-3xl font-black text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {metaFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm transition-all group overflow-hidden cursor-pointer"
                open={openFaqIdx === idx}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenFaqIdx(openFaqIdx === idx ? null : idx);
                }}
              >
                <summary className="font-extrabold text-base text-foreground flex items-center justify-between gap-4 list-none group-hover:text-emerald-400 transition-colors">
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openFaqIdx === idx ? 'rotate-180' : ''}`} />
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
