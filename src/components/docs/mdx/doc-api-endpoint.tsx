import React from 'react';

export interface DocApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  description?: string;
}

export function DocApiEndpoint({ method, endpoint, description }: DocApiEndpointProps) {
  const methodStyles = {
    GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    POST: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DELETE: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  return (
    <div className="my-6 p-4 rounded-2xl border border-border/80 bg-card shadow-md space-y-2 text-left">
      <div className="flex items-center gap-3 font-mono text-xs sm:text-sm">
        <span className={`px-2.5 py-1 rounded-lg font-black border ${methodStyles[method]}`}>
          {method}
        </span>
        <span className="font-bold text-foreground tracking-tight select-all">{endpoint}</span>
      </div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
    </div>
  );
}

export interface ParameterItem {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export function DocParamTable({ parameters }: { parameters: ParameterItem[] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-md">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40">
            <th className="p-3.5 font-black text-foreground uppercase">Parameter</th>
            <th className="p-3.5 font-black text-foreground uppercase">Type</th>
            <th className="p-3.5 font-black text-foreground uppercase">Required</th>
            <th className="p-3.5 font-black text-foreground uppercase">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {parameters.map((p, i) => (
            <tr key={i} className="hover:bg-muted/20">
              <td className="p-3.5 font-bold text-emerald-400 font-mono">{p.name}</td>
              <td className="p-3.5 text-muted-foreground">{p.type}</td>
              <td className="p-3.5">
                {p.required ? (
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold text-[10px]">Required</span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">Optional</span>
                )}
              </td>
              <td className="p-3.5 text-foreground font-sans leading-relaxed">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
