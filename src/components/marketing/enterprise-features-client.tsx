'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Bot,
  Kanban,
  Send,
  GitBranch,
  Mic,
  Code2,
  BarChart3,
  Users,
  Building2,
  Lock,
  Zap,
  Clock,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Layers,
  Award,
  Globe,
  DollarSign,
  Activity,
  Check,
  ChevronRight,
  Play,
  Cpu,
  RefreshCw,
  PhoneCall,
  Server,
  FileCheck,
  AlertTriangle,
  Heart,
  GraduationCap,
  ShoppingCart,
  Home,
  Landmark,
  Quote,
  Search,
  X,
  Star,
  ExternalLink,
  ArrowDown,
  Presentation
} from 'lucide-react';
import { FALLBACK_FEATURES_CATALOG } from '@/lib/services/features-cms.service';

/* ─── useCountUp Hook: Animated counter on scroll intersection ─── */
function useCountUp(end: number, duration = 2000, suffix = '') {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { ref, display: `${count}${suffix}` };
}

/* ─── useScrollReveal Hook: Intersection-based fade-in-up ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: visible ? 'feat-animate-fade-in-up' : 'opacity-0' };
}

export function EnterpriseFeaturesClient() {
  // Section 2: Explorer Tab State
  const [activeModule, setActiveModule] = useState('ai');
  // Section 5: Interactive Hotspot State
  const [activeHotspot, setActiveHotspot] = useState('inbox');
  // Section 8: Active Industry Tab State
  const [activeIndustry, setActiveIndustry] = useState('mfg');
  // Section 10: Active Case Study State
  const [activeCaseStudy, setActiveCaseStudy] = useState('education');
  // Section 11: Expandable Feature Category State
  const [openCategory, setOpenCategory] = useState<string | null>('AI Platform');
  // Section 11: Search State & Features State
  const [featureSearch, setFeatureSearch] = useState('');
  const [cmsFeatures, setCmsFeatures] = useState<any[]>(FALLBACK_FEATURES_CATALOG);

  // Counter hooks for Section 7
  const counter1 = useCountUp(80, 2000, '%');
  const counter2 = useCountUp(60, 2000, '%');
  const counter3 = useCountUp(3, 1800, '.2x');
  const counter4 = useCountUp(99, 2200, '.99%');
  const counter5 = useCountUp(40, 2000, '%');

  // Scroll reveal hooks
  const reveal1 = useScrollReveal();
  const reveal2 = useScrollReveal();
  const reveal3 = useScrollReveal();
  const reveal4 = useScrollReveal();
  const reveal5 = useScrollReveal();
  const reveal6 = useScrollReveal();
  const reveal7 = useScrollReveal();
  const reveal8 = useScrollReveal();
  const reveal9 = useScrollReveal();
  const reveal10 = useScrollReveal();
  const reveal11 = useScrollReveal();
  const reveal12 = useScrollReveal();
  const reveal13 = useScrollReveal();

  useEffect(() => {
    fetch('/api/admin/features')
      .then((res) => res.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          setCmsFeatures(data.features);
        }
      })
      .catch(() => {});
  }, []);

  const explorerModules = [
    {
      id: 'ai',
      label: 'AI Platform',
      tag: 'BYOK Multi-LLM Engine',
      icon: Bot,
      title: 'BYOK Multi-Model AI Routing with 0% Token Markup',
      desc: 'Connect Google Gemini 3.6, OpenAI GPT-4o, Claude 3.5, Groq, or DeepSeek directly. Zero vendor markup, sub-1s auto-failover, and 0-token greeting cache.',
      image: '/ai-mockup.png',
      highlights: [
        'Verified 0% Platform Token Markup',
        'Sub-1s Self-Healing Auto Failover',
        '0-Token Instant Greeting Cache',
        'BYOK Multi-Model Key Management'
      ],
      slug: '/features/byok',
      interactiveBadge: '⚡ Gemini 3.6 → Groq LLaMA 3.3 in 84ms'
    },
    {
      id: 'crm',
      label: 'Sales CRM',
      tag: 'Kanban Pipelines',
      icon: Kanban,
      title: 'Visual Drag-and-Drop WhatsApp Sales Kanban',
      desc: 'Turn conversations into pipeline stages. Track lead values, automated deal progression, and sales rep performance in real-time.',
      image: '/pipeline-mockup.png',
      highlights: [
        'Visual Stage-Based Deal Pipeline',
        'Automated Follow-Up Reminders',
        'Revenue Attribution Analytics',
        'Custom Pipeline Fields'
      ],
      slug: '/features/crm-pipeline',
      interactiveBadge: '📈 ₹12.4 Lakhs Pipeline Generated'
    },
    {
      id: 'inbox',
      label: 'Shared Inbox',
      tag: 'Multi-Agent Support',
      icon: MessageSquare,
      title: 'Multi-Agent Shared Team Inbox with Collision Detection',
      desc: 'Unify sales and support reps on a single WhatsApp number with live typing collision alerts, private internal notes, and auto-assignment.',
      image: '/inbox-mockup.png',
      highlights: [
        'Unlimited Agent & Team Access',
        'Real-Time Collision Detection',
        'Private Internal @Mention Notes',
        'Round-Robin Auto Assignment'
      ],
      slug: '/features/shared-inbox',
      interactiveBadge: '👥 12 Agents Active • 0 Typing Collisions'
    },
    {
      id: 'voice',
      label: 'Voice AI',
      tag: 'Multi-Provider Voice AI',
      icon: Mic,
      title: 'Multi-Provider Voice AI — Retell & ElevenLabs',
      desc: 'Deploy AI voice agents using Retell AI or ElevenLabs (native Hindi voices). Every call extracts structured CRM intelligence — sentiment, buying signals, lead score — and syncs to Contacts, Deals, and Tasks automatically.',
      image: '/crm-mockup.png',
      highlights: [
        'Retell AI & ElevenLabs — switchable providers',
        'Native Hindi voices: Priya & Arjun (ElevenLabs)',
        'Post-call AI intelligence → Lead Score, Sentiment, Stage',
        'WhatsApp follow-up auto-triggered after every call'
      ],
      slug: '/features/voice-ai',
      interactiveBadge: '✨ ElevenLabs Call Complete · Lead Score: 87 · Buying Signal Detected'
    },
    {
      id: 'marketing',
      label: 'Marketing',
      tag: 'Broadcast Campaigns',
      icon: Send,
      title: 'Meta Official WhatsApp Broadcast Campaigns',
      desc: 'Run targeted broadcast campaigns to 100,000+ contacts with 98% open rates, interactive rich media templates, and live CTA tracking.',
      image: '/broadcast-mockup.png',
      highlights: [
        '98% Guaranteed Open Rates',
        'Interactive Action Buttons & Lists',
        'Audience Segmentation Filters',
        'Direct Meta API Conversation Rates'
      ],
      slug: '/features/broadcast-campaigns',
      interactiveBadge: '🚀 50,000 Broadcast Delivered • 98% Open Rate'
    },
    {
      id: 'meta-ads',
      label: 'Meta Ads',
      tag: 'AI Ad Creation',
      icon: Presentation,
      title: 'AI Meta Ads & Direct Lead Sync',
      desc: 'Generate high-converting Facebook and Instagram ads using AI. Connect Lead Ads directly to your WhatsApp CRM so incoming prospects receive instant personalized replies.',
      image: '/pipeline-mockup.png',
      highlights: [
        'AI Ad Copy & Creative Generation',
        'Instant Facebook Lead Ad Sync',
        'Automated First-Touch WhatsApp Reply',
        'Campaign ROI Attribution'
      ],
      slug: '/features/meta-ads',
      interactiveBadge: '✨ AI Ad Generated & 42 Leads Synced'
    },
    {
      id: 'automation',
      label: 'Automation',
      tag: 'Visual Workflow Builder',
      icon: GitBranch,
      title: 'No-Code Visual Workflow Builder',
      desc: 'Design complex automated customer journeys with visual triggers, AI evaluation nodes, webhook actions, and CRM stage updates.',
      image: '/flow-mockup.png',
      highlights: [
        'Visual Drag-and-Drop Nodes',
        'Webhook Trigger & Webhook Action',
        'Conditional AI Branching',
        '35+ Hours Saved Per Rep / Month'
      ],
      slug: '/features/workflow-automation',
      interactiveBadge: '🔄 35 Hours Rep Time Saved This Month'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      tag: 'Real-Time ROI',
      icon: BarChart3,
      title: 'Executive Telemetry & Conversation ROI Dashboards',
      desc: 'Track response time SLAs, resolution speed, team productivity, and revenue attribution across every WhatsApp campaign.',
      image: '/dashboard-mockup.png',
      highlights: [
        'Real-Time Resolution SLAs',
        'Agent Productivity Heatmaps',
        'Campaign Revenue Attribution',
        'Exportable CSV/PDF Reports'
      ],
      slug: '/features/analytics',
      interactiveBadge: '📊 Resolution SLA: 99.4% Under 2 Mins'
    },
    {
      id: 'developer',
      label: 'Developer Platform',
      tag: 'APIs & Webhooks',
      icon: Code2,
      title: 'Sub-50ms REST Developer APIs & Webhook Verification',
      desc: 'Programmatic access to send templates, query CRM deals, execute AI routing, and receive sub-50ms real-time webhook events with HMAC-SHA256 cryptographic signature verification and exponential backoff retries.',
      image: '/automation-mockup.png',
      highlights: [
        'HMAC-SHA256 Signature Verification',
        'Automatic Exponential Backoff Retries',
        'SDKs for Node.js, Python, cURL, Go',
        'Sub-50ms Event Delivery & Latency Logs'
      ],
      slug: '/features/api',
      interactiveBadge: '⚡ API Latency: 32ms Average Dispatch · HMAC Verified'
    },
    {
      id: 'security',
      label: 'Security & Governance',
      tag: 'Enterprise Governance',
      icon: ShieldCheck,
      title: 'Enterprise RBAC, Audit Logging & Governance',
      desc: '6-tier Role-Based Access Control (Owner, Admin, Manager, Agent, Client, Viewer), immutable audit trail with IP metadata, effective permission inspector, and 100% Meta Cloud API compliance.',
      image: '/dashboard-mockup.png',
      highlights: [
        '6-Tier Role-Based Access Control (RBAC)',
        'Immutable Real-Time Audit Trail (IP & UA)',
        'Effective Permission Matrix Inspector',
        '100% Meta Official Cloud API Ban Protection'
      ],
      slug: '/features/security',
      interactiveBadge: '🛡️ Enterprise RBAC & SOC2-Ready Audit Logging'
    }
  ];

  const currentModule = explorerModules.find((m) => m.id === activeModule) || explorerModules[0];

  const hotspots = [
    { id: 'inbox', label: 'Shared Inbox', top: '22%', left: '18%', desc: 'Multi-agent inbox with collision prevention and round-robin auto-assignment.' },
    { id: 'crm', label: 'Kanban CRM', top: '38%', left: '48%', desc: 'Drag-and-drop visual deals pipeline with automated stage progression.' },
    { id: 'broadcast', label: 'Meta Broadcasts', top: '55%', left: '78%', desc: 'High-volume targeted broadcast campaigns with 98% open rates.' },
    { id: 'ai', label: 'BYOK AI Router', top: '72%', left: '32%', desc: 'Multi-LLM zero token markup routing with sub-1s auto failover.' }
  ];

  const categories = [
    'AI Platform',
    'Sales CRM',
    'Customer Support',
    'Marketing',
    'Meta Ads',
    'Automation',
    'Analytics',
    'Developer Platform',
    'Security'
  ];

  const categoryIcons: Record<string, any> = {
    'AI Platform': Bot,
    'Sales CRM': Kanban,
    'Customer Support': MessageSquare,
    'Marketing': Send,
    'Meta Ads': Presentation,
    'Automation': GitBranch,
    'Analytics': BarChart3,
    'Developer Platform': Code2,
    'Security': ShieldCheck
  };

  const industryData = [
    {
      id: 'mfg',
      title: 'Manufacturing & B2B',
      tag: 'Supply Chain Automation',
      icon: Building2,
      desc: 'Automate distributor inquiries, catalog PDFs, stock availability checks, and order status updates directly via WhatsApp.',
      outcome: '45% Faster Order Processing',
      workflowSteps: ['Distributor PDF Request', 'AI Inventory Lookup', 'Instant Catalog Dispatch', 'Order Confirmation'],
      testimonial: 'Distributor orders processed 2x faster with zero manual intervention.',
      image: '/automation-mockup.png'
    },
    {
      id: 'health',
      title: 'Healthcare & Clinics',
      tag: 'Patient Appointment Booking',
      icon: Heart,
      desc: 'HIPAA-compliant appointment booking reminders, doctor consultation routing, and automated lab report dispatches on WhatsApp.',
      outcome: '3x More Appointments Booked',
      workflowSteps: ['Inbound Patient Inquiry', 'Doctor Slot Selection', 'Automated Confirmation', 'WhatsApp Lab Report Link'],
      testimonial: 'No-show rates dropped by 65% after introducing WhatsApp appointment reminders.',
      image: '/inbox-mockup.png'
    },
    {
      id: 'edu',
      title: 'Education & Admissions',
      tag: 'Student Lead Conversion',
      icon: GraduationCap,
      desc: 'AI counseling chatbots, campus visit scheduling, fee payment alerts, and automated admissions counseling.',
      outcome: '80% Faster Lead Response',
      workflowSteps: ['Student Inbound Chat', 'AI Counselor Screening', 'Campus Tour Scheduling', 'Fee Payment Link'],
      testimonial: 'AIWCRM handled over 50,000 student admission inquiries with an 80% response speed improvement.',
      image: '/ai-mockup.png'
    },
    {
      id: 'd2c',
      title: 'Retail & D2C Brands',
      tag: 'Cart Recovery & Sales',
      icon: ShoppingCart,
      desc: 'Recover abandoned carts with personalized discount coupons via official Meta WhatsApp broadcast campaigns.',
      outcome: '32% Cart Recovery Rate',
      workflowSteps: ['Shopify Cart Abandoned', 'WhatsApp Coupon Trigger', 'One-Click Buy Button', 'Order Tracking Update'],
      testimonial: 'Recovered over ₹15 Lakhs in abandoned cart revenue in our very first month.',
      image: '/broadcast-mockup.png'
    },
    {
      id: 'realestate',
      title: 'Real Estate & Builders',
      tag: 'Property Lead Management',
      icon: Home,
      desc: 'Send property site visit videos, digital brochures, floor plans, and automated broker lead routing.',
      outcome: '2.5x More Site Visits Scheduled',
      workflowSteps: ['Property Ad Click', 'AI Brochure Dispatch', 'Site Visit Scheduling', 'Broker Round-Robin Routing'],
      testimonial: 'Site visit conversions doubled within 30 days of implementing visual property workflows.',
      image: '/pipeline-mockup.png'
    },
    {
      id: 'bfsi',
      title: 'BFSI & Fintech',
      tag: 'KYC & Loan Verification',
      icon: Landmark,
      desc: 'Secure document collection, loan status updates, automated EMI reminders, and fraud alert dispatches via WhatsApp.',
      outcome: '60% Faster KYC Completion',
      workflowSteps: ['Document Upload Link', 'OCR Identity Check', 'Instant Approval Alert', 'EMI Reminder Schedule'],
      testimonial: 'Customer document verification time reduced from 2 days to under 10 minutes.',
      image: '/crm-mockup.png'
    }
  ];

  const currentIndustry = industryData.find((i) => i.id === activeIndustry) || industryData[0];

  const caseStudies = [
    {
      id: 'education',
      client: 'BPTPIA Admissions Group',
      vertical: 'Educational Institution Chain',
      region: 'Delhi NCR & Pan-India',
      roi: '120x Net ROI',
      revenue: '₹6.5 Lakhs/mo Lift',
      quote: "AIWCRM's AI auto-responder and Voice AI agents transformed our peak admission season — 80% faster response times and a ₹6.5 Lakh monthly revenue lift.",
      challenge: 'High lead drop-offs on student inquiries during peak admission season across 12 campus locations.',
      solution: 'Deployed Gemini AI auto-responder & Multi-Provider Voice AI (Retell + ElevenLabs with Hindi voices) for 24/7 student engagement & instant campus tour booking.',
      results: [
        { metric: '80%', label: 'Faster Lead Response' },
        { metric: '₹6.5L', label: 'Monthly Revenue Lift' },
        { metric: '100%', label: 'Official Meta Compliance' }
      ],
      image: '/ai-mockup.png'
    },
    {
      id: 'manufacturing',
      client: 'Apex Industrial Parts',
      vertical: 'B2B Auto Components Manufacturer',
      region: 'Pune & Mumbai',
      roi: '95x Net ROI',
      revenue: '45% Order Speedup',
      quote: 'With AIWCRM BYOK AI routing, our distributors check catalog availability and place PO orders directly on WhatsApp 24/7.',
      challenge: 'Distributor orders took up to 24 hours to process through scattered phone calls and manual emails.',
      solution: 'Implemented WhatsApp Catalog Automation + BYOK Gemini AI with 0% token markup and sub-50ms webhooks.',
      results: [
        { metric: '45%', label: 'Faster Order Speed' },
        { metric: '0%', label: 'Platform Token Markup' },
        { metric: '95x', label: 'Verified Net ROI' }
      ],
      image: '/automation-mockup.png'
    },
    {
      id: 'd2c',
      client: 'Veda Organics Skincare',
      vertical: 'D2C E-Commerce Brand',
      region: 'Bangalore',
      roi: '140x Net ROI',
      revenue: '32% Cart Recovery',
      quote: 'Meta Official Broadcast campaigns on AIWCRM generated 98% open rates and recovered ₹18 Lakhs in cart revenue.',
      challenge: 'High abandoned cart rates on Shopify with traditional SMS marketing delivering sub-5% open rates.',
      solution: 'Meta official WhatsApp broadcast campaigns with interactive action buttons and automated cart dispatches.',
      results: [
        { metric: '32%', label: 'Cart Recovery Rate' },
        { metric: '98%', label: 'Campaign Open Rate' },
        { metric: '140x', label: 'Verified Net ROI' }
      ],
      image: '/broadcast-mockup.png'
    }
  ];

  const currentCaseStudy = caseStudies.find((c) => c.id === activeCaseStudy) || caseStudies[0];

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground text-left selection:bg-emerald-500/30" role="main">
      
      {/* ─── SECTION 1: ENTERPRISE HERO SHOWCASE ─── */}
      <section
        ref={reveal1.ref}
        aria-labelledby="hero-heading"
        className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-36 bg-background"
      >
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-gradient-to-tr from-emerald-500/12 via-teal-500/8 to-blue-500/8 blur-[200px] rounded-full feat-animate-gradient" />
          <div className="absolute bottom-[-100px] right-[-200px] w-[600px] h-[400px] bg-gradient-to-bl from-purple-500/6 to-emerald-500/4 blur-[150px] rounded-full" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 text-center">
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 backdrop-blur-sm shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Enterprise-Grade WhatsApp AI Platform</span>
            </div>

            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
              The All-in-One{' '}
              <span className="aiwcrm-gradient-text font-black">
                AI Platform
              </span>{' '}
              for WhatsApp Business
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Unify sales, marketing, and customer support on WhatsApp with BYOK multi-model AI routing,
              Multi-Provider Voice AI (Retell + ElevenLabs), visual Kanban pipelines, and Meta official broadcast campaigns —
              all with zero platform token markup.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/free-trial"
                className="feat-cta-shimmer flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-10 text-sm transition-all shadow-xl shadow-emerald-500/25 gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                aria-label="Start your free 7-day trial of AIWCRM"
              >
                Start 7-Day Free Trial <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/book-demo"
                className="flex h-14 items-center justify-center rounded-full border border-border bg-card hover:bg-muted px-8 text-sm font-bold text-foreground transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                aria-label="Book a live product demo"
              >
                <Play className="h-4 w-4 mr-2" aria-hidden="true" /> Watch Live Demo
              </Link>
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> Meta Official Partner</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> 99.99% Uptime SLA</span>
              <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> SOC2 & GDPR Compliant</span>
              <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> 0% Token Markup</span>
            </div>
          </div>

          {/* MacBook-style Hero Dashboard Frame */}
          <div className="relative pt-4 max-w-6xl mx-auto feat-perspective-card">
            
            {/* Floating Glass Badges */}
            <div className="hidden lg:flex absolute -top-2 -left-8 z-20 p-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl space-y-1.5 text-left w-60 feat-animate-float">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Zap className="h-4 w-4" aria-hidden="true" /> 0-Token Greeting Cache
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">&lt;100ms instant reply dispatch</p>
              </div>
            </div>

            <div className="hidden lg:flex absolute top-1/3 -right-10 z-20 p-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl space-y-1.5 text-left w-64 feat-animate-float-delayed">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Bot className="h-4 w-4" aria-hidden="true" /> BYOK AI Auto-Failover
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">Gemini 3.6 → Groq LLaMA 3.3 in &lt;1s</p>
              </div>
            </div>

            <div className="hidden lg:flex absolute bottom-12 -left-4 z-20 p-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl space-y-1.5 text-left w-56 feat-animate-float" style={{ animationDelay: '3s' }}>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" /> Live Revenue Tracking
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">₹12.4L pipeline this month</p>
              </div>
            </div>

            {/* MacBook Frame */}
            <div className="rounded-2xl sm:rounded-3xl border border-border/60 bg-card/80 backdrop-blur-2xl p-3 sm:p-5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden group relative">
              {/* Browser Chrome */}
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" aria-hidden="true" />
                  <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" aria-hidden="true" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-muted/50 border border-border/40 text-xs text-muted-foreground font-mono">
                  <Lock className="h-3 w-3" aria-hidden="true" /> app.aiwcrm.com/dashboard
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-extrabold border border-emerald-500/30">
                  ● Live
                </span>
              </div>

              <figure className="overflow-hidden rounded-xl sm:rounded-2xl border border-border/30 relative">
                <img
                  src="/dashboard-mockup.png"
                  alt="AIWCRM Enterprise Command Center Dashboard showing multi-agent inbox, AI routing panel, and sales pipeline overview"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  loading="eager"
                  width={1920}
                  height={1080}
                />
              </figure>
            </div>

            {/* MacBook Base */}
            <div className="hidden sm:block mx-auto w-[120px] h-[6px] bg-gradient-to-b from-border/60 to-border/20 rounded-b-xl" aria-hidden="true" />
            <div className="hidden sm:block mx-auto w-[280px] h-[3px] bg-border/30 rounded-b-lg" aria-hidden="true" />
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: INTERACTIVE PRODUCT EXPLORER ─── */}
      <section
        ref={reveal2.ref}
        aria-labelledby="explorer-heading"
        className={`py-24 lg:py-32 bg-card/30 ${reveal2.className}`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Interactive Product Explorer</span>
            <h2 id="explorer-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Explore Every Platform Module
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Select any module below to see live UI previews, architecture highlights, and key capabilities.
            </p>
          </header>

          {/* Module Navigation Pills */}
          <nav aria-label="Product module navigation" className="flex flex-wrap items-center justify-center gap-2">
            {explorerModules.map((mod) => {
              const IconComp = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  aria-pressed={isActive}
                  aria-label={`Explore ${mod.label} module`}
                  className={`feat-focus-ring flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-emerald-500/30'
                  }`}
                >
                  <IconComp className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{mod.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Module Showcase Display */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-card p-6 sm:p-8 lg:p-10 rounded-3xl border border-border/80 shadow-2xl">
            
            {/* Left: Description & Highlights */}
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-extrabold uppercase border border-emerald-500/30">
                {currentModule.tag}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                {currentModule.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentModule.desc}
              </p>

              <div className="space-y-3 pt-2">
                {currentModule.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href={currentModule.slug}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Explore {currentModule.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right: Live UI Preview with Interactive Chrome & Badge */}
            <div className="lg:col-span-8 feat-perspective-card">
              <div className="rounded-2xl border border-border/60 overflow-hidden bg-background shadow-xl relative">
                {/* Live Interactive Telemetry Badge Header */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" aria-hidden="true" />
                    <span className="ml-2 text-[10px] font-mono text-muted-foreground font-bold">{currentModule.label} Module</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    {currentModule.interactiveBadge}
                  </span>
                </div>
                <figure className="relative">
                  <img
                    src={currentModule.image}
                    alt={`${currentModule.title} — live product interface screenshot`}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/dashboard-mockup.png'; }}
                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                </figure>
              </div>
            </div>

          </article>

        </div>
      </section>

      {/* ─── SECTION 3: ENTERPRISE DATA FLOW ARCHITECTURE ─── */}
      <section
        ref={reveal3.ref}
        aria-labelledby="dataflow-heading"
        className={`py-24 lg:py-32 bg-background ${reveal3.className}`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">System Architecture</span>
            <h2 id="dataflow-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              End-to-End Enterprise Data Flow
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              See how AIWCRM routes incoming customer messages through zero-latency AI engines into your CRM pipeline — in real time.
            </p>
          </header>

          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-8">
            {/* Single-line Flow: All 6 nodes with animated dots */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { step: '01', name: 'Customer', sub: 'WhatsApp Lead', color: 'text-emerald-400', glow: false },
                { step: '02', name: 'Meta API', sub: 'Cloud Webhook', color: 'text-blue-400', glow: false },
                { step: '03', name: 'AI Router', sub: 'BYOK Model Select', color: 'text-emerald-300', glow: true },
                { step: '04', name: 'Multi-LLM', sub: 'Gemini/GPT/Groq', color: 'text-purple-400', glow: false },
                { step: '05', name: 'CRM Pipeline', sub: 'Kanban Lead Stage', color: 'text-amber-400', glow: false },
                { step: '06', name: 'Analytics', sub: 'Real-Time Telemetry', color: 'text-emerald-400', glow: false },
              ].flatMap((node, idx, arr) => {
                const card = (
                  <div
                    key={`node-${idx}`}
                    className={`shrink-0 p-4 sm:p-5 rounded-2xl border space-y-2 text-center transition-all duration-300 hover:scale-105 min-w-[120px] ${
                      node.glow
                        ? 'bg-emerald-500/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-500 block">{node.step}</span>
                    <span className={`${node.color} font-black text-sm block`}>{node.name}</span>
                    <p className="text-[10px] text-slate-400">{node.sub}</p>
                  </div>
                );

                if (idx < arr.length - 1) {
                  const dots = (
                    <div key={`dot-${idx}`} className="shrink-0 flex items-center gap-1 px-1" aria-hidden="true">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" style={{ animation: 'feat-pulse-dot 1.5s ease infinite', animationDelay: `${idx * 0.3}s` }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" style={{ animation: 'feat-pulse-dot 1.5s ease infinite', animationDelay: `${idx * 0.3 + 0.2}s` }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" style={{ animation: 'feat-pulse-dot 1.5s ease infinite', animationDelay: `${idx * 0.3 + 0.4}s` }} />
                    </div>
                  );
                  return [card, dots];
                }
                return [card];
              })}
            </div>

            {/* Performance Summary Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Webhook Dispatch', value: '<50ms', icon: Zap },
                { label: 'Token Markup', value: '0%', icon: DollarSign },
                { label: 'Auto-Failover', value: '<1 Second', icon: RefreshCw },
              ].map((metric, idx) => {
                const MetricIcon = metric.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                    <MetricIcon className="h-5 w-5 text-emerald-400 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-emerald-400 font-black text-sm">{metric.value}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{metric.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 4: CUSTOMER JOURNEY TIMELINE ─── */}
      <section
        ref={reveal4.ref}
        aria-labelledby="journey-heading"
        className={`py-24 lg:py-32 bg-gradient-to-b from-card/30 via-card/50 to-card/30 ${reveal4.className}`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Automation Lifecycle</span>
            <h2 id="journey-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              8-Step Automated Customer Journey
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              From first WhatsApp message to closed deal — every step automated with AI precision.
            </p>
          </header>

          {/* Timeline Grid */}
          <div className="relative">
            {/* Vertical Timeline Line (desktop only) */}
            <div className="feat-timeline-line hidden lg:block" aria-hidden="true" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { step: '01', title: 'Lead Inbound', desc: 'Prospect clicks WhatsApp Click-to-Chat ad or scans QR code.', icon: MessageSquare },
                { step: '02', title: '0-Token Greeting', desc: 'Instant catalog reply dispatches in <100ms with zero token cost.', icon: Zap },
                { step: '03', title: 'AI Intent Scoring', desc: 'Multi-LLM engine evaluates intent and tags buyer score (HOT 🔥).', icon: Bot },
                { step: '04', title: 'Kanban Auto-Creation', desc: 'Creates a deal card on your sales Kanban with custom fields.', icon: Kanban },
                { step: '05', title: 'Agent Assignment', desc: 'Round-robin routes high-intent lead to senior sales rep.', icon: Users },
                { step: '06', title: 'Voice AI Call (Retell / ElevenLabs)', desc: 'Triggers AI voice call — choose Retell or ElevenLabs with native Hindi support.', icon: PhoneCall },
                { step: '07', title: 'Automated Invoice', desc: 'Generates Razorpay payment link directly inside WhatsApp.', icon: FileCheck },
                { step: '08', title: '24/7 Retention', desc: 'AI auto-responder handles repeat support queries 24/7.', icon: RefreshCw },
              ].map((j, i) => {
                const StepIcon = j.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 group relative feat-animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* Step Number Circle */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                          <StepIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        </div>
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                          {j.step}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-foreground text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{j.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{j.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: INTERACTIVE DASHBOARD TOUR ─── */}
      <section
        ref={reveal5.ref}
        aria-labelledby="tour-heading"
        className={`py-24 lg:py-32 bg-background ${reveal5.className}`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Interactive Hotspot Tour</span>
            <h2 id="tour-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Click to Explore the Command Center
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Click any glowing hotspot on the dashboard to learn about that module.
            </p>
          </header>

          <div className="rounded-3xl border border-border bg-card p-3 sm:p-5 shadow-2xl relative">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/50 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" aria-hidden="true" />
              <span className="ml-3 text-[10px] font-mono text-muted-foreground">AIWCRM Command Center — Interactive Tour</span>
            </div>

            <figure className="relative overflow-hidden rounded-2xl">
              <img
                src="/dashboard-mockup.png"
                alt="AIWCRM interactive dashboard tour with clickable hotspots highlighting Shared Inbox, Kanban CRM, Meta Broadcasts, and BYOK AI Router"
                className="w-full h-auto object-cover rounded-2xl"
                loading="lazy"
              />

              {/* Pulsing Hotspot Markers */}
              {hotspots.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setActiveHotspot(h.id)}
                  style={{ top: h.top, left: h.left }}
                  aria-label={`Explore ${h.label}: ${h.desc}`}
                  aria-pressed={activeHotspot === h.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    activeHotspot === h.id ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                  }`}
                >
                  {/* Pulse Ring */}
                  <span className={`absolute inset-0 rounded-full feat-animate-pulse-ring ${activeHotspot === h.id ? 'bg-emerald-500/30' : 'bg-emerald-500/20'}`} aria-hidden="true" />
                  {/* Dot */}
                  <span className={`relative flex h-8 w-8 items-center justify-center rounded-full shadow-xl ${
                    activeHotspot === h.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900/90 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>

                  {/* Tooltip on active */}
                  {activeHotspot === h.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2.5 rounded-xl bg-card border border-emerald-500/30 shadow-2xl whitespace-nowrap z-30 text-left">
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">{h.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] whitespace-normal">{h.desc}</p>
                    </div>
                  )}
                </button>
              ))}
            </figure>

            {/* Active Hotspot Status Bar */}
            <div className="p-4 mt-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2" role="status" aria-live="polite">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
                {hotspots.find((h) => h.id === activeHotspot)?.label}
              </span>
              <span className="text-muted-foreground text-xs">
                {hotspots.find((h) => h.id === activeHotspot)?.desc}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: ENTERPRISE PRODUCT PILLARS (ASYMMETRIC BENTO GRID) ─── */}
      <section
        ref={reveal6.ref}
        aria-labelledby="pillars-heading"
        className={`py-24 lg:py-32 bg-gradient-to-b from-card/20 via-card/40 to-card/20 ${reveal6.className}`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Product Architecture</span>
            <h2 id="pillars-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              8 Enterprise Product Pillars
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Asymmetric modular design for enterprise-scale WhatsApp AI operations.
            </p>
          </header>

          {/* Asymmetric Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Bento Card 1 (Span 2 col): BYOK AI & Voice Platform */}
            <div className="lg:col-span-2 rounded-3xl bg-card border border-border/80 p-8 shadow-xl space-y-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all group relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                    <Bot className="h-4 w-4" aria-hidden="true" /> BYOK Multi-LLM + Multi-Provider Voice AI
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">0% Token Markup</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Multi-Model AI Engine & Voice Agents
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Route customer conversations through Gemini 3.6, OpenAI GPT-4o, Claude 3.5, Groq LLaMA, or DeepSeek R1 with zero vendor markup. Trigger AI voice calls via Retell AI or ElevenLabs (native Hindi voices, sub-310ms latency).
                </p>
              </div>

              <figure className="rounded-2xl border border-border/60 overflow-hidden bg-background relative mt-4">
                <img
                  src="/crm-mockup.png"
                  alt="AIWCRM BYOK Multi-Model AI Routing Interface"
                  className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
                />
              </figure>

              <div className="pt-4 flex items-center justify-between border-t border-border/40">
                <Link href="/features/byok" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:underline">
                  Explore BYOK AI Platform <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/features/voice-ai" className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:underline">
                  Explore Voice AI <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Bento Card 2: Visual Sales Kanban */}
            <div className="rounded-3xl bg-card border border-border/80 p-8 shadow-xl space-y-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all group relative overflow-hidden">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                  <Kanban className="h-4 w-4" aria-hidden="true" /> Visual Deals Kanban
                </div>
                <h3 className="text-2xl font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Visual Pipeline Tracking
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Drag and drop lead cards across custom stages. Auto-sync lead sentiment scores and conversation logs directly into contact profiles.
                </p>
              </div>

              <figure className="rounded-2xl border border-border/60 overflow-hidden bg-background relative mt-4">
                <img
                  src="/pipeline-mockup.png"
                  alt="AIWCRM Visual Sales Kanban Pipeline"
                  className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </figure>

              <Link href="/features/crm-pipeline" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-border/40 hover:underline">
                Explore Sales Kanban <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Bento Card 3: Multi-Agent Shared Inbox */}
            <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Shared Team Inbox
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time agent typing collision detection, private internal notes, and round-robin auto-assignment across unlimited reps.
                </p>
              </div>
              <Link href="/features/shared-inbox" className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between border-t border-border/40 pt-3">
                <span>Collision Prevention</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            {/* Bento Card 4: Meta Official Broadcasts */}
            <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-xl space-y-4 hover:border-blue-500/40 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit">
                  <Send className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Meta Broadcast Campaigns
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  High-volume WhatsApp template campaigns with 98% open rates, rich interactive buttons, and real-time conversation tracking.
                </p>
              </div>
              <Link href="/features/broadcast-campaigns" className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between border-t border-border/40 pt-3">
                <span>98% Open Rate</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            {/* Bento Card 5: Visual Workflow Automation */}
            <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-xl space-y-4 hover:border-purple-500/40 transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
                  <GitBranch className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  No-Code Workflows
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Visual trigger-action builder with AI evaluation nodes, webhooks, and conditional customer journey branching.
                </p>
              </div>
              <Link href="/features/workflow-automation" className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between border-t border-border/40 pt-3">
                <span>No-Code Builder</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            {/* Bento Card 6 (Span 2 col): Telemetry & Developer APIs */}
            <div className="lg:col-span-2 rounded-3xl bg-card border border-border/80 p-8 shadow-xl space-y-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                    <Code2 className="h-4 w-4" aria-hidden="true" /> Sub-50ms REST APIs & Executive Telemetry
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">99.99% SLA</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Developer Platform & Executive SLA Telemetry
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Programmatic template dispatches, live webhook streams, agent SLA resolution heatmaps, and enterprise RBAC security compliant with Meta Cloud API.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-border/40">
                <Link href="/features/api" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:underline">
                  Developer API Docs <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/features/analytics" className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5 hover:underline">
                  Telemetry Dashboards <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 7: BUSINESS OUTCOMES (ANIMATED COUNTERS) ─── */}
      <section
        ref={reveal7.ref}
        aria-labelledby="outcomes-heading"
        className={`py-24 lg:py-32 bg-slate-950 text-white relative overflow-hidden ${reveal7.className}`}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/8 blur-[200px] rounded-full" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-400">Proven Results</span>
            <h2 id="outcomes-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Enterprise Business Outcomes
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Measurable impact across response speed, cost savings, and revenue growth.
            </p>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4">
            {[
              { ref: counter1.ref, display: counter1.display, label: 'Faster Response', icon: Zap },
              { ref: counter2.ref, display: counter2.display, label: 'Lower AI Cost', icon: DollarSign },
              { ref: counter3.ref, display: counter3.display, label: 'Lead Conversion', icon: TrendingUp },
              { ref: counter4.ref, display: counter4.display, label: 'Platform Uptime', icon: Activity },
              { ref: counter5.ref, display: counter5.display, label: 'Rep Productivity', icon: Users },
            ].map((s, idx) => {
              const StatIcon = s.icon;
              return (
                <div
                  key={idx}
                  ref={s.ref}
                  className="px-2 py-5 sm:px-4 sm:py-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 text-center space-y-2.5 shadow-xl hover:border-emerald-500/30 transition-all duration-300"
                >
                  <StatIcon className="h-5 w-5 text-emerald-400 mx-auto" aria-hidden="true" />
                  <p className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight whitespace-nowrap feat-animate-counter-glow">
                    {s.display}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: INDUSTRY SOLUTIONS (INTERACTIVE SHOWCASE) ─── */}
      <section
        ref={reveal8.ref}
        aria-labelledby="industry-heading"
        className={`py-24 lg:py-32 bg-background ${reveal8.className}`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Industry Solutions</span>
            <h2 id="industry-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Purpose-Built Workflows per Vertical
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Select your industry to preview tailored WhatsApp AI workflows and business impact metrics.
            </p>
          </header>

          {/* Industry Navigation Tabs */}
          <nav aria-label="Industry navigation" className="flex flex-wrap items-center justify-center gap-2">
            {industryData.map((ind) => {
              const IndIcon = ind.icon;
              const isActive = activeIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  aria-pressed={isActive}
                  aria-label={`Show ${ind.title} workflow`}
                  className={`feat-focus-ring flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <IndIcon className="h-4 w-4" aria-hidden="true" />
                  <span>{ind.title.split('&')[0]}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Industry Visual Showcase Card */}
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card p-6 sm:p-10 rounded-3xl border border-border/80 shadow-2xl">
            
            {/* Left Column: Details & Workflow Steps */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-extrabold uppercase border border-emerald-500/30">
                {currentIndustry.tag}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                {currentIndustry.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentIndustry.desc}
              </p>

              {/* Quantifiable Impact Badge */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">Impact Metric</p>
                  <p className="text-base sm:text-lg font-black text-foreground">{currentIndustry.outcome}</p>
                </div>
              </div>

              {/* Workflow Steps Sequence */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-mono text-muted-foreground uppercase font-bold">Automated Workflow Sequence:</p>
                <div className="space-y-2">
                  {currentIndustry.workflowSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-foreground p-2.5 rounded-xl bg-background border border-border/60">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Screenshot & Quote Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-border/60 overflow-hidden bg-background shadow-xl">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-muted/20">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" aria-hidden="true" />
                  <span className="ml-2 text-[10px] font-mono text-muted-foreground">{currentIndustry.title} Workflow Preview</span>
                </div>
                <figure>
                  <img
                    src={currentIndustry.image}
                    alt={`${currentIndustry.title} WhatsApp Workflow Interface`}
                    className="w-full h-64 sm:h-80 object-cover"
                    loading="lazy"
                  />
                </figure>
              </div>

              {/* Testimonial Quote Pill */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-center gap-3">
                <Quote className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <p className="text-xs italic text-muted-foreground font-medium">{currentIndustry.testimonial}</p>
              </div>
            </div>

          </article>
        </div>
      </section>

      {/* ─── SECTION 9: INTEGRATIONS ECOSYSTEM ─── */}
      <section
        ref={reveal9.ref}
        aria-labelledby="integrations-heading"
        className={`py-24 lg:py-32 bg-gradient-to-b from-card/20 via-card/40 to-card/20 text-center ${reveal9.className}`}
      >
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <header className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Integrations Ecosystem</span>
            <h2 id="integrations-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Everything Connects to AIWCRM
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Seamlessly connect with your existing tools, AI models, and payment gateways.
            </p>
          </header>

          <div className="rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden p-8 sm:p-12 space-y-10">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/8 blur-[160px] rounded-full pointer-events-none" aria-hidden="true" />

            {/* Row 1: AI Model Providers */}
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 font-mono">AI Model Providers — BYOK</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { name: 'OpenAI GPT-4o', color: 'text-emerald-400', border: 'border-emerald-500/30 hover:border-emerald-500' },
                  { name: 'Google Gemini 3.6', color: 'text-blue-400', border: 'border-blue-500/30 hover:border-blue-500' },
                  { name: 'Anthropic Claude', color: 'text-purple-400', border: 'border-purple-500/30 hover:border-purple-500' },
                  { name: 'Groq LLaMA 3.3', color: 'text-amber-400', border: 'border-amber-500/30 hover:border-amber-500' },
                  { name: 'DeepSeek R1', color: 'text-cyan-400', border: 'border-cyan-500/30 hover:border-cyan-500' },
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-4 py-2.5 rounded-2xl bg-slate-900/80 border ${item.border} ${item.color} text-xs font-bold font-mono transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default flex items-center gap-2`}
                  >
                    <Bot className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Connecting Lines → Center Hub */}
            <div className="flex items-center justify-center gap-4 relative z-10" aria-hidden="true">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-slate-600" />
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" style={{ animation: 'feat-pulse-dot 2s ease infinite' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" style={{ animation: 'feat-pulse-dot 2s ease infinite', animationDelay: '0.3s' }} />
              </div>
              {/* Center Logo */}
              <div className="p-5 rounded-full bg-emerald-600 shadow-2xl shadow-emerald-500/30 relative">
                <Sparkles className="h-7 w-7 text-white" aria-hidden="true" />
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 feat-animate-pulse-ring" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" style={{ animation: 'feat-pulse-dot 2s ease infinite', animationDelay: '0.5s' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" style={{ animation: 'feat-pulse-dot 2s ease infinite', animationDelay: '0.8s' }} />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-700 to-slate-600" />
            </div>

            {/* Row 2: Tools & Services */}
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 font-mono">Tools & Services</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { name: 'Meta Cloud API', color: 'text-blue-400', border: 'border-blue-500/30 hover:border-blue-500', icon: Globe },
                  { name: 'Razorpay', color: 'text-blue-300', border: 'border-blue-400/30 hover:border-blue-400', icon: DollarSign },
                  { name: 'Google Sheets', color: 'text-green-400', border: 'border-green-500/30 hover:border-green-500', icon: Layers },
                  { name: 'Zapier', color: 'text-orange-400', border: 'border-orange-500/30 hover:border-orange-500', icon: Zap },
                  { name: 'Shopify', color: 'text-lime-400', border: 'border-lime-500/30 hover:border-lime-500', icon: ShoppingCart },
                  { name: 'Webhooks', color: 'text-slate-300', border: 'border-slate-600 hover:border-slate-500', icon: Code2 },
                  { name: 'REST APIs', color: 'text-teal-400', border: 'border-teal-500/30 hover:border-teal-500', icon: Server },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <span
                      key={idx}
                      className={`px-4 py-2.5 rounded-2xl bg-slate-900/80 border ${item.border} ${item.color} text-xs font-bold font-mono transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default flex items-center gap-2`}
                    >
                      <ItemIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {item.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Highlighted stat */}
            <div className="relative z-10 pt-2 flex items-center justify-center gap-8 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> Sub-50ms Webhooks</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> AES-256 Encryption</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> Auto-Failover</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: CUSTOMER SUCCESS CASE STUDIES ─── */}
      <section
        ref={reveal10.ref}
        aria-labelledby="success-heading"
        className={`py-24 lg:py-32 bg-background ${reveal10.className}`}
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Customer Success Stories</span>
            <h2 id="success-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Real Results from Enterprise Clients
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Read how leading enterprises scale WhatsApp revenue and customer engagement with AIWCRM.
            </p>
          </header>

          {/* Case Study Switcher Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {caseStudies.map((cs) => (
              <button
                key={cs.id}
                onClick={() => setActiveCaseStudy(cs.id)}
                aria-pressed={activeCaseStudy === cs.id}
                className={`feat-focus-ring px-6 py-3 rounded-full text-xs font-extrabold transition-all ${
                  activeCaseStudy === cs.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cs.client} ({cs.roi})
              </button>
            ))}
          </div>

          <article className="rounded-3xl bg-card border border-border overflow-hidden shadow-xl">
            {/* Header with Customer Info */}
            <div className="p-6 sm:p-8 border-b border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Award className="h-7 w-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">{currentCaseStudy.client}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">{currentCaseStudy.vertical} • {currentCaseStudy.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                  {currentCaseStudy.roi}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                  {currentCaseStudy.revenue}
                </span>
              </div>
            </div>

            {/* Quote Block */}
            <div className="p-6 sm:p-8 border-b border-border/40 bg-muted/20">
              <div className="flex gap-3">
                <Quote className="h-8 w-8 text-emerald-500/40 shrink-0 mt-1" aria-hidden="true" />
                <blockquote className="text-base sm:text-lg text-foreground font-medium italic leading-relaxed">
                  &ldquo;{currentCaseStudy.quote}&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Problem → Solution → Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/40">
              <div className="p-6 sm:p-8 md:col-span-4 space-y-2">
                <p className="text-muted-foreground font-mono text-[10px] uppercase font-bold tracking-wider">Business Challenge</p>
                <p className="text-xs text-foreground font-semibold leading-relaxed">{currentCaseStudy.challenge}</p>
              </div>
              <div className="p-6 sm:p-8 md:col-span-4 space-y-2">
                <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">AIWCRM Solution</p>
                <p className="text-xs text-foreground font-semibold leading-relaxed">{currentCaseStudy.solution}</p>
              </div>
              <div className="p-6 sm:p-8 md:col-span-4 space-y-3 bg-emerald-500/5">
                <p className="text-muted-foreground font-mono text-[10px] uppercase font-bold tracking-wider">Quantifiable KPIs</p>
                <div className="space-y-2">
                  {currentCaseStudy.results.map((res, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{res.label}</span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{res.metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ─── SECTION 11: FEATURE EXPLORER (40+ FEATURES) ─── */}
      <section
        ref={reveal11.ref}
        aria-labelledby="catalog-heading"
        className={`py-24 lg:py-32 bg-gradient-to-b from-card/20 via-card/40 to-card/20 ${reveal11.className}`}
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <header className="text-center max-w-3xl mx-auto space-y-5">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Feature Catalog</span>
            <h2 id="catalog-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Explore All 40+ Enterprise Features
            </h2>
            
            {/* Search with clear button */}
            <div className="relative max-w-md mx-auto pt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 mt-1 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                placeholder="Search features, capabilities, or modules..."
                aria-label="Search features"
                className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-10 text-xs font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 shadow-inner"
              />
              {featureSearch && (
                <button
                  onClick={() => setFeatureSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </header>

          <div className="space-y-3" role="list" aria-label="Feature categories">
            {categories.map((cat) => {
              const catFeats = cmsFeatures.filter((f) => {
                const matchesCat = f.category === cat;
                const matchesSearch =
                  !featureSearch ||
                  f.name?.toLowerCase().includes(featureSearch.toLowerCase()) ||
                  f.short_description?.toLowerCase().includes(featureSearch.toLowerCase()) ||
                  f.slug?.toLowerCase().includes(featureSearch.toLowerCase());
                return matchesCat && matchesSearch;
              });

              if (catFeats.length === 0) return null;
              const isSelected = openCategory === cat;
              const isOpen = isSelected || !!featureSearch;
              const CatIcon = categoryIcons[cat] || Layers;

              return (
                <div key={cat} className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm" role="listitem">
                  <button
                    onClick={() => {
                      if (isSelected && !featureSearch) {
                        setOpenCategory(null);
                      } else {
                        setOpenCategory(cat);
                      }
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`cat-${cat.replace(/\s/g, '-')}`}
                    className="feat-focus-ring w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-muted/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10">
                        <CatIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-foreground">{cat}</h3>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full font-bold">{catFeats.length}</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`} aria-hidden="true" />
                  </button>

                  <div
                    id={`cat-${cat.replace(/\s/g, '-')}`}
                    className="feat-accordion-content"
                    data-open={isOpen}
                    role="region"
                    aria-label={`${cat} features`}
                  >
                    <div className="feat-accordion-inner">
                      <div className="p-4 sm:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-border/40">
                        {catFeats.map((feat) => (
                          <Link
                            key={feat.slug}
                            href={`/features/${feat.slug}`}
                            className="p-4 rounded-2xl bg-background border border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-xs space-y-1.5 block group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{feat.name}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{feat.short_description}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 12: PLATFORM COMPARISON SHOWDOWN ─── */}
      <section
        ref={reveal12.ref}
        aria-labelledby="comparison-heading"
        className={`py-24 lg:py-32 bg-gradient-to-b from-background via-card/30 to-background ${reveal12.className}`}
      >
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <header className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Activity className="h-4 w-4" aria-hidden="true" /> Performance Comparison
            </span>
            <h2 id="comparison-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Traditional Legacy vs AIWCRM Enterprise
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              See why modern businesses choose AIWCRM for sub-100ms response speed, 0% AI cost markups, and enterprise-grade reliability.
            </p>
          </header>

          {/* Side-by-Side Showdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4 items-stretch max-w-5xl mx-auto relative">
            
            {/* VS Divider (desktop) */}
            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" aria-hidden="true">
              <div className="h-14 w-14 rounded-full bg-slate-900 border-2 border-rose-500/40 flex items-center justify-center text-sm font-black text-rose-400 shadow-xl" style={{ animation: 'feat-vs-pulse 3s ease-in-out infinite' }}>
                VS
              </div>
            </div>

            {/* Left: Traditional Business */}
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/10 border border-rose-500/20 space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase font-mono">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Traditional Stack
                </div>
                <h3 className="text-2xl font-black text-foreground">Scattered & Manual Operations</h3>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Response Speed', val: '4-Hour Manual Delay', icon: Clock },
                    { label: 'Team Setup', val: 'Scattered Personal Phones', icon: Users },
                    { label: 'AI Cost', val: '3x Vendor Markup', icon: DollarSign },
                    { label: 'Pipeline', val: 'Manual Excel Sheets', icon: Layers },
                    { label: 'Reliability', val: 'Single Points of Failure', icon: AlertTriangle },
                  ].map((item, idx) => {
                    const RowIcon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                        <RowIcon className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
                        <div className="flex-1">
                          <span className="text-[10px] text-muted-foreground uppercase block font-bold">{item.label}</span>
                          <span className="text-rose-600 dark:text-rose-300 font-extrabold">{item.val}</span>
                        </div>
                        <span className="text-rose-400 font-bold" aria-hidden="true">✕</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: AIWCRM Enterprise */}
            <div className="p-6 sm:p-8 pt-10 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-card to-emerald-950/20 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 space-y-6 flex flex-col justify-between relative">
              <div className="absolute top-4 right-5 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                RECOMMENDED
              </div>

              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase font-mono">
                  <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> AIWCRM Enterprise Engine
                </div>
                <h3 className="text-2xl font-black text-foreground">Instant, Unified & Automated</h3>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Response Speed', val: '<100ms 0-Token Instant Reply', icon: Zap },
                    { label: 'Team Setup', val: 'Multi-Agent Shared Inbox', icon: MessageSquare },
                    { label: 'AI Cost', val: '0% BYOK Direct Provider Rates', icon: DollarSign },
                    { label: 'Pipeline', val: 'Visual Kanban Sales Pipeline', icon: Kanban },
                    { label: 'Reliability', val: 'Sub-1s Self-Healing Failover', icon: RefreshCw },
                  ].map((item, idx) => {
                    const RowIcon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <RowIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                        <div className="flex-1">
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase block font-bold">{item.label}</span>
                          <span className="text-foreground font-extrabold">{item.val}</span>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold" aria-hidden="true">✓</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/free-trial"
                className="feat-cta-shimmer w-full flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/25 gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Switch to AIWCRM Enterprise →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 13: FINAL CONVERSION CTA ─── */}
      <section
        ref={reveal13.ref}
        aria-labelledby="final-cta-heading"
        className={`py-28 lg:py-36 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 text-white text-center relative overflow-hidden ${reveal13.className}`}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/8 blur-[180px] rounded-full feat-animate-gradient" />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.04),transparent_50%)]" />
        </div>

        <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-bold text-emerald-400 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Ready to Transform Your WhatsApp Business?
          </div>

          <h2 id="final-cta-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Start Your 7-Day Free Trial
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Test all 40+ features with zero platform token markup, full Meta Cloud API protection, 
            and enterprise-grade security — completely free for 7 days.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/free-trial"
              className="feat-cta-shimmer flex h-14 sm:h-16 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-10 sm:px-12 text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/25 gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Start your free 7-day trial of AIWCRM"
            >
              Start Free Trial <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/book-demo"
              className="flex h-14 sm:h-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-600 text-white font-bold px-10 sm:px-12 text-sm sm:text-base transition-all gap-2"
              aria-label="Book a live demo with our AIWCRM specialists"
            >
              Book Live Demo <Presentation className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> Free 7-day access</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" /> Cancel anytime</span>
          </div>
        </div>
      </section>

    </main>
  );
}
