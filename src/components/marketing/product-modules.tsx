'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Building2, 
  Users, 
  Kanban, 
  GitBranch, 
  Send, 
  Bot, 
  Sparkles, 
  Mic, 
  FileText, 
  BarChart3, 
  Code2,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export function ProductModulesSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const modules = [
    { 
      id: 'inbox', 
      title: 'WhatsApp Shared Team Inbox', 
      tag: 'Multi-Agent Support',
      desc: 'Centralize all customer conversations in one collaborative workspace with smart department routing, conversation assignment, SLA tracking, and internal team notes.',
      icon: MessageSquare,
      highlights: ['Multi-agent chat distribution', 'Internal private notes', 'Automated SLA response timers'],
      demoText: 'Agent Ramesh assigned to Inquiry #1084 (BPTPIA Admissions)'
    },
    { 
      id: 'crm', 
      title: 'Enterprise CRM Engine', 
      tag: 'Customer 360',
      desc: 'Complete customer profiles, interaction timeline, custom lead attributes, lifecycle tags, and purchase history synced automatically from WhatsApp chats.',
      icon: Building2,
      highlights: ['Full interaction history', 'Custom lead fields & tags', 'Automated contact deduplication'],
      demoText: 'Contact Profile #4092 updated with 12 interaction events'
    },
    { 
      id: 'scoring', 
      title: 'Lead Management & Intent Scoring', 
      tag: 'AI Lead Qualification',
      desc: 'Real-time AI sentiment analysis automatically scores incoming customer intent (HOT 🔥, WARM, COLD) and routes high-value prospects to senior reps.',
      icon: Users,
      highlights: ['AI sentiment & intent scoring', 'Instant lead assignment', 'Hot lead alert notifications'],
      demoText: 'Intent Score: 94% (HOT 🔥) — Campus Visit Requested'
    },
    { 
      id: 'kanban', 
      title: 'Visual Deals & Pipelines', 
      tag: 'Sales Automation',
      desc: 'Drag-and-drop Kanban sales deal pipelines. Track deal values, probability, upcoming follow-up tasks, and revenue forecasts in real time.',
      icon: Kanban,
      highlights: ['Multi-stage Kanban boards', 'Revenue forecasting', 'Deal task reminders'],
      demoText: 'Deal Moved to Proposal Sent (Value: ₹1,30,000)'
    },
    { 
      id: 'automation', 
      title: 'No-Code Automation Builder', 
      tag: 'Workflow Engine',
      desc: 'Visual drag-and-drop workflow builder to trigger automated replies, lead assignments, tag updates, and deal stage transitions based on customer events.',
      icon: GitBranch,
      highlights: ['Visual node graph builder', 'Conditional logic branches', 'Delay & schedule triggers'],
      demoText: 'Workflow Triggered: Keyword "Admission Fee" matched'
    },
    { 
      id: 'broadcast', 
      title: 'Meta Broadcast Campaigns', 
      tag: 'Official API Marketing',
      desc: 'Schedule Meta-approved broadcast messages to thousands of contacts with custom template variables, audience segmentation, and read reports.',
      icon: Send,
      highlights: ['Meta pre-approved templates', 'Audience segmentation', 'Real-time read analytics'],
      demoText: 'Broadcast Delivered to 4,500 Contacts (98.2% Open Rate)'
    },
    { 
      id: 'voice', 
      title: 'Voice AI Integration (Retell)', 
      tag: 'Voice + Chat AI',
      desc: 'Integrate intelligent AI voice agents for automated inbound phone call answering and outbound follow-up calls synced directly with your WhatsApp pipeline.',
      icon: Mic,
      highlights: ['Retell AI voice call sync', 'Call transcript logging', 'Automated phone follow-ups'],
      demoText: 'Inbound Call Answering Active — Call Transcript Saved'
    },
    { 
      id: 'api', 
      title: 'Developer REST APIs & Webhooks', 
      tag: 'Developer Platform',
      desc: 'Comprehensive HTTP REST APIs, real-time webhook events, and SDKs to seamlessly integrate WhatsApp into your ERP, CRM, or custom tech stack.',
      icon: Code2,
      highlights: ['Real-time webhook triggers', 'Full REST API coverage', 'AES-256 encrypted security'],
      demoText: 'Webhook Event Fired: message.received (200 OK)'
    },
  ];

  const currentMod = modules[activeIdx];
  const CurrentIcon = currentMod.icon;

  return (
    <section className="py-24 bg-card/40 border-y border-border/50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Linear-Style Product Suite
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            12 Enterprise Product Modules
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Click through our core modules to explore capabilities, workflows, and live telemetry.
          </p>
        </div>

        {/* Interactive Linear-Style Feature Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* LEFT: Interactive Vertical Selector List (5 Cols) */}
          <div className="lg:col-span-5 space-y-2 pr-2">
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              const isActive = activeIdx === idx;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border ${
                    isActive
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground shadow-md scale-[1.01]'
                      : 'bg-card/60 border-border/60 text-muted-foreground hover:bg-card hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${isActive ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-muted border-border'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold">{mod.title}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                    {mod.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Live Visual Feature Showcase Window (7 Cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-background border border-border/80 shadow-2xl space-y-6 flex flex-col justify-between">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <CurrentIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">{currentMod.title}</h3>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">{currentMod.tag}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentMod.desc}
              </p>

              {/* Key Capabilities Checklist */}
              <div className="space-y-2.5 pt-2">
                {currentMod.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Live Status Telemetry Bar */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                <p className="text-[10px] font-mono uppercase text-muted-foreground font-extrabold">Module Status & Telemetry</p>
                <p className="text-xs font-mono text-emerald-400 font-bold">● {currentMod.demoText}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border/60 flex items-center justify-between">
              <Link
                href="/features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md"
              >
                <span>Explore All Features</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
