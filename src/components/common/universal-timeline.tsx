"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Sparkles, FileText, Check, DollarSign, MessageSquare, ArrowRight } from "lucide-react"

export interface TimelineEvent {
  id: string
  title: string
  category: 'AI_ACTION' | 'CUSTOMER_ACTIVITY' | 'FINANCE_EVENT' | 'MARKETING_EVENT' | 'SALES_EVENT' | 'WORKFLOW_EVENT'
  timestamp: string
  actor: string
}

/**
 * PRD v16.1 Shared Platform Component — Universal Timeline
 * Reusable across Campaigns, Leads, Contacts, Deals, Quotations, Invoices, Customers & Workflows.
 */
export function UniversalTimeline({ title = "Universal Activity Timeline", events: customEvents }: { title?: string; events?: TimelineEvent[] }) {
  const defaultEvents: TimelineEvent[] = [
    { id: '1', title: 'AI generated Commercial Proposal & SOW for Patna Commercial Complex', category: 'AI_ACTION', timestamp: '10 mins ago', actor: 'Patna Sales Copilot AI' },
    { id: '2', title: 'Rahul Sharma viewed Quotation #QT-2026-991 via WhatsApp link', category: 'CUSTOMER_ACTIVITY', timestamp: '25 mins ago', actor: 'Rahul Sharma' },
    { id: '3', title: 'Payment of ₹18,40,000 received for Invoice #INV-2026-101', category: 'FINANCE_EVENT', timestamp: '1 hour ago', actor: 'Razorpay Gateway' },
    { id: '4', title: 'Meta Ad Campaign budget auto-optimized +15% based on 4.8x ROAS', category: 'MARKETING_EVENT', timestamp: '3 hours ago', actor: 'Marketing Orchestrator' },
    { id: '5', title: 'WhatsApp Automated Greeting sent to new inbound lead', category: 'SALES_EVENT', timestamp: 'Today at 09:00 AM', actor: 'Universal Lead Platform' }
  ]

  const list = customEvents || defaultEvents

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-[10px]">
              Platform cross-object event log for AI decisions, customer interactions & payments
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          REALTIME STREAM
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        {list.map(ev => (
          <div key={ev.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-xs">{ev.title}</span>
                <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary shrink-0">
                  {ev.category}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">Actor: {ev.actor} • Timestamp: {ev.timestamp}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
