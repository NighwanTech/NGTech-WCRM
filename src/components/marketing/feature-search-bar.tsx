'use client';

import React from 'react';
import { Search, Filter, Sparkles, Building2 } from 'lucide-react';

interface FeatureSearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (ind: string) => void;
  categories: string[];
  industries: string[];
}

export function FeatureSearchBar({
  query,
  setQuery,
  selectedCategory,
  setSelectedCategory,
  selectedIndustry,
  setSelectedIndustry,
  categories,
  industries
}: FeatureSearchBarProps) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      
      {/* Search Input Box */}
      <div className="relative w-full shadow-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 40+ enterprise features by keyword (e.g. Shared Inbox, BYOK, Voice AI, Kanban, Webhooks)..."
          className="w-full rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase font-bold">
          <Filter className="h-3.5 w-3.5 text-emerald-400" /> Filter by Category:
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Industry Pills Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase font-bold">
          <Building2 className="h-3.5 w-3.5 text-blue-400" /> Filter by Industry Use Case:
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...industries].map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all ${
                selectedIndustry === ind
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-card/50 border border-border/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
