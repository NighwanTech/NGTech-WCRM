'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  HelpCircle,
  ChevronDown,
  Kanban,
  Send,
  MessageSquare,
  Mic,
  Code2,
  Lock,
  BarChart3,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Cpu,
  Flame,
  UserCheck,
  Calculator,
  Compass,
  Check,
  X,
  ShoppingCart,
  Sliders
} from 'lucide-react';
import { PricingPlan, PricingFaq, PricingHeroSettings } from '@/lib/services/pricing-cms.service';
import { TestimonialCarousel, type Testimonial } from '@/components/marketing/testimonial-carousel';

interface PricingPageClientProps {
  initialPlans: PricingPlan[];
  initialFaqs: PricingFaq[];
  heroSettings: PricingHeroSettings;
  testimonials: Testimonial[];
}

export function PricingPageClient({
  initialPlans,
  initialFaqs,
  heroSettings,
  testimonials
}: PricingPageClientProps) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlans[1]?.id || initialPlans[0]?.id || 'plan_growth');

  // Cart Configurator State
  const [cartSeats, setCartSeats] = useState(5);
  const [cartMessages, setCartMessages] = useState(10000);
  const [cartAddons, setCartAddons] = useState<string[]>(['voice_ai', 'byok_vault']);

  // Current selected plan object
  const currentSelectedPlan = initialPlans.find(p => p.id === selectedPlanId) || initialPlans[1] || initialPlans[0];
  const isEnterprisePlan = currentSelectedPlan?.is_enterprise || currentSelectedPlan?.slug === 'enterprise' || currentSelectedPlan?.name.toLowerCase().includes('enterprise');

  // Base price calculation
  const rawMonthly = currentSelectedPlan?.price_monthly ?? currentSelectedPlan?.monthly_price ?? 0;
  const rawYearly = currentSelectedPlan?.price_yearly ?? currentSelectedPlan?.annual_price ?? 0;
  const basePlanPrice = Number(isAnnual ? rawYearly : rawMonthly);

  // Extra Seats math
  const includedSeats = parseInt(String(currentSelectedPlan?.max_users || 3).replace(/\D/g, '')) || 3;
  const extraSeatsCount = Math.max(0, cartSeats - includedSeats);
  const extraSeatsCost = extraSeatsCount * 999;

  // Extra Conversations math
  const includedMsgs = parseInt(String(currentSelectedPlan?.max_conversations || 5000).replace(/\D/g, '')) || 5000;
  const extraMessagesCount = Math.max(0, cartMessages - includedMsgs);
  const extraMessagesCost = Math.round(extraMessagesCount * 1.5);

  const addonPrices: Record<string, number> = {
    voice_ai: 2999,
    byok_vault: 1499,
    greeting_cache: 999,
    meta_setup: 4999,
    meta_ads: 1999,
  };

  const totalAddonsCost = cartAddons.reduce((sum, key) => sum + (addonPrices[key] || 0), 0);
  const cartSubtotal = (isEnterprisePlan ? 0 : basePlanPrice) + extraSeatsCost + extraMessagesCost + totalAddonsCost;
  const cartFinalTotal = isAnnual ? Math.round(cartSubtotal * 0.8) : cartSubtotal;

  // ROI Calculator State
  const [numAgents, setNumAgents] = useState(5);
  const [monthlyLeads, setMonthlyLeads] = useState(10000);
  const [avgSalary, setAvgSalary] = useState(30000);

  // Plan Recommendation Wizard State
  const [showWizard, setShowWizard] = useState(false);
  const [wizTeamSize, setWizTeamSize] = useState('4-10');
  const [wizVolume, setWizVolume] = useState('5k-25k');
  const [wizNeedByok, setWizNeedByok] = useState('yes');

  // ROI Calculations
  const hoursSavedPerMonth = Math.round(numAgents * 35);
  const additionalRevenue = Math.round(monthlyLeads * 0.035 * 450);
  const aiCostSavings = Math.round(monthlyLeads * 0.40);
  const totalMonthlyBenefit = additionalRevenue + aiCostSavings;
  const growthPlanCost = isAnnual ? 3999 : 4999;
  const netRoiMultiple = (totalMonthlyBenefit / growthPlanCost).toFixed(1);

  // Recommendation Logic
  const recommendedPlanSlug =
    wizTeamSize === '10+' || wizNeedByok === 'custom' || wizVolume === '25k+'
      ? 'enterprise'
      : wizTeamSize === '4-10' || wizNeedByok === 'yes'
      ? 'growth'
      : 'starter';

  // Multi-currency support (Crawled from Bigin/Zoho enterprise pricing standards)
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  const currencyRate = currency === 'INR' ? 1 : currency === 'USD' ? 0.012 : currency === 'EUR' ? 0.011 : 0.0095;

  const formatPrice = (amountINR: number) => {
    if (currency === 'INR') return `₹${amountINR.toLocaleString('en-IN')}`;
    const val = Math.round(amountINR * currencyRate);
    return `${currencySymbol}${val.toLocaleString('en-US')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-20 bg-background text-foreground border-b border-border/40">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>{heroSettings.badge_text}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.06] max-w-5xl mx-auto">
            Simple, Transparent Pricing with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              Zero AI Token Markup.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            {heroSettings.subheadline}
          </p>

          {/* ─── CRAWLED TRUST GUARANTEE BANNER (BIGIN STYLE) ─── */}
          <div className="pt-2 pb-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2.5 px-6 rounded-2xl bg-card/80 border border-border/80 shadow-md text-xs font-bold text-foreground">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> 7-Day Free Trial (No Credit Card)
              </div>
              <span className="hidden sm:inline text-border">•</span>
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="h-4 w-4" /> 100% Money-Back Guarantee
              </div>
              <span className="hidden sm:inline text-border">•</span>
              <div className="flex items-center gap-2 text-blue-400">
                <Zap className="h-4 w-4" /> 1-Click CRM Data Migration
              </div>
              <span className="hidden sm:inline text-border">•</span>
              <div className="flex items-center gap-2 text-purple-400">
                <Lock className="h-4 w-4" /> No Forced Contracts
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-card border border-border/80 shadow-md">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${
                  !isAnnual ? 'bg-emerald-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
                  isAnnual ? 'bg-emerald-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                  Save 20%
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold hover:bg-emerald-500/20 transition-all"
            >
              <Compass className="h-4 w-4" /> AI Plan Recommendation Wizard
            </button>
          </div>

        </div>
      </section>

      {/* ─── AI PLAN RECOMMENDATION WIZARD MODAL ─── */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-card border border-border/80 p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowWizard(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">
                <Compass className="h-3.5 w-3.5" /> AI Plan Recommendation
              </div>
              <h3 className="text-2xl font-black text-foreground">Find the Right WCRM Plan for Your Business</h3>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">1. What is your team size?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1-3', '4-10', '10+'].map(val => (
                    <button
                      key={val}
                      onClick={() => setWizTeamSize(val)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        wizTeamSize === val ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-background border-border text-muted-foreground'
                      }`}
                    >
                      {val} Seats
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">2. Monthly WhatsApp conversation volume?</label>
                <div className="grid grid-cols-3 gap-2">
                  {['<5k', '5k-25k', '25k+'].map(val => (
                    <button
                      key={val}
                      onClick={() => setWizVolume(val)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        wizVolume === val ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-background border-border text-muted-foreground'
                      }`}
                    >
                      {val} / month
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">3. Do you need Bring Your Own Key (BYOK) AI?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'yes', label: 'Yes (0% AI Token Markup)' },
                    { key: 'custom', label: 'Custom Enterprise Gateway' }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setWizNeedByok(item.key)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        wizNeedByok === item.key ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-background border-border text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Result */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2">
              <p className="text-xs font-mono uppercase text-emerald-400 font-extrabold">Recommended Plan Match</p>
              <h4 className="text-xl font-black text-foreground uppercase">
                {recommendedPlanSlug === 'growth' ? 'Growth AI (Best Value)' : recommendedPlanSlug === 'enterprise' ? 'Enterprise Scale' : 'Starter Plan'}
              </h4>
              <p className="text-xs text-muted-foreground">
                Optimal choice for {wizTeamSize} agents processing {wizVolume} monthly conversations with zero AI token markups.
              </p>
            </div>

            <button
              onClick={() => {
                setShowWizard(false);
                const planObj = initialPlans.find(p => p.slug === recommendedPlanSlug);
                if (planObj) setSelectedPlanId(planObj.id);
              }}
              className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg"
            >
              Select Recommended Plan & View Options →
            </button>
          </div>
        </div>
      )}

      {/* ─── 2. DYNAMIC PRICING CARDS ─── */}
      <section className="py-20 bg-card/40 relative overflow-hidden border-b border-border/50">
        <div className="container mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 ${initialPlans.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4 max-w-[88rem]' : 'lg:grid-cols-3 max-w-6xl'} gap-6 items-stretch mx-auto`}>
            {initialPlans.map((plan) => {
              const priceMonthlyVal = Number(plan.price_monthly ?? plan.monthly_price ?? 0);
              const priceYearlyVal = Number(plan.price_yearly ?? plan.annual_price ?? 0);
              const price = isAnnual ? priceYearlyVal : priceMonthlyVal;

              const origPrice = isAnnual
                ? (plan.original_price_yearly ?? (priceYearlyVal ? Math.round(priceYearlyVal * 1.25) : null))
                : (plan.original_price_monthly ?? (priceMonthlyVal ? Math.round(priceMonthlyVal * 1.25) : null));
              const currency = plan.currency || '₹';
              const isSelected = selectedPlanId === plan.id;
              const isEnt = plan.is_enterprise || plan.slug === 'enterprise' || plan.name.toLowerCase().includes('enterprise') || (price === 0 && !plan.is_free && plan.name.toLowerCase() !== 'free');
              const descriptionText = plan.short_description || plan.description || 'Full-featured WhatsApp CRM & AI Automation platform.';

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-6 sm:p-8 pt-9 rounded-3xl transition-all duration-300 flex flex-col justify-between relative border cursor-pointer ${
                    isSelected || plan.popular_badge
                      ? 'bg-background border-emerald-500/60 shadow-2xl shadow-emerald-500/15 scale-[1.02]'
                      : 'bg-background border-border/80 hover:border-emerald-500/30 shadow-md'
                  }`}
                >
                  {plan.popular_badge && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                      {plan.popular_badge}
                    </div>
                  )}

                  <div className="space-y-6 text-left">
                    <div className="space-y-2 border-b border-border/60 pb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-foreground">{plan.name}</h3>
                        {plan.recommended_badge && (
                          <span className="text-[9px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {plan.recommended_badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                        {descriptionText}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="space-y-1">
                      {isEnt ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-black text-foreground">Custom Quote</span>
                          <span className="text-xs text-muted-foreground font-mono">/ custom SLA</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-black text-foreground">{currency}{(price || 0).toLocaleString('en-IN')}</span>
                          <span className="text-xs text-muted-foreground font-mono">/ month</span>
                        </div>
                      )}

                      {!isEnt && origPrice && Number(origPrice) > price && (
                        <p className="text-xs text-muted-foreground line-through">
                          Regular: {currency}{(Number(origPrice) || 0).toLocaleString('en-IN')}/mo
                        </p>
                      )}
                      <p className="text-[11px] text-emerald-400 font-mono font-semibold pt-1">
                        ✓ {isEnt ? '24/7 Dedicated Support' : isAnnual ? 'Billed annually' : 'Billed monthly'} · {plan.trial_days || 7}-Day Free Trial
                      </p>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div><span className="text-muted-foreground">Team:</span> <span className="font-bold text-foreground">{plan.team_size || `${plan.max_users || 3} Seats`}</span></div>
                      <div><span className="text-muted-foreground">Contacts:</span> <span className="font-bold text-foreground">{plan.max_contacts ? String(plan.max_contacts) : '10,000'}</span></div>
                      <div><span className="text-muted-foreground">Convs:</span> <span className="font-bold text-foreground">{plan.max_conversations ? String(plan.max_conversations) : '5,000'}</span></div>
                      <div><span className="text-muted-foreground">AI Engine:</span> <span className="font-bold text-emerald-400">{plan.max_ai_requests || 'BYOK'}</span></div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-mono uppercase font-bold text-muted-foreground">Included Capabilities:</p>
                      {(plan.features_list || [
                        'Official Meta WhatsApp Cloud API',
                        'Multi-Agent Shared Inbox',
                        'BYOK AI Auto-Responder',
                        'Live Telemetry & Reports'
                      ]).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-8 space-y-2">
                    <Link
                      href={plan.button_url || (isEnt ? '/book-demo?plan=enterprise' : `/free-trial?plan=${plan.slug || 'starter'}`)}
                      className={`w-full flex h-12 items-center justify-center rounded-full font-extrabold text-sm transition-all shadow-md ${
                        plan.popular_badge || isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 hover:scale-[1.02]'
                          : 'bg-card border-2 border-emerald-500/30 text-foreground hover:bg-emerald-500/10'
                      }`}
                    >
                      {plan.button_text || (isEnt ? 'Schedule Enterprise Demo' : 'Start 7-Day Free Trial')} →
                    </Link>

                    <a
                      href="#cart-configurator"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="w-full flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 hover:underline pt-1"
                    >
                      <Sliders className="h-3 w-3" /> Customize Seats & Add-Ons ↓
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. INTERACTIVE PLAN CART & ADD-ON CONFIGURATOR ─── */}
      <section id="cart-configurator" className="py-20 bg-gradient-to-b from-card/30 via-background to-card/30 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShoppingCart className="h-4 w-4" /> Interactive Order Cart & Add-On Configurator
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Customize Your Plan & Add-Ons in Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Adjust team seats, monthly WhatsApp volume, and AI add-on extensions to view instant cart pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left Column: Sliders & Add-Ons */}
            <div className="lg:col-span-7 space-y-6 bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xl text-left">
              
              {/* 1. Base Plan Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground font-mono uppercase">1. Selected Base Plan</label>
                <div className="grid grid-cols-4 gap-2">
                  {initialPlans.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                        selectedPlanId === p.id
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-background border-border/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Team Seats Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-foreground font-mono uppercase">2. Team Seats</label>
                  <span className="font-mono font-black text-emerald-400 text-sm">{cartSeats} Seats</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={cartSeats}
                  onChange={(e) => setCartSeats(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>1 Seat (₹999/extra seat)</span>
                  <span>25 Seats</span>
                  <span>50 Seats</span>
                </div>
              </div>

              {/* 3. Monthly Message Quota Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-foreground font-mono uppercase">3. Monthly WhatsApp Conversations</label>
                  <span className="font-mono font-black text-emerald-400 text-sm">{cartMessages.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={5000}
                  value={cartMessages}
                  onChange={(e) => setCartMessages(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>5,000 (₹1.5 / extra msg)</span>
                  <span>100,000</span>
                  <span>250,000+</span>
                </div>
              </div>

              {/* 4. Enterprise Add-Ons Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-foreground font-mono uppercase">4. Optional Enterprise Services & Add-Ons</label>
                <div className="space-y-2">
                  {[
                    { key: 'voice_ai', name: '🎙️ Voice AI Call Agent (Retell or ElevenLabs)', price: '+₹2,999/mo', desc: 'Multi-provider calling · Hindi voices · CRM intelligence sync' },
                    { key: 'byok_vault', name: '🤖 BYOK Multi-LLM Router Vault', price: '+₹1,499/mo', desc: 'Direct 0% token markup API key routing' },
                    { key: 'greeting_cache', name: '⚡ 0-Token Instant Reply Cache', price: '+₹999/mo', desc: '<100ms instant greeting auto-responder' },
                    { key: 'meta_ads', name: '🎯 AI Meta Ads', price: '+₹1,999/mo', desc: 'Generate & sync Meta ads with AI' },
                    { key: 'meta_setup', name: '🚀 Dedicated Meta Account Setup', price: '+₹4,999 one-time', desc: 'White-glove Meta green tick onboarding' },
                  ].map((addon) => {
                    const isChecked = cartAddons.includes(addon.key);
                    return (
                      <div
                        key={addon.key}
                        onClick={() => {
                          if (isChecked) {
                            setCartAddons(cartAddons.filter((k) => k !== addon.key));
                          } else {
                            setCartAddons([...cartAddons, addon.key]);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground' : 'bg-background border-border/80 text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] ${isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-border'}`}>
                            {isChecked && '✓'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{addon.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{addon.desc}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Live Sticky Cart Order Summary Box */}
            <div className="lg:col-span-5 bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl space-y-6 text-left lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-500" /> Order Summary
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  {isAnnual ? '20% Annual Discount' : 'Monthly Plan'}
                </span>
              </div>

              {/* Line Items */}
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Base Plan ({currentSelectedPlan.name}):</span>
                  <span className="font-bold text-foreground">{isEnterprisePlan ? 'Custom Quote' : `₹${basePlanPrice.toLocaleString('en-IN')}/mo`}</span>
                </div>

                {extraSeatsCost > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Extra Seats ({extraSeatsCount} x ₹999):</span>
                    <span className="font-bold">+₹{extraSeatsCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {extraMessagesCost > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Extra Conversations ({extraMessagesCount.toLocaleString('en-IN')}):</span>
                    <span className="font-bold">+₹{extraMessagesCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {totalAddonsCost > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Selected Add-Ons ({cartAddons.length}):</span>
                    <span className="font-bold">+₹{totalAddonsCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {isAnnual && (
                  <div className="flex justify-between items-center text-emerald-300 font-bold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    <span>Annual 20% Discount Saved:</span>
                    <span>-₹{Math.round(cartSubtotal * 0.2).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Cart Total */}
              <div className="pt-4 border-t border-border/60 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-muted-foreground font-mono">Cart Total:</span>
                  <span className="text-3xl font-black text-foreground">₹{cartFinalTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono">
                  ✓ Includes 7-Day Free Trial · 0% AI Token Markup Guarantee
                </p>
              </div>

              {/* Direct Checkout Button */}
              <Link
                href={`/checkout?plan=${currentSelectedPlan.slug || 'starter'}&billing=${isAnnual ? 'annual' : 'monthly'}&seats=${cartSeats}&price=${cartFinalTotal}&addons=${cartAddons.join(',')}`}
                className="w-full flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/25 gap-2"
              >
                Proceed to Instant Checkout →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 4. INTERACTIVE ROI & COST CALCULATOR ─── */}
      <section className="py-24 bg-background border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="h-4 w-4" /> Interactive Business ROI Calculator
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Calculate Your Expected Monthly Return
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              See how much your business saves with zero platform token markups & 80% automated WhatsApp response times.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Left Sliders */}
            <div className="lg:col-span-7 space-y-6 bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xl text-left">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>Number of Sales & Support Agents</span>
                  <span className="text-emerald-400 font-mono font-black">{numAgents} Agents</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={numAgents}
                  onChange={(e) => setNumAgents(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>Monthly Inbound WhatsApp Leads</span>
                  <span className="text-emerald-400 font-mono font-black">{monthlyLeads.toLocaleString()} Leads</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>Average Agent Monthly Salary (₹)</span>
                  <span className="text-emerald-400 font-mono font-black">₹{avgSalary.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={100000}
                  step={5000}
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Right ROI Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/40 via-card to-emerald-950/20 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 text-left">
              <div className="space-y-1">
                <p className="text-xs font-mono uppercase font-bold text-emerald-400">Estimated Monthly Impact</p>
                <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 font-mono">
                  +₹{totalMonthlyBenefit.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Estimated revenue lift & operational savings per month.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rep Hours Saved / Mo:</span>
                  <span className="font-bold text-foreground">{hoursSavedPerMonth} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Token Savings (0% Markup):</span>
                  <span className="font-bold text-emerald-400">₹{aiCostSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated ROI Multiple:</span>
                  <span className="font-bold text-emerald-400">{netRoiMultiple}x ROI</span>
                </div>
              </div>

              <Link
                href="/free-trial?calculator=true"
                className="w-full flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg"
              >
                Claim Your Estimated ROI & Start Free Trial →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. FEATURE COMPARISON TABLE ─── */}
      <section className="py-24 bg-gradient-to-b from-background via-card/30 to-background border-b border-border/50">
        <div className="container mx-auto max-w-6xl px-4 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              ⚡ Full Feature Capability Matrix
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Compare Plan Capabilities Side-by-Side
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Detailed technical specs across all tiers with zero hidden API fees or surprises.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-2xl">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-5 sm:p-6 text-sm font-black text-foreground uppercase tracking-wider">CAPABILITY</th>
                  <th className="p-5 sm:p-6 text-center text-foreground font-bold">STARTER</th>
                  <th className="p-5 sm:p-6 text-center text-emerald-400 font-extrabold bg-emerald-500/10 border-x border-emerald-500/20">
                    GROWTH AI (POPULAR 🔥)
                  </th>
                  <th className="p-5 sm:p-6 text-center text-foreground font-bold">ENTERPRISE SCALE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { feature: 'Official Meta WhatsApp Cloud API', starter: true, growth: true, enterprise: true, tag: 'CORE API' },
                  { feature: 'Multi-Agent Shared Inbox', starter: '3 Seats', growth: '10 Seats', enterprise: 'Unlimited Seats', tag: 'INBOX' },
                  { feature: 'BYOK Multi-LLM AI Routing (0% Markup)', starter: false, growth: true, enterprise: true, tag: 'AI ROUTER' },
                  { feature: 'Visual Kanban Deals Pipeline', starter: false, growth: true, enterprise: true, tag: 'SALES CRM' },
                  { feature: 'No-Code Workflow Builder', starter: false, growth: true, enterprise: true, tag: 'AUTOMATION' },
                  { feature: 'Multi-Provider Voice AI (Retell + ElevenLabs)', starter: false, growth: true, enterprise: true, tag: 'VOICE AI' },
                  { feature: '0-Token Instant Reply Greeting Cache', starter: true, growth: true, enterprise: true, tag: 'SPEED' },
                  { feature: 'Sub-1s Self-Healing Auto Failover', starter: false, growth: true, enterprise: true, tag: 'SECURITY' },
                  { feature: 'Developer REST APIs & Sub-50ms Webhooks', starter: false, growth: true, enterprise: true, tag: 'DEV SUITE' },
                  { feature: 'Dedicated Account Manager & SLA Support', starter: false, growth: false, enterprise: true, tag: 'SLA' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground flex items-center justify-between gap-4">
                      <span>{row.feature}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono font-bold">
                        {row.tag}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-medium">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold mx-auto">✓</span> : <span className="text-muted-foreground/30 font-bold">✕</span>
                      ) : row.starter}
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-emerald-500/5 font-extrabold text-emerald-400 border-x border-emerald-500/20">
                      {typeof row.growth === 'boolean' ? (
                        row.growth ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold mx-auto">✓</span> : <span className="text-muted-foreground/30 font-bold">✕</span>
                      ) : row.growth}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-extrabold text-foreground">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold mx-auto">✓</span> : <span className="text-muted-foreground/30 font-bold">✕</span>
                      ) : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 6. TESTIMONIALS ─── */}
      <section className="py-24 bg-background border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">Trusted Industry Leaders</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Loved by High-Growth Teams across India</h2>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* ─── 7. PRICING FAQS ─── */}
      <section className="py-24 bg-card/40 border-b border-border/50">
        <div className="container mx-auto max-w-4xl px-4 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">
              <HelpCircle className="h-4 w-4" /> Clear Answers
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 text-left">
            {(initialFaqs.length > 0 ? initialFaqs : [
              { id: '1', question: 'Are there any hidden platform markups on Meta WhatsApp messages?', answer: 'No! WCRM passes Meta Cloud API messaging rates directly to you with zero added markups.', category: 'Billing' },
              { id: '2', question: 'How does Bring Your Own Key (BYOK) work for AI models?', answer: 'BYOK allows you to plug your own OpenAI, Gemini, or Groq API keys directly into WCRM.', category: 'AI Platform' },
              { id: '3', question: 'What happens when primary AI model experiences a 429 error?', answer: 'WCRM automatically switches to your backup model in <1 second with zero downtime.', category: 'AI Platform' },
            ]).map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={faq.id || idx} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-extrabold text-foreground text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-6 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
