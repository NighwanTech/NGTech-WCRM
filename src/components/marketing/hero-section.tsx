'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Bot,
  MessageSquare,
  Kanban,
  BarChart3,
  Send,
  Mic,
  Building2,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Phone,
  FileText,
  UserCheck,
  ExternalLink
} from 'lucide-react';

export function EnterpriseHeroSection() {
  return (
    <section className="relative overflow-hidden pt-2 pb-16 lg:pt-4 lg:pb-24 bg-background text-foreground">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-150px] w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

          {/* LEFT COLUMN: Hero Narrative & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">

            {/* Top Badges Row - Mobile & Desktop Responsive */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 w-full">
              {/* 1. Parent Company Badge */}
              <a 
                href="https://nighwantech.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Nighwan Technology Pvt. Ltd."
                className="inline-flex items-center gap-3 rounded-full border border-border bg-card/90 hover:bg-emerald-500/5 hover:border-emerald-500/40 backdrop-blur-md px-4 py-2 min-h-[42px] sm:min-h-[40px] text-xs font-semibold text-foreground shadow-sm transition-all duration-200 group"
              >
                <img 
                  src="/nighwan-logo.svg" 
                  alt="Nighwan Technology Logo" 
                  className="h-7 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
                />
                <div className="flex flex-col text-left leading-tight pr-1">
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-muted-foreground">A Product of</span>
                  <span className="text-xs font-black text-foreground tracking-tight flex items-center gap-1">
                    Nighwan Technology Pvt. Ltd.
                    <ExternalLink className="h-3 w-3 text-emerald-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </span>
                </div>
              </a>

              {/* 2. Google Reviews Badge */}
              <a
                href="https://share.google/s1sO2OSQvG5Y5L23E"
                target="_blank"
                rel="noopener noreferrer"
                title="View Google Reviews for Nighwan Technology"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 backdrop-blur-md px-4 py-2 min-h-[42px] sm:min-h-[40px] text-xs font-bold text-foreground transition-all duration-200 shadow-sm hover:scale-[1.01]"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                </svg>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">5.0</span>
                  <div className="flex text-amber-400 text-xs">
                    ★★★★★
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">
                  (230+ Google Reviews)
                </span>
              </a>

              {/* 3. Multi-LLM Engine Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-2 min-h-[42px] sm:min-h-[40px] text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
                <Cpu className="h-4 w-4 text-emerald-500 animate-pulse shrink-0" />
                <span className="text-[11px] sm:text-xs">Multi-LLM Engine: Gemini 3.6 · OpenAI · Claude · Groq · DeepSeek</span>
              </div>
            </div>

            {/* Giant Typography Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem] font-black tracking-tight text-foreground leading-[1.06] text-center lg:text-left">
              India&apos;s AI WhatsApp CRM for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
                Sales, Marketing & Support
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal text-center lg:text-left mx-auto lg:mx-0">
              Manage Sales, Support, Marketing, AI Agents, Voice AI and CRM from one intelligent platform powered by Gemini, OpenAI, Claude, Groq, DeepSeek or your own API keys.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-1 w-full sm:w-auto">
              <Link
                href="/free-trial"
                className="flex h-13 sm:h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-9 text-base transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] gap-2.5"
              >
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/book-demo"
                className="flex h-13 sm:h-14 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-card/60 backdrop-blur-md px-9 text-base font-bold text-foreground transition-all duration-300 hover:bg-emerald-500/10"
              >
                Book Live Demo
              </Link>
            </div>

            {/* Government Recognitions Bar */}
            <div className="pt-2 pb-1 text-center lg:text-left w-full">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Government Recognitions & Funding
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0">
                {/* Startup India Card */}
                <div className="flex items-center justify-center sm:justify-start gap-3 p-2.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm hover:border-orange-500/40 transition-colors">
                  <div className="h-10 w-28 flex items-center justify-center bg-white rounded-xl p-1 shrink-0 border border-slate-200 overflow-hidden">
                    <img
                      src="/startup-india.svg"
                      alt="Startup India - Govt. of India"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Recognised Startup</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Govt. of India</p>
                  </div>
                </div>

                {/* Seed Funded by Govt. of Bihar Card */}
                <div className="flex items-center justify-center sm:justify-start gap-3 p-2.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm hover:border-blue-500/40 transition-colors">
                  <div className="h-10 w-28 flex items-center justify-center bg-white rounded-xl p-1 shrink-0 border border-slate-200 overflow-hidden">
                    <img
                      src="/govt-bihar.svg"
                      alt="Govt. of Bihar - Seed Funded"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Seed Funded Company</p>
                    <p className="text-[11px] text-muted-foreground font-medium">Govt. of Bihar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Checklist */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 7-Day Free Trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Bring Your Own Keys (BYOK)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> 99.9% Uptime SLA
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: Realistic WhatsApp Phone & Live AI Telemetry (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">

            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-blue-500/10 rounded-full blur-3xl -z-10" />

            {/* Floating Top Telemetry Pill */}
            <div className="absolute -top-4 left-0 sm:left-4 z-20 p-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-emerald-500/30 shadow-xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Zap className="h-4 w-4 animate-bounce" />
              </div>
              <div className="text-left text-xs">
                <p className="font-extrabold text-foreground">Zero Token Greeting Cache</p>
                <p className="text-[10px] text-emerald-400 font-mono">100ms Instant Fast Reply · 0 Tokens</p>
              </div>
            </div>

            {/* Realistic Smartphone Mockup Frame */}
            <div className="w-full max-w-[340px] rounded-[40px] border-[8px] border-slate-900 bg-slate-950 p-2 shadow-2xl shadow-emerald-500/15 relative overflow-hidden">

              {/* Phone Speaker Notch */}
              <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* WhatsApp UI Screen */}
              <div className="rounded-[30px] bg-[#0b141a] p-3 text-white text-xs space-y-3 font-sans relative overflow-hidden min-h-[460px] flex flex-col justify-between">

                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      W
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">WCRM AI Assistant</p>
                      <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Online · Gemini 3.6
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Official API
                  </span>
                </div>

                {/* Live Message Thread */}
                <div className="space-y-3 flex-1 overflow-y-auto py-2">

                  {/* Customer Message 1 */}
                  <div className="flex justify-end">
                    <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[80%] space-y-0.5">
                      <p>Hi, looking for course admissions fee structure for B.Tech CSE?</p>
                      <span className="text-[9px] text-emerald-200 float-right pl-2 font-mono">10:42 AM</span>
                    </div>
                  </div>

                  {/* AI Response 1 (Cached Greeting) */}
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] text-white p-2.5 rounded-2xl rounded-tl-none max-w-[85%] space-y-1.5 border border-emerald-500/30">
                      <p className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                        <Bot className="h-3 w-3" /> WCRM AI Auto-Reply
                      </p>
                      <p>Hello! Welcome to BPTPIA. B.Tech CSE fee is ₹65,000/yr. Attached official brochure 📄</p>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-[10px]">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        <div>
                          <p className="font-bold text-white">BTech_Prospectus_2026.pdf</p>
                          <p className="text-[9px] text-slate-400">1.4 MB · Sent</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 float-right font-mono">10:42 AM · 0 Tokens (Cached)</span>
                    </div>
                  </div>

                  {/* Customer Message 2 */}
                  <div className="flex justify-end">
                    <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[80%] space-y-0.5">
                      <p>Can I book a campus visit tomorrow at 2 PM?</p>
                      <span className="text-[9px] text-emerald-200 float-right pl-2 font-mono">10:43 AM</span>
                    </div>
                  </div>

                  {/* AI Response 2 + CRM Lead Stage Update */}
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] text-white p-2.5 rounded-2xl rounded-tl-none max-w-[85%] space-y-1.5 border border-blue-500/30">
                      <p className="font-bold text-blue-400 text-[11px] flex items-center gap-1">
                        <UserCheck className="h-3 w-3" /> AI Intent Scoring: HOT 🔥
                      </p>
                      <p>Campus visit booked for 2 PM tomorrow! Auto-assigned Senior Counselor Ramesh Sharma.</p>
                      <span className="text-[9px] text-slate-400 float-right font-mono">10:43 AM</span>
                    </div>
                  </div>

                </div>

                {/* Input Bar */}
                <div className="bg-[#111b21] p-2 rounded-xl border border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                  <span>Type a message...</span>
                  <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Send className="h-3 w-3" />
                  </div>
                </div>

              </div>

            </div>

            {/* Floating Bottom Telemetry Pill */}
            <div className="absolute -bottom-4 right-0 sm:right-4 z-20 p-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-blue-500/30 shadow-xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Kanban className="h-4 w-4" />
              </div>
              <div className="text-left text-xs">
                <p className="font-extrabold text-foreground">CRM Deal Stage Updated</p>
                <p className="text-[10px] text-blue-400 font-mono">Status: Visit Scheduled (₹1,30,000)</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
