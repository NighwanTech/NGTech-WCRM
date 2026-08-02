'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Kanban, 
  Mic, 
  Send, 
  CheckCircle2, 
  UserCheck, 
  Bot, 
  Zap, 
  FileText, 
  PhoneCall, 
  BarChart3,
  Search,
  Filter
} from 'lucide-react';

export function InteractivePipelinePreview() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'pipeline' | 'voice' | 'broadcast'>('inbox');

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 text-center">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Kanban className="h-4 w-4" /> Interactive Product Demonstration
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            See the Platform in Action
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Switch between core enterprise modules to explore the live user interface.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { id: 'inbox', label: 'Shared Team Inbox', icon: MessageSquare },
            { id: 'pipeline', label: 'Kanban Deals Pipeline', icon: Kanban },
            { id: 'voice', label: 'Voice AI Integration', icon: Mic },
            { id: 'broadcast', label: 'Broadcast Campaigns', icon: Send },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-extrabold transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105' 
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Preview Window */}
        <div className="rounded-3xl border border-border/80 bg-card shadow-2xl p-4 sm:p-6 text-left max-w-6xl mx-auto">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono font-semibold text-muted-foreground pl-3 border-l border-border">
                wacrm.in/dashboard/{activeTab}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              ● Live Workspace
            </span>
          </div>

          {/* TAB 1: Shared Team Inbox */}
          {activeTab === 'inbox' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[420px]">
              {/* Left Contact List (4 Cols) */}
              <div className="md:col-span-4 border-r border-border/60 pr-4 space-y-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    readOnly
                    value="Search conversations..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted/60 border border-border text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground">Rajesh Kumar</span>
                      <span className="text-[10px] text-emerald-400 font-mono">10:42 AM</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">B.Tech Admission enquiry for 2026...</p>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">HOT LEAD 🔥</span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-1 opacity-80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-foreground">Anita Singh</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Yesterday</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">Sent quotation for polytechnic course...</p>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-bold">Proposal Sent</span>
                  </div>
                </div>
              </div>

              {/* Right Chat Thread (8 Cols) */}
              <div className="md:col-span-8 space-y-4 pl-2 flex flex-col justify-between">
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/60 border border-border flex items-start justify-between">
                    <div>
                      <p className="font-bold text-foreground">Rajesh Kumar (+91 9835XXXXXX)</p>
                      <p className="text-[10px] text-muted-foreground">Assigned to: Senior Counselor Ramesh · Dept: Admissions</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                      Gemini 3.6 Active
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <p className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                      <Bot className="h-4 w-4" /> AI Auto-Reply (0 Tokens Cached)
                    </p>
                    <p className="text-foreground">
                      &quot;Hello Rajesh! Welcome to BPTPIA. B.Tech CSE tuition fee is ₹65,000/yr. Sent prospectus PDF 📄&quot;
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Type message or add internal note...</span>
                  <button className="px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-xs">
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Kanban Deals Pipeline */}
          {activeTab === 'pipeline' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[420px]">
              {[
                { title: 'New Leads (12)', bg: 'border-slate-500/30', cardName: 'Suresh Verma', value: '₹45,000', tag: 'Polytechnic' },
                { title: 'Contacted / Qualified (8)', bg: 'border-blue-500/30', cardName: 'Rajesh Kumar', value: '₹1,30,000', tag: 'B.Tech CSE' },
                { title: 'Campus Visit Scheduled (5)', bg: 'border-purple-500/30', cardName: 'Pooja Kumari', value: '₹65,000', tag: 'Visit 2 PM' },
                { title: 'Won / Enrolled (18)', bg: 'border-emerald-500/30', cardName: 'Amit Sharma', value: '₹1,30,000', tag: 'Enrolled 🔥' },
              ].map((col, idx) => (
                <div key={idx} className={`p-3 rounded-2xl bg-muted/30 border ${col.bg} space-y-3`}>
                  <p className="font-extrabold text-xs text-foreground border-b border-border pb-2">{col.title}</p>
                  <div className="p-3 rounded-xl bg-card border border-border space-y-2 shadow-sm">
                    <p className="font-bold text-xs text-foreground">{col.cardName}</p>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-mono text-emerald-400 font-bold">{col.value}</span>
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">{col.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Voice AI Integration */}
          {activeTab === 'voice' && (
            <div className="space-y-4 min-h-[420px]">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="font-bold text-foreground text-sm">Retell AI Inbound / Outbound Call Agent</p>
                    <p className="text-xs text-muted-foreground">Automated phone call transcript & sentiment synced to WhatsApp CRM</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                  Voice Agent Active
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                <p className="font-bold text-foreground">Latest Call Transcript (+91 9934XXXXXX)</p>
                <p className="text-muted-foreground italic">&quot;AI Voice Agent answered inquiry about polytechnic diploma fees, sent prospectus on WhatsApp, and created a new lead in CRM stage Qualified.&quot;</p>
              </div>
            </div>
          )}

          {/* TAB 4: Broadcast Campaigns */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4 min-h-[420px]">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground text-sm">Meta Approved Broadcast Campaign: Admission_Alert_2026</p>
                  <p className="text-xs text-muted-foreground">Target Segment: 4,500 High-Intent Admissions Leads</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  Delivered 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <p className="text-2xl font-black text-foreground">4,500</p>
                  <p className="text-xs text-muted-foreground">Sent Messages</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <p className="text-2xl font-black text-emerald-400">98.2%</p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <p className="text-2xl font-black text-blue-400">34.6%</p>
                  <p className="text-xs text-muted-foreground">Click-Through Rate</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
