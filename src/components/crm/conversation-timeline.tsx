"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ShieldCheck, Sparkles, MessageSquare, User, FileText, CheckCircle2 } from "lucide-react"

export interface TimelineEvent {
  id: string
  eventType: string
  title: string
  timestamp: string
  description?: string
}

/**
 * ConversationTimeline Component
 * Displays Universal Customer Timeline from Lead Created ➔ AI Qualified ➔ WhatsApp ➔ Sales ➔ Closed Won.
 */
export function ConversationTimeline() {
  const events: TimelineEvent[] = [
    {
      id: "ev_1",
      eventType: "LEAD_CREATED",
      title: "Lead Created via Meta Instant Form",
      timestamp: "Today at 09:15 AM",
      description: "Acquired via Advantage+ Patna Property Campaign."
    },
    {
      id: "ev_2",
      eventType: "AI_QUALIFIED",
      title: "AI Qualified: Lead Score 96 / 100",
      timestamp: "Today at 09:16 AM",
      description: "High purchase intent detected based on verified Patna location and budget response."
    },
    {
      id: "ev_3",
      eventType: "WHATSAPP_SENT",
      title: "WhatsApp AI Sales Assistant Delivered Greeting",
      timestamp: "Today at 09:17 AM",
      description: "Customer replied requesting verified pricing brochure."
    },
    {
      id: "ev_4",
      eventType: "QUOTATION_SENT",
      title: "Quotation #QT-2026-991 Generated (₹2,30,000)",
      timestamp: "Today at 10:30 AM",
      description: "PDF quotation sent via WhatsApp with 10% instant booking discount."
    }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-3.5 bg-muted/20 border-b">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" /> Universal Customer Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3.5 space-y-3 font-mono text-[11px]">
        {events.map((ev, idx) => (
          <div key={ev.id} className={`flex items-start gap-2.5 ${idx < events.length - 1 ? 'pb-3 border-b' : ''}`}>
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-foreground">{ev.title}</span>
              <p className="text-[10px] text-muted-foreground">{ev.timestamp}</p>
              {ev.description && <p className="text-muted-foreground text-[10px] mt-0.5">{ev.description}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
