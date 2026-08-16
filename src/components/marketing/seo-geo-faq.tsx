'use client';

import React from 'react';
import { HelpCircle, ChevronDown, Sparkles, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export function SeoGeoFaqSection() {
  const faqs = [
    {
      q: 'What is AIWCRM and why is it called an AI-Powered WhatsApp CRM?',
      a: 'AIWCRM is an enterprise-grade AI-powered WhatsApp CRM platform that combines Meta Official WhatsApp Business API messaging with multi-LLM AI engines (Google Gemini 3.6, OpenAI GPT-4o, Anthropic Claude 3.5, Groq, DeepSeek) and visual Kanban deal pipelines. It empowers sales, support, and marketing teams to automate lead qualification, customer support, and voice calls from one unified workspace.'
    },
    {
      q: 'How does Bring Your Own Key (BYOK) benefit my business?',
      a: 'Bring Your Own Key (BYOK) allows you to plug your existing OpenAI, Gemini, Claude, Groq, or DeepSeek API keys directly into AIWCRM. Unlike competitor platforms that add heavy markups per AI response, AIWCRM charges 0% platform token markup, giving you direct billing with AI providers and reducing monthly AI costs by up to 60%.'
    },
    {
      q: 'How does Zero Downtime AI Auto-Failover protect customer conversations?',
      a: 'AI Auto-Failover automatically switches customer conversations to a secondary backup AI model (e.g. from Gemini 3.5 to Groq Llama 3.3 or Gemini 3.6) in <1 second if the primary model encounters a rate limit (429 error), 15s API timeout, or provider downtime. Your customer receives a seamless reply without delay, and an instant WhatsApp alert is sent to your admin.'
    },
    {
      q: 'What is the Zero Token Greeting Cache?',
      a: 'The Zero Token Greeting Cache is an intelligent fast-reply engine that intercepts common conversational greetings (such as "Hi", "Hello", "Namaste", "Good Morning", "Thanks", "Ok") and responds instantly with your custom brand welcome message. It uses 0 AI tokens and delivers <100ms response times, saving thousands of API tokens every month.'
    },
    {
      q: 'Can AIWCRM handle multi-agent customer support and team inbox routing?',
      a: 'Yes! AIWCRM features a full Shared Team Inbox supporting unlimited live support agents. It includes automated department routing, contact assignment, internal team notes, conversation status tracking (Open, Closed, Pending), and SLA response telemetry.'
    },
    {
      q: 'Is AIWCRM an official Meta WhatsApp Business API partner platform?',
      a: 'Yes. AIWCRM integrates directly with Meta Cloud API, enabling official WhatsApp green tick verification, Meta-approved message template broadcasting, interactive button menus, and high-deliverability marketing campaigns without third-party proxy markups.'
    },
    {
      q: 'Does AIWCRM support AI Voice Call Agents?',
      a: 'Yes! AIWCRM features a Multi-Provider Voice AI Platform supporting both Retell AI and ElevenLabs. You can deploy intelligent AI voice agents in English and native Hindi (Priya, Arjun voices) for automated inbound call answering and outbound follow-up calls. Every call automatically extracts CRM intelligence — sentiment, buying signals, lead score, and action items — and syncs directly into your Contacts, Deals, and Tasks.'
    }
  ];

  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border/50 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Side-by-Side 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT COLUMN: FAQ Accordions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left flex flex-col justify-between">
            
            {/* Header */}
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="h-3.5 w-3.5 text-emerald-500" /> Frequently Asked Questions
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
                Everything You Need to Know About{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
                  AIWCRM.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Clear, authoritative answers optimized for search engines and AI assistants.
              </p>
            </div>

            {/* Q&A Accordion List */}
            <div className="space-y-3 pt-1">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-sm transition-all group overflow-hidden cursor-pointer"
                >
                  <summary className="font-extrabold text-xs sm:text-sm text-foreground flex items-center justify-between gap-3 list-none group-hover:text-emerald-500 transition-colors">
                    <span>{faq.q}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3 font-normal">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: Conversion CTA Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-3xl bg-slate-950 text-white p-7 sm:p-9 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full space-y-6">
              
              {/* Radial glow spotlight */}
              <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-emerald-500/20 blur-[130px] pointer-events-none" />

              <div className="space-y-5 relative z-10 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" /> Deploy Enterprise AI Today
                </div>

                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  Ready to Transform Your Sales & Customer Operations?
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join thousands of forward-thinking enterprises using AIWCRM to automate support, qualify leads via Voice AI, and scale Meta Ads ROI with 0% token markup.
                </p>

                <div className="space-y-2 pt-2 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>10-Minute Instant Setup & Onboarding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Bring Your Own Key (BYOK) — 0% Token Markup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Dedicated Enterprise Solution Engineer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>AES-256 Vault Encryption & DPDP Compliance</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 relative z-10">
                <Link
                  href="/free-trial"
                  className="flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-6 text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] w-full gap-2"
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                
                <Link
                  href="/book-demo"
                  className="flex h-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all w-full"
                >
                  Book Enterprise Demo
                </Link>

                <p className="text-[10px] text-center text-slate-400 font-mono pt-1">
                  ★ No credit card required · Instant Activation
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
