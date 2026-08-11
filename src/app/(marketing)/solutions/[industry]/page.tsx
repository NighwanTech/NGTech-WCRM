import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IndustrySolutionsClient } from '@/components/marketing/industry-solutions-client';
import { INDUSTRIES_DATA } from '@/lib/data/industry-solutions-data';
import { getSiteUrl } from '@/lib/site-config';

export const dynamicParams = true;

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES_DATA).map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> | { industry: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const industrySlug = resolvedParams?.industry?.toLowerCase() || '';
  const data = INDUSTRIES_DATA[industrySlug];
  if (!data) return {};

  const pageUrl = getSiteUrl(`/solutions/${industrySlug}`);

  return {
    title: `${data.name} WhatsApp CRM & AI Workflows | AIWCRM`,
    description: data.heroDesc,
    keywords: [
      `WhatsApp CRM ${data.name}`,
      `AI Automation ${data.name}`,
      `WhatsApp API Provider ${data.name}`,
    ],
    openGraph: {
      title: `${data.name} WhatsApp CRM & AI Workflows | AIWCRM`,
      description: data.heroDesc,
      url: pageUrl,
      siteName: 'AIWCRM',
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function IndustrySubPage({ params }: { params: Promise<{ industry: string }> | { industry: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const industrySlug = resolvedParams?.industry?.toLowerCase() || '';
  const data = INDUSTRIES_DATA[industrySlug];

  if (!data) {
    notFound();
  }

  return <IndustrySolutionsClient initialIndustry={industrySlug} />;
}
