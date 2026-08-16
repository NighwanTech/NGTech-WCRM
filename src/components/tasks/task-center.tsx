"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Clock, AlertTriangle, Phone, MessageSquare, Calendar } from "lucide-react"

/**
 * PRD v14.0 Module 6 — Task Center
 * AI Task Generation for Calls, Meetings, Follow-ups, Reminders, Approvals & Escalations.
 */
export function TaskCenter({ tasks = [] }: { tasks?: any[] }) {
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
          {tasks.length} TASKS DUE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {tasks.length > 0 ? (
          tasks.map(t => (
            <div key={t.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <span className="font-bold text-foreground text-xs">{t.title}</span>
                <p className="text-[10px] text-muted-foreground">Due: {t.dueDate} • Type: {t.type}</p>
              </div>
              <Badge className="bg-red-600 text-white font-mono text-[9px] shrink-0">
                {t.priority}
              </Badge>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <CheckSquare className="w-5 h-5 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">All Tasks Completed</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Follow-up calls, SLA reminders, and quotation review tasks will generate automatically based on pipeline activity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
