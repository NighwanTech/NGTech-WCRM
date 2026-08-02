import { createClient } from '@/lib/supabase/server';

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description?: string;
  price_monthly?: number;
  price_yearly?: number;
  monthly_price?: number;
  annual_price?: number;
  original_price_monthly?: number;
  original_price_yearly?: number;
  discount_percent?: number;
  currency: string;
  popular_badge?: string;
  recommended_badge?: string;
  button_text: string;
  button_url: string;
  suitable_for: string;
  team_size: string;
  max_contacts: string;
  max_conversations: string;
  max_users: string;
  max_ai_requests: string;
  max_broadcasts: string;
  api_access: boolean;
  support_type: string;
  trial_days: number;
  is_free: boolean;
  is_enterprise: boolean;
  is_active: boolean;
  sort_order: number;
  features_list: string[];
}

export interface PricingFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export interface PricingHeroSettings {
  headline: string;
  subheadline: string;
  badge_text: string;
  trial_days: number;
  annual_discount_text: string;
}

export const FALLBACK_HERO_SETTINGS: PricingHeroSettings = {
  headline: 'Simple, Transparent Pricing with Zero AI Token Markup',
  subheadline: 'Choose the perfect plan for your business. All plans include official Meta Cloud API, multi-agent inbox, BYOK AI routing, and 24/7 automated support.',
  badge_text: 'Verified 0% Platform Token Markup · BYOK Multi-LLM Engine',
  trial_days: 7,
  annual_discount_text: 'Save 20% on Annual Billing'
};

export const FALLBACK_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    slug: 'starter',
    short_description: 'Perfect for small teams and growing local businesses getting started on WhatsApp.',
    price_monthly: 1999,
    price_yearly: 1599,
    original_price_monthly: 2499,
    original_price_yearly: 1999,
    discount_percent: 20,
    currency: '₹',
    button_text: 'Start 7-Day Free Trial',
    button_url: '/free-trial?plan=starter',
    suitable_for: 'Small Teams & Local Businesses',
    team_size: 'Up to 3 Agents',
    max_contacts: '10,000 Contacts',
    max_conversations: '5,000 / mo',
    max_users: '3 Team Seats',
    max_ai_requests: '10,000 Tokens / mo',
    max_broadcasts: '5,000 Messages / mo',
    api_access: false,
    support_type: 'Standard Email & Chat',
    trial_days: 7,
    is_free: false,
    is_enterprise: false,
    is_active: true,
    sort_order: 1,
    features_list: [
      'Official Meta WhatsApp Cloud API',
      'Multi-Agent Shared Inbox (3 Seats)',
      'Gemini 3.6 & OpenAI AI Auto-Responder',
      'Zero-Token Greeting Cache (<100ms)',
      'Basic Broadcast Campaigns',
      'Contact Tags & Attributes',
      'Standard Support & Documentation'
    ]
  },
  {
    id: 'plan_growth',
    name: 'Growth AI',
    slug: 'growth',
    short_description: 'Built for fast-growing SMBs needing advanced CRM deal pipelines, BYOK AI, and Voice AI.',
    price_monthly: 4999,
    price_yearly: 3999,
    original_price_monthly: 6499,
    original_price_yearly: 4999,
    discount_percent: 20,
    currency: '₹',
    popular_badge: 'MOST POPULAR 🔥',
    recommended_badge: 'BEST VALUE FOR SMBs',
    button_text: 'Start 7-Day Free Trial',
    button_url: '/free-trial?plan=growth',
    suitable_for: 'Fast-Growing SMBs & D2C Brands',
    team_size: 'Up to 10 Agents',
    max_contacts: '50,000 Contacts',
    max_conversations: '25,000 / mo',
    max_users: '10 Team Seats',
    max_ai_requests: 'Unlimited BYOK Tokens',
    max_broadcasts: '50,000 Messages / mo',
    api_access: true,
    support_type: 'Priority WhatsApp & Phone',
    trial_days: 7,
    is_free: false,
    is_enterprise: false,
    is_active: true,
    sort_order: 2,
    features_list: [
      'Everything in Starter Plan +',
      'Bring Your Own Key (BYOK) - 0% Markup',
      'Visual Kanban Deals Pipeline',
      'No-Code Workflow Automation Builder',
      'Retell Voice AI Integration & Call Sync',
      'AI Lead Sentiment & Intent Scoring (HOT 🔥)',
      'Google Sheets 2-Way Real-Time Sync',
      'Priority WhatsApp Support & Setup Guide'
    ]
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Scale',
    slug: 'enterprise',
    short_description: 'Designed for large organizations requiring custom VPCs, SLA telemetry, and dedicated support.',
    price_monthly: 12999,
    price_yearly: 9999,
    original_price_monthly: 15999,
    original_price_yearly: 12999,
    discount_percent: 23,
    currency: '₹',
    recommended_badge: 'ENTERPRISE SLA 99.9%',
    button_text: 'Schedule Enterprise Demo',
    button_url: '/book-demo?plan=enterprise',
    suitable_for: 'Large Enterprises & Educational Chains',
    team_size: 'Unlimited Agents',
    max_contacts: 'Unlimited Contacts',
    max_conversations: 'Unlimited',
    max_users: 'Unlimited Seats',
    max_ai_requests: 'Custom Multi-Model Gateway',
    max_broadcasts: 'Unlimited Mass Broadcasts',
    api_access: true,
    support_type: '24/7 Dedicated Account Manager',
    trial_days: 7,
    is_free: false,
    is_enterprise: true,
    is_active: true,
    sort_order: 3,
    features_list: [
      'Everything in Growth AI Plan +',
      'Unlimited Team Seats & Agents',
      'AI Auto-Failover Engine (Zero Downtime)',
      'Multi-Number & Multi-Department Routing',
      'Developer REST APIs & Webhook Triggers',
      'SLA Breach Alerts & Telemetry Reports',
      'AES-256 Data Encryption & SOC-2 Audit',
      '24/7 Dedicated Account Manager & SLA'
    ]
  }
];

export const FALLBACK_PRICING_FAQS: PricingFaq[] = [
  {
    id: 'faq_1',
    question: 'Are there any hidden platform markups on Meta WhatsApp messages?',
    answer: 'No! Unlike traditional providers who add 30-50% markups on messaging costs, WCRM passes Meta Cloud API messaging rates directly to you with zero added markups.',
    category: 'Billing & Meta Pricing',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'faq_2',
    question: 'How does Bring Your Own Key (BYOK) work for AI models?',
    answer: 'BYOK allows you to plug your own OpenAI, Gemini, Groq, or Claude API keys directly into WCRM. You pay the AI providers directly at their raw rates, saving up to 60% compared to standard CRM vendors.',
    category: 'AI Platform',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'faq_3',
    question: 'What happens when primary AI model experiences an API rate limit (429 error)?',
    answer: 'WCRM features a self-healing Auto-Failover Engine. If your primary model hits a rate limit or timeout, WCRM automatically routes the message to your backup model (e.g. Groq Llama 3.3 or DeepSeek) in <1 second.',
    category: 'AI Platform',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'faq_4',
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer: 'Yes! You can upgrade or switch your plan anytime from your dashboard. Plan upgrades take effect immediately with pro-rated billing.',
    category: 'Subscription',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'faq_5',
    question: 'Do you offer a free trial?',
    answer: 'Yes! We provide a full 7-day free trial on all plans so you can test team inboxes, AI auto-responders, and broadcast campaigns completely risk-free without entering credit card details.',
    category: 'Subscription',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'faq_6',
    question: 'How can I migrate my existing data from another CRM or WhatsApp tool?',
    answer: 'WCRM features 1-click data migration from Zoho CRM, Bigin, HubSpot, Pipedrive, and CSV lists. Our technical support team assists with white-glove migration free of charge during onboarding.',
    category: 'Migration',
    sort_order: 6,
    is_active: true
  },
  {
    id: 'faq_7',
    question: 'What is your money-back guarantee policy?',
    answer: 'We offer a 100% money-back guarantee. If you are not completely satisfied within 30 days for monthly billing or 45 days for annual billing, we will issue a full refund—no questions asked.',
    category: 'Billing',
    sort_order: 7,
    is_active: true
  },
  {
    id: 'faq_8',
    question: 'Are there any forced long-term contracts or lock-ins?',
    answer: 'No long-term contracts or forced commitments. You can cancel, upgrade, or downgrade your plan anytime directly from your admin control panel.',
    category: 'Subscription',
    sort_order: 8,
    is_active: true
  }
];

export async function getPricingPlansFromDB(): Promise<PricingPlan[]> {
  try {
    const supabase = await createClient();
    const { data: dbPlans, error } = await supabase
      .from('saas_pricing_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && dbPlans && dbPlans.length > 0) {
      return dbPlans as PricingPlan[];
    }
  } catch (err) {
    console.warn('Failed to fetch pricing plans from DB, using fallbacks', err);
  }
  return FALLBACK_PRICING_PLANS;
}

export async function getPricingFaqsFromDB(): Promise<PricingFaq[]> {
  try {
    const supabase = await createClient();
    const { data: dbFaqs, error } = await supabase
      .from('saas_pricing_faqs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && dbFaqs && dbFaqs.length > 0) {
      return dbFaqs as PricingFaq[];
    }
  } catch (err) {
    console.warn('Failed to fetch pricing FAQs from DB, using fallbacks', err);
  }
  return FALLBACK_PRICING_FAQS;
}
