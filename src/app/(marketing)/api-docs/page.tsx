import { Metadata } from 'next';
import { DevelopersApiClient } from '@/components/marketing/developers-api-client';

export const metadata: Metadata = {
  title: 'Developer REST APIs & Webhooks | WCRM WhatsApp Platform',
  description: 'Integrate Meta WhatsApp Cloud API with your app using WCRM SDKs (Node.js, Python, cURL, Go). Sub-50ms webhooks, BYOK AI completions, and 99.99% SLA.',
  keywords: [
    'WhatsApp Developer API',
    'WhatsApp REST API India',
    'WhatsApp Webhook SDK',
    'BYOK AI API WhatsApp',
    'Node.js WhatsApp Cloud API'
  ],
  openGraph: {
    title: 'Developer REST APIs & Webhooks | WCRM',
    description: 'Programmatic access to Meta Cloud API, BYOK AI completions, and real-time webhooks.',
    url: 'https://wacrm.in/api-docs',
    siteName: 'WCRM',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://wacrm.in/api-docs',
  },
};

export default function ApiDocsPage() {
  return <DevelopersApiClient />;
}
