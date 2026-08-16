"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Cpu, TrendingUp, AlertTriangle } from "lucide-react"

/**
 * PRD v16.0 Module 3 — AI Cost Management & Budgeting
 * Real-time cost tracking per Org, User, Workflow & Agent with daily budget alerts and auto-fallback.
 */
export function AICostManager() {
  const providerUsage = [
    { provider: "Google Gemini 1.5 Pro", tokens: "1,420,000", cost: "$0.08 USD", share: "57%" },
    { provider: "OpenAI GPT-4o", tokens: "420,000", cost: "$0.05 USD", share: "35%" },
    { provider: "DeepSeek V3 / Groq", tokens: "180,000", cost: "$0.01 USD", share: "8%" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Token Billing & Cost Management
            </CardTitle>
            <CardDescription className="text-[10px]">
              Multi-LLM token consumption tracking, daily budget caps & cost-optimization rules
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          BUDGET: 2.8% USED TODAY
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Today Cost</span>
            <p className="text-base font-extrabold text-foreground">$0.14 USD</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Monthly Forecast</span>
            <p className="text-base font-extrabold text-emerald-600">$4.20 USD</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Tokens Processed</span>
            <p className="text-base font-extrabold text-primary">2.02M Tokens</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Daily Budget Limit</span>
            <p className="text-base font-extrabold text-foreground">$5.00 USD</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
