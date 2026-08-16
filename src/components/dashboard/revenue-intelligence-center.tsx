"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, TrendingUp, DollarSign, Award, Target } from "lucide-react"

/**
 * PRD v14.0 Module 11 — Revenue Intelligence Center
 * Displays Pipeline Value, Monthly Revenue, CAC, LTV, Blended ROAS, Win Rate & Conversion Rate.
 */
export function RevenueIntelligenceCenter({
  pipelineValue = 0,
  blendedCac = 0,
  ltvToCac = 0,
  winRate = 0
}: {
  pipelineValue?: number
  blendedCac?: number
  ltvToCac?: number
  winRate?: number
}) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Revenue Intelligence & Performance Center
            </CardTitle>
            <CardDescription className="text-[10px]">
              Customer Acquisition Cost (CAC), Lifetime Value (LTV), Blended ROAS & Pipeline Health
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          REALTIME ANALYTICS
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Pipeline Active Value</span>
            <p className="text-base font-extrabold text-foreground">₹{pipelineValue.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Blended CAC</span>
            <p className="text-base font-extrabold text-primary">₹{blendedCac.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">LTV to CAC Ratio</span>
            <p className="text-base font-extrabold text-foreground">{ltvToCac > 0 ? `${ltvToCac}x` : '0.0x'}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Win Rate</span>
            <p className="text-base font-extrabold text-foreground">{winRate > 0 ? `${winRate}%` : '0.0%'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
