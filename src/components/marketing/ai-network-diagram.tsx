import React from 'react';
import { 
  KeyRound, 
  Cpu, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Database,
  Lock,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export function AiNetworkDiagramSection() {
  const models = [
    { name: 'Google Gemini 3.6', provider: 'Google AI', badge: 'Default Flagship', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400', icon: '♊' },
    { name: 'OpenAI GPT-4o & o3', provider: 'OpenAI', badge: 'BYOK Supported', color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/40 text-blue-400', icon: '🤖' },
    { name: 'Anthropic Claude 3.5', provider: 'Anthropic', badge: 'BYOK Supported', color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400', icon: '🧠' },
    { name: 'Groq (Llama 3.3 70B)', provider: 'Groq Inc', badge: 'Sub-100ms Ultra Fast', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400', icon: '⚡' },
    { name: 'DeepSeek R1 / V3', provider: 'DeepSeek AI', badge: 'Reasoning SOTA', color: 'from-sky-500/20 to-blue-500/10 border-sky-500/40 text-sky-400', icon: '🐳' },
  ];

  return (
    <section className="py-12 sm:py-14 bg-card/50 border-y border-border/60 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Narrative & Value Proposition (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <KeyRound className="h-4 w-4" /> 0% Platform Token Markup
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Bring Your Own Keys with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
                0% AI Token Markup.
              </span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              Why pay 3x markups on AI tokens? AIWCRM lets you plug in your own API keys for Google Gemini, OpenAI, Claude, Groq, or DeepSeek. Pay vendors directly with complete cost transparency.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Zero AI Token Markups</h4>
                  <p className="text-xs text-muted-foreground">Direct API billing with OpenAI, Google, Anthropic, or Groq.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">No Vendor Lock-In</h4>
                  <p className="text-xs text-muted-foreground">Switch between models anytime in 1 click from your dashboard.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">AES-256 GCM Key Security</h4>
                  <p className="text-xs text-muted-foreground">API keys are hardware-encrypted and never exposed in browser inspector.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/ai-platform"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md"
              >
                Explore Multi-AI Platform <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive AI Network Node Diagram (7 Cols) */}
          <div className="lg:col-span-7 relative p-6 sm:p-8 rounded-3xl bg-background border border-border/80 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-extrabold text-foreground">AIWCRM AI Smart Routing Network</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold">
                BYOK Active
              </span>
            </div>

            {/* Network Visualization Nodes */}
            <div className="space-y-4">
              {/* WhatsApp Source Node */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                    💬
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground text-sm">WhatsApp Inbound Cloud API</p>
                    <p className="text-xs text-muted-foreground">Incoming Customer Query Event</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">Step 1: Ingest</span>
              </div>

              {/* Connecting Connector Line */}
              <div className="flex justify-center">
                <div className="h-6 w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500 animate-pulse" />
              </div>

              {/* Central AI Router Node */}
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground text-sm">AIWCRM Multi-LLM Intent Router</p>
                    <p className="text-xs text-muted-foreground">Evaluates greeting cache, intent score & provider health</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">Step 2: Route</span>
              </div>

              {/* Connecting Connector Line */}
              <div className="flex justify-center">
                <div className="h-6 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 animate-pulse" />
              </div>

              {/* Destination LLM Model Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {models.map((m, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl bg-card border ${m.color} flex items-center justify-between text-xs`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.icon}</span>
                      <div>
                        <p className="font-bold text-foreground">{m.name}</p>
                        <p className="text-[10px] text-muted-foreground">{m.provider}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded bg-background border border-border">
                      {m.badge}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
