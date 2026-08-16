"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, User, Target } from "lucide-react"

export interface LeadIntelligenceCardProps {
  score?: number
  intent?: 'HIGH' | 'MEDIUM' | 'LOW'
  urgency?: string
  estimatedRevenue?: number
  recommendedSalesperson?: string
  nextBestAction?: string
}

/**
 * LeadIntelligenceCard Component
 * Displays AI Lead Score (0-100), Intent Badge, Urgency, Revenue Forecast & Next Action.
 */
export function LeadIntelligenceCard({
  score = 94,
  intent = 'HIGH',
  urgency = 'IMMEDIATE',
  estimatedRevenue = 150000,
  recommendedSalesperson = 'Rahul Sharma (Enterprise Rep)',
  nextBestAction = 'Call Customer Immediately & Generate WhatsApp Quotation'
}: LeadIntelligenceCardProps) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-3.5 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
            AI Lead Intelligence Scorecard
          </CardTitle>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono font-bold text-[10px]">
          {score} / 100 ({intent} INTENT)
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div className="p-2 rounded-lg border bg-muted/20 space-y-0.5">
            <span className="text-muted-foreground text-[10px]">Urgency Level</span>
            <p className="font-bold text-foreground">{urgency}</p>
          </div>
          <div className="p-2 rounded-lg border bg-muted/20 space-y-0.5">
            <span className="text-muted-foreground text-[10px]">Forecast Revenue</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{estimatedRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-1 text-[11px]">
          <span className="text-muted-foreground font-bold flex items-center gap-1">
            <User className="w-3 h-3 text-primary" /> Recommended Sales Assignment:
          </span>
          <p className="font-bold text-foreground pl-4">{recommendedSalesperson}</p>
        </div>

        <div className="p-2.5 rounded-xl border bg-primary/5 border-primary/20 space-y-1 text-[11px]">
          <span className="text-primary font-bold flex items-center gap-1">
            <Target className="w-3 h-3" /> Next Best Action:
          </span>
          <p className="font-bold text-foreground">{nextBestAction}</p>
        </div>
      </CardContent>
    </Card>
  )
}
