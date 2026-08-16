"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Circle } from "lucide-react"

/**
 * PRD v12.0 Module 2 — Customer Journey Intelligence
 * Journey visualizer tracking stages from Awareness ➔ Lead ➔ Qualified ➔ Proposal ➔ Negotiation ➔ Customer ➔ Renewal.
 */
export function CustomerJourneyEngine() {
  const stages = [
    { name: "Awareness", status: "COMPLETED" },
    { name: "Lead", status: "COMPLETED" },
    { name: "Qualified", status: "COMPLETED" },
    { name: "Proposal", status: "ACTIVE" },
    { name: "Negotiation", status: "PENDING" },
    { name: "Closed Won", status: "PENDING" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
            Customer Journey Intelligence Engine
          </CardTitle>
          <CardDescription className="text-[10px]">
            AI-driven stage transition tracking & churn probability analysis
          </CardDescription>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          STAGE: PROPOSAL (89% PROBABILITY)
        </Badge>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
          {stages.map((stg, idx) => (
            <div key={stg.name} className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
                stg.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold' :
                stg.status === 'ACTIVE' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'bg-muted/20 text-muted-foreground'
              }`}>
                {stg.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                <span>{stg.name}</span>
              </div>
              {idx < stages.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
