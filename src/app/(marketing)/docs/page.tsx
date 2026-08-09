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

export const metadata: Metadata = {
  title: 'AI WCRM Documentation & Enterprise User Manual',
  description: 'Complete user manual, API references, BYOK setup guides, workflow automations, and troubleshooting for AI WCRM.',
  keywords: ['AI WCRM Docs', 'WhatsApp CRM User Manual', 'BYOK Setup Guide', 'Meta Cloud API Docs', 'AI WCRM API'],
  openGraph: {
    title: 'AI WCRM Enterprise Documentation & User Manual',
    description: 'Comprehensive technical documentation and guides for AI WCRM.',
    url: 'https://wacrm.in/docs',
    siteName: 'AI WCRM',
    type: 'website'
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
          <BookOpen className="h-3.5 w-3.5" /> Enterprise Knowledge Base & Manual
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
          AI WCRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Documentation Platform</span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Everything you need to set up, build, scale, and automate your WhatsApp AI CRM operations. Search 15+ specialized categories or follow our 5-minute quickstart guide.
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
            <h4 className="text-xs font-extrabold text-foreground">Voice AI (ElevenLabs & Retell)</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">Hindi voices & 10-field CRM sync</p>
          </Link>

          <Link
            href="/docs/campaign-management/ai-meta-ads-guide"
            className="p-4 rounded-2xl bg-muted/40 hover:bg-emerald-500/10 border border-border/60 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Send className="h-5 w-5 text-blue-400" />
              <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-xs font-extrabold text-foreground">AI Meta Ads & Lead Sync</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">0-latency Lead Form WhatsApp sync</p>
          </Link>

          <Link
            href="/docs/administration/pbac-rbac-permission-guide"
            className="p-4 rounded-2xl bg-muted/40 hover:bg-emerald-500/10 border border-border/60 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-xs font-extrabold text-foreground">Enterprise PBAC & RBAC</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">Role hierarchy & access policies</p>
          </Link>

          <Link
            href="/docs/security-compliance/security-vault-compliance-guide"
            className="p-4 rounded-2xl bg-muted/40 hover:bg-emerald-500/10 border border-border/60 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Lock className="h-5 w-5 text-amber-400" />
              <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-xs font-extrabold text-foreground">Security & DPDP Vault</h4>
            <p className="text-[11px] text-muted-foreground pt-0.5">AES-256 vault & SOC-2 logs</p>
          </Link>
        </div>
      </section>

      {/* 15 Documentation Categories Grid */}
      <section className="space-y-6 text-left">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-foreground">Documentation Categories</h2>
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
