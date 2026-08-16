"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Play, Pause, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

/**
 * PRD v16.0 Module 1 — Execution Monitoring Center
 * Operations center for running, queued, completed, failed, retrying & cancelled workflows.
 */
export function ExecutionMonitor() {
  const [executions] = useState([
    { id: "exec_501", name: "Meta Lead ➔ WhatsApp Instant Welcome", status: "RUNNING", duration: "1.2s", tokens: 142, calls: 2 },
    { id: "exec_502", name: "Quotation #QT-991 Discount Approval Flow", status: "COMPLETED", duration: "0.8s", tokens: 96, calls: 1 },
    { id: "exec_503", name: "Daily Revenue Forecast Refresh Job", status: "COMPLETED", duration: "3.4s", tokens: 420, calls: 4 }
  ])

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Automation Execution Monitoring Center
            </CardTitle>
            <CardDescription className="text-[10px]">
              Real-time worker telemetry, execution logs, token usage & 1-click replay
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          1 RUNNING • 2 COMPLETED
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {executions.map(ex => (
          <div key={ex.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{ex.name}</span>
              <p className="text-[10px] text-muted-foreground">ID: {ex.id} • Duration: {ex.duration} • Tokens: {ex.tokens} • API Calls: {ex.calls}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={ex.status === 'RUNNING' ? 'bg-primary text-primary-foreground text-[9px]' : 'bg-emerald-600 text-white text-[9px]'}>
                {ex.status}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => toast.success(`Replaying execution ${ex.id}...`)} className="h-6 text-[10px] font-bold">
                Replay
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
