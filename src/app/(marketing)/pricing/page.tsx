import { Metadata } from 'next';
import {
  getPricingPlansFromDB,
  getPricingFaqsFromDB,
  FALLBACK_HERO_SETTINGS
} from '@/lib/services/pricing-cms.service';
import { PricingPageClient } from '@/components/marketing/pricing-page-client';
import { createClient } from '@/lib/supabase/server';
import { type Testimonial } from '@/components/marketing/testimonial-carousel';

export const metadata: Metadata = {
  title: 'Transparent Pricing & BYOK AI Costs | AIWCRM WhatsApp CRM',
  description: 'Simple, transparent pricing with 0% platform token markup. All plans include official Meta Cloud API, AI Meta Ads Add-on, BYOK multi-model AI, Enterprise RBAC, Shared Team Inbox, and Voice AI.',
  keywords: [
    'AIWCRM Pricing',
    'WhatsApp CRM Pricing India',
    'AI Meta Ads Add-on Pricing',
    'BYOK WhatsApp AI Pricing',
    'Enterprise RBAC WhatsApp Pricing',
    'WhatsApp Business API Costs',
    'WhatsApp Shared Inbox Pricing',
    'Zero Markup WhatsApp API'
  ],
  openGraph: {
    title: 'Transparent Pricing & BYOK AI Costs | AIWCRM',
    description: 'Simple, transparent pricing with 0% token markup. AI Meta Ads, Enterprise RBAC, BYOK multi-model AI with 7-day free trial.',
    url: 'https://www.aiwcrm.com/pricing',
    siteName: 'AIWCRM',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.aiwcrm.com/pricing',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PricingPage() {
  let plans = await getPricingPlansFromDB();
  
  // Override Starter plan price to 5000 INR per user request
  plans = plans.map(plan => {
    if (plan.slug === 'starter' || plan.name.toLowerCase().includes('starter')) {
      return {
        ...plan,
        price_monthly: 5000,
        price_yearly: 5000,
        monthly_price: 5000,
        annual_price: 5000,
        original_price_monthly: 6500,
        original_price_yearly: 6500,
      };
    }
    return plan;
  });

  const faqs = await getPricingFaqsFromDB();

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'WCRM Enterprise WhatsApp CRM',
    description: 'AI-Powered WhatsApp CRM Platform with 0% token markup and BYOK multi-model routing.',
    offers: plans.map(p => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price_monthly,
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      url: `https://wacrm.in/pricing`,
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingPageClient
        initialPlans={plans}
        initialFaqs={faqs}
        heroSettings={FALLBACK_HERO_SETTINGS}
        testimonials={testimonials}
      />
    </>
  );
}
