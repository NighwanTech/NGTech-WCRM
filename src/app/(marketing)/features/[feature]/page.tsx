import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeaturesCmsService } from '@/lib/services/features-cms.service';
import { DynamicSectionRenderer } from '@/components/marketing/dynamic-section-renderer';

interface FeaturePageProps {
  params: Promise<{ feature: string }>;
}

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { feature: slug } = await params;
  const feature = await FeaturesCmsService.getFeatureBySlug(slug);

  return {
    title: feature.meta_title || `${feature.name} | WCRM Enterprise Platform`,
    description: feature.meta_description || feature.short_description,
    keywords: [
      feature.name,
      `WhatsApp ${feature.name}`,
      'WCRM Enterprise Features',
      'Meta WhatsApp Cloud API',
      'BYOK AI WhatsApp'
    ],
    openGraph: {
      title: feature.meta_title || `${feature.name} | WCRM`,
      description: feature.meta_description || feature.short_description,
      url: `https://wacrm.in/features/${slug}`,
      siteName: 'WCRM',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: `https://wacrm.in/features/${slug}`,
    },
  };
}

export default async function SingleFeaturePage({ params }: FeaturePageProps) {
  const { feature: slug } = await params;
  const feature = await FeaturesCmsService.getFeatureBySlug(slug);

  if (!feature) {
    notFound();
  }

  // Generate structured JSON-LD schemas
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `WCRM - ${feature.name}`,
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication',
    description: feature.short_description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://wacrm.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Features',
        item: 'https://wacrm.in/features',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: feature.name,
        item: `https://wacrm.in/features/${feature.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <DynamicSectionRenderer
        sections={feature.sections_config || []}
        status={feature.status}
        plans={feature.available_in_plans}
        relatedSlugs={feature.related_slugs}
      />
    </>
  );
}
