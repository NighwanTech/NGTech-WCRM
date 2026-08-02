'use client';

import React from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export function SeoGeoFaqSection() {
  const faqs = [
    {
      q: 'What is WCRM and why is it called an AI-Powered WhatsApp CRM?',
      a: 'WCRM is an enterprise-grade AI-powered WhatsApp CRM platform that combines Meta Official WhatsApp Business API messaging with multi-LLM AI engines (Google Gemini 3.6, OpenAI GPT-4o, Anthropic Claude 3.5, Groq, DeepSeek) and visual Kanban deal pipelines. It empowers sales, support, and marketing teams to automate lead qualification, customer support, and voice calls from one unified workspace.'
    },
    {
      q: 'How does Bring Your Own Key (BYOK) benefit my business?',
      a: 'Bring Your Own Key (BYOK) allows you to plug your existing OpenAI, Gemini, Claude, Groq, or DeepSeek API keys directly into WCRM. Unlike competitor platforms that add heavy markups per AI response, WCRM charges 0% platform token markup, giving you direct billing with AI providers and reducing monthly AI costs by up to 60%.'
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
      q: 'Can WCRM handle multi-agent customer support and team inbox routing?',
      a: 'Yes! WCRM features a full Shared Team Inbox supporting unlimited live support agents. It includes automated department routing, contact assignment, internal team notes, conversation status tracking (Open, Closed, Pending), and SLA response telemetry.'
    },
    {
      q: 'Is WCRM an official Meta WhatsApp Business API partner platform?',
      a: 'Yes. WCRM integrates directly with Meta Cloud API, enabling official WhatsApp green tick verification, Meta-approved message template broadcasting, interactive button menus, and high-deliverability marketing campaigns without third-party proxy markups.'
    },
    {
      q: 'Does WCRM support Retell AI Voice Call Agents?',
      a: 'Yes! WCRM natively integrates with Retell AI to deploy intelligent AI voice agents that handle inbound phone calls and execute automated outbound follow-up calls, logging call transcripts and lead status directly into your WCRM sales pipeline.'
    }
  ];

  return (
    <section className="py-24 bg-background border-t border-border/50 relative">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Everything You Need to Know About WCRM
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear, authoritative answers optimized for search engines and AI assistants.
          </p>
        </div>

        {/* Q&A Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm transition-all group overflow-hidden cursor-pointer"
            >
              <summary className="font-extrabold text-base text-foreground flex items-center justify-between gap-4 list-none group-hover:text-emerald-400 transition-colors">
                <span>{faq.q}</span>
                <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
}
