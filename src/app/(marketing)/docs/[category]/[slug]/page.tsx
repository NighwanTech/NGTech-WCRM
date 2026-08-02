import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronRight, Clock, User, Tag, Calendar, ArrowLeft } from 'lucide-react';
import {
  getDocCategoriesFromDB,
  getDocArticlesFromDB,
  getDocArticleBySlug
} from '@/lib/services/docs-cms.service';
import { DocsSidebar } from '@/components/docs/docs-sidebar';
import { DocsToc } from '@/components/docs/docs-toc';
import { DocsFeedback } from '@/components/docs/docs-feedback';

// Dynamic MDX elements
import { DocCallout } from '@/components/docs/mdx/doc-callout';
import { DocCodeTabs } from '@/components/docs/mdx/doc-code-tabs';
import { DocApiEndpoint, DocParamTable } from '@/components/docs/mdx/doc-api-endpoint';

interface DocArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: DocArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getDocArticleBySlug(category, slug);

  if (!article) {
    return {
      title: 'Document Not Found | AI WCRM Docs'
    };
  }

  return {
    title: `${article.title} | AI WCRM Documentation`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article'
    }
  };
}

export default async function DocArticlePage({ params }: DocArticlePageProps) {
  const { category, slug } = await params;
  const categories = await getDocCategoriesFromDB();
  const allArticles = await getDocArticlesFromDB();

  const article = await getDocArticleBySlug(category, slug);
  if (!article) notFound();

  // Structured Data (TechArticle JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: article.author_name || 'AI WCRM Engineering'
    },
    datePublished: article.created_at,
    dateModified: article.updated_at,
    inLanguage: 'en-US'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Tree Sidebar */}
        <DocsSidebar
          categories={categories}
          articles={allArticles}
          activeCategorySlug={category}
          activeArticleSlug={slug}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto space-y-8 text-left text-foreground">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link href="/docs" className="hover:text-emerald-400">Docs</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/docs/${category}/overview`} className="hover:text-emerald-400 capitalize">
              {category.replace(/-/g, ' ')}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-bold truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Header Title Block */}
          <div className="space-y-4 border-b border-border/60 pb-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                {article.version || 'v1.0'}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.reading_time_minutes || 5} min read</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{article.author_name || 'AI WCRM Team'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* MDX Body Renderer */}
          <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed font-sans">
            {/* Custom components rendering demonstration */}
            {article.slug === 'byok-configuration-guide' && (
              <>
                <DocCallout type="tip">
                  **Direct Provider Rates**: Pay AI providers directly at raw API rates. Save up to **60%** compared to traditional CRM vendors!
                </DocCallout>

                <h2 id="key-benefits">Key Benefits of BYOK</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Zero Platform Markup</strong>: 100% of your AI token usage is billed directly to your provider accounts.</li>
                  <li><strong>Sub-Second Auto-Failover</strong>: If OpenAI hits a 429 rate limit, AI WCRM seamlessly shifts traffic to Groq or Gemini in &lt;1 second.</li>
                  <li><strong>Enterprise AES-256 Vault</strong>: API keys are encrypted at rest using AES-256-GCM.</li>
                </ul>

                <h2 id="code-example">Code Example & SDK Verification</h2>
                <DocCodeTabs
                  items={[
                    {
                      label: 'Node.js',
                      language: 'typescript',
                      code: `import { AiRouter } from '@aiwcrm/sdk';

const router = new AiRouter({
  primaryModel: 'gemini-3.6-flash',
  fallbackModel: 'groq-llama-3.3-70b',
  byokKeys: { gemini: process.env.GEMINI_API_KEY }
});
const response = await router.complete({ prompt: 'Hello world' });`
                    },
                    {
                      label: 'Python',
                      language: 'python',
                      code: `from aiwcrm import AiRouter
import os

router = AiRouter(
    primary_model="gemini-3.6-flash",
    byok_keys={"gemini": os.getenv("GEMINI_API_KEY")}
)
res = router.complete(prompt="Hello world")`
                    }
                  ]}
                />

                <DocCallout type="warning">
                  **Security Note**: Never share or publish your raw API keys in public repositories. AI WCRM never logs your secret keys.
                </DocCallout>
              </>
            )}

            {article.slug === 'api-authentication' && (
              <>
                <h2 id="base-url">Base API URL</h2>
                <DocApiEndpoint method="GET" endpoint="https://api.aiwcrm.com/v1/contacts" description="Returns paginated list of CRM contact objects." />

                <h2 id="query-parameters">Query Parameters</h2>
                <DocParamTable
                  parameters={[
                    { name: 'limit', type: 'integer', required: false, description: 'Number of results to return (max 100, default 20).' },
                    { name: 'status', type: 'string', required: false, description: 'Filter by contact status (lead, customer, archived).' },
                    { name: 'api_key', type: 'string', required: true, description: 'Bearer API Secret Key.' }
                  ]}
                />
              </>
            )}

            {article.slug !== 'byok-configuration-guide' && article.slug !== 'api-authentication' && (
              <div className="space-y-4">
                <DocCallout type="info">
                  This documentation page is live-rendered from the AI WCRM Knowledge Engine.
                </DocCallout>
                <div className="p-6 rounded-2xl bg-card border border-border/80 text-muted-foreground whitespace-pre-wrap font-mono text-xs leading-relaxed">
                  {article.content_mdx}
                </div>
              </div>
            )}
          </article>

          {/* Feedback Rating Widget */}
          <DocsFeedback articleId={article.id} />

        </main>

        {/* Right Sticky Table of Contents */}
        <DocsToc contentMdx={article.content_mdx} />
      </div>
    </>
  );
}
