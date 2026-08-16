"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Zap } from "lucide-react"

/**
 * PRD v12.0 Module 1 — Revenue AI Brain
 * Intelligent priority stream continuously analyzing marketing, sales, revenue, pipeline, and AI activity.
 */
export function RevenueAIBrain() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Revenue AI Brain — Executive Priority Stream
            </CardTitle>
            <CardDescription className="text-[10px]">
              Real-time predictive intelligence across Marketing, Sales, Pipeline & AI Execution
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          REALTIME TELEMETRY ACTIVE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Top Priority Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Today's Priority Focus</span>
            <p className="font-bold text-foreground text-xs">Close 3 High-Intent Bihar Deals</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Forecast Revenue: ₹5,04,000</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Pipeline Health Score</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">94 / 100 (EXCELLENT)</p>
            <p className="text-[10px] text-muted-foreground">Conversion Probability: 82%</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">AI System Confidence</span>
            <p className="font-bold text-primary text-xs">96.8% Accuracy</p>
            <p className="text-[10px] text-muted-foreground">0 Overrides Required Today</p>
          </div>
        </div>

        {/* AI Priorities & Next Best Actions List */}
        <div className="space-y-2">
          <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" /> Today's Autonomous AI Recommendations
          </span>

          <div className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">1. Auto-generate PDF Quotation for Rahul Sharma</span>
              <Badge className="bg-emerald-600 text-white font-mono text-[9px]">HIGH INTENT (96 SCORE)</Badge>
            </div>
            <p className="text-muted-foreground text-[11px]">Customer requested Patna property consultation details. 10% instant booking discount recommended.</p>
          </div>

          <div className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">2. Scale Advantage+ Campaign Budget +15%</span>
              <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">ROAS 4.8X</Badge>
            </div>
            <p className="text-muted-foreground text-[11px]">Patna Property Investment campaign achieved 4.8x ROAS. Increasing daily budget from ₹1,000 to ₹1,150 forecast +18 leads/day.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
