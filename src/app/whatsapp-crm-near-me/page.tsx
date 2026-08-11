import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-config';
import Link from 'next/link';
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
  MapPin,
  Building2,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Send,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { StripeStatsBanner } from '@/components/marketing/stats-banner';
import { AiNetworkDiagramSection } from '@/components/marketing/ai-network-diagram';
import { FailoverTimelineSection } from '@/components/marketing/failover-timeline';
import { InteractivePipelinePreview } from '@/components/marketing/interactive-pipeline-preview';
import { BeforeAfterTransformationSection } from '@/components/marketing/before-after-transformation';
import { IntegrationOrbitSection } from '@/components/marketing/integration-orbit';
import { ProductModulesSection } from '@/components/marketing/product-modules';
import { TestimonialCarousel, type Testimonial } from '@/components/marketing/testimonial-carousel';
import { CITY_DATA } from '@/app/whatsapp-crm/[city]/page';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'WhatsApp CRM Near Me | Meta Approved Business API Provider Near You',
  description: 'Looking for a WhatsApp CRM provider near you? WCRM provides official Meta-approved WhatsApp Business API, AI chatbots, multi-agent shared inbox & instant local support across India.',
  keywords: [
    'WhatsApp CRM near me',
    'WhatsApp Business API provider near me',
    'WhatsApp automation company near me',
    'WhatsApp marketing software near me',
    'WhatsApp shared inbox near me',
    'WhatsApp AI chatbot near me',
  ],
  alternates: {
    canonical: getSiteUrl('/whatsapp-crm-near-me'),
  },
  openGraph: {
    title: 'WhatsApp CRM Near Me | Official Meta Approved API Provider',
    description: 'Connect with India’s top-rated WhatsApp CRM & Business API provider near you. Instant setup, AI auto-replies, and local support.',
    url: getSiteUrl('/whatsapp-crm-near-me'),
    siteName: 'AIWCRM',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function NearMeSEOPage() {
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
        }
      ];

  const nearMeFaqs = [
    {
      q: 'How do I find a verified WhatsApp Business API Provider near me?',
      a: 'WCRM provides official Meta WhatsApp Business API integration across all major cities in India. Onboarding takes less than 10 minutes online, and our engineering team offers dedicated 24/7 remote and local support.'
    },
    {
      q: 'Can WCRM assign WhatsApp conversations to local agents near my office?',
      a: 'Yes! WCRM features a Shared Team Inbox supporting multi-agent assignment, local office department routing, internal notes, and manager SLA performance tracking.'
    },
    {
      q: 'Does WCRM support Bring Your Own Key (BYOK) for local Indian companies?',
      a: 'Yes! Plug in your own OpenAI, Google Gemini, or Groq API keys with 0% platform token markup, saving 60% on monthly AI costs.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-background text-foreground">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-400">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Verified WhatsApp CRM Provider Near You in India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
                #1 WhatsApp CRM & API Provider Near You
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Scale your sales, customer support, and WhatsApp broadcasts with official Meta Cloud API, Multi-Model AI agents, and local support.
              </p>

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
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[340px] rounded-[40px] border-[8px] border-slate-900 bg-slate-950 p-2 shadow-2xl shadow-emerald-500/15">
                <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-800 rounded-full" />
                </div>
                <div className="rounded-[30px] bg-[#0b141a] p-3 text-white text-xs space-y-3 font-sans min-h-[440px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                        W
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">WCRM Near Me</p>
                        <p className="text-[10px] text-emerald-400 font-mono">Online · Gemini 3.6</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1 py-2">
                    <div className="flex justify-end">
                      <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[80%]">
                        <p>Hi! Looking for WhatsApp CRM services near my location?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#202c33] text-white p-2.5 rounded-2xl rounded-tl-none max-w-[85%] border border-emerald-500/30">
                        <p className="font-bold text-emerald-400 text-[11px]">WCRM AI Auto-Reply (0 Tokens)</p>
                        <p>Welcome! We serve 1,200+ local businesses across India. Sent product catalog 📄</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StripeStatsBanner />
      <AiNetworkDiagramSection />
      <FailoverTimelineSection />
      <InteractivePipelinePreview />
      <BeforeAfterTransformationSection />
      <IntegrationOrbitSection />
      <ProductModulesSection />

      <section className="py-24 bg-card/40 border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 text-center space-y-12">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">Loved by Local Businesses Across India</h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-4xl px-4 space-y-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">WhatsApp CRM Near Me FAQs</h2>
          <div className="space-y-4 text-left">
            {nearMeFaqs.map((faq, idx) => (
              <details key={idx} className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm transition-all group cursor-pointer">
                <summary className="font-extrabold text-base text-foreground flex items-center justify-between gap-4 list-none group-hover:text-emerald-400">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/40 border-t border-border/50 text-center">
        <div className="container mx-auto max-w-7xl px-4 space-y-8">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">WCRM Available Across Major Indian Cities</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(CITY_DATA).map(([key, val]) => (
              <Link
                key={key}
                href={`/whatsapp-crm-${key}`}
                className="px-4 py-2 rounded-full text-xs font-bold border bg-card border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/40"
              >
                WhatsApp CRM in {val.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
