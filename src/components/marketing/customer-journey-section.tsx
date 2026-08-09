'use client';

import React, { useState } from 'react';
import { 
  Target, 
  PhoneCall, 
  Kanban, 
  FileText, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export function CustomerJourneySection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Meta Ad Lead Capture',
      subtitle: '<2s WhatsApp Webhook Trigger',
      icon: Target,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/30',
      tag: 'LEAD GENERATION',
      detail: 'Customer submits a Facebook or Instagram Instant Lead Form. AIWCRM receives the Meta webhook in 100ms and sends a personalized WhatsApp greeting with course brochure PDF in under 2 seconds.'
    },
    {
      num: '02',
      title: 'Voice AI Phone Qualification',
      subtitle: 'Retell + ElevenLabs with Hindi',
      icon: PhoneCall,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      tag: 'VOICE AGENT',
      detail: 'AI Voice Agent places an outbound callback in Hindi/Hinglish to verify student marks, budget, and preferred campus visit date with human-like conversation.'
    },
    {
      num: '03',
      title: 'Kanban Stage & Intelligence',
      subtitle: '10 Structured CRM Fields Synced',
      icon: Kanban,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      tag: 'CRM INTELLIGENCE',
      detail: 'Post-call telemetry automatically extracts 10 structured fields (Intent, Budget, Location, Visit Date) and updates the Kanban deal card to HOT 🔥 while assigning a senior rep.'
    },
    {
      num: '04',
      title: 'Dynamic Payment & PDF Receipt',
      subtitle: '1-Click Razorpay UPI Link',
      icon: CreditCard,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      tag: 'CHECKOUT & INVOICE',
      detail: 'AI sends a 1-click Razorpay UPI payment link inside WhatsApp. Upon payment confirmation, an official digitally signed receipt PDF is issued instantly.'
    },
    {
      num: '05',
      title: '24/7 AI Post-Sale Support',
      subtitle: 'BYOK Multi-Model Memory',
      icon: Bot,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
      tag: 'OMNICHANNEL ASSISTANT',
      detail: 'AI Assistant answers post-onboarding questions, delivers examination timetables, and collects Google 5-star reviews with zero token markup.'
    }
  ];

  return (
    <section className="py-24 bg-card/40 border-t border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Complete Customer Journey Engine
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
            From Ad Click to Closed Deal.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              Fully Automated by AI.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            See how AIWCRM orchestrates every customer interaction across Meta Ads, WhatsApp, Voice AI, Kanban Pipelines, and Payment Gateways.
          </p>
        </div>

        {/* Step-by-Step Flow Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left space-y-2 relative ${
                  isSelected 
                    ? 'bg-card border-emerald-500 shadow-xl ring-2 ring-emerald-500/20 scale-[1.02]' 
                    : 'bg-card/60 border-border/60 hover:bg-card hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-muted-foreground font-mono">{step.num}</span>
                  <div className={`p-2 rounded-xl border ${step.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-foreground group-hover:text-emerald-500 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Step Feature Showcase Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
              <Zap className="w-3.5 h-3.5" /> Stage {steps[activeStep].num}: {steps[activeStep].tag}
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {steps[activeStep].title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {steps[activeStep].detail}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> 100% Automated Execution
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Real-time Telemetry Logged
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Execution Event</span>
              <span className="text-[10px] font-mono text-emerald-400">Status: SUCCESS</span>
            </div>
            
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase">Trigger Event</p>
                <p className="text-emerald-400 font-bold">{steps[activeStep].title}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase">System Action</p>
                <p className="text-white">{steps[activeStep].subtitle}</p>
              </div>
            </div>

            <Link
              href="/free-trial"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold py-2.5 px-4 rounded-xl transition-all"
            >
              Test This Flow Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
