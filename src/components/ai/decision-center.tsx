"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CheckCircle2, RotateCcw, Sparkles } from "lucide-react"

/**
 * PRD v12.0 Module 13 — AI Decision Center
 * Displays full AI decision stream with status, confidence, reason, outcome, and learning feedback.
 */
export function AIDecisionCenter() {
  const decisions = [
    { id: "dec_1", action: "Assigned Lead Rahul Sharma to Senior Enterprise Sales Desk", status: "APPROVED", confidence: 96, time: "Today at 09:16 AM" },
    { id: "dec_2", action: "Generated Quotation #QT-2026-991 with 10% Discount", status: "EXECUTED", confidence: 94, time: "Today at 10:30 AM" },
    { id: "dec_3", action: "Scaled Campaign Patna Property Investment Budget +15%", status: "APPROVED", confidence: 98, time: "Yesterday" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Governance & Decision Center
            </CardTitle>
            <CardDescription className="text-[10px]">
              Audit trail of AI decisions, confidence scores, execution status & learning
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {decisions.length} Decisions Logged
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {decisions.map(dec => (
          <div key={dec.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{dec.action}</span>
              <p className="text-[10px] font-mono text-muted-foreground">{dec.time} • Confidence: {dec.confidence}%</p>
            </div>
            <Badge className="bg-emerald-600 text-white font-mono text-[9px] shrink-0">
              {dec.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
