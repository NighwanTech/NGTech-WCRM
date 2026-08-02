import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Zap, 
  CheckCircle2, 
  Database, 
  BarChart3, 
  KeyRound, 
  ShieldCheck,
  Bot
} from 'lucide-react';

export function EnterpriseAiEngineSection() {
  const aiModels = [
    { name: 'Google Gemini 3.6', tag: 'Current Flagship', speed: 'Ultra Fast (110ms)', desc: 'Optimized for complex agentic & multimodal workflows', icon: '♊' },
    { name: 'OpenAI GPT-4o & o3-Mini', tag: 'Industry Standard', speed: 'High Intelligence', desc: 'Superior reasoning and structured data extraction', icon: '🤖' },
    { name: 'Anthropic Claude 3.5', tag: 'Top Intelligence', speed: 'Nuanced Reasoning', desc: 'Best for complex support policies and long context', icon: '🧠' },
    { name: 'Groq (Llama 3.3 70B)', tag: 'Ultra-Fast Backup', speed: 'Instant (80ms)', desc: 'Sub-second throughput for massive message volume', icon: '⚡' },
    { name: 'DeepSeek R1 / V3', tag: 'Reasoning SOTA', speed: 'Cost Efficient', desc: 'Advanced problem solving and analytical responses', icon: '🐳' },
    { name: 'Ollama & Local LLMs', tag: 'Self-Hosted', speed: 'Private Endpoint', desc: 'Zero data leakage for confidential enterprise setups', icon: '🦙' },
    { name: 'Custom Enterprise APIs', tag: 'Custom Gateway', speed: 'Tailored SLA', desc: 'Connect to your internal private LLM infrastructure', icon: '🔌' },
    { name: 'Mistral & Cohere AI', tag: 'Open Weights SOTA', speed: 'Ultra Fast (100ms)', desc: 'High-performance multi-lingual reasoning & document RAG', icon: '🌀' },
  ];

  const workflowSteps = [
    { step: '1', title: 'WhatsApp Message', desc: 'Customer sends inquiry on WhatsApp Business API', icon: MessageSquare, color: 'text-green-400 bg-green-500/10 border-green-500/30' },
    { step: '2', title: 'AI Smart Router', desc: 'Evaluates intent, business hours & greeting cache', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { step: '3', title: 'Multi AI Providers', desc: 'Selects active provider (Gemini / Groq / OpenAI)', icon: Cpu, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { step: '4', title: 'Best Available Response', desc: 'Generates structured, accurate brand answer', icon: Bot, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { step: '5', title: 'CRM & Pipeline Sync', desc: 'Updates deal stage, tags lead & assigns agent', icon: Database, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { step: '6', title: 'Real-Time Analytics', desc: 'Logs token usage, cost & SLA response time', icon: BarChart3, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
  ];

  return (
    <section className="py-24 bg-card/40 border-y border-border/50 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="h-3.5 w-3.5" /> Multi-LLM Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Enterprise AI Engine
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Deploy cutting-edge AI models from Google, OpenAI, Anthropic, and Groq with BYOK flexibility and zero platform vendor lock-in.
          </p>
        </div>

        {/* Supported AI Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {aiModels.map((model, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-card border border-border/60 shadow-md space-y-3 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{model.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    {model.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                  {model.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {model.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Speed: {model.speed}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Diagram Banner */}
        <div className="p-8 rounded-3xl bg-background border border-border/80 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-foreground">
              Intelligent Message Processing Workflow
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              How WCRM routes incoming WhatsApp messages through multi-provider AI, CRM automation, and real-time telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative group">
                  <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3 text-center h-full flex flex-col items-center justify-between hover:border-emerald-500/40 transition-all">
                    <div className={`p-3 rounded-2xl border ${step.color} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        Step {step.step}
                      </span>
                      <h4 className="text-xs font-bold text-foreground">{step.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-tight">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
