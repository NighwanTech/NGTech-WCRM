"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Phone, Mail, MapPin, Sparkles, TrendingUp, ShieldCheck, ArrowRight, MessageSquare, Calendar, FileText, Activity, Clock } from "lucide-react"

export interface Customer360WorkspaceProps {
  contactName?: string
  phone?: string
  email?: string
  city?: string
  campaignName?: string
}

/**
 * CTO Refinement #12 — Customer 360 Command Center
 * Unified single contact workspace rendering Lead Score, Intent, Expected Revenue, Journey, Timeline & AI Suggestions.
 */
export function Customer360Workspace({
  contactName = "Rahul Sharma",
  phone = "+91 98765 43210",
  email = "rahul.sharma@example.com",
  city = "Patna, Bihar",
  campaignName = "Patna Property Investment Campaign 2026"
}: Customer360WorkspaceProps) {
  const [activeSubTab, setActiveSubTab] = useState<'TIMELINE' | 'CONVERSATION' | 'QUOTES' | 'AI_MEMORY'>('TIMELINE')

  return (
    <div className="space-y-4 text-xs">
      {/* Top Banner: Contact Identity & AI Score Summary */}
      <Card className="border bg-card shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">
              {contactName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{contactName}</h2>
                <Badge className="bg-emerald-600 text-white font-mono text-[9px]">HIGH PURCHASE INTENT</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-[11px] mt-1">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary" /> {phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-primary" /> {email}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {city}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-l pl-4 font-mono">
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">AI Lead Score</span>
              <p className="text-xl font-extrabold text-primary">96 / 100</p>
            </div>
            <div className="text-right border-l pl-4">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Forecast Revenue</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">₹2,30,000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Left Journey & Details | Right Command Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Attribution & AI Memory */}
        <div className="space-y-4">
          <Card className="border bg-card shadow-xs">
            <CardHeader className="py-2.5 px-3.5 bg-muted/20 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Campaign Attribution & Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2.5 text-[11px]">
              <div>
                <span className="text-muted-foreground">Source Channel:</span>
                <p className="font-bold text-foreground">Meta Instant Form (Advantage+ Leadgen)</p>
              </div>
              <div>
                <span className="text-muted-foreground">Campaign:</span>
                <p className="font-bold text-foreground">{campaignName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Assigned Sales Rep:</span>
                <p className="font-bold text-foreground">Sunil Kumar (Patna Enterprise Desk)</p>
              </div>
              <div className="pt-2 border-t">
                <span className="text-muted-foreground font-bold">Customer Journey Stage:</span>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Qualified</Badge>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Negotiation</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Sales Copilot Suggestion Card */}
          <Card className="border bg-primary/5 border-primary/30 shadow-xs">
            <CardHeader className="py-2.5 px-3.5 border-b bg-primary/10">
              <CardTitle className="text-xs font-bold text-primary flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> AI Sales Copilot Next Best Action
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 space-y-2 text-[11px]">
              <p className="font-bold text-foreground">Generate PDF Quotation with 10% Immediate Booking Discount</p>
              <p className="text-muted-foreground">High win probability (89%). Customer verified requirement in Patna property consultation.</p>
              <Button size="sm" className="w-full h-7 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                Execute Suggested Action
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Command Workspace Tabs (Timeline, Conversation, Quotes) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border">
            <button
              onClick={() => setActiveSubTab('TIMELINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'TIMELINE' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Universal Timeline
            </button>
            <button
              onClick={() => setActiveSubTab('CONVERSATION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'CONVERSATION' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp AI Chat
            </button>
            <button
              onClick={() => setActiveSubTab('QUOTES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'QUOTES' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Quotations & Deals
            </button>
          </div>

          <Card className="border bg-card shadow-xs p-4 min-h-[300px]">
            {activeSubTab === 'TIMELINE' && (
              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex items-start gap-2.5 pb-2 border-b">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground">Lead Acquired via Meta Instant Form</span>
                    <p className="text-[10px] text-muted-foreground">Today at 09:15 AM • Form Answers: Verified Phone + Patna Location</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pb-2 border-b">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground">AI Score Calculated: 96/100 (HIGH INTENT)</span>
                    <p className="text-[10px] text-muted-foreground">Today at 09:16 AM • Assigned to Sunil Kumar via Territory Routing</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground">WhatsApp AI Sales Assistant Greeting Delivered</span>
                    <p className="text-[10px] text-muted-foreground">Today at 09:17 AM • Customer replied requesting pricing brochure</p>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'CONVERSATION' && (
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-muted/30 border max-w-md">
                  <span className="font-bold text-primary">WhatsApp AI Sales Assistant:</span>
                  <p className="text-foreground mt-0.5">Namaste Rahul 👋 Thank you for inquiring via our Patna Property campaign. I am your AI Sales Assistant. How may I assist your requirement today?</p>
                </div>
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 max-w-md ml-auto text-right">
                  <span className="font-bold text-foreground">Rahul (Customer):</span>
                  <p className="text-foreground mt-0.5">Please send verified pricing and plot availability in Patna NCR.</p>
                </div>
              </div>
            )}

            {activeSubTab === 'QUOTES' && (
              <div className="space-y-2 text-[11px] font-mono">
                <div className="p-3 rounded-xl border bg-muted/20 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">Quotation #QT-2026-991</p>
                    <p className="text-[10px] text-muted-foreground">Patna Residential Plot Consultation • ₹2,30,000</p>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-[9px]">DRAFT GENERATED</Badge>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
