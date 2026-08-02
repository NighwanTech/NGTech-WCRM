'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
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
} from 'lucide-react';
import { DocCategory, DocArticle } from '@/lib/services/docs-cms.service';

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

interface DocsSidebarProps {
  categories: DocCategory[];
  articles: DocArticle[];
  activeCategorySlug?: string;
  activeArticleSlug?: string;
}

export function DocsSidebar({ categories, articles, activeCategorySlug, activeArticleSlug }: DocsSidebarProps) {
  const pathname = usePathname();
  const [openCategorySlugs, setOpenCategorySlugs] = useState<Record<string, boolean>>({
    [activeCategorySlug || 'ai-copilot']: true,
    'developer-platform': true,
    'whatsapp-cloud-api': true
  });

  const toggleCategory = (slug: string) => {
    setOpenCategorySlugs(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-border/60 bg-card/40 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-1">
        <p className="text-[10px] font-mono uppercase font-black tracking-widest text-emerald-400 px-2 pb-2">
          DOCUMENTATION INDEX
        </p>

        <div className="space-y-1 text-left">
          {categories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || BookOpen;
            const isOpen = !!openCategorySlugs[cat.slug];
            const isCatActive = activeCategorySlug === cat.slug;

            const categoryArticles = articles.filter(a => a.category_slug === cat.slug);

            return (
              <div key={cat.id} className="space-y-1">
                {/* Category Header Button */}
                <button
                  onClick={() => toggleCategory(cat.slug)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all ${
                    isCatActive ? 'bg-emerald-500/10 text-emerald-400 font-extrabold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Sub-Articles Accordion */}
                {isOpen && (
                  <div className="pl-6 space-y-1 border-l border-border/40 ml-4 py-1">
                    {categoryArticles.length > 0 ? (
                      categoryArticles.map((art) => {
                        const isArtActive = activeArticleSlug === art.slug;
                        return (
                          <Link
                            key={art.id}
                            href={`/docs/${cat.slug}/${art.slug}`}
                            className={`block py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                              isArtActive
                                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                          >
                            {art.title}
                          </Link>
                        );
                      })
                    ) : (
                      <Link
                        href={`/docs/${cat.slug}/overview`}
                        className="block py-1 px-2 text-[11px] text-muted-foreground/60 italic hover:text-foreground"
                      >
                        Overview & Guides →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
