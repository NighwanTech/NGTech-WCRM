'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  PhoneCall, 
  Target, 
  Users, 
  BarChart3, 
  BrainCircuit, 
  Database, 
  Sparkles, 
  Workflow, 
  MessageSquareText, 
  ShoppingBag, 
  Building2, 
  GraduationCap, 
  HeartPulse, 
  Landmark, 
  Hotel, 
  ShieldCheck, 
  Code2, 
  KeyRound, 
  Zap, 
  Layers, 
  Globe, 
  FileText, 
  ChevronDown, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Compass,
  Briefcase,
  Radio,
  ExternalLink
} from 'lucide-react';
import { MarketingMobileMenu } from '@/components/layout/marketing-mobile-menu';

export function EnterpriseHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-xl shadow-black/5' 
          : 'bg-background/80 backdrop-blur-xl border-b border-border/30'
      }`}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white text-[11px] font-medium py-1 px-3 sm:px-4 text-center flex items-center justify-center gap-1.5 sm:gap-2">
        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] shrink-0">
          <Sparkles className="w-3 h-3 text-emerald-200" /> Multi-Provider Voice AI
        </span>
        <span className="hidden md:inline">Deploy Human-Grade Voice AI with Retell + ElevenLabs & Native Hindi Support. Zero Token Markup!</span>
        <span className="md:hidden truncate">Retell + ElevenLabs Voice AI with Native Hindi.</span>
        <Link href="/docs/ai-copilot/multi-provider-voice-ai-guide" className="underline font-bold hover:text-emerald-200 transition-colors inline-flex items-center gap-0.5 ml-1 shrink-0">
          Manual <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Main Navbar Container */}
      <div className="container mx-auto flex h-16 sm:h-20 max-w-[1400px] items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        
        {/* Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-3 lg:gap-6 xl:gap-8 shrink-0 min-w-0">
          <Link href="/" className="flex items-center shrink-0 group">
            <img 
              src="/logo.svg" 
              alt="AIWCRM Logo" 
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
            />
          </Link>

          {/* Desktop Mega Navigation - Shows on xl screens (1150px+) to prevent overlap/cut-off */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
            
            {/* 1. PLATFORM & AI PRODUCTS */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('platform')}
            >
              <button 
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider transition-colors duration-200 rounded-lg ${
                  activeMenu === 'platform' ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                AI Products <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'platform' ? 'rotate-180 text-primary' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {activeMenu === 'platform' && (
                <div className="absolute top-full left-0 w-[800px] max-w-[90vw] mt-2 p-5 bg-card/98 backdrop-blur-3xl border border-border/80 rounded-2xl shadow-2xl shadow-black/20 grid grid-cols-3 gap-5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="col-span-2 space-y-3">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-emerald-500" /> Core AI Platform Engines
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { 
                          icon: Bot, 
                          title: 'AI Assistant & Copilot', 
                          desc: 'Multi-turn memory & CRM auto-sync.',
                          href: '/ai-platform#copilot',
                          badge: 'HOT'
                        },
                        { 
                          icon: PhoneCall, 
                          title: 'Voice AI Calling', 
                          desc: 'Retell & ElevenLabs with Hindi support.',
                          href: '/ai-platform#voice-ai',
                          badge: 'NEW'
                        },
                        { 
                          icon: Target, 
                          title: 'Autonomous Meta Ads OS', 
                          desc: '0-latency WhatsApp reply from IG/FB Forms.',
                          href: '/ai-platform#meta-ads'
                        },
                        { 
                          icon: KeyRound, 
                          title: 'BYOK Multi-Model Vault', 
                          desc: 'OpenAI, Gemini, Groq with 0% token markup.',
                          href: '/ai-platform#byok',
                          badge: 'SAVE 60%'
                        },
                        { 
                          icon: Users, 
                          title: 'Customer Intelligence', 
                          desc: 'Predictive lead scoring & buyer telemetry.',
                          href: '/features#customer-intelligence'
                        },
                        { 
                          icon: Workflow, 
                          title: 'Decision Center & Engine', 
                          desc: 'Visual flow builder with AI triggers.',
                          href: '/features#workflow-automation'
                        },
                        { 
                          icon: MessageSquareText, 
                          title: 'WhatsApp Shared Inbox', 
                          desc: 'Multi-agent inbox with SLA timers.',
                          href: '/features#shared-inbox'
                        },
                        { 
                          icon: BarChart3, 
                          title: 'Executive Analytics', 
                          desc: 'ROAS, agent SLA & conversion reports.',
                          href: '/features#analytics'
                        }
                      ].map((item, idx) => (
                        <Link 
                          key={idx} 
                          href={item.href}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-muted/60 transition-all group border border-transparent hover:border-border/50"
                        >
                          <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                            <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1 font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                              {item.badge && (
                                <span className="px-1 py-0.2 rounded text-[8px] font-extrabold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Spotlight Box */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl text-white flex flex-col justify-between border border-slate-800">
                    <div className="space-y-2.5">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <Sparkles className="w-3 h-3" /> Zero Token Markup
                      </span>
                      <h4 className="text-xs font-black leading-snug">Bring Your Own Key (BYOK)</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Connect OpenAI, Gemini, or Groq keys into AIWCRM. Pay raw provider rates with zero SaaS markup.
                      </p>
                    </div>
                    <Link 
                      href="/pricing#calculator" 
                      className="mt-3 inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-extrabold py-1.5 px-3 rounded-lg transition-all"
                    >
                      Calculate Savings <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. SOLUTIONS */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('solutions')}
            >
              <button 
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider transition-colors duration-200 rounded-lg ${
                  activeMenu === 'solutions' ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Solutions <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'solutions' ? 'rotate-180 text-primary' : ''}`} />
              </button>

              {activeMenu === 'solutions' && (
                <div className="absolute top-full left-0 w-[640px] max-w-[90vw] mt-2 p-5 bg-card/98 backdrop-blur-3xl border border-border/80 rounded-2xl shadow-2xl shadow-black/20 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="col-span-2 text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-500" /> Industry & Use Case Solutions
                  </div>

                  {[
                    { icon: GraduationCap, title: 'Education & EdTech', desc: 'Instant student counseling & PDF prospectuses.', href: '/solutions/education' },
                    { icon: Building2, title: 'Real Estate & Property', desc: 'Meta Lead Ads to WhatsApp site visits.', href: '/solutions/realestate' },
                    { icon: ShoppingBag, title: 'D2C & E-Commerce', desc: 'Abandoned cart recovery & COD verification.', href: '/solutions/retail' },
                    { icon: HeartPulse, title: 'Healthcare & Clinics', desc: 'Appointment booking & PDF lab reports.', href: '/solutions/healthcare' },
                    { icon: Landmark, title: 'BFSI & FinTech', desc: 'Loan pre-approvals & KYC document upload.', href: '/solutions/bfsi' },
                    { icon: Hotel, title: 'Hospitality & Travel', desc: 'Direct room reservations & 24/7 guest bot.', href: '/solutions/hospitality' },
                    { icon: Globe, title: 'Government & Public Sector', desc: 'Civic complaint ticketing & public alerts.', href: '/solutions/government' },
                    { icon: Briefcase, title: 'B2B Enterprise', desc: 'Multi-region team inbox & ERP webhooks.', href: '/solutions/b2b' }
                  ].map((item, idx) => (
                    <Link 
                      key={idx} 
                      href={item.href}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-all group border border-transparent hover:border-border/50"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">{item.title}</div>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. INTEGRATIONS */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('integrations')}
            >
              <button 
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider transition-colors duration-200 rounded-lg ${
                  activeMenu === 'integrations' ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Integrations <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'integrations' ? 'rotate-180 text-primary' : ''}`} />
              </button>

              {activeMenu === 'integrations' && (
                <div className="absolute top-full left-0 w-[560px] max-w-[90vw] mt-2 p-5 bg-card/98 backdrop-blur-3xl border border-border/80 rounded-2xl shadow-2xl shadow-black/20 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="col-span-2 text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> Ecosystem Integrations
                  </div>

                  {[
                    { title: 'Meta WhatsApp Cloud API', desc: 'Direct 0-markup official Meta API.', badge: 'OFFICIAL' },
                    { title: 'Retell & ElevenLabs AI', desc: 'Voice agents with sub-800ms speed.', badge: 'VOICE AI' },
                    { title: 'Meta Lead Ads OS', desc: 'Real-time webhook sync from IG/FB Ads.', badge: 'ADS OS' },
                    { title: 'OpenAI & Google Gemini', desc: 'GPT-4o & Gemini 3.6 LLM engines.', badge: 'LLMs' },
                    { title: 'Shopify & WooCommerce', desc: 'Cart recovery & order tracking sync.' },
                    { title: 'Razorpay & PayU Links', desc: '1-click embedded UPI payment links.' },
                    { title: 'Zapier & Make Webhooks', desc: 'Connect 5,000+ apps via REST APIs.' },
                    { title: 'Tally & SAP ERP Sync', desc: 'Bi-directional stock & invoice sync.' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-muted/30 hover:bg-muted/70 transition-all border border-border/40">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{item.title}</span>
                        {item.badge && <span className="text-[8px] font-extrabold text-amber-600 bg-amber-500/10 px-1 py-0.2 rounded">{item.badge}</span>}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. ENTERPRISE */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('enterprise')}
            >
              <button 
                className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider transition-colors duration-200 rounded-lg ${
                  activeMenu === 'enterprise' ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Enterprise <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === 'enterprise' ? 'rotate-180 text-primary' : ''}`} />
              </button>

              {activeMenu === 'enterprise' && (
                <div className="absolute top-full left-0 w-[520px] max-w-[90vw] mt-2 p-5 bg-card/98 backdrop-blur-3xl border border-border/80 rounded-2xl shadow-2xl shadow-black/20 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="col-span-2 text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise Governance & Trust
                  </div>

                  {[
                    { icon: Lock, title: 'AES-256 Data Vault', desc: 'End-to-end payload encryption.' },
                    { icon: ShieldCheck, title: 'DPDP Act & GDPR', desc: 'Indian & global privacy compliance.' },
                    { icon: KeyRound, title: 'BYOK Architecture', desc: 'Pay raw AI model costs directly.' },
                    { icon: CheckCircle2, title: '99.99% Uptime SLA', desc: 'Multi-region auto-failover.' },
                    { icon: Layers, title: 'Enterprise RBAC/PBAC', desc: 'Granular permissions & audit logs.' },
                    { icon: Globe, title: 'Dedicated VPC Option', desc: 'Isolated deployment for enterprises.' }
                  ].map((item, idx) => (
                    <Link 
                      key={idx} 
                      href="/features#enterprise"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-all group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">{item.title}</div>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. PRICING */}
            <Link 
              href="/pricing"
              className="px-2.5 py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              Pricing
            </Link>

            {/* 6. DOCS */}
            <Link 
              href="/docs"
              className="px-2.5 py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" /> Docs
            </Link>

            {/* 7. BLOG */}
            <Link 
              href="/blog"
              className="px-2.5 py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              Blog
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <a
            href="https://wa.me/918092225777"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden 2xl:inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white px-3 py-1.5 rounded-full border border-[#25D366]/20 transition-all duration-300 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Live Chat</span>
          </a>

          <Link 
            href="/login" 
            className="hidden sm:inline-flex h-8 sm:h-9 items-center justify-center rounded-full border border-border/80 bg-background/50 px-3.5 sm:px-4 text-xs font-bold text-foreground/90 transition-all duration-200 hover:bg-muted hover:text-foreground shrink-0"
          >
            Log in
          </Link>

          <Link 
            href="/book-demo" 
            className="hidden lg:inline-flex h-8 sm:h-9 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 sm:px-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 shrink-0"
          >
            Book Demo
          </Link>

          <Link 
            href="/free-trial" 
            className="inline-flex h-8 sm:h-9 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-3.5 sm:px-4 text-xs sm:text-xs shadow-md shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] whitespace-nowrap shrink-0"
          >
            Start Free Trial
          </Link>

          {/* Mobile Menu Drawer Trigger */}
          <MarketingMobileMenu />
        </div>

      </div>
    </header>
  );
}
