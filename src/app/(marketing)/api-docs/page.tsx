import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-config';
import { DevelopersApiClient } from '@/components/marketing/developers-api-client';

export const metadata: Metadata = {
  title: 'Developer REST APIs & Webhooks | AIWCRM WhatsApp Platform',
  description: 'Integrate Meta WhatsApp Cloud API with your app using AIWCRM SDKs (Node.js, Python, cURL, Go). Sub-50ms webhooks, BYOK AI completions, and 99.99% SLA.',
  keywords: [
    'WhatsApp Developer API',
    'WhatsApp REST API India',
    'WhatsApp Webhook SDK',
    'BYOK AI API WhatsApp',
    'Node.js WhatsApp Cloud API'
  ],
  openGraph: {
    title: 'Developer REST APIs & Webhooks | AIWCRM',
    description: 'Programmatic access to Meta Cloud API, BYOK AI completions, and real-time webhooks.',
    url: getSiteUrl('/api-docs'),
    siteName: 'AIWCRM',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: getSiteUrl('/api-docs'),
  },
};

export default function ApiDocsPage() {
  return <DevelopersApiClient />;
}
