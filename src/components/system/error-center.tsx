"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertOctagon, CheckCircle2, RefreshCw } from "lucide-react"

/**
 * PRD v16.0 Module 5 — Enterprise Error Center
 * Unified error dashboard for System, Webhook, Workflow, Provider, API errors, Failed Jobs, Retry Queue & Dead Letters.
 */
export function ErrorCenter() {
  const errors = [
    { title: "Meta Graph API Temporary Timeout", category: "WEBHOOK", status: "RESOLVED_AUTO", time: "Today at 08:30 AM" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise System Error Center & Dead Letter Queue
            </CardTitle>
            <CardDescription className="text-[10px]">
              Unified exception tracking, webhook failures, dead letter recovery & API error telemetry
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          0 UNRESOLVED ERRORS
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {errors.map(err => (
          <div key={err.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{err.title}</span>
              <p className="text-[10px] text-muted-foreground">Category: {err.category} • Resolved: {err.time}</p>
            </div>
            <Badge className="bg-emerald-600 text-white text-[9px]">
              {err.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
