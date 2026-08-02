'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function DocsToc({ contentMdx }: { contentMdx: string }) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Parse H2 and H3 headings from markdown content
    const lines = contentMdx.split('\n');
    const parsedHeadings: TocHeading[] = [];

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const text = line.replace('## ', '').trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        parsedHeadings.push({ id, text, level: 2 });
      } else if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        parsedHeadings.push({ id, text, level: 3 });
      }
    });

    setHeadings(parsedHeadings);
    if (parsedHeadings.length > 0) setActiveId(parsedHeadings[0].id);
  }, [contentMdx]);

  if (headings.length === 0) return null;

  return (
    <div className="w-56 shrink-0 hidden xl:block p-4 space-y-3 border-l border-border/40 text-left text-xs sticky top-20 h-fit">
      <div className="flex items-center gap-2 font-mono uppercase font-black text-emerald-400 text-[10px] tracking-wider">
        <List className="h-3.5 w-3.5" /> ON THIS PAGE
      </div>

      <nav className="space-y-1.5 font-mono">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={() => setActiveId(h.id)}
            className={`block truncate transition-colors ${
              h.level === 3 ? 'pl-3 text-[11px]' : 'font-bold'
            } ${
              activeId === h.id ? 'text-emerald-400 font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
