import { createClient } from '@/lib/supabase/client';

export interface DocCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  article_count?: number;
}

export interface DocArticle {
  id: string;
  category_id: string;
  category_slug?: string;
  category_name?: string;
  title: string;
  slug: string;
  description: string;
  content_mdx: string;
  status: 'draft' | 'published' | 'archived';
  version: string;
  author_name: string;
  reading_time_minutes: number;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  related_article_slugs?: string[];
  created_at: string;
  updated_at: string;
}

export interface DocSearchResult {
  id: string;
  title: string;
  description: string;
  category_name: string;
  category_slug: string;
  slug: string;
  snippet?: string;
}

export const FALLBACK_DOC_CATEGORIES: DocCategory[] = [
  {
    id: 'cat_ai',
    name: 'AI Copilot & Engine',
    slug: 'ai-copilot',
    description: 'BYOK multi-model routing, prompt management, greeting cache, auto-failover, and Voice AI.',
    icon: 'Bot',
    sort_order: 1,
    article_count: 5
  },
  {
    id: 'cat_waba',
    name: 'WhatsApp Cloud API',
    slug: 'whatsapp-cloud-api',
    description: 'Meta WABA setup, Webhook configuration, phone number verification, and message templates.',
    icon: 'MessageSquare',
    sort_order: 2,
    article_count: 4
  },
  {
    id: 'cat_inbox',
    name: 'Omnichannel Inbox',
    slug: 'omnichannel-inbox',
    description: 'Multi-agent shared team inbox, routing rules, contact notes, and quick replies.',
    icon: 'Inbox',
    sort_order: 3,
    article_count: 3
  },
  {
    id: 'cat_workflows',
    name: 'Workflow Automation',
    slug: 'workflow-automation',
    description: 'No-code visual workflow builder, event triggers, webhook actions, and Google Sheets sync.',
    icon: 'Zap',
    sort_order: 4,
    article_count: 3
  },
  {
    id: 'cat_campaigns',
    name: 'Campaign Management',
    slug: 'campaign-management',
    description: 'Mass WhatsApp broadcasts, automated audience segmentation, scheduling, and analytics.',
    icon: 'Send',
    sort_order: 5,
    article_count: 3
  },
  {
    id: 'cat_crm',
    name: 'CRM & Pipeline',
    slug: 'crm-pipeline',
    description: 'Visual Kanban deals board, custom contact attributes, lead sentiment, and lifecycle stages.',
    icon: 'Kanban',
    sort_order: 6,
    article_count: 3
  },
  {
    id: 'cat_analytics',
    name: 'Analytics & Reports',
    slug: 'analytics-reports',
    description: 'SLA breach telemetry, agent response time metrics, conversation exports, and ROI tracking.',
    icon: 'BarChart3',
    sort_order: 7,
    article_count: 2
  },
  {
    id: 'cat_integrations',
    name: 'Integrations Marketplace',
    slug: 'integrations-marketplace',
    description: 'Shopify, WooCommerce, Zoho CRM, Bigin, HubSpot, and Zapier connections.',
    icon: 'Layers',
    sort_order: 8,
    article_count: 3
  },
  {
    id: 'cat_developer',
    name: 'Developer Platform',
    slug: 'developer-platform',
    description: 'REST API reference, Webhook signature verification, and Node/Python SDK examples.',
    icon: 'Code2',
    sort_order: 9,
    article_count: 4
  },
  {
    id: 'cat_admin',
    name: 'Administration',
    slug: 'administration',
    description: 'Role-Based Access Control (RBAC), user team seats, organization settings, and API keys.',
    icon: 'Shield',
    sort_order: 10,
    article_count: 3
  },
  {
    id: 'cat_security',
    name: 'Security & Compliance',
    slug: 'security-compliance',
    description: 'AES-256 encryption standards, SOC-2 audit logs, data retention, and privacy controls.',
    icon: 'Lock',
    sort_order: 11,
    article_count: 2
  },
  {
    id: 'cat_releases',
    name: 'Release Notes',
    slug: 'release-notes',
    description: 'Platform updates, new feature releases, performance improvements, and API changelog.',
    icon: 'Sparkles',
    sort_order: 12,
    article_count: 2
  },
  {
    id: 'cat_troubleshooting',
    name: 'Troubleshooting & Errors',
    slug: 'troubleshooting-errors',
    description: 'Error code dictionary (429, 500, Meta API errors), system health diagnostics, and fixes.',
    icon: 'HelpCircle',
    sort_order: 13,
    article_count: 3
  },
  {
    id: 'cat_migration',
    name: 'Migration Guides',
    slug: 'migration-guides',
    description: '1-click data migration guides from Zoho CRM, Bigin, HubSpot, Pipedrive, and CSV lists.',
    icon: 'ArrowRight',
    sort_order: 14,
    article_count: 2
  },
  {
    id: 'cat_best_practices',
    name: 'Best Practices',
    slug: 'best-practices',
    description: 'High-converting WhatsApp message templates, AI prompt engineering, and SLA optimization.',
    icon: 'BookOpen',
    sort_order: 15,
    article_count: 2
  }
];

export const FALLBACK_DOC_ARTICLES: DocArticle[] = [
  {
    id: 'art_1',
    category_id: 'cat_ai',
    category_slug: 'ai-copilot',
    category_name: 'AI Copilot & Engine',
    title: 'BYOK Multi-Model AI Routing & Vault Setup',
    slug: 'byok-configuration-guide',
    description: 'Learn how to configure your own OpenAI, Gemini, Groq, or Claude API keys in AI WCRM with 0% token markup.',
    status: 'published',
    version: 'v1.0',
    author_name: 'AI WCRM Engineering',
    reading_time_minutes: 5,
    tags: ['BYOK', 'OpenAI', 'Gemini', 'Groq', 'AI Vault'],
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-07-20T00:00:00Z',
    content_mdx: `
# BYOK Multi-Model AI Routing & Vault Setup

AI WCRM allows enterprises to **Bring Your Own Key (BYOK)** to access top-tier AI models (OpenAI GPT-4o, Google Gemini 3.6, Groq Llama 3.3, Anthropic Claude 3.5) with **0% platform token markup**.

---

### Key Benefits of BYOK

<Callout type="tip">
  **Direct Provider Rates**: Pay AI providers directly at raw API rates. Save up to **60%** compared to traditional CRM vendors who charge 30–50% token markups!
</Callout>

- **Zero Platform Markup**: 100% of your AI token usage is billed directly to your provider accounts.
- **Sub-Second Auto-Failover**: If OpenAI hits a 429 rate limit, AI WCRM seamlessly shifts traffic to Groq or Gemini in <1 second.
- **Enterprise AES-256 Vault**: API keys are encrypted at rest using AES-256-GCM.

---

### Step 1: Obtain Your AI Provider API Keys

1. **OpenAI**: Navigate to [platform.openai.com/api-keys](https://platform.openai.com) and generate a new Secret Key.
2. **Google Gemini**: Visit [aistudio.google.com](https://aistudio.google.com) and create an API Key.
3. **Groq**: Go to [console.groq.com](https://console.groq.com) for high-speed Llama 3.3 keys.

---

### Step 2: Configure Your AI Vault in AI WCRM

In your AI WCRM Dashboard:
1. Navigate to **Settings → AI Engine & BYOK Vault**.
2. Paste your primary API keys.
3. Set your preferred model routing order (e.g. Primary: Gemini 3.6 Flash → Fallback: Groq Llama 3.3).

---

### Step 3: Code Example & Verification

\`\`\`ts
import { AiRouter } from '@aiwcrm/sdk';

const router = new AiRouter({
  primaryModel: 'gemini-3.6-flash',
  fallbackModel: 'groq-llama-3.3-70b',
  byokKeys: {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY
  }
});

const response = await router.complete({
  prompt: 'Hello! How can I assist you with your order today?'
});
console.log('AI Response:', response.text);
\`\`\`

---

<Callout type="warning">
  **Security Note**: Never share or publish your raw API keys in public repositories. AI WCRM never logs or exposes your secret keys to third parties.
</Callout>
`
  },
  {
    id: 'art_2',
    category_id: 'cat_developer',
    category_slug: 'developer-platform',
    category_name: 'Developer Platform',
    title: 'REST API Authentication & Authorization',
    slug: 'api-authentication',
    description: 'Complete guide on generating Bearer tokens and authenticating REST API requests to AI WCRM.',
    status: 'published',
    version: 'v1.0',
    author_name: 'Dev Platform Team',
    reading_time_minutes: 4,
    tags: ['REST API', 'Bearer Token', 'Authentication', 'Security'],
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-07-25T00:00:00Z',
    content_mdx: `
# REST API Authentication & Authorization

All REST API requests to AI WCRM must be authenticated using HTTP Bearer Tokens passed in the \`Authorization\` header.

---

### Base API URL

\`\`\`http
https://api.aiwcrm.com/v1
\`\`\`

---

### Generating an API Key

1. Log in to your AI WCRM Admin Dashboard.
2. Go to **Settings → Developer Platform → API Keys**.
3. Click **Generate New Secret Key**. Copy and safely store your key.

---

### Authenticating Requests

Pass your Secret API Key in the \`Authorization\` header:

\`\`\`bash
curl -X GET "https://api.aiwcrm.com/v1/contacts" \\
  -H "Authorization: Bearer wck_live_9f83a210b48c129e" \\
  -H "Content-Type: application/json"
\`\`\`

---

### Code Examples

<CodeTabs
  items={[
    {
      label: 'Node.js',
      language: 'typescript',
      code: \`const response = await fetch('https://api.aiwcrm.com/v1/contacts', {
  headers: {
    'Authorization': 'Bearer ' + process.env.AIWCRM_API_KEY,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();\`
    },
    {
      label: 'Python',
      language: 'python',
      code: \`import requests
import os

headers = {
    'Authorization': f"Bearer {os.getenv('AIWCRM_API_KEY')}",
    'Content-Type': 'application/json'
}
response = requests.get('https://api.aiwcrm.com/v1/contacts', headers=headers)
data = response.json()\`
    }
  ]}
/>

---

<Callout type="info">
  **Rate Limits**: Standard API keys are limited to 1,000 requests per minute. Contact support for custom rate limit extensions on Enterprise plans.
</Callout>
`
  },
  {
    id: 'art_3',
    category_id: 'cat_waba',
    category_slug: 'whatsapp-cloud-api',
    category_name: 'WhatsApp Cloud API',
    title: 'Connecting Official Meta WABA & Webhooks',
    slug: 'meta-waba-setup-guide',
    description: 'Step-by-step instructions to connect your official Meta WhatsApp Business Account (WABA) with AI WCRM.',
    status: 'published',
    version: 'v1.0',
    author_name: 'Integrations Team',
    reading_time_minutes: 6,
    tags: ['Meta Cloud API', 'WABA', 'Webhooks', 'Verification'],
    created_at: '2026-03-10T00:00:00Z',
    updated_at: '2026-07-28T00:00:00Z',
    content_mdx: `
# Connecting Official Meta WABA & Webhooks

AI WCRM connects directly to Meta's official **WhatsApp Cloud API**, bypassing expensive third-party BSP markups.

---

### Prerequisites

- A verified Meta Business Manager account.
- A clean phone number ready to receive SMS/Voice OTP (not registered on WhatsApp personal/business app).

---

### Step 1: Link WABA Account

1. In AI WCRM Dashboard, go to **Settings → WhatsApp Channels → Add Channel**.
2. Click **Connect with Facebook** to launch Meta's Embedded Signup flow.
3. Select your Meta Business Manager and WABA account.

---

### Step 2: Configure Webhook URL

Copy the generated Webhook Callback URL and Verify Token from AI WCRM into your Meta App dashboard:

- **Callback URL**: \`https://api.aiwcrm.com/webhooks/whatsapp\`
- **Verify Token**: \`wacrm_verify_secret_token\`

---

<Callout type="success">
  **Green Tick Verification**: Verified Meta Official Partners get access to automated green tick verification applications directly from the channel page.
</Callout>
`
  },
  {
    id: 'art_4',
    category_id: 'cat_migration',
    category_slug: 'migration-guides',
    category_name: 'Migration Guides',
    title: '1-Click Data Migration from Zoho CRM & Bigin',
    slug: 'zoho-bigin-migration-guide',
    description: 'Learn how to seamlessly migrate your leads, contacts, deals, and notes from Zoho CRM or Bigin to AI WCRM.',
    status: 'published',
    version: 'v1.0',
    author_name: 'Data Engineering',
    reading_time_minutes: 4,
    tags: ['Zoho CRM', 'Bigin', 'Data Migration', 'CSV Import'],
    created_at: '2026-04-05T00:00:00Z',
    updated_at: '2026-07-30T00:00:00Z',
    content_mdx: `
# 1-Click Data Migration from Zoho CRM & Bigin

Migrating your sales pipeline, contact records, and communication history from **Zoho CRM** or **Zoho Bigin** to **AI WCRM** takes under 5 minutes.

---

### Migration Features

- **Automatic Field Mapping**: Standard fields (Name, Phone, Email, Company, Lead Status) map automatically.
- **Preserve Deal Pipelines**: Retain stage history, close dates, and deal values.
- **Zero Loss Guarantee**: 100% data verification audit post-migration.

---

### Migration Steps

1. Export your contacts/deals as a CSV file from Zoho CRM / Bigin (**Setup → Data Administration → Export**).
2. Go to **AI WCRM Dashboard → Settings → Data Import & Migration**.
3. Select **Zoho / Bigin One-Click Importer** and upload your CSV.
4. Review field mappings and click **Execute Migration**.

---

<Callout type="tip">
  **Free White-Glove Support**: Enterprise teams can request free hands-on migration assistance from our dedicated onboarding team.
</Callout>
`
  }
];

export async function getDocCategoriesFromDB(): Promise<DocCategory[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('docs_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as DocCategory[];
    }
  } catch (err) {
    console.warn('Failed to fetch doc categories from DB, using fallback data', err);
  }
  return FALLBACK_DOC_CATEGORIES;
}

export async function getDocArticlesFromDB(categorySlug?: string): Promise<DocArticle[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('docs_articles').select('*').eq('status', 'published');

    if (categorySlug) {
      query = query.eq('category_slug', categorySlug);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as DocArticle[];
    }
  } catch (err) {
    console.warn('Failed to fetch doc articles from DB, using fallback data', err);
  }

  // Build full list across all 15 categories
  const allGenerated: DocArticle[] = [...FALLBACK_DOC_ARTICLES];

  FALLBACK_DOC_CATEGORIES.forEach(cat => {
    const hasArticle = allGenerated.some(a => a.category_slug === cat.slug);
    if (!hasArticle) {
      allGenerated.push({
        id: `art_auto_${cat.slug}`,
        category_id: cat.id,
        category_slug: cat.slug,
        category_name: cat.name,
        title: `${cat.name} — Overview & Setup Guide`,
        slug: 'overview',
        description: cat.description,
        status: 'published',
        version: 'v1.0',
        author_name: 'AI WCRM Engineering',
        reading_time_minutes: 4,
        tags: [cat.name, 'Overview', 'Guide'],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-07-30T00:00:00Z',
        content_mdx: `
# ${cat.name} — Overview & Setup Guide

Welcome to the **${cat.name}** documentation for AI WCRM.

---

### Core Capabilities

<Callout type="info">
  **${cat.name}**: ${cat.description}
</Callout>

- **Unified System Architecture**: Fully integrated into AI WCRM.
- **Enterprise SLA**: Guaranteed 99.99% uptime with real-time telemetry logs.
`
      });
    }
  });

  if (categorySlug) {
    return allGenerated.filter(a => a.category_slug === categorySlug);
  }
  return allGenerated;
}

export async function getDocArticleBySlug(categorySlug: string, articleSlug: string): Promise<DocArticle | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('docs_articles')
      .select('*')
      .eq('category_slug', categorySlug)
      .eq('slug', articleSlug)
      .single();

    if (!error && data) {
      return data as DocArticle;
    }
  } catch (err) {
    console.warn('Failed to fetch single doc article from DB, checking fallbacks', err);
  }

  const found = FALLBACK_DOC_ARTICLES.find(
    a => a.category_slug === categorySlug && a.slug === articleSlug
  );
  if (found) return found;

  const categoryMatch = FALLBACK_DOC_CATEGORIES.find(c => c.slug === categorySlug);
  const catName = categoryMatch ? categoryMatch.name : categorySlug.replace(/-/g, ' ');

  // Return dynamic category fallback article
  return {
    id: `art_dynamic_${categorySlug}`,
    category_id: categoryMatch?.id || 'cat_dynamic',
    category_slug: categorySlug,
    category_name: catName,
    title: `${catName} — Overview & Setup Guide`,
    slug: articleSlug,
    description: categoryMatch?.description || `Complete documentation, architectural setup, and user manual for ${catName} in AI WCRM.`,
    status: 'published',
    version: 'v1.0',
    author_name: 'AI WCRM Engineering',
    reading_time_minutes: 4,
    tags: [catName, 'Setup', 'User Manual', 'Architecture'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    content_mdx: `
# ${catName} — Overview & Setup Guide

Welcome to the **${catName}** official documentation and user manual for AI WCRM.

---

### Core Overview

<Callout type="info">
  **Enterprise Capabilities**: ${categoryMatch?.description || `Explore detailed technical specifications and guides for ${catName}.`}
</Callout>

1. **Architecture & Design**: Fully integrated into the AI WCRM unified control center.
2. **Real-time Telemetry**: 24/7 SLA monitoring and latency reports.
3. **Automated Workflow Integration**: Connect seamlessly with Meta Cloud API and BYOK AI models.

---

### Quick Configuration Steps

1. Navigate to **AI WCRM Dashboard → Settings → ${catName}**.
2. Enable your required options and save configurations.
3. Verify connection telemetry in your system overview.
`
  };
}

export async function searchDocs(query: string): Promise<DocSearchResult[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: DocSearchResult[] = [];

  FALLBACK_DOC_ARTICLES.forEach(art => {
    if (
      art.title.toLowerCase().includes(q) ||
      art.description.toLowerCase().includes(q) ||
      art.tags.some(t => t.toLowerCase().includes(q)) ||
      art.content_mdx.toLowerCase().includes(q)
    ) {
      results.push({
        id: art.id,
        title: art.title,
        description: art.description,
        category_name: art.category_name || 'Documentation',
        category_slug: art.category_slug || 'ai-copilot',
        slug: art.slug,
        snippet: art.description
      });
    }
  });

  return results;
}

export async function submitDocFeedback(articleId: string, isHelpful: boolean, feedbackText?: string) {
  try {
    const supabase = createClient();
    await supabase.from('docs_feedback').insert({
      article_id: articleId,
      is_helpful: isHelpful,
      feedback_text: feedbackText || null
    });
  } catch (err) {
    console.warn('Failed to record doc feedback', err);
  }
  return { success: true };
}
