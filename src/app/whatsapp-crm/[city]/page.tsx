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
    headline: '#1 AI WhatsApp CRM & API Provider in Patna, Bihar',
    description: 'Empower your Patna education institutes, Coaching centers, Real Estate, and Retail businesses with Meta-approved WhatsApp API, AI Chatbots, and Multi-Agent Shared Inbox.',
    highlights: ['Trusted by leading Patna institutions and BPTPIA members', 'Instant setup with Multi-Model AI (Gemini 3.6 & BYOK)', 'Dedicated local support in Bihar'],
  },
  delhi: {
    name: 'Delhi NCR',
    state: 'Delhi',
    headline: '#1 WhatsApp CRM & API Provider in Delhi NCR',
    description: 'Empower your Delhi NCR sales and support teams with Meta-approved WhatsApp Business API, AI chatbots, and multi-agent shared inbox.',
    highlights: ['Serving 500+ businesses across Delhi, Gurgaon, and Noida', 'Instant Meta API setup in under 10 minutes', 'Dedicated local support & setup assistance'],
  },
  mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    headline: 'Leading WhatsApp CRM & Automation Software in Mumbai',
    description: 'Scale your enterprise and small business sales in Mumbai with WhatsApp bulk broadcasts, automated pipelines, and 24/7 AI auto-replies.',
    highlights: ['Tailored for Mumbai real estate, retail, and e-commerce', 'Multi-agent chat routing & team performance tracking', 'Zero message blocking with official Meta API'],
  },
  bangalore: {
    name: 'Bangalore',
    state: 'Karnataka',
    headline: 'Best WhatsApp Business API & CRM for Startups in Bangalore',
    description: 'Built for fast-growing Bangalore tech startups and D2C brands. Automate customer support and turn WhatsApp chats into revenue.',
    highlights: ['Developer-friendly webhooks & REST API integrations', 'AI lead scoring & automated CRM pipeline stages', 'Used by top Bengaluru tech and retail brands'],
  },
  hyderabad: {
    name: 'Hyderabad',
    state: 'Telangana',
    headline: 'Top WhatsApp CRM Platform in Hyderabad',
    description: 'Transform customer engagement in Hyderabad with WhatsApp green-tick API, AI chatbots, and automated broadcast campaigns.',
    highlights: ['Ideal for Hyderabad education, healthcare, and IT firms', '24/7 AI auto-responder with custom knowledge base', 'High deliverability bulk WhatsApp broadcasts'],
  },
  chennai: {
    name: 'Chennai',
    state: 'Tamil Nadu',
    headline: 'Leading WhatsApp CRM & Automation Platform in Chennai',
    description: 'Scale sales and support in Chennai with official WhatsApp Cloud API, AI agents, and Kanban deal pipelines.',
    highlights: ['Popular among Chennai healthcare, manufacturing, and retail', 'Multi-agent inbox with automatic department routing', 'BYOK support with 0% token markup'],
  },
  pune: {
    name: 'Pune',
    state: 'Maharashtra',
    headline: 'WhatsApp Business API & CRM Software in Pune',
    description: 'Grow your Pune business with seamless WhatsApp lead management, multi-agent chat assignment, and automated drip sequences.',
    highlights: ['Fast onboarding for Pune manufacturing and educational institutes', 'INR ₹ billing with transparent token usage', 'No-code flow builder for custom chat funnels'],
  },
  kolkata: {
    name: 'Kolkata',
    state: 'West Bengal',
    headline: 'Best WhatsApp CRM & Chatbot Software in Kolkata',
    description: 'Automate sales and customer support in Kolkata with Meta-approved WhatsApp API and AI auto-responders.',
    highlights: ['Ideal for Kolkata retail, education, and hospitality', 'Zero token greeting cache for instant replies', 'Multi-agent team inbox & deal tracking'],
  },
  ahmedabad: {
    name: 'Ahmedabad',
    state: 'Gujarat',
    headline: 'Top WhatsApp CRM & Broadcast Software in Ahmedabad',
    description: 'Empower Ahmedabad manufacturing, textile, and D2C businesses with WhatsApp broadcast marketing and AI CRM.',
    highlights: ['Built for Gujarat manufacturing and trade businesses', 'High delivery Meta broadcast campaigns', 'AI auto-failover for zero downtime'],
  },
  jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    headline: 'Leading WhatsApp CRM & Automation Software in Jaipur',
    description: 'Scale your Jaipur business with WhatsApp green-tick API, automated lead qualification, and Kanban sales pipelines.',
    highlights: ['Popular for Jaipur tourism, retail, and education', 'Automated follow-up sequences & deal alerts', 'Multi-model AI support (Gemini & OpenAI)'],
  },
  chandigarh: {
    name: 'Chandigarh & Mohali',
    state: 'Punjab',
    headline: '#1 WhatsApp CRM Platform in Chandigarh & Mohali',
    description: 'Streamline customer support for Chandigarh and Mohali businesses with official WhatsApp API, AI lead scoring, and team inbox.',
    highlights: ['Local North India support team based in Mohali/Chandigarh', 'Automated appointment booking & lead followup', 'Meta green tick verification assistance'],
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
    title: `${data.headline} | WCRM`,
    description: data.description,
    keywords: [
      `WhatsApp CRM ${data.name}`,
      `WhatsApp API Provider ${data.name}`,
      `AI Chatbot ${data.name}`,
      `WhatsApp Business API ${data.state}`,
      `WhatsApp Bulk Broadcast ${data.name}`,
    ],
    openGraph: {
      title: data.headline,
      description: data.description,
      url: `https://wacrm.in/whatsapp-crm/${city.toLowerCase()}`,
    },
    alternates: {
      canonical: `https://wacrm.in/whatsapp-crm/${city.toLowerCase()}`,
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
          testimonial_text: 'WCRM transformed our student admission counseling. The Gemini AI auto-responder handles 80% of routine inquiries instantly, saving our staff hundreds of hours.',
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
      q: `Why choose WCRM as your WhatsApp CRM provider in ${data.name}?`,
      a: `WCRM is built specifically for growing businesses in ${data.name} and across ${data.state}. It provides Meta Official WhatsApp Business API access with BYOK multi-model AI (Gemini 3.6, OpenAI, Groq), zero-downtime auto-failover, and native sales CRM pipelines without third-party markups.`
    },
    {
      q: `How fast can a business in ${data.name} get started with WCRM?`,
      a: `Onboarding takes less than 10 minutes. You can connect your existing phone number or apply for a new Meta WhatsApp Business API number directly from your WCRM dashboard.`
    },
    {
      q: `Does WCRM support local language AI auto-replies in ${data.name}?`,
      a: `Yes! WCRM AI auto-responders support multi-lingual processing including English, Hindi, and regional languages, enabling natural conversations with customers in ${data.name}.`
    },
    {
      q: `What is the Bring Your Own Key (BYOK) pricing benefit for ${data.name} companies?`,
      a: `BYOK allows companies in ${data.name} to plug in their own OpenAI, Gemini, or Groq API keys with 0% platform token markup, cutting monthly AI API expenses by up to 60%.`
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* City LocalBusiness & Software Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: `WCRM - WhatsApp CRM ${data.name}`,
            description: data.description,
            url: `https://wacrm.in/whatsapp-crm/${cityKey}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: data.name,
              addressRegion: data.state,
              addressCountry: 'IN',
            },
            areaServed: data.name,
          }),
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
                        <p className="font-bold text-white text-xs">WCRM AI {data.name}</p>
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
                        <p className="font-bold text-emerald-400 text-[11px]">WCRM AI Auto-Reply (0 Tokens)</p>
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
            WCRM Across Major Indian Cities
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
            Join leading enterprises in {data.name} using WCRM to automate support, qualify leads, and run high-ROI campaigns with zero AI markup.
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
