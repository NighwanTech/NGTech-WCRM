"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, RefreshCw, CheckCircle2 } from "lucide-react"

/**
 * PRD v15.0 Module 5 — Enterprise Job Scheduler
 * Cron & background job manager for Forecast Refresh, Campaign Sync, Invoice Reminders & DLQ retries.
 */
export function JobScheduler() {
  const jobs = [
    { name: "Meta Graph API Realtime Lead Sync", cron: "*/5 * * * *", status: "SCHEDULED", lastRun: "2 mins ago" },
    { name: "Daily Revenue & Pipeline Forecast Refresh", cron: "0 0 * * *", status: "SCHEDULED", lastRun: "Today at 00:00" },
    { name: "Overdue Invoice & Payment Collection Reminder", cron: "0 9 * * 1", status: "SCHEDULED", lastRun: "Yesterday" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Cron & Job Scheduler
            </CardTitle>
            <CardDescription className="text-[10px]">
              Background workers, DLQ retry queue & automated forecast refresh schedules
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          WORKERS HEALTHY
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {jobs.map(j => (
          <div key={j.name} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{j.name}</span>
              <p className="text-[10px] text-muted-foreground">Cron: {j.cron} • Last Execution: {j.lastRun}</p>
            </div>
            <Badge className="bg-emerald-600 text-white text-[9px]">
              {j.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
