import { Metadata } from 'next';
import { IndustrySolutionsClient } from '@/components/marketing/industry-solutions-client';

export const metadata: Metadata = {
  title: "Enterprise Industry Solutions, AI Meta Ads & Workflows | AIWCRM",
  description: "Explore tailored WhatsApp CRM, AI Meta Ads Creation, AI Chatbots, Voice AI and automated sales workflows across Manufacturing, Education, Healthcare, Retail, Real Estate, BFSI, Hospitality, and Government.",
  keywords: [
    "AIWCRM Industry Solutions",
    "AI Meta Ads for Industries",
    "WhatsApp CRM Manufacturing",
    "WhatsApp CRM Education",
    "WhatsApp CRM Healthcare",
    "WhatsApp CRM Real Estate",
    "WhatsApp CRM Retail D2C",
    "Enterprise RBAC WhatsApp",
    "WhatsApp Business API Industry Solutions",
    "AI-Powered WhatsApp Ads India"
  ],
  openGraph: {
    title: "Enterprise Industry Solutions, AI Meta Ads & Workflows | AIWCRM",
    description: "Tailored WhatsApp AI automation & AI Meta Ads across 12 high-growth industry verticals with zero AI token markup.",
    url: 'https://www.aiwcrm.com/solutions',
    siteName: 'AIWCRM',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.aiwcrm.com/solutions',
  },
};

export default function IndustrySolutionsPage() {
  return <IndustrySolutionsClient />;
}
