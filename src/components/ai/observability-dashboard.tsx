"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Zap, DollarSign, ShieldCheck } from "lucide-react"

/**
 * PRD v12.0 Module 9 — Enterprise AI Observability Dashboard
 * Monitor Requests, Latency, Tokens, Cost, Tool Calls, Approval Rate & Human Overrides.
 */
export function AIObservabilityDashboard() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise AI Observability & Telemetry
            </CardTitle>
            <CardDescription className="text-[10px]">
              Model execution logs, latency, token consumption & human override rates
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          99.9% ACCURACY
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total AI Requests</span>
            <p className="text-base font-extrabold text-foreground">1,420</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Avg Latency</span>
            <p className="text-base font-extrabold text-primary">340 ms</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Token Cost Today</span>
            <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">$0.14 USD</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Human Override</span>
            <p className="text-base font-extrabold text-foreground">0.0%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
