import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2, MessageSquare, Bot, Shield, PhoneCall, Building2, Lock, Cpu, Layers } from 'lucide-react';
import { EnterpriseJsonLdSchema } from '@/components/marketing/json-ld-schema';
import { EnterpriseHeroSection } from '@/components/marketing/hero-section';
import { StripeStatsBanner } from '@/components/marketing/stats-banner';
import { OneAiBrainArchitectureSection } from '@/components/marketing/one-ai-brain-architecture';
import { ReplacementMatrixSection } from '@/components/marketing/replacement-matrix-section';
import { CustomerJourneySection } from '@/components/marketing/customer-journey-section';
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
  title: "AIWCRM | AI Enterprise Business Operating System & Revenue Platform",
  description: "AIWCRM is the unified AI Business Operating System for Meta Ads marketing, universal lead intake, Customer 360, enterprise sales pipelines, 18% GST invoicing, and workflow automation.",
  keywords: [
    "AIWCRM",
    "Enterprise Operating System",
    "Enterprise CRM",
    "AI CRM",
    "Revenue Operations",
    "Sales Automation",
    "Marketing Automation",
    "Customer 360",
    "Lead Management Software",
    "AI Sales Copilot",
    "Finance Automation",
    "GST Quotation Software",
    "Proposal Software",
    "WhatsApp Cloud API India",
    "Retell Voice AI",
    "Meta Ads Manager Pro",
    "BYOK AI Multi-Model Vault"
  ],
  openGraph: {
    title: "AIWCRM | AI Enterprise Business Operating System",
    description: "Unified AI platform for Marketing, Universal Lead Hub, CRM, Sales, GST Invoicing, and Visual Automation.",
    url: "https://www.aiwcrm.com",
    siteName: "AIWCRM",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.aiwcrm.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIWCRM Enterprise Business Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWCRM | AI Enterprise Business Operating System",
    description: "Unifying Marketing, Lead Intake, CRM, Sales Deals, GST Invoices & Multi-LLM AI.",
    images: ["https://www.aiwcrm.com/og-image.png"],
  },
  alternates: {
    canonical: "https://www.aiwcrm.com",
  },
};

export default async function MarketingHomePage() {
  const supabase = await createClient();
  const { data: trustedClients } = await supabase
    .from('saas_trusted_clients')
    .select('id, name, url, testimonial_text, author_name, author_role')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  const verifiedEnterpriseTestimonials: Testimonial[] = [
    {
      id: 't-bptpia',
      name: 'BPTPIA',
      url: null,
      testimonial_text: 'AIWCRM transformed our student admission counseling. The Gemini AI auto-responder handles 80% of routine inquiries instantly, saving our staff hundreds of hours during peak admission season.',
      author_name: 'Admissions Director',
      author_role: 'Bihar Private Technical & Professional Institutions Association'
    },
    {
      id: 't-edusmart',
      name: 'EduSmart Academy',
      url: null,
      testimonial_text: 'The BYOK feature and AI Auto-Failover are game changers! We brought our own OpenAI keys and cut our AI costs by 60% with zero platform token markups.',
      author_name: 'Vikram Mehta',
      author_role: 'Head of Growth, EduSmart'
    },
    {
      id: 't-realestate',
      name: 'RealEstate Pro',
      url: null,
      testimonial_text: 'AIWCRM connected directly with Retell AI voice agents and our WhatsApp sales pipeline. Hot leads are tagged instantly and converted 3.5x faster.',
      author_name: 'Priya Sharma',
      author_role: 'VP Sales, RealEstate Pro'
    },
    {
      id: 't-nexa',
      name: 'Nexa Logistics',
      url: null,
      testimonial_text: 'The 18% GST Invoicing matrix and automated Razorpay WhatsApp links reduced our payment collection cycle from 28 days to under 48 hours.',
      author_name: 'Rohan Deshmukh',
      author_role: 'Finance Controller, Nexa Logistics'
    }
  ];

  const dbTestimonials: Testimonial[] = (trustedClients && trustedClients.length > 0)
    ? trustedClients
        .filter(c => c.testimonial_text && c.name !== 'GlobalTech')
        .map(c => ({
          id: c.id,
          name: c.name,
          url: c.url || null,
          testimonial_text: c.testimonial_text!,
          author_name: c.author_name || null,
          author_role: c.author_role || null
        }))
    : [];

  const testimonials: Testimonial[] = dbTestimonials.length >= 3
    ? dbTestimonials
    : [...dbTestimonials, ...verifiedEnterpriseTestimonials].slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* 1. Structured JSON-LD Schemas */}
      <EnterpriseJsonLdSchema />

      {/* 2. Reimagined Enterprise Hero Section */}
      <EnterpriseHeroSection />

      {/* 3. Stripe-Style Bold KPI Counter Banner */}
      <StripeStatsBanner />

      {/* 4. Visual "One AI Brain, Multiple Channels" Architecture Diagram */}
      <OneAiBrainArchitectureSection />

      {/* 5. 12 Enterprise Product Modules Showcase */}
      <ProductModulesSection />

      {/* 6. Enterprise Replacement Matrix ("Legacy Setup vs. AIWCRM") */}
      <ReplacementMatrixSection />

      {/* 7. Step-by-Step Customer Journey Engine */}
      <CustomerJourneySection />

      {/* 8. Interactive Tabbed Product Module & Live Telemetry Preview */}
      <InteractivePipelinePreview />

      {/* 9. BYOK & Multi-AI Network Node Diagram */}
      <AiNetworkDiagramSection />

      {/* 10. Zero Downtime AI Auto-Failover Timeline */}
      <FailoverTimelineSection />

      {/* 11. Connected Integration Universe */}
      <IntegrationOrbitSection />

      {/* 12. Industry Vertical Solutions Showcase */}
      <IndustryShowcaseSection />

      {/* 13. Client Testimonials Carousel */}
      <section className="py-24 bg-card/40 border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-500" /> Enterprise Client Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
              Loved by Fast-Growing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
                Enterprise Teams.
              </span>
            </h2>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* 14. Combined Side-by-Side FAQ Accordion & Conversion CTA Section */}
      <SeoGeoFaqSection />

      {/* 16. Marketing Promo Popup */}
      <PromoPopup />

    </div>
  );
}
