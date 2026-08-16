import { Metadata } from 'next';
import { EnterpriseFeaturesClient } from '@/components/marketing/enterprise-features-client';

export const metadata: Metadata = {
  title: "All Platform Capabilities — AI Enterprise Business Operating System | AIWCRM",
  description: "Explore the 12 core platform capabilities on AIWCRM: Meta Ads Manager Pro, Universal Lead Hub, Customer 360, Sales Deals & AI Proposals, 18% GST Invoicing, Customer Success, BYOK Multi-LLM AI Vault (0% markup), Retell Voice AI, and Visual Automation.",
  keywords: [
    "AIWCRM Features",
    "Enterprise Operating System",
    "AI Meta Ads Manager",
    "Universal Lead Hub",
    "Customer 360 CRM",
    "AI Proposal Builder",
    "18% GST Invoicing Software",
    "Customer Success Hub",
    "BYOK WhatsApp AI",
    "Retell Voice AI WhatsApp",
    "WhatsApp Shared Team Inbox",
    "WhatsApp Broadcast Software India",
    "Multi-Model AI Router",
    "Visual Flow Automation"
  ],
  openGraph: {
    title: "All Platform Capabilities — AI Enterprise Business Operating System | AIWCRM",
    description: "12 unified business capabilities: Meta Ads, Universal Lead Hub, CRM 360, Sales Deals, GST Invoicing, CS & BYOK Multi-LLM AI.",
    url: "https://aiwcrm.com/features",
    siteName: "AIWCRM",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://aiwcrm.com/dashboard-mockup.png",
        width: 1920,
        height: 1080,
        alt: "AIWCRM Enterprise Operating System Dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "All Platform Capabilities — AI Enterprise Operating System | AIWCRM",
    description: "12 enterprise capabilities on AIWCRM: Meta Ads, Lead Hub, Deals, GST Invoices, BYOK AI & Retell Voice.",
    images: ["https://aiwcrm.com/dashboard-mockup.png"]
  },
  alternates: {
    canonical: "https://aiwcrm.com/features",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FeaturesPage() {
  /* ─── Multi-Schema JSON-LD for maximum SEO & GEO coverage ─── */
  const schemas = [
    // 1. SoftwareApplication
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AI WCRM — Enterprise AI WhatsApp CRM',
      operatingSystem: 'Web, All Platforms',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Customer Relationship Management',
      description: 'Enterprise-grade AI Customer Engagement Platform for WhatsApp. Features include BYOK multi-model AI routing with 0% token markup, multi-agent shared inbox, Retell Voice AI agents, visual Kanban sales pipelines, Meta official broadcast campaigns, and no-code workflow automation.',
      featureList: 'BYOK Multi-LLM AI Routing, 0% Token Markup, Multi-Agent Shared Inbox, Retell Voice AI, Visual Kanban Pipeline, Meta Broadcast Campaigns, No-Code Workflow Builder, Sub-50ms REST APIs, Enterprise RBAC Security, 0-Token Greeting Cache',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        description: '7-day free trial with full feature access',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '180',
        bestRating: '5',
      },
    },
    // 2. WebPage
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'AI WCRM Platform Features',
      description: 'Comprehensive overview of all 40+ enterprise features available in the AI WCRM WhatsApp AI CRM platform.',
      url: 'https://aiwcrm.com/features',
      isPartOf: {
        '@type': 'WebSite',
        name: 'AI WCRM',
        url: 'https://aiwcrm.com',
      },
    },
    // 3. BreadcrumbList
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aiwcrm.com' },
        { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://aiwcrm.com/features' },
      ],
    },
    // 4. Organization
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AI WCRM',
      url: 'https://aiwcrm.com',
      logo: 'https://aiwcrm.com/logo.png',
      description: 'Enterprise AI-powered WhatsApp CRM platform for sales, marketing, and customer support automation.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        availableLanguage: ['English', 'Hindi'],
      },
    },
    // 5. FAQPage (GEO optimized Q&A blocks)
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is BYOK AI routing in AI WCRM?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BYOK (Bring Your Own Key) AI routing allows you to connect your own API keys from providers like OpenAI, Google Gemini, Anthropic Claude, Groq, and DeepSeek directly to AI WCRM. This means zero platform token markup — you pay only the provider\'s direct rates. AI WCRM automatically routes between models with sub-1-second failover.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does AI WCRM\'s 0-Token Greeting Cache work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The 0-Token Greeting Cache dispatches instant catalog replies to new WhatsApp leads in under 100ms without consuming any AI tokens. This eliminates cold-start delays and reduces AI costs while ensuring every prospect gets an immediate professional response.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between AI WCRM and traditional WhatsApp CRM tools?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AI WCRM is an enterprise-grade platform built on the official Meta Cloud API with features like multi-agent shared inbox (collision detection), BYOK AI routing (0% markup), Retell Voice AI agents, visual Kanban sales pipelines, and no-code workflow automation. Traditional tools typically use unofficial APIs, charge AI markups, and lack enterprise security features.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does AI WCRM support Retell Voice AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. AI WCRM integrates with Retell Voice AI to deploy human-like AI voice agents that handle phone calls, record transcripts, perform real-time sentiment analysis, and log follow-ups directly into your WhatsApp CRM — all with sub-600ms response latency.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is AI WCRM compliant with Meta\'s WhatsApp Business API policies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AI WCRM uses the official Meta Cloud API exclusively, ensuring 100% compliance with Meta\'s policies. This provides zero number ban risk, enterprise-grade RBAC security, audit logging, and SOC2 & GDPR data protection standards.',
          },
        },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <EnterpriseFeaturesClient />
    </>
  );
}
