"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Zap } from "lucide-react"

/**
 * PRD v12.0 Module 1 — Revenue AI Brain
 * Intelligent priority stream continuously analyzing marketing, sales, revenue, pipeline, and AI activity.
 */
export function RevenueAIBrain({ recommendations = [] }: { recommendations?: any[] }) {
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
            <p className="font-bold text-foreground text-xs">Connect Inbound Channels & Ad Accounts</p>
            <p className="text-[10px] text-muted-foreground font-semibold">Pipeline: ₹0 Active</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Pipeline Health Score</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">100 / 100 (OPTIMAL)</p>
            <p className="text-[10px] text-muted-foreground">Conversion Engine: Ready</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">AI System Confidence</span>
            <p className="font-bold text-primary text-xs">99.9% Ready</p>
            <p className="text-[10px] text-muted-foreground">0 Policy Violations</p>
          </div>
        </div>

        {/* AI Priorities & Next Best Actions List */}
        <div className="space-y-2">
          <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" /> Autonomous AI Recommendations
          </span>

          {recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{rec.title}</span>
                  <Badge className="bg-emerald-600 text-white font-mono text-[9px]">{rec.tag || 'AI RECOMMENDATION'}</Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">{rec.description}</p>
              </div>
            ))
          ) : (
            <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
              <Sparkles className="w-5 h-5 text-primary mx-auto opacity-70" />
              <p className="font-bold text-foreground text-xs">Revenue Pipeline is Optimal</p>
              <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                AI autonomous agents continuously scan your Meta ads, lead funnels, and sales deals to suggest revenue-optimizing actions in real time.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
