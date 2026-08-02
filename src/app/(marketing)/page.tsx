import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, MessageSquare, Bot, Shield, PhoneCall } from 'lucide-react';
import { EnterpriseJsonLdSchema } from '@/components/marketing/json-ld-schema';
import { EnterpriseHeroSection } from '@/components/marketing/hero-section';
import { StripeStatsBanner } from '@/components/marketing/stats-banner';
import { AiNetworkDiagramSection } from '@/components/marketing/ai-network-diagram';
import { FailoverTimelineSection } from '@/components/marketing/failover-timeline';
import { InteractivePipelinePreview } from '@/components/marketing/interactive-pipeline-preview';
import { BeforeAfterTransformationSection } from '@/components/marketing/before-after-transformation';
import { IntegrationOrbitSection } from '@/components/marketing/integration-orbit';
import { ProductModulesSection } from '@/components/marketing/product-modules';
import { IndustryShowcaseSection } from '@/components/marketing/industry-showcase';
import { TestimonialCarousel, type Testimonial } from '@/components/marketing/testimonial-carousel';
import { SeoGeoFaqSection } from '@/components/marketing/seo-geo-faq';
import { PromoPopup } from '@/components/marketing/promo-popup';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: "WCRM | India's AI-Powered WhatsApp CRM & Customer Engagement Platform",
  description: "Manage Sales, Support, Marketing, AI Agents, Voice AI and CRM from one intelligent platform powered by Gemini 3.6, OpenAI, Claude, Groq, DeepSeek or your own API keys.",
  keywords: [
    "WhatsApp CRM India",
    "AI WhatsApp CRM",
    "BYOK WhatsApp CRM",
    "WhatsApp API Provider India",
    "AI Auto Failover CRM",
    "Retell Voice AI Integration",
    "WhatsApp Shared Team Inbox",
    "WhatsApp Broadcast Software"
  ],
  openGraph: {
    title: "WCRM | India's AI-Powered WhatsApp CRM Platform",
    description: "Multi-Model AI WhatsApp CRM with BYOK, Auto-Failover, Voice AI & Kanban Sales Pipelines.",
    url: "https://wacrm.in",
    siteName: "WCRM",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WCRM | AI-Powered WhatsApp CRM",
    description: "Multi-Model AI WhatsApp CRM with BYOK, Auto-Failover & Voice AI.",
  },
  alternates: {
    canonical: "https://wacrm.in",
  },
};

export default async function MarketingHomePage() {
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
          testimonial_text: 'WCRM transformed our student admission counseling. The Gemini AI auto-responder handles 80% of routine inquiries instantly, saving our staff hundreds of hours during peak admission season.',
          author_name: 'Admissions Director',
          author_role: 'Bihar Private Technical & Professional Institutions Association'
        },
        {
          id: '2',
          name: 'EduSmart Academy',
          url: null,
          testimonial_text: 'The BYOK feature and AI Auto-Failover are game changers! We brought our own OpenAI keys and cut our AI costs by 60% with zero platform token markups.',
          author_name: 'Vikram Mehta',
          author_role: 'Head of Growth, EduSmart'
        },
        {
          id: '3',
          name: 'RealEstate Pro',
          url: null,
          testimonial_text: 'WCRM connected directly with Retell AI voice agents and our WhatsApp sales pipeline. Hot leads are tagged instantly and converted 3.5x faster.',
          author_name: 'Priya Sharma',
          author_role: 'VP Sales, RealEstate Pro'
        }
      ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* 1. Structured JSON-LD Schemas */}
      <EnterpriseJsonLdSchema />

      {/* 2. Asymmetric Enterprise Hero with Live WhatsApp Phone & Telemetry */}
      <EnterpriseHeroSection />

      {/* 3. Stripe-Style Bold KPI Counter Banner */}
      <StripeStatsBanner />

      {/* 4. BYOK & Multi-AI Network Node Diagram */}
      <AiNetworkDiagramSection />

      {/* 5. Zero Downtime AI Auto-Failover Timeline */}
      <FailoverTimelineSection />

      {/* 6. Interactive Tabbed Product Module & Dashboard Preview */}
      <InteractivePipelinePreview />

      {/* 7. Before vs. After Business Transformation */}
      <BeforeAfterTransformationSection />

      {/* 8. Connected Integration Universe */}
      <IntegrationOrbitSection />

      {/* 9. 12 Enterprise Product Modules */}
      <ProductModulesSection />

      {/* 10. Industry Vertical Solutions */}
      <IndustryShowcaseSection />

      {/* 11. Client Testimonials Carousel */}
      <section className="py-24 bg-card/40 border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
              Client Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              Loved by Fast-Growing Enterprise Teams
            </h2>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* 12. SEO & GEO Accordion Q&A Section */}
      <SeoGeoFaqSection />

      {/* 13. Vercel-Style Spotlight Conversion CTA Section */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden text-center border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/20 blur-[180px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Transform Customer Engagement Today
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Ready to Scale Your Sales & Support on WhatsApp?
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of forward-thinking businesses using WCRM to automate support, qualify leads, and run high-ROI campaigns with zero AI markup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/free-trial"
              className="flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-10 text-base transition-all duration-300 shadow-xl shadow-emerald-500/25 hover:scale-[1.03] w-full sm:w-auto gap-2.5"
            >
              Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/book-demo"
              className="flex h-14 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-900/80 px-10 text-base font-bold text-white transition-all duration-300 hover:bg-slate-800 w-full sm:w-auto"
            >
              Book Live Demo
            </Link>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            ✓ 10-Minute Setup · ✓ Bring Your Own Keys · ✓ Dedicated Solution Engineer
          </p>
        </div>
      </section>

      {/* Marketing Promo Popup */}
      <PromoPopup />

    </div>
  );
}
