'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  MessageSquare, 
  PhoneCall, 
  Target, 
  Bot, 
  Kanban, 
  Workflow, 
  ShoppingBag, 
  BarChart3, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Lock,
  Cpu,
  Layers
} from 'lucide-react';

export function OneAiBrainArchitectureSection() {
  const [activeNode, setActiveNode] = useState<string>('brain');

  const nodes = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Cloud API',
      subtitle: 'Official 0-Markup Channel',
      icon: MessageSquare,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      telemetry: '0-Latency Webhooks · Sub-100ms Greeting Cache · 100% Deliverability',
      description: 'Send broadcasts, capture inbound lead messages, deliver PDF brochures, and automate customer support directly on WhatsApp with zero Meta price markups.'
    },
    {
      id: 'voice-ai',
      title: 'Multi-Provider Voice AI',
      subtitle: 'Retell + ElevenLabs',
      icon: PhoneCall,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      telemetry: 'Native Hindi/Hinglish · 10-Field CRM Auto-Extraction · Sub-800ms Latency',
      description: 'Deploy human-grade voice AI agents for outbound lead qualification calls, consultation scheduling, and automated post-call telemetry sync into CRM fields.'
    },
    {
      id: 'meta-ads',
      title: 'Autonomous Meta Ads OS',
      subtitle: 'Instant Lead Form Sync',
      icon: Target,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/30',
      telemetry: '2-Second WhatsApp Trigger · AI Ad Creative Generator · ROAS Attribution',
      description: 'Connect Facebook & Instagram Lead Ads directly to WhatsApp. Automatically trigger personalized messages <2 seconds after form submission and track true ROAS.'
    },
    {
      id: 'web-copilot',
      title: 'Website AI Copilot',
      subtitle: 'Multi-Turn Memory Chat',
      icon: Bot,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
      telemetry: 'Omnichannel Context Sync · Knowledge Base RAG · Lead Intent Scoring',
      description: 'Embed intelligent chat widgets on your website that share context with WhatsApp, answer FAQs from your Knowledge Base, and score buyer intent in real time.'
    },
    {
      id: 'kanban',
      title: 'Kanban Sales Pipeline',
      subtitle: 'Customer Intelligence',
      icon: Kanban,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      telemetry: 'Automated Stage Triggers · Lead Assignment · Revenue Forecast',
      description: 'Move deal cards automatically as customers respond, complete voice calls, or make payments. Never let a high-intent prospect drop out of your funnel.'
    },
    {
      id: 'workflow',
      title: 'Workflow Automation',
      subtitle: 'Visual Flow Builder',
      icon: Workflow,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
      telemetry: 'Sub-50ms Trigger Speed · Dynamic Webhooks · Conditional Logic',
      description: 'Build complex multi-step automations without code. Trigger WhatsApp alerts, voice callbacks, tag updates, and external API requests based on buyer actions.'
    },
    {
      id: 'ecommerce',
      title: 'ERP & E-Commerce Sync',
      subtitle: 'Shopify, Tally & Razorpay',
      icon: ShoppingBag,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/30',
      telemetry: 'Automated Cart Recovery · COD Verification · Dynamic UPI Links',
      description: 'Sync Shopify checkout abandonments, generate 1-click Razorpay payment links in chat, and query stock availability from Tally/SAP via REST webhooks.'
    },
    {
      id: 'analytics',
      title: 'Executive Analytics',
      subtitle: 'Decision Center',
      icon: BarChart3,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
      telemetry: 'Real-time Campaign ROI · Agent Response SLA · AI Token Telemetry',
      description: 'Monitor overall business performance with live dashboards showing campaign ROI, agent response SLAs, AI token savings, and revenue forecasting.'
    }
  ];

  return (
    <section className="py-24 bg-card/30 border-t border-border/50 relative overflow-hidden">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-emerald-500/5 blur-[160px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-emerald-500" /> Unified Ecosystem Architecture
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
            One Intelligent AI Brain.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
              Multiple Connected Channels.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Stop stitching together isolated tools. AIWCRM connects all your customer touchpoints to a single central AI engine with unified memory, BYOK model routing, and CRM governance.
          </p>
        </div>

        {/* Visual Interactive Architecture Node Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left / Top: Surrounding Connected Nodes Grid (8 Cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nodes.map((node) => {
              const IconComp = node.icon;
              const isSelected = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-card border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20 scale-[1.02]' 
                      : 'bg-card/60 border-border/60 hover:bg-card hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl border ${node.color} shrink-0 transition-transform group-hover:scale-110`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider animate-pulse">
                        ACTIVE CHANNEL
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-1">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-emerald-500 transition-colors">
                      {node.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground/80">
                      {node.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                    {node.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right / Center: Core AI Brain Hub Card (4 Cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            
            {/* Top Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <BrainCircuit className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} /> Central AI Brain Hub
              </div>

              <h3 className="text-2xl font-black text-white leading-snug">
                {activeNode === 'brain' ? 'Central AI Engine' : nodes.find(n => n.id === activeNode)?.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeNode === 'brain' 
                  ? 'Combines Gemini 3.6, OpenAI GPT-4o, Groq, Retell, and ElevenLabs into one zero-markup BYOK architecture.'
                  : nodes.find(n => n.id === activeNode)?.description
                }
              </p>

              {/* Dynamic Live Telemetry Box */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" /> Live Channel Telemetry
                </div>
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  {nodes.find(n => n.id === activeNode)?.telemetry || '0% Token Markup · Sub-100ms Greeting Cache · AES-256 Encrypted'}
                </p>
              </div>
            </div>

            {/* Key Brain Attributes */}
            <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center justify-between">
                <span>Auto-Failover Latency:</span>
                <span className="text-emerald-400 font-mono font-bold">&lt;1000ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Model Providers:</span>
                <span className="text-emerald-400 font-bold">OpenAI, Gemini, Groq, Claude</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Token Markup Fee:</span>
                <span className="text-emerald-400 font-mono font-bold">0% (BYOK)</span>
              </div>
            </div>

            <button
              onClick={() => setActiveNode('brain')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Reset Ecosystem View <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
