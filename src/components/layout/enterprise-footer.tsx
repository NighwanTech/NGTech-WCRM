'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Award, 
  Building2, 
  CheckCircle2, 
  Activity, 
  ArrowRight,
  Globe,
  Heart,
  Phone,
  Mail,
  ExternalLink,
  MessageSquare,
  Zap,
  Bot,
  FileText,
  KeyRound,
  Check
} from 'lucide-react';

export function EnterpriseFooter() {
  return (
    <footer className="relative border-t border-border/80 bg-card/90 dark:bg-slate-950 text-foreground overflow-hidden font-sans">
      
      {/* Ambient Lighting Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-emerald-500/10 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Top Emerald Gradient Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-14 relative z-10">

        {/* TOP SECTION: BRAND HERO CARD & ACCREDITATION BADGES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-background/80 dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-border/80 dark:border-slate-800 backdrop-blur-xl shadow-xl">
          
          {/* Brand Info & Mission (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <Link href="/" className="inline-block group">
              <img 
                src="/logo.svg" 
                alt="AIWCRM Logo" 
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-300 leading-relaxed font-normal">
              The Enterprise AI Platform for Sales, Marketing & Customer Engagement. Unifying WhatsApp Cloud API, Retell & ElevenLabs Voice AI, Autonomous Meta Ads OS, BYOK Multi-LLM Vault, and Kanban Pipelines into one intelligent ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="https://wa.me/918092225777" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-[#25D366] hover:bg-[#20bd5a] px-4.5 py-2.5 rounded-full shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Live Chat Support</span>
              </a>

              <a 
                href="tel:+918985025794" 
                className="inline-flex items-center gap-2 text-xs font-bold text-foreground bg-muted/60 hover:bg-muted border border-border px-4 py-2.5 rounded-full transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>+91 8985025794</span>
              </a>
            </div>
          </div>

          {/* Recognition & Accreditation Badges Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Startup India Logo Badge */}
            <div className="p-3.5 rounded-2xl bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 text-left flex items-center gap-3.5 shadow-sm hover:border-amber-500/50 transition-colors">
              <div className="h-11 w-28 bg-white rounded-xl p-1.5 shrink-0 border border-slate-200 flex items-center justify-center shadow-sm">
                <img 
                  src="/startup-india.svg" 
                  alt="Startup India - DPIIT" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-extrabold text-foreground dark:text-white leading-snug">Recognised Startup</p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">Govt. of India</p>
              </div>
            </div>

            {/* 2. Govt of Bihar / Startup Bihar Logo Badge */}
            <div className="p-3.5 rounded-2xl bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 text-left flex items-center gap-3.5 shadow-sm hover:border-blue-500/50 transition-colors">
              <div className="h-11 w-28 bg-white rounded-xl p-1.5 shrink-0 border border-slate-200 flex items-center justify-center shadow-sm">
                <img 
                  src="/govt-bihar.svg" 
                  alt="Govt. of Bihar - Startup Bihar" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-extrabold text-foreground dark:text-white leading-snug">Seed Funded Company</p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Govt. of Bihar</p>
              </div>
            </div>

            {/* 3. AES-256 Vault White Container Badge */}
            <div className="p-3.5 rounded-2xl bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 text-left flex items-center gap-3.5 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="h-11 w-28 bg-white rounded-xl p-1.5 shrink-0 border border-slate-200 flex items-center justify-center gap-1.5 shadow-sm">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-black text-slate-950 tracking-tight">AES-256</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-extrabold text-foreground dark:text-white leading-snug">Encrypted Data Vault</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">DPDP Act & GDPR</p>
              </div>
            </div>

            {/* 4. 99.99% Uptime SLA White Container Badge */}
            <div className="p-3.5 rounded-2xl bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 text-left flex items-center gap-3.5 shadow-sm hover:border-teal-500/50 transition-colors">
              <div className="h-11 w-28 bg-white rounded-xl p-1.5 shrink-0 border border-slate-200 flex items-center justify-center gap-1.5 shadow-sm">
                <Activity className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-[11px] font-black text-slate-950 tracking-tight">99.99%</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-extrabold text-foreground dark:text-white leading-snug">SLA Uptime Guarantee</p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">Multi-Region VPC</p>
              </div>
            </div>

          </div>

        </div>

        {/* MAIN NAVIGATION COLUMNS (6 WELL-ORGANIZED COLUMNS) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-xs text-left">
          
          {/* COL 1: PLATFORM CAPABILITIES */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500" /> Platform
            </h4>
            <ul className="space-y-2 text-muted-foreground dark:text-slate-300 font-medium">
              <li><Link href="/platform" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform font-bold text-foreground">Platform Overview</Link></li>
              <li><Link href="/features#marketing" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Marketing & Meta Ads</Link></li>
              <li><Link href="/features#lead-hub" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Universal Lead Hub</Link></li>
              <li><Link href="/features#crm" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">CRM & Customer 360</Link></li>
              <li><Link href="/features#sales" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Enterprise Sales & Deals</Link></li>
              <li><Link href="/features#finance" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Finance & GST Invoicing</Link></li>
              <li><Link href="/features#success" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Customer Success & NPS</Link></li>
              <li><Link href="/ai-platform" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">AI Studio & Copilot</Link></li>
              <li><Link href="/features#automation" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Visual Automation EAP</Link></li>
              <li><Link href="/features#analytics" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Revenue Analytics</Link></li>
            </ul>
          </div>

          {/* COL 2: USE CASES */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-blue-500" /> Use Cases
            </h4>
            <ul className="space-y-2 text-muted-foreground dark:text-slate-300 font-medium">
              <li><Link href="/use-cases#generate-leads" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Generate Inbound Leads</Link></li>
              <li><Link href="/use-cases#automate-sales" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Automate Sales & Deals</Link></li>
              <li><Link href="/use-cases#collect-payments" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Collect Payments & Invoices</Link></li>
              <li><Link href="/use-cases#customer-retention" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Customer Retention</Link></li>
              <li><Link href="/use-cases#whatsapp-automation" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">WhatsApp Automation</Link></li>
              <li><Link href="/use-cases#ai-sales-assistant" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">AI Sales Assistant</Link></li>
              <li><Link href="/use-cases#executive-dashboards" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Executive Dashboards</Link></li>
            </ul>
          </div>

          {/* COL 3: SOLUTIONS BY INDUSTRY */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-500" /> Solutions
            </h4>
            <ul className="space-y-2 text-muted-foreground dark:text-slate-300 font-medium">
              <li><Link href="/solutions/education" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Education & EdTech</Link></li>
              <li><Link href="/solutions/realestate" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Real Estate & Builders</Link></li>
              <li><Link href="/solutions/retail" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Retail & D2C Brands</Link></li>
              <li><Link href="/solutions/healthcare" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Healthcare & Clinics</Link></li>
              <li><Link href="/solutions/bfsi" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">BFSI & FinTech</Link></li>
              <li><Link href="/solutions/hospitality" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Hospitality & Direct</Link></li>
            </ul>
          </div>

          {/* COL 4: DEVELOPERS & MANUALS */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-500" /> Developers & Docs
            </h4>
            <ul className="space-y-2 text-muted-foreground dark:text-slate-300 font-medium">
              <li><Link href="/docs" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Documentation Manual</Link></li>
              <li>
                <Link href="/api-docs" className="hover:text-foreground dark:hover:text-white transition-colors flex items-center justify-between group">
                  <span className="group-hover:translate-x-0.5 transition-transform">REST API Reference</span>
                  <span className="text-[9px] font-extrabold bg-teal-500/10 text-teal-600 dark:text-teal-300 px-1.5 py-0.2 rounded border border-teal-500/30">v2.0</span>
                </Link>
              </li>
              <li><Link href="/docs/campaign-management/ai-meta-ads-guide" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Meta Ads OS Manual</Link></li>
              <li><Link href="/docs/developer-platform/api-authentication" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Developer Platform Guide</Link></li>
              <li><Link href="/why-aiwcrm" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform font-bold text-foreground">Why AIWCRM</Link></li>
              <li><Link href="/blog" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Engineering Blog</Link></li>
            </ul>
          </div>

          {/* COL 5: COMPARISONS */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-500" /> Compare
            </h4>
            <ul className="space-y-2 text-muted-foreground dark:text-slate-300 font-medium">
              <li><Link href="/vs/hubspot" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">AIWCRM vs HubSpot</Link></li>
              <li><Link href="/vs/salesforce" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">AIWCRM vs Salesforce</Link></li>
              <li><Link href="/vs/zoho" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">AIWCRM vs Zoho CRM</Link></li>
              <li><Link href="/vs/monday" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">AIWCRM vs Monday.com</Link></li>
              <li><Link href="/vs/freshworks" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">AIWCRM vs Freshworks</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Enterprise Pricing</Link></li>
            </ul>
          </div>

          {/* COL 6: SECURITY & COMPANY */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-500" /> Security & Trust
            </h4>
            <ul className="space-y-2 text-muted-foreground dark:text-slate-300 font-medium">
              <li><Link href="/security" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform font-bold text-foreground">Security Center</Link></li>
              <li><Link href="/security#rbac" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">PBAC Permissions Matrix</Link></li>
              <li><Link href="/security#audit" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">SHA-256 Audit Trails</Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">DPDP & Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-foreground dark:hover:text-white transition-colors block hover:translate-x-0.5 transition-transform">About Nighwan Tech</Link></li>
            </ul>
          </div>

        </div>

        {/* INDIAN CITIES NETWORK SEO BAR */}
        <div className="p-5 sm:p-6 rounded-2xl bg-background/80 dark:bg-slate-900/40 border border-border/80 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-muted-foreground dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-foreground dark:text-slate-300">
              <Globe className="w-4 h-4 text-emerald-500" /> AIWCRM ENTERPRISE NETWORK ACROSS INDIA:
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">25+ Metro Nodes</span>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground dark:text-slate-300">
            {[
              { name: 'Delhi NCR', slug: 'delhi' },
              { name: 'Mumbai', slug: 'mumbai' },
              { name: 'Bangalore', slug: 'bangalore' },
              { name: 'Hyderabad', slug: 'hyderabad' },
              { name: 'Pune', slug: 'pune' },
              { name: 'Ahmedabad', slug: 'ahmedabad' },
              { name: 'Jaipur', slug: 'jaipur' },
              { name: 'Chandigarh & Mohali', slug: 'chandigarh' },
              { name: 'Chennai', slug: 'chennai' },
              { name: 'Kolkata', slug: 'kolkata' },
              { name: 'Surat', slug: 'surat' },
              { name: 'Lucknow', slug: 'lucknow' },
              { name: 'Patna', slug: 'patna' },
              { name: 'Ranchi', slug: 'ranchi' },
              { name: 'Gaya Ji', slug: 'gaya' },
              { name: 'Muzaffarpur', slug: 'muzaffarpur' },
              { name: 'Bhagalpur', slug: 'bhagalpur' },
              { name: 'Dhanbad', slug: 'dhanbad' },
              { name: 'Jamshedpur', slug: 'jamshedpur' },
              { name: 'Indore', slug: 'indore' },
              { name: 'Bhopal', slug: 'bhopal' },
              { name: 'Nagpur', slug: 'nagpur' },
              { name: 'Varanasi', slug: 'varanasi' },
              { name: 'Dehradun', slug: 'dehradun' },
              { name: 'Raipur', slug: 'raipur' },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/whatsapp-crm-${c.slug}`}
                className="px-2.5 py-1 rounded-lg bg-card dark:bg-slate-900 hover:bg-emerald-500/10 text-muted-foreground dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 border border-border/80 dark:border-slate-800 hover:border-emerald-500/40 transition-all font-medium"
              >
                AIWCRM {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR & COPYRIGHT */}
        <div className="border-t border-border/80 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground dark:text-slate-400 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} AIWCRM by Nighwan Technology Pvt. Ltd. All rights reserved.</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> Made in India
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <Link href="/legal/terms" className="hover:text-foreground dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/legal/privacy-policy" className="hover:text-foreground dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/return-refund" className="hover:text-foreground dark:hover:text-white transition-colors">Return & Refund</Link>
            <Link href="/docs/security-compliance/security-vault-compliance-guide" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500" /> Trust Center
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
