"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, AlertTriangle, Phone, MessageSquare, Calendar } from "lucide-react"

/**
 * PRD v14.0 Module 6 — Task Center
 * AI Task Generation for Calls, Meetings, Follow-ups, Reminders, Approvals & Escalations.
 */
export function TaskCenter() {
  const tasks = [
    { title: "Call Rahul Sharma regarding 10% Discount Quotation", priority: "HIGH", type: "CALL", dueDate: "Today at 02:00 PM" },
    { title: "Deliver SOW Agreement for Patna Complex Deal", priority: "HIGH", type: "DOCUMENT", dueDate: "Today at 05:00 PM" },
    { title: "WhatsApp follow-up with Priya Singh for appointment", priority: "MEDIUM", type: "WHATSAPP", dueDate: "Tomorrow" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Task & Escalation Center
            </CardTitle>
            <CardDescription className="text-[10px]">
              AI auto-generated sales calls, meeting follow-ups & SLA escalation triggers
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {tasks.length} Tasks Due
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {tasks.map(t => (
          <div key={t.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{t.title}</span>
              <p className="text-[10px] text-muted-foreground">Due: {t.dueDate} • Type: {t.type}</p>
            </div>
            <Badge className="bg-red-600 text-white font-mono text-[9px] shrink-0">
              {t.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
