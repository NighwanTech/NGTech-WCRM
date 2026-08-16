"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, X, ArrowRight } from "lucide-react"
import { toast } from "sonner"

/**
 * PRD v15.0 Module 6 — AI Recommendation Center
 * Centralized recommendation queue across Marketing, Sales, Finance, CS & Ops.
 */
export function RecommendationCenter({ recommendations = [] }: { recommendations?: any[] }) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Centralized AI Recommendation Queue
            </CardTitle>
            <CardDescription className="text-[10px]">
              AI suggestions with confidence scores, business impact & 1-click execution
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {recommendations.length} PENDING ACTIONS
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {recommendations.length > 0 ? (
          recommendations.map(r => (
            <div key={r.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <span className="font-bold text-foreground text-xs">{r.title}</span>
                <p className="text-[10px] text-muted-foreground">Category: {r.category} • Expected Lift: {r.impact} • Confidence: {r.confidence}%</p>
              </div>
              <Button size="sm" onClick={() => toast.success("Approved & Executed Recommendation!")} className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
                <Check className="w-3 h-3" /> Approve & Execute
              </Button>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <Sparkles className="w-5 h-5 text-primary mx-auto opacity-70" />
            <p className="font-bold text-foreground text-xs">Recommendation Queue is Clear</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              AI continuous intelligence will suggest budget scale, deal acceleration, and retention triggers as data flows through the system.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
