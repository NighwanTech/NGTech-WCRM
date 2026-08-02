import { Metadata } from 'next';
import { IndustrySolutionsClient } from '@/components/marketing/industry-solutions-client';

export const metadata: Metadata = {
  title: "Enterprise Industry Solutions & Workflows | WCRM",
  description: "Explore tailored WhatsApp CRM, AI Chatbots, Voice AI and automated sales workflows across Manufacturing, Education, Healthcare, Retail, Real Estate, BFSI, Hospitality, and Government.",
  keywords: [
    "WhatsApp CRM Manufacturing",
    "WhatsApp CRM Education",
    "WhatsApp CRM Healthcare",
    "WhatsApp CRM Real Estate",
    "WhatsApp CRM Retail D2C",
    "WhatsApp Business API Industry Solutions"
  ],
  openGraph: {
    title: "Enterprise Industry Solutions & Workflows | WCRM",
    description: "Tailored WhatsApp AI automation across 12 high-growth industry verticals with zero AI token markup.",
    url: "https://wacrm.in/solutions",
    siteName: "WCRM",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://wacrm.in/solutions",
  },
};

export default function IndustrySolutionsPage() {
  return <IndustrySolutionsClient />;
}
