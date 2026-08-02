'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { searchDocs, DocSearchResult } from '@/lib/services/docs-cms.service';

export function DocsSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await searchDocs(query);
      setResults(res);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden space-y-0 text-left relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-border/60 flex items-center gap-3 bg-muted/30">
          <Search className="h-5 w-5 text-emerald-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI WCRM docs, API endpoints, error codes... (Cmd + K)"
            className="w-full bg-transparent text-sm font-medium focus:outline-none text-foreground placeholder:text-muted-foreground font-sans"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {loading && <p className="text-xs text-muted-foreground font-mono text-center py-6">Searching knowledge base...</p>}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground font-mono">No documentation matches for "{query}".</p>
            </div>
          )}

          {!loading && results.map((res) => (
            <Link
              key={res.id}
              href={`/docs/${res.category_slug}/${res.slug}`}
              onClick={onClose}
              className="block p-3.5 rounded-2xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                  {res.category_name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm font-bold text-foreground group-hover:text-emerald-300 font-sans">{res.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 pt-0.5">{res.description}</p>
            </Link>
          ))}

          {!query && (
            <div className="py-4 text-xs font-mono text-muted-foreground space-y-2">
              <p className="uppercase text-[10px] font-bold text-emerald-400">Popular Quick Searches:</p>
              <div className="flex flex-wrap gap-2">
                {['BYOK Config', 'REST API Bearer', 'Meta WABA Webhooks', 'Zoho Migration', 'SLA Telemetry'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-muted border border-border/60 hover:border-emerald-500/40 text-foreground transition-all text-xs font-sans"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
