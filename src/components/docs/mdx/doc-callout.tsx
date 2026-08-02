import React from 'react';
import { Info, Sparkles, AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

export interface DocCalloutProps {
  type?: 'info' | 'tip' | 'warning' | 'success' | 'danger';
  children: React.ReactNode;
}

export function DocCallout({ type = 'info', children }: DocCalloutProps) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300 icon-blue',
    tip: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 icon-emerald',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300 icon-amber',
    success: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 icon-emerald',
    danger: 'bg-rose-500/10 border-rose-500/30 text-rose-300 icon-rose'
  };

  const icons = {
    info: <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />,
    tip: <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />,
    danger: <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
  };

  const formatChildren = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      const parts = node.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    }
    return node;
  };

  return (
    <div className={`p-4 rounded-2xl border my-6 flex items-start gap-3 text-xs sm:text-sm leading-relaxed backdrop-blur-sm ${styles[type]}`}>
      {icons[type]}
      <div className="space-y-1 text-left font-sans">{formatChildren(children)}</div>
    </div>
  );
}
