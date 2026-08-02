'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export interface CodeItem {
  label: string;
  language: string;
  code: string;
}

export interface DocCodeTabsProps {
  items: CodeItem[];
}

export function DocCodeTabs({ items }: DocCodeTabsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeItem = items[activeIdx] || items[0];

  const handleCopy = () => {
    if (activeItem?.code) {
      navigator.clipboard.writeText(activeItem.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-border/80 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-border/60">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeIdx === idx
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-muted-foreground hover:text-foreground transition-all shrink-0"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Block */}
      <div className="p-4 overflow-x-auto text-xs font-mono text-emerald-200/90 leading-relaxed bg-slate-950">
        <pre>
          <code>{activeItem?.code}</code>
        </pre>
      </div>
    </div>
  );
}
