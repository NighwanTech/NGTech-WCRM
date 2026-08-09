'use client';

import React, { useState } from 'react';
import { 
  Factory, 
  GraduationCap, 
  HeartPulse, 
  ShoppingBag, 
  Building, 
  Landmark, 
  Hotel, 
  Plane, 
  Heart, 
  Building2,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export function IndustryShowcaseSection() {
  const [activeSlug, setActiveSlug] = useState('education');

  const industries = [
    { 
      title: 'Education & Coaching', 
      slug: 'education', 
      icon: GraduationCap,
      challenge: 'High volume of student admission inquiries during admission season leads to long counselor response times and missed admission targets.',
      solution: 'Deploy 24/7 AI admission counselors powered by Gemini 3.6 & BYOK to answer fee structures, prospectus requests, and campus visit bookings instantly.',
      outcomes: ['+45% Admission Conversion', '-80% Staff Workload', '0 AI Token Markup'],
      useCase: 'Used by BPTPIA & top Coaching Institutes across India'
    },
    { 
      title: 'Manufacturing & B2B', 
      slug: 'manufacturing', 
      icon: Factory,
      challenge: 'Managing vendor inquiries, RFQ quotation requests, and order dispatch alerts across multiple manual channels.',
      solution: 'Automate RFQ processing, vendor broadcasts, order dispatch tracking, and batch updates via Meta Official Cloud API.',
      outcomes: ['3.5x Faster RFQ Turnaround', '100% Delivery Rate', 'Automated Dispatch Tracking'],
      useCase: 'Tailored for Indian manufacturers & exporters'
    },
    { 
      title: 'Healthcare & Hospitals', 
      slug: 'healthcare', 
      icon: HeartPulse,
      challenge: 'Patient appointment booking bottlenecks, missed appointments, and delayed lab report deliveries.',
      solution: 'Instant appointment booking, doctor availability checks, lab report PDF delivery, and automated SMS/WhatsApp appointment reminders.',
      outcomes: ['-90% Patient No-Shows', '<2 min Appointment Booking', 'HIPAA & GDPR Compliant'],
      useCase: 'Ideal for hospital chains & diagnostic centers'
    },
    { 
      title: 'Retail & D2C Brands', 
      slug: 'retail', 
      icon: ShoppingBag,
      challenge: 'Abandoned shopping carts, high COD return rates, and low re-engagement on traditional email newsletters.',
      solution: 'Interactive catalog browsing inside WhatsApp, automated COD order confirmation broadcasts, and shipment tracking alerts.',
      outcomes: ['+25% Cart Recovery', '-40% COD Returns', '98% Message Open Rate'],
      useCase: 'Built for D2C brands & e-commerce stores'
    },
    { 
      title: 'Real Estate & Construction', 
      slug: 'real-estate', 
      icon: Building,
      challenge: 'Slow follow-ups on site visit leads lead to property buyers booking with competitor developers.',
      solution: 'Automated site visit scheduling, instant property brochure PDF delivery, and AI lead intent scoring (HOT 🔥).',
      outcomes: ['2.5x Site Visit Bookings', 'Instant Lead Assignment', 'Full Pipeline Visibility'],
      useCase: 'Trusted by top property developers & brokers'
    },
    { 
      title: 'BFSI & Financial Services', 
      slug: 'finance', 
      icon: Landmark,
      challenge: 'Collecting loan application documents and following up on pending EMI payment reminders manually.',
      solution: 'Secure document collection via WhatsApp, loan eligibility calculators, and automated EMI payment reminder broadcasts.',
      outcomes: ['-60% Document Delay', '+35% On-time EMI Collections', 'AES-256 Encrypted'],
      useCase: 'Built for NBFCs, fintech, & insurance agencies'
    },
    { 
      title: 'Hospitality & Travel', 
      slug: 'hospitality', 
      icon: Hotel,
      challenge: 'Managing guest check-in inquiries, room service requests, and travel itinerary updates across email and phone.',
      solution: 'Table reservations, room booking confirmations, menu PDF broadcasts, and automated travel itinerary sharing.',
      outcomes: ['+98% Guest Satisfaction', '<100ms Instant Answers', 'Seamless Concierge AI'],
      useCase: 'Used by hotel chains & travel agencies'
    },
  ];

  const currentInd = industries.find(i => i.slug === activeSlug) || industries[0];
  const CurrentIcon = currentInd.icon;

  return (
    <section className="py-12 sm:py-14 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Building2 className="h-4 w-4" /> Tailored Industry Verticals
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Built for Every High-Growth Sector
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Select your industry to see how WCRM solves your specific sales and support challenges.
          </p>
        </div>

        {/* Interactive Industry Pill Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isActive = activeSlug === ind.slug;
            return (
              <button
                key={ind.slug}
                onClick={() => setActiveSlug(ind.slug)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{ind.title}</span>
              </button>
            );
          })}
        </div>

        {/* Industry Solution Spotlight Showcase */}
        <div className="max-w-5xl mx-auto p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-8">
          
          <div className="flex items-center justify-between border-b border-border/60 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CurrentIcon className="h-8 w-8" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-foreground">{currentInd.title} Solution</h3>
                <p className="text-xs text-emerald-400 font-mono font-bold">{currentInd.useCase}</p>
              </div>
            </div>
            <Link
              href={`/solutions/${currentInd.slug}`}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md"
            >
              <span>Explore Solution</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Challenge & Solution */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <p className="text-xs font-mono uppercase text-rose-400 font-extrabold">Industry Challenge</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{currentInd.challenge}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <p className="text-xs font-mono uppercase text-emerald-400 font-extrabold">WCRM AI Solution</p>
                <p className="text-xs text-foreground leading-relaxed font-medium">{currentInd.solution}</p>
              </div>
            </div>

            {/* Measurable Business Outcomes */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase text-muted-foreground font-extrabold">Measurable Key Impact</p>
                <div className="space-y-2.5">
                  {currentInd.outcomes.map((out, i) => (
                    <div key={i} className="p-3 rounded-xl bg-background border border-border/60 flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-sm font-extrabold text-foreground">{out}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 sm:hidden">
                <Link
                  href={`/solutions/${currentInd.slug}`}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 text-white text-xs font-extrabold w-full"
                >
                  <span>Explore Solution</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
