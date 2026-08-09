import React from 'react';
import { getSiteUrl, SITE_CONFIG } from '@/lib/site-config';

export function EnterpriseJsonLdSchema() {
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    operatingSystem: 'Web, iOS, Android',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1240',
      bestRating: '5',
      worstRating: '1',
    },
    description: SITE_CONFIG.description,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.legalName,
      url: getSiteUrl(),
      logo: getSiteUrl(SITE_CONFIG.logo),
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: getSiteUrl(),
    logo: getSiteUrl(SITE_CONFIG.logo),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.contact.phone,
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const sitelinksSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Features',
        url: getSiteUrl('/features'),
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'AI Platform',
        url: getSiteUrl('/features/byok'),
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'Pricing',
        url: getSiteUrl('/pricing'),
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Solutions',
        url: getSiteUrl('/solutions'),
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: '7-Day Free Trial',
        url: getSiteUrl('/free-trial'),
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${SITE_CONFIG.name} and how does it work?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${SITE_CONFIG.name} is India’s leading AI-powered WhatsApp CRM and Customer Engagement Platform. It connects your WhatsApp Business API to multi-model AI engines (Gemini 3.6, OpenAI, Claude, Groq, DeepSeek) and native sales pipelines, enabling automated customer support, lead qualification, voice AI, and multi-agent team inbox routing.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is Bring Your Own Key (BYOK) in ${SITE_CONFIG.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `BYOK allows businesses to plug in their own OpenAI, Google Gemini, Anthropic Claude, Groq, or DeepSeek API keys directly into ${SITE_CONFIG.name}. This means zero platform markup on AI token usage, cutting monthly AI costs by up to 60%.`,
        },
      },
      {
        '@type': 'Question',
        name: `How does AI Auto-Failover work in ${SITE_CONFIG.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `If your primary AI model experiences a rate limit or API timeout, ${SITE_CONFIG.name} automatically switches to a secondary backup model within 1 second. Your customer receives a seamless reply with zero downtime.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Zero Token Greeting Cache?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Zero Token Greeting Cache intercepts standard conversational greetings ("Hi", "Hello") and responds instantly with your custom brand welcome message using 0 AI tokens and <100ms latency.',
        },
      },
      {
        '@type': 'Question',
        name: `Does ${SITE_CONFIG.name} support AI Voice Call Agents?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! ${SITE_CONFIG.name} features a Multi-Provider Voice AI Platform supporting Retell AI and ElevenLabs. Deploy AI voice agents in English or native Hindi (Priya, Arjun voices) for automated inbound and outbound calls. Every call auto-extracts CRM intelligence — sentiment, buying signals, lead score — and syncs to Contacts, Deals, and Tasks.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
