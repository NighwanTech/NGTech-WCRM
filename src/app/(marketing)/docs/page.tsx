import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  BookOpen,
  Bot,
  MessageSquare,
  Inbox,
  Zap,
  Send,
  Kanban,
  BarChart3,
  Layers,
  Code2,
  Shield,
  Lock,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Search,
  CheckCircle2,
  Terminal,
  Compass
} from 'lucide-react';
import { getDocCategoriesFromDB } from '@/lib/services/docs-cms.service';

import { getSiteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'AIWCRM Documentation & Enterprise Platform Manual',
  description: 'Complete user manual, API references, BYOK setup guides, GST invoicing, PBAC security, workflow automations, and troubleshooting for AIWCRM Enterprise OS.',
  keywords: ['AIWCRM Docs', 'Enterprise CRM Manual', 'GST Invoicing Guide', 'PBAC Permissions Guide', 'BYOK Setup Guide', 'Meta Cloud API Docs', 'AIWCRM API'],
  openGraph: {
    title: 'AIWCRM Enterprise Documentation & User Manual',
    description: 'Comprehensive technical documentation and guides for AIWCRM Enterprise Business Operating System.',
    url: getSiteUrl('/docs'),
    siteName: 'AIWCRM',
    type: 'website'
  },
  alternates: {
    canonical: getSiteUrl('/docs'),
  }
};

const ICON_MAP: Record<string, React.ElementType> = {
  Bot,
  MessageSquare,
  Inbox,
  Zap,
  Send,
  Kanban,
  BarChart3,
  Layers,
  Code2,
  Shield,
  Lock,
  Sparkles,
  HelpCircle,
  ArrowRight,
  BookOpen
};

export default async function DocsIndexPage() {
  const categories = await getDocCategoriesFromDB();

  return (
    <div className="space-y-12 py-10 px-4 sm:px-6 lg:px-8 text-foreground font-sans">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-card via-background to-card border border-border/80 shadow-2xl text-center space-y-6">
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
          <BookOpen className="h-3.5 w-3.5" /> Enterprise OS Knowledge Base & Manual
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-foreground">
          AIWCRM{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            Platform Documentation.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Comprehensive operational manuals, REST API guides, 18% GST invoicing workflows, PBAC security matrices, and visual automation blueprints.
        </p>

        {/* Quickstart Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-4 text-left">
          <Link
            href="/docs/ai-copilot/multi-provider-voice-ai-guide"
            className="p-4 rounded-2xl bg-muted/40 hover:bg-emerald-500/10 border border-border/60 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Bot className="h-5 w-5 text-emerald-400" />
              <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-xs font-extrabold text-foreground">AI Studio & Voice</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">Retell Voice AI & BYOK Multi-LLM</p>
          </Link>

          <Link
            href="/docs/campaign-management/ai-meta-ads-guide"
            className="p-4 rounded-2xl bg-muted/40 hover:bg-emerald-500/10 border border-border/60 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <ArrowRight className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-xs font-extrabold text-foreground">Meta Ads & Lead Hub</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">Sub-2s lead intake & audience studio</p>
          </Link>

          <Link
            href="/security"
            className="p-4 rounded-2xl bg-muted/40 hover:bg-emerald-500/10 border border-border/60 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <ArrowRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-xs font-extrabold text-foreground">Security & PBAC</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">4-tier permission matrix & audit logs</p>
          </Link>

          <Link
            href="/api-docs"
            className="p-4 rounded-2xl bg-muted/40 hover:bg-emerald-500/10 border border-border/60 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Code2 className="h-5 w-5 text-amber-400" />
              <ArrowRight className="h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-xs font-extrabold text-foreground">REST API v2.0</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">Webhooks, CRM sync & endpoints</p>
          </Link>
        </div>
      </section>

      {/* 15 Documentation Categories Grid */}
      <section className="space-y-6 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Operational Blueprints
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight">
            Enterprise Platform{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              Knowledge Hub.
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">Select a topic below to read detailed specifications, guides, and API references.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || BookOpen;
            const categorySlugMap: Record<string, string> = {
              'ai-copilot': 'multi-provider-voice-ai-guide',
              'campaign-management': 'ai-meta-ads-guide',
              'administration': 'pbac-rbac-permission-guide',
              'security-compliance': 'security-vault-compliance-guide',
              'whatsapp-cloud-api': 'meta-waba-setup-guide',
              'developer-platform': 'api-authentication',
              'migration-guides': 'zoho-bigin-migration-guide'
            };
            const defaultSlug = categorySlugMap[cat.slug] || 'overview';

            return (
              <Link
                key={cat.id}
                href={`/docs/${cat.slug}/${defaultSlug}`}
                className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {cat.article_count || 3} Articles
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-foreground group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 pt-2 border-t border-border/40">
                  <span>Explore Guides</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
