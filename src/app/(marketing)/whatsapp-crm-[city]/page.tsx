import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  MessageSquare,
  Bot,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  PhoneCall,
  BarChart3,
  Globe,
  Building2,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Cpu,
  KeyRound,
  FileText,
  UserCheck,
  Send,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StripeStatsBanner } from '@/components/marketing/stats-banner';
import { AiNetworkDiagramSection } from '@/components/marketing/ai-network-diagram';
import { FailoverTimelineSection } from '@/components/marketing/failover-timeline';
import { InteractivePipelinePreview } from '@/components/marketing/interactive-pipeline-preview';
import { BeforeAfterTransformationSection } from '@/components/marketing/before-after-transformation';
import { IntegrationOrbitSection } from '@/components/marketing/integration-orbit';
import { ProductModulesSection } from '@/components/marketing/product-modules';
import { TestimonialCarousel, type Testimonial } from '@/components/marketing/testimonial-carousel';
import { createClient } from '@/lib/supabase/server';

export const CITY_DATA: Record<string, { name: string; state: string; headline: string; description: string; highlights: string[] }> = {
  patna: {
    name: 'Patna',
    state: 'Bihar',
    headline: '#1 AI WhatsApp CRM & Meta Ads Platform in Patna, Bihar',
    description: 'Empower your Patna education institutes, Real Estate, and Retail businesses with Meta-approved WhatsApp API, AI Meta Ads Integration, and Enterprise RBAC.',
    highlights: ['Trusted by leading Patna institutions and BPTPIA members', 'Instant setup with Multi-Model AI (Gemini 3.6 & BYOK)', 'Geo-Targeted WhatsApp Ads for Bihar'],
  },
  delhi: {
    name: 'Delhi NCR',
    state: 'Delhi',
    headline: '#1 WhatsApp CRM, Meta Ads & API Provider in Delhi NCR',
    description: 'Empower your Delhi NCR sales teams with Meta-approved WhatsApp Business API, AI-driven Meta Ads campaigns, and Enterprise Governance.',
    highlights: ['Serving 500+ businesses across Delhi, Gurgaon, and Noida', 'Enterprise RBAC and Multi-Agent Inbox', 'Geo-Targeted AI Meta Ads Setup'],
  },
  mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    headline: 'Leading WhatsApp CRM & Meta Ads Software in Mumbai',
    description: 'Scale your enterprise and small business sales in Mumbai with WhatsApp bulk broadcasts, AI Meta Ads integration, and LLM search optimizations.',
    highlights: ['Tailored for Mumbai real estate, retail, and e-commerce', 'AI-Powered WhatsApp Ads Generation', 'Enterprise Security & Governance'],
  },
  bangalore: {
    name: 'Bangalore',
    state: 'Karnataka',
    headline: 'Best WhatsApp CRM, AI Meta Ads & API for Startups in Bangalore',
    description: 'Built for fast-growing Bangalore tech startups and D2C brands. Run AI-powered Meta Ads, automate customer support, and turn WhatsApp chats into revenue.',
    highlights: ['AI Meta Ads Creation & Audience Targeting', 'BYOK Multi-Model AI (Gemini, OpenAI, Groq)', 'Developer-friendly webhooks & REST API integrations'],
  },
  hyderabad: {
    name: 'Hyderabad',
    state: 'Telangana',
    headline: 'Top WhatsApp CRM & AI Meta Ads Platform in Hyderabad',
    description: 'Transform customer engagement in Hyderabad with Meta-approved WhatsApp API, AI-generated Meta Ads, and 24/7 automated AI chatbots.',
    highlights: ['AI-Powered Meta Ads for Hyderabad businesses', '24/7 AI auto-responder with custom knowledge base', 'Enterprise RBAC & Multi-Agent Inbox'],
  },
  chennai: {
    name: 'Chennai',
    state: 'Tamil Nadu',
    headline: 'WhatsApp CRM, AI Meta Ads & Automation Platform in Chennai',
    description: 'Scale sales in Chennai with official WhatsApp Cloud API, AI Meta Ads campaigns, and enterprise-grade security & governance.',
    highlights: ['AI Meta Ads Campaigns for Chennai businesses', 'Enterprise RBAC & Role-Based Access Control', 'BYOK support with 0% AI token markup'],
  },
  pune: {
    name: 'Pune',
    state: 'Maharashtra',
    headline: 'WhatsApp Business API, Meta Ads & CRM Software in Pune',
    description: 'Grow your Pune business with seamless WhatsApp lead management, AI-driven Meta Ads, and Enterprise Security.',
    highlights: ['Fast onboarding for Pune manufacturing and educational institutes', 'AI Meta Ads Integration & Geo-Targeting', 'Enterprise RBAC and Multi-Agent Inbox'],
  },
  kolkata: {
    name: 'Kolkata',
    state: 'West Bengal',
    headline: 'Best WhatsApp CRM, AI Meta Ads & Chatbot Software in Kolkata',
    description: 'Automate sales in Kolkata with Meta-approved WhatsApp API, AI-generated Meta Ads campaigns, and smart AI auto-responders.',
    highlights: ['AI Meta Ads & Geo-Targeted Campaigns in Kolkata', 'Zero-Token Greeting Cache for instant AI replies', 'Multi-agent team inbox & enterprise deal tracking'],
  },
  ahmedabad: {
    name: 'Ahmedabad',
    state: 'Gujarat',
    headline: 'Top WhatsApp CRM, AI Meta Ads & Broadcast Software in Ahmedabad',
    description: 'Empower Ahmedabad manufacturing, textile, and D2C businesses with AI-powered Meta Ads, WhatsApp broadcast marketing, and enterprise security.',
    highlights: ['AI Meta Ads for Gujarat manufacturing & trade', 'High delivery Meta broadcast campaigns', 'Enterprise RBAC & AI Governance tools'],
  },
  jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    headline: 'Leading WhatsApp CRM, AI Meta Ads & Automation Software in Jaipur',
    description: 'Scale your Jaipur business with WhatsApp green-tick API, AI-powered Meta Ads creation, and automated lead qualification pipelines.',
    highlights: ['AI Meta Ads for Jaipur tourism, retail & education', 'Automated follow-up sequences & deal alerts', 'Multi-model AI (Gemini & OpenAI) with BYOK'],
  },
  chandigarh: {
    name: 'Chandigarh & Mohali',
    state: 'Punjab',
    headline: '#1 WhatsApp CRM & AI Meta Ads Platform in Chandigarh & Mohali',
    description: 'Streamline customer support for Chandigarh and Mohali with official WhatsApp API, AI Meta Ads campaigns, and enterprise-grade multi-agent team inbox.',
    highlights: ['AI Meta Ads for North India businesses', 'Automated appointment booking & lead followup', 'Enterprise RBAC & Meta Green Tick Verification'],
  },
  surat: {
    name: 'Surat',
    state: 'Gujarat',
    headline: 'Top WhatsApp CRM & AI Meta Ads Platform in Surat',
    description: 'Empower Surat textile, diamond, and D2C businesses with AI-powered Meta Ads, official WhatsApp Business API, and automated sales pipelines.',
    highlights: ['AI Meta Ads for Surat textile & diamond businesses', 'Meta-approved WhatsApp API with green-tick', 'Enterprise RBAC & Multi-Agent Inbox'],
  },
  lucknow: {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    headline: 'Leading WhatsApp CRM & AI Meta Ads Software in Lucknow',
    description: 'Scale your Lucknow business with official WhatsApp API, AI-powered Meta Ads creation, and 24/7 AI chatbots for sales and support.',
    highlights: ['AI Meta Ads for Lucknow retail & education businesses', '24/7 Gemini AI auto-responder', 'Enterprise RBAC & BYOK support'],
  },
  ranchi: {
    name: 'Ranchi',
    state: 'Jharkhand',
    headline: '#1 WhatsApp CRM & AI Meta Ads Provider in Ranchi',
    description: 'Empower Ranchi businesses with Meta-approved WhatsApp API, AI Meta Ads campaigns, and multi-agent team inbox for faster customer support.',
    highlights: ['AI Meta Ads for Ranchi businesses & startups', 'Instant Meta API setup in under 10 minutes', 'Local Jharkhand support & onboarding'],
  },
  gaya: {
    name: 'Gaya Ji',
    state: 'Bihar',
    headline: '#1 WhatsApp CRM & AI Meta Ads Platform in Gaya Ji, Bihar',
    description: 'Boost your Gaya Ji business with Meta-approved WhatsApp Business API, AI-generated Meta Ads, and multi-model AI chatbots for education, hospitality, and retail.',
    highlights: ['AI Meta Ads for Gaya hospitality & education sector', 'Gemini 3.6 AI with 0-Token Greeting Cache', 'Trusted by Bihar businesses'],
  },
  muzaffarpur: {
    name: 'Muzaffarpur',
    state: 'Bihar',
    headline: 'Best WhatsApp CRM & AI Meta Ads Software in Muzaffarpur',
    description: 'Scale your Muzaffarpur business with AI-powered Meta Ads, official WhatsApp Business API, and 24/7 AI customer support automation.',
    highlights: ['AI Meta Ads for Muzaffarpur retail & agri-businesses', 'BYOK Multi-Model AI (Gemini, OpenAI, Groq)', 'Multi-agent inbox & deal pipeline'],
  },
  bhagalpur: {
    name: 'Bhagalpur',
    state: 'Bihar',
    headline: 'Leading WhatsApp CRM & AI Meta Ads Platform in Bhagalpur',
    description: 'Empower Bhagalpur silk, textile, and retail businesses with Meta-approved WhatsApp API, AI-generated Meta Ads, and automated lead qualification.',
    highlights: ['AI Meta Ads for Bhagalpur silk & retail industry', 'Enterprise RBAC & multi-agent team inbox', 'Zero-token Greeting Cache for instant replies'],
  },
  dhanbad: {
    name: 'Dhanbad',
    state: 'Jharkhand',
    headline: 'Top WhatsApp CRM & AI Meta Ads Software in Dhanbad',
    description: 'Transform customer engagement in Dhanbad with official WhatsApp API, AI-powered Meta Ads campaigns, and enterprise-grade CRM pipelines.',
    highlights: ['AI Meta Ads for Dhanbad businesses', 'Automated follow-up & broadcast campaigns', 'Enterprise security & RBAC governance'],
  },
  jamshedpur: {
    name: 'Jamshedpur',
    state: 'Jharkhand',
    headline: 'Best WhatsApp CRM & AI Meta Ads Platform in Jamshedpur',
    description: 'Grow your Jamshedpur manufacturing, retail, and education business with Meta-approved WhatsApp API, AI Meta Ads, and automated sales pipelines.',
    highlights: ['AI Meta Ads for Jamshedpur manufacturing & retail', 'Multi-agent team inbox with smart routing', 'Enterprise RBAC & AI Governance'],
  },
  indore: {
    name: 'Indore',
    state: 'Madhya Pradesh',
    headline: 'Leading WhatsApp CRM & AI Meta Ads Platform in Indore',
    description: 'Scale your Indore business with official WhatsApp Business API, AI-powered Meta Ads creation, and automated CRM pipelines for faster sales closures.',
    highlights: ['AI Meta Ads for Indore retail, education & IT', 'Gemini 3.6 AI chatbot with BYOK support', 'Enterprise RBAC & Multi-Agent Inbox'],
  },
  bhopal: {
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    headline: '#1 WhatsApp CRM & AI Meta Ads Software in Bhopal',
    description: 'Empower Bhopal businesses with Meta-approved WhatsApp Business API, AI-generated Meta Ads campaigns, and enterprise-grade team inbox.',
    highlights: ['AI Meta Ads for Bhopal businesses & startups', '24/7 AI auto-responder with Gemini 3.6', 'Enterprise security, RBAC & green-tick API'],
  },
  nagpur: {
    name: 'Nagpur',
    state: 'Maharashtra',
    headline: 'Top WhatsApp CRM & AI Meta Ads Platform in Nagpur',
    description: 'Scale Nagpur retail, education, and orange-industry businesses with AI Meta Ads, official WhatsApp API, and automated drip campaigns.',
    highlights: ['AI Meta Ads for Nagpur retail & education', 'High-delivery WhatsApp broadcast campaigns', 'Enterprise RBAC & Multi-Agent Inbox'],
  },
  varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    headline: 'Best WhatsApp CRM & AI Meta Ads Software in Varanasi',
    description: 'Grow your Varanasi tourism, retail, and handicraft business with Meta-approved WhatsApp API, AI Meta Ads, and 24/7 AI customer support.',
    highlights: ['AI Meta Ads for Varanasi tourism & handicraft sector', 'Automated WhatsApp broadcast for seasonal campaigns', 'BYOK Multi-Model AI with 0% token markup'],
  },
  dehradun: {
    name: 'Dehradun',
    state: 'Uttarakhand',
    headline: 'Leading WhatsApp CRM & AI Meta Ads Platform in Dehradun',
    description: 'Empower Dehradun education institutes, hospitality, and retail businesses with AI-powered Meta Ads, official WhatsApp API, and multi-agent team inbox.',
    highlights: ['AI Meta Ads for Dehradun education & hospitality', 'Enterprise RBAC & green-tick verification', 'Automated lead qualification & follow-up'],
  },
  raipur: {
    name: 'Raipur',
    state: 'Chhattisgarh',
    headline: '#1 WhatsApp CRM & AI Meta Ads Software in Raipur',
    description: 'Transform your Raipur business with Meta-approved WhatsApp Business API, AI Meta Ads creation, and automated sales CRM pipelines.',
    highlights: ['AI Meta Ads for Raipur steel, mining & retail businesses', 'Gemini 3.6 AI chatbot with multi-lingual support', 'Enterprise RBAC & Multi-Agent Inbox'],
  },
};

export async function generateStaticParams() {
  return Object.keys(CITY_DATA).map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const data = CITY_DATA[city.toLowerCase()];
  if (!data) return {};

  return {
    title: `${data.headline} | AIWCRM`,
    description: data.description,
    keywords: [
      `WhatsApp CRM ${data.name}`,
      `WhatsApp API Provider ${data.name}`,
      `AI Meta Ads ${data.name}`,
      `Enterprise RBAC ${data.state}`,
      `WhatsApp Business API ${data.state}`,
      `Geo-Targeted WhatsApp Ads ${data.name}`,
    ],
    openGraph: {
      title: data.headline,
      description: data.description,
      url: `https://wacrm.in/whatsapp-crm-${city.toLowerCase()}`,
    },
    alternates: {
      canonical: `https://wacrm.in/whatsapp-crm-${city.toLowerCase()}`,
    },
  };
}

export default async function CityLandingPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  const data = CITY_DATA[cityKey];

  if (!data) {
    notFound();
  }

  const supabase = await createClient();
  const { data: trustedClients } = await supabase
    .from('saas_trusted_clients')
    .select('id, name, url, testimonial_text, author_name, author_role')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  const testimonials: Testimonial[] = (trustedClients && trustedClients.length > 0)
    ? trustedClients
        .filter(c => c.testimonial_text)
        .map(c => ({
          id: c.id,
          name: c.name,
          url: c.url || null,
          testimonial_text: c.testimonial_text!,
          author_name: c.author_name || null,
          author_role: c.author_role || null
        }))
    : [
        {
          id: '1',
          name: 'BPTPIA',
          url: null,
          testimonial_text: 'AIWCRM transformed our student admission counseling in Patna. The Gemini AI auto-responder handles 80% of routine inquiries instantly, saving our staff hundreds of hours.',
          author_name: 'Admissions Director',
          author_role: 'Bihar Private Technical & Professional Institutions Association'
        },
        {
          id: '2',
          name: 'EduSmart Academy',
          url: null,
          testimonial_text: 'The BYOK feature and AI Auto-Failover are game changers! We brought our own OpenAI keys and cut our AI costs by 60%.',
          author_name: 'Vikram Mehta',
          author_role: 'Head of Growth, EduSmart'
        }
      ];

  const cityFaqs = [
    {
      q: `Why choose AIWCRM as your WhatsApp CRM provider in ${data.name}?`,
      a: `AIWCRM is built specifically for growing businesses in ${data.name} and across ${data.state}. It provides Meta Official WhatsApp Business API access with BYOK multi-model AI (Gemini 3.6, OpenAI, Groq), zero-downtime auto-failover, and native sales CRM pipelines without third-party markups.`
    },
    {
      q: `How fast can a business in ${data.name} get started with AIWCRM?`,
      a: `Onboarding takes less than 10 minutes. You can connect your existing phone number or apply for a new Meta WhatsApp Business API number directly from your AIWCRM dashboard.`
    },
    {
      q: `Does AIWCRM support local language AI auto-replies in ${data.name}?`,
      a: `Yes! AIWCRM AI auto-responders support multi-lingual processing including English, Hindi, and regional languages, enabling natural conversations with customers in ${data.name}.`
    },
    {
      q: `What is the Bring Your Own Key (BYOK) pricing benefit for ${data.name} companies?`,
      a: `BYOK allows companies in ${data.name} to plug in their own OpenAI, Gemini, or Groq API keys with 0% platform token markup, cutting monthly AI API expenses by up to 60%.`
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* Rich Snippets Schema (LocalBusiness, SoftwareApplication, FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: `AIWCRM - WhatsApp CRM ${data.name}`,
              description: data.description,
              url: `https://wacrm.in/whatsapp-crm-${cityKey}`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: data.name,
                addressRegion: data.state,
                addressCountry: 'IN',
              },
              areaServed: data.name,
              priceRange: '₹₹',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: `AIWCRM WhatsApp Business API - ${data.name}`,
              operatingSystem: 'Web, iOS, Android',
              applicationCategory: 'BusinessApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                description: '7-Day Free Trial',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '520',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: cityFaqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.a,
                },
              })),
            },
          ]),
        }}
      />

      {/* 1. CITY HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-background text-foreground">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Globe className="h-4 w-4 text-emerald-500" />
                <span>Verified Local Provider for {data.name}, {data.state}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
                {data.headline}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
                {data.description}
              </p>

              {/* AI Feature Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-[11px] font-bold text-blue-400">
                  <Sparkles className="h-3 w-3" /> AI Meta Ads Creation
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-[11px] font-bold text-purple-400">
                  <Bot className="h-3 w-3" /> Gemini 3.6 AI Chatbot
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
                  <ShieldCheck className="h-3 w-3" /> Enterprise RBAC
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-[11px] font-bold text-orange-400">
                  <Zap className="h-3 w-3" /> Meta API Official Partner
                </span>
              </div>

              {/* City Highlights Checklist */}
              <div className="space-y-2.5 pt-2">
                {data.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/free-trial"
                  className="flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-9 text-base transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] gap-2.5"
                >
                  Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/book-demo"
                  className="flex h-14 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-card/60 backdrop-blur-md px-9 text-base font-bold text-foreground hover:bg-emerald-500/10"
                >
                  Book Live Demo
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-muted-foreground pt-2">
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

            {/* Right Phone Mockup */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[340px] rounded-[40px] border-[8px] border-slate-900 bg-slate-950 p-2 shadow-2xl shadow-emerald-500/15 relative overflow-hidden">
                <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-800 rounded-full" />
                </div>
                <div className="rounded-[30px] bg-[#0b141a] p-3 text-white text-xs space-y-3 font-sans relative overflow-hidden min-h-[440px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                        W
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">AIWCRM AI {data.name}</p>
                        <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Online · Gemini 3.6
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto py-2">
                    <div className="flex justify-end">
                      <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[80%] space-y-0.5">
                        <p>Hi! Looking for WhatsApp CRM services in {data.name}?</p>
                        <span className="text-[9px] text-emerald-200 float-right pl-2 font-mono">10:42 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#202c33] text-white p-2.5 rounded-2xl rounded-tl-none max-w-[85%] space-y-1 border border-emerald-500/30">
                        <p className="font-bold text-emerald-400 text-[11px]">AIWCRM AI Auto-Reply (0 Tokens)</p>
                        <p>Welcome! We serve 500+ businesses in {data.name}. Sent product catalog 📄</p>
                        <span className="text-[9px] text-slate-400 float-right font-mono">10:42 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#111b21] p-2 rounded-xl border border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                    <span>Type message...</span>
                    <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <Send className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <StripeStatsBanner />

      {/* 3. BYOK & MULTI-AI DIAGRAM */}
      <AiNetworkDiagramSection />

      {/* 4. FAILOVER TIMELINE */}
      <FailoverTimelineSection />

      {/* 5. INTERACTIVE DASHBOARD PREVIEW */}
      <InteractivePipelinePreview />

      {/* 6. BEFORE VS AFTER TRANSFORMATION */}
      <BeforeAfterTransformationSection />

      {/* 7. INTEGRATION ORBIT */}
      <IntegrationOrbitSection />

      {/* 8. 12 PRODUCT MODULES */}
      <ProductModulesSection />

      {/* 9. TESTIMONIALS */}
      <section className="py-24 bg-card/40 border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
              Trusted in {data.name}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              Loved by Top Brands in {data.name} & {data.state}
            </h2>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* 10. LOCALIZED GEO FAQ ACCORDION */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              WhatsApp Business API FAQs for {data.name}
            </h2>
          </div>

          <div className="space-y-4">
            {cityFaqs.map((faq, idx) => (
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

      {/* 11. OTHER CITIES NAV GRID */}
      <section className="py-16 bg-card/40 border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 text-center space-y-8">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
            AIWCRM Across Major Indian Cities
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(CITY_DATA).map(([key, val]) => (
              <Link
                key={key}
                href={`/whatsapp-crm-${key}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  key === cityKey
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/40'
                }`}
              >
                WhatsApp CRM in {val.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. SPOTLIGHT CONVERSION CTA */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden text-center border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/20 blur-[180px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Ready to Scale Your Sales in {data.name}?
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Join leading enterprises in {data.name} using AIWCRM to automate support, qualify leads, and run high-ROI campaigns with zero AI markup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/free-trial"
              className="flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-10 text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.03] gap-2.5"
            >
              Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/book-demo"
              className="flex h-14 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-900/80 px-10 text-base font-bold text-white transition-all hover:bg-slate-800"
            >
              Book Live Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
