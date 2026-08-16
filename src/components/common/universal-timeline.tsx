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
export function UniversalTimeline({ title = "Universal Activity Timeline", events = [] }: { title?: string; events?: TimelineEvent[] }) {
  const list = events

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
        {list.length > 0 ? (
          list.map(ev => (
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
          ))
        ) : (
          <div className="py-8 px-4 text-center border rounded-xl bg-muted/10 space-y-2">
            <Clock className="w-6 h-6 text-muted-foreground mx-auto opacity-50" />
            <p className="font-bold text-foreground text-xs">No Recent Activity Logged</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Platform cross-object telemetry will stream live activity here as your team launches campaigns, receives leads, and closes sales.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
