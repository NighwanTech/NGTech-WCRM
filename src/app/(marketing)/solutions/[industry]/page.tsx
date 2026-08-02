import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IndustrySolutionsClient, INDUSTRIES_DATA } from '@/components/marketing/industry-solutions-client';

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES_DATA).map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry } = await params;
  const data = INDUSTRIES_DATA[industry.toLowerCase()];
  if (!data) return {};

  return {
    title: `${data.name} WhatsApp CRM & AI Workflows | WCRM`,
    description: data.heroDesc,
    keywords: [
      `WhatsApp CRM ${data.name}`,
      `AI Automation ${data.name}`,
      `WhatsApp API Provider ${data.name}`,
    ],
    openGraph: {
      title: `${data.name} WhatsApp CRM & AI Workflows | WCRM`,
      description: data.heroDesc,
      url: `https://wacrm.in/solutions/${industry.toLowerCase()}`,
    },
    alternates: {
      canonical: `https://wacrm.in/solutions/${industry.toLowerCase()}`,
    },
  };
}

export default async function IndustrySubPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const data = INDUSTRIES_DATA[industry.toLowerCase()];

  if (!data) {
    notFound();
  }

  return <IndustrySolutionsClient />;
}
