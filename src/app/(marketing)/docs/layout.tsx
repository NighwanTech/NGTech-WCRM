'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Sparkles, Terminal } from 'lucide-react';
import { DocsSearchModal } from '@/components/docs/docs-search-modal';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Top Docs Navigation Sub-Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link href="/docs" className="flex items-center gap-2 font-black text-base tracking-tight text-foreground hover:opacity-90">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              <span>AI WCRM <span className="text-emerald-400 font-mono text-xs uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">Docs & Manual</span></span>
            </Link>
          </div>

          {/* Search Trigger Button (Cmd + K) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border/80 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-all shadow-sm max-w-sm w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-emerald-500" />
              <span>Search Documentation...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground border border-border/60">
              ⌘K
            </kbd>
          </button>

          <div className="hidden md:flex items-center gap-4 text-xs font-bold font-mono">
            <Link href="/docs/developer-platform/api-authentication" className="text-muted-foreground hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" /> REST API
            </Link>
            <Link href="/docs/release-notes/overview" className="text-muted-foreground hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Releases
            </Link>
          </div>

        </div>
      </header>

      {/* Main Page Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto">
        {children}
      </div>

      {/* Global Cmd+K Search Modal */}
      <DocsSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
