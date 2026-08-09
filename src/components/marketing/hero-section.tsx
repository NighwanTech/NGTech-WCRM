'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Phone,
  Megaphone,
  Kanban,
  Bot,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Settings,
  TrendingUp,
  Users,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export function EnterpriseHeroSection() {
  return (
    <section className="relative overflow-hidden pt-4 pb-16 lg:pt-6 lg:pb-20 bg-background text-foreground font-sans">
      
      {/* Background Ambient Spotlights with Pulse Motion */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-emerald-500/15 via-purple-500/15 to-blue-500/15 blur-[170px] rounded-full pointer-events-none -z-10 animate-signal-pulse" />
      <div className="absolute top-[25%] right-[-120px] w-[500px] h-[500px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Narrative, Checklist, CTAs & Accreditations (6 / 12 Cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full">
              
              {/* 1. Parent Company White Badge */}
              <a
                href="https://nighwantech.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Visit Nighwan Technology Pvt. Ltd."
                className="inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-white dark:bg-slate-900 px-3.5 py-1.5 shadow-sm hover:border-emerald-500/40 hover:scale-[1.02] transition-all group"
              >
                <img 
                  src="/nighwan-logo.svg" 
                  alt="NG Technology Logo" 
                  className="h-6 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400">A PRODUCT OF</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
                    Nighwan Technology Pvt. Ltd.
                  </span>
                </div>
              </a>

              {/* 2. Google Reviews Rating Badge */}
              <a
                href="https://share.google/s1sO2OSQvG5Y5L23E"
                target="_blank"
                rel="noopener noreferrer"
                title="View Google Reviews for Nighwan Technology"
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-foreground shadow-sm hover:bg-amber-500/20 hover:scale-[1.02] transition-all"
              >
                <svg className="h-4 w-4 shrink-0 animate-bounce" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                </svg>
                <span className="font-black text-amber-600 dark:text-amber-400">5.0</span>
                <span className="text-amber-400 text-xs tracking-tighter">★★★★★</span>
                <span className="text-[11px] text-muted-foreground font-medium">(230+ Google Reviews)</span>
              </a>

            </div>

            {/* Sub-badge: Multi-LLM Engine */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>Multi-LLM Engine: Gemini 3.6 • OpenAI • Claude • Groq • DeepSeek</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] font-black tracking-tight text-foreground leading-[1.1]">
                India&apos;s Most Powerful
              </h1>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-purple-500 to-indigo-600">
                AI Business Operating System
              </div>
            </div>

            {/* Pill Tags: CRM • WhatsApp • AI Agents... */}
            <div className="space-y-1 text-xs sm:text-sm font-extrabold text-foreground tracking-tight text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-slate-800 dark:text-slate-200">
                <span className="text-emerald-600 dark:text-emerald-400 font-black">CRM</span> • 
                <span className="text-teal-600 dark:text-teal-400 font-black">WhatsApp</span> • 
                <span className="text-purple-600 dark:text-purple-400 font-black">AI Agents</span> • 
                <span className="text-blue-600 dark:text-blue-400 font-black">Meta Ads</span> • 
                <span className="text-indigo-600 dark:text-indigo-400 font-black">AI Calling</span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
                <span>Sales</span> • <span>Marketing</span> • <span>Support</span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-muted-foreground font-medium text-center lg:text-left">
              Run your complete business from one AI-powered platform.
            </p>

            {/* 2-Column Green Checkmark Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-bold text-foreground text-left max-w-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>WhatsApp CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>AI Voice Calling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Team Management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Meta Lead Automation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Marketing Automation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Sales Pipeline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Billing & Reports</span>
              </div>
            </div>

            {/* Powered By Line */}
            <p className="text-xs text-muted-foreground font-medium pt-1 text-center lg:text-left">
              Powered by <span className="font-bold text-blue-500">Gemini</span>, <span className="font-bold text-emerald-500">OpenAI</span>, <span className="font-bold text-amber-500">Claude</span>, <span className="font-bold text-rose-500">Groq</span> and <span className="font-bold text-indigo-500">DeepSeek</span>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href="/free-trial"
                className="flex h-12 items-center justify-center rounded-2xl bg-[#00b060] hover:bg-[#009b54] text-white font-extrabold px-8 text-sm transition-all duration-300 shadow-lg shadow-[#00b060]/20 hover:scale-[1.03] gap-2 group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/book-demo"
                className="flex h-12 items-center justify-center rounded-2xl border border-border/90 bg-card hover:bg-muted text-foreground text-sm font-bold px-8 transition-all shadow-sm hover:scale-[1.02]"
              >
                Book Live Demo
              </Link>
            </div>

            {/* Government Recognitions & Funding Block */}
            <div className="pt-3 w-full text-center lg:text-left space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                GOVERNMENT RECOGNITIONS & FUNDING
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                
                {/* Startup India */}
                <div className="flex items-center gap-3 p-2.5 rounded-2xl border border-border/80 bg-card/80 shadow-sm hover:border-amber-500/40 hover:scale-[1.02] transition-all text-left">
                  <div className="h-10 w-24 bg-white rounded-xl p-1 shrink-0 border border-slate-200 flex items-center justify-center shadow-sm">
                    <img 
                      src="/startup-india.svg" 
                      alt="Startup India - DPIIT" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-foreground leading-snug">Recognised Startup</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Govt. of India</p>
                  </div>
                </div>

                {/* Govt of Bihar */}
                <div className="flex items-center gap-3 p-2.5 rounded-2xl border border-border/80 bg-card/80 shadow-sm hover:border-blue-500/40 hover:scale-[1.02] transition-all text-left">
                  <div className="h-10 w-24 bg-white rounded-xl p-1 shrink-0 border border-slate-200 flex items-center justify-center shadow-sm">
                    <img 
                      src="/govt-bihar.svg" 
                      alt="Govt. of Bihar - Startup Bihar" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-foreground leading-snug">Seed Funded Company</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Govt. of Bihar</p>
                  </div>
                </div>

              </div>
            </div>

          </div>


          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Crystal Clear Hub-and-Spoke Ecosystem (ZERO OVERLAPS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center mt-6 lg:mt-0 space-y-4">
            
            {/* Top Pill Tag */}
            <div>
              <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 hover:scale-105 transition-transform">
                <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-spin-slow" />
                All-in-One AI Business Platform
              </span>
            </div>

            {/* 3-Row Responsive Flex Canvas Container */}
            <div className="relative w-full max-w-[580px] p-2 sm:p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 sm:space-y-6 overflow-hidden">

              {/* Dynamic Animated Flowing SVG Rays */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                {/* Flowing animated signal lines */}
                <line x1="50" y1="50" x2="20" y2="18" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" className="animate-flow-dash" />
                <circle cx="20" cy="18" r="1.5" fill="#3b82f6" className="animate-ping" />

                <line x1="50" y1="50" x2="80" y2="18" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" className="animate-flow-dash" />
                <circle cx="80" cy="18" r="1.5" fill="#3b82f6" className="animate-ping" />

                <line x1="50" y1="50" x2="18" y2="50" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" className="animate-flow-dash" />
                <circle cx="18" cy="50" r="1.5" fill="#a855f7" />

                <line x1="50" y1="50" x2="82" y2="50" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" className="animate-flow-dash" />
                <circle cx="82" cy="50" r="1.5" fill="#f59e0b" />

                <line x1="50" y1="50" x2="20" y2="82" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" className="animate-flow-dash" />
                <circle cx="20" cy="82" r="1.5" fill="#10b981" />

                <line x1="50" y1="50" x2="80" y2="82" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" className="animate-flow-dash" />
                <circle cx="80" cy="82" r="1.5" fill="#3b82f6" />
              </svg>

              {/* ROW 1: TOP SPOKE CARDS (AI Calling + Meta Ads) */}
              <div className="flex items-center justify-between gap-3 relative z-10">
                {/* SPOKE 1: AI Calling */}
                <div className="w-[47%] p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-1 group">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="leading-none text-xs font-extrabold truncate">AI Calling</p>
                      <p className="text-[10px] text-muted-foreground truncate">Calls Today</p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-base sm:text-lg font-black text-foreground">156</span>
                    <span className="text-[10px] font-bold text-emerald-500">↑ 42%</span>
                  </div>
                  {/* Status Dots */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  </div>
                </div>

                {/* SPOKE 2: Meta Ads */}
                <div className="w-[47%] p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-1 group">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Megaphone className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="leading-none text-xs font-extrabold truncate">Meta Ads</p>
                      <p className="text-[10px] text-muted-foreground truncate">Leads Today</p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-base sm:text-lg font-black text-foreground">84</span>
                    <span className="text-[10px] text-slate-500 font-medium">Cost/Lead: <strong className="text-foreground">₹36</strong></span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="h-2.5 w-full bg-blue-500/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-[65%] bg-blue-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>


              {/* ROW 2: MIDDLE ROW (Sales CRM + CRYSTAL CLEAR CENTER HUB + AI Agent) */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 relative z-10">
                {/* SPOKE 3: Sales CRM */}
                <div className="w-[33%] p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-0.5 group">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <div className="p-1 rounded-lg bg-purple-500/10 text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Kanban className="h-3.5 w-3.5" />
                    </div>
                    <p className="leading-none text-[11px] sm:text-xs font-extrabold truncate">Sales CRM</p>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground pt-1 truncate">Pipeline Value</p>
                  <p className="text-sm sm:text-base font-black text-foreground">₹1.8 Cr</p>
                </div>

                {/* CENTER HUB: 100% CRYSTAL CLEAR HIGH-CONTRAST AI WCRM CIRCLE */}
                <div className="shrink-0 z-30 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-3 sm:p-3.5 flex items-center justify-center relative hover:scale-110 transition-transform group ring-4 ring-blue-500/20">
                  
                  {/* Subtle Clean Outer Halo (Strictly Behind Card Body) */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 blur-md -z-10" />

                  {/* Sharp High-Res Logo */}
                  <img 
                    src="/logo.svg" 
                    alt="AI WCRM" 
                    className="h-9 sm:h-11 w-auto object-contain drop-shadow-sm transition-transform group-hover:scale-105" 
                  />
                </div>

                {/* SPOKE 4: AI Agent */}
                <div className="w-[33%] p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-0.5 group">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="leading-none text-[11px] sm:text-xs font-extrabold truncate">AI Agent</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">Agents Working</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm sm:text-base font-black text-foreground">24×7</span>
                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Online
                    </span>
                  </div>
                </div>
              </div>


              {/* FLOATING ACTIVE AGENTS BADGE */}
              <div className="w-fit mx-auto z-20 px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-2.5 hover:scale-105 transition-transform animate-float-hero">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img className="inline-block h-5 w-5 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Agent" />
                  <img className="inline-block h-5 w-5 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Agent" />
                  <img className="inline-block h-5 w-5 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Agent" />
                  <img className="inline-block h-5 w-5 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Agent" />
                  <span className="inline-flex h-5 w-5 rounded-full bg-slate-100 text-[8px] font-bold text-slate-700 items-center justify-center ring-2 ring-white">+12</span>
                </div>
                <div className="text-left leading-none">
                  <p className="text-[10px] font-extrabold text-foreground">AI Agents Active</p>
                  <p className="text-[8px] text-muted-foreground font-medium pt-0.5">Handling 1,240+ Conversations</p>
                </div>
              </div>


              {/* ROW 3: BOTTOM SPOKE CARDS (WhatsApp CRM + Analytics) */}
              <div className="flex items-center justify-between gap-3 relative z-10">
                {/* SPOKE 5: WhatsApp CRM */}
                <div className="w-[47%] p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-1 group">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="leading-none text-xs font-extrabold truncate">WhatsApp CRM</p>
                      <p className="text-[10px] text-muted-foreground truncate">Messages</p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between pt-0.5">
                    <span className="text-base sm:text-lg font-black text-foreground">1,240</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground font-medium">Auto Replies</span>
                    <span className="font-bold text-emerald-500">↑ 98%</span>
                  </div>
                </div>

                {/* SPOKE 6: Analytics */}
                <div className="w-[47%] p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-1 group">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="leading-none text-xs font-extrabold truncate">Analytics</p>
                      <p className="text-[10px] text-muted-foreground truncate">Revenue</p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between pt-0.5">
                    <span className="text-base sm:text-lg font-black text-foreground">₹12.4 Cr</span>
                    <span className="text-[10px] font-bold text-blue-500">↑ 28%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom 5 Features Pill Bar (Clean 1-Row Desktop Container with Perfect Spacing) */}
            <div className="w-full max-w-[580px] p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 text-[11px] font-bold text-foreground">
              <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                <Settings className="h-3.5 w-3.5 text-blue-500" />
                <span>Smart Automation</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                <span>Real-time Analytics</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 hover:text-purple-500 transition-colors">
                <Users className="h-3.5 w-3.5 text-purple-500" />
                <span>Team Collaboration</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 hover:text-orange-500 transition-colors">
                <UserCheck className="h-3.5 w-3.5 text-orange-500" />
                <span>Role & Permission</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Secure & Compliant</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
