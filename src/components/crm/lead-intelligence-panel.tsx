"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, UserCheck, MessageSquare, FileText, Calendar } from "lucide-react"
import { toast } from "sonner"

export interface LeadIntelligencePanelProps {
  score?: number
  intent?: string
  estimatedRevenue?: number
  campaignName?: string
  source?: string
  owner?: string
  journeyStage?: string
}

/**
 * PRD v13.0 Component 2 — Lead Intelligence Panel
 * Focused panel displaying AI Score, Revenue Forecast, Campaign Attribution, Source, Sales Owner & Actions.
 */
export function LeadIntelligencePanel({
  score = 96,
  intent = "HIGH",
  estimatedRevenue = 230000,
  campaignName = "Patna Property Investment Campaign 2026",
  source = "Meta Instant Form",
  owner = "Sunil Kumar (Patna Desk)",
  journeyStage = "Proposal"
}: LeadIntelligencePanelProps) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-3.5 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
            Lead Intelligence Panel
          </CardTitle>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          SCORE: {score} / 100 ({intent})
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div className="p-2 rounded-lg border bg-muted/20 space-y-0.5">
            <span className="text-muted-foreground text-[10px]">Source & Channel</span>
            <p className="font-bold text-foreground truncate">{source}</p>
          </div>
          <div className="p-2 rounded-lg border bg-muted/20 space-y-0.5">
            <span className="text-muted-foreground text-[10px]">Forecast Revenue</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{estimatedRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-1 text-[11px]">
          <span className="text-muted-foreground font-bold">Campaign Attribution:</span>
          <p className="font-bold text-foreground">{campaignName}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-muted-foreground">Assigned Sales Owner:</span>
            <p className="font-bold text-foreground">{owner}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Journey Stage:</span>
            <p className="font-bold text-primary">{journeyStage}</p>
          </div>
        </div>

        <div className="pt-2 border-t grid grid-cols-2 gap-2">
          <Button
            size="sm"
            onClick={() => toast.success("Opened Customer 360 Workspace!")}
            className="h-7 font-bold text-[10px] bg-primary text-primary-foreground gap-1"
          >
            Open Customer360 <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Opened WhatsApp Conversation Inbox!")}
            className="h-7 font-bold text-[10px] gap-1"
          >
            <MessageSquare className="w-3 h-3 text-primary" /> Conversation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
