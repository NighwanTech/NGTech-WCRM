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
  title: "Enterprise WhatsApp AI Platform & Meta Ads OS",
  description: "AIWCRM is the #1 Enterprise AI Platform for WhatsApp Cloud API, Retell Voice AI, Meta Ads OS, BYOK multi-LLM routing, and Kanban sales pipelines.",
  keywords: [
    "AIWCRM",
    "Enterprise AI Platform",
    "AI WhatsApp CRM India",
    "Multi-Provider Voice AI",
    "Retell ElevenLabs Voice AI",
    "AI Meta Ads OS",
    "BYOK WhatsApp CRM",
    "WhatsApp API Provider India",
    "AI Auto Failover Engine",
    "Enterprise RBAC WhatsApp CRM",
    "WhatsApp Shared Team Inbox",
    "WhatsApp Broadcast Platform",
    "LLM AI Optimization AIO",
    "Geo-Targeted WhatsApp Marketing"
  ],
  openGraph: {
    title: "AIWCRM | Enterprise WhatsApp AI Platform & Meta Ads OS",
    description: "AIWCRM is the #1 Enterprise AI Platform for WhatsApp Cloud API, Retell Voice AI, Meta Ads OS, BYOK multi-LLM routing, and Kanban sales pipelines.",
    url: "https://www.aiwcrm.com",
    siteName: "AIWCRM",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.aiwcrm.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIWCRM Enterprise Platform Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWCRM | Enterprise AI Platform for Sales & Marketing",
    description: "Multi-Provider Voice AI, Meta Ads OS, WhatsApp CRM & BYOK Multi-LLM Vault.",
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
          testimonial_text: 'AIWCRM transformed our student admission counseling. The Gemini AI auto-responder handles 80% of routine inquiries instantly, saving our staff hundreds of hours during peak admission season.',
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
          testimonial_text: 'AIWCRM connected directly with Retell AI voice agents and our WhatsApp sales pipeline. Hot leads are tagged instantly and converted 3.5x faster.',
          author_name: 'Priya Sharma',
          author_role: 'VP Sales, RealEstate Pro'
        }
      ];

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
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
              Enterprise Client Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              Loved by Fast-Growing Enterprise Teams
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
