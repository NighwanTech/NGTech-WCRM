"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, UserCheck, MessageSquare, User } from "lucide-react"
import Link from "next/link"

export interface LeadIntelligencePanelProps {
  score?: number
  intent?: string
  estimatedRevenue?: number
  campaignName?: string
  source?: string
  owner?: string
  journeyStage?: string
  contactId?: string
}

/**
 * Lead Intelligence Panel
 * Displays AI Score, Revenue Forecast, Campaign Attribution, Source, Sales Owner & Direct Navigation Actions.
 */
export function LeadIntelligencePanel({
  score,
  intent = "QUALIFIED",
  estimatedRevenue = 0,
  campaignName,
  source,
  owner,
  journeyStage = "New Inquiry",
  contactId
}: LeadIntelligencePanelProps) {
  if (!campaignName && !source && !score) {
    return (
      <Card className="border bg-card shadow-xs text-xs">
        <CardHeader className="py-2.5 px-3.5 bg-muted/20 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Lead Intelligence Panel
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
            AI READY
          </Badge>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-3 font-mono">
          <User className="w-6 h-6 text-muted-foreground mx-auto opacity-50" />
          <p className="font-bold text-foreground text-xs">No Active Lead Selected</p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
            Select an incoming lead from the Lead Operations table or Contacts directory to analyze intent and AI scoring.
          </p>
          <div className="pt-1">
            <Link href="/contacts">
              <Button size="sm" className="h-7 font-bold text-[10px] bg-primary text-primary-foreground gap-1.5 cursor-pointer">
                View All Contacts <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          SCORE: {score || 90} / 100 ({intent})
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3 font-mono">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg border bg-muted/20 space-y-0.5">
            <span className="text-muted-foreground text-[10px]">Source & Channel</span>
            <p className="font-bold text-foreground truncate">{source || "Meta Ads / WhatsApp"}</p>
          </div>
          <div className="p-2 rounded-lg border bg-muted/20 space-y-0.5">
            <span className="text-muted-foreground text-[10px]">Forecast Revenue</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{estimatedRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-1 text-[11px]">
          <span className="text-muted-foreground font-bold">Campaign Attribution:</span>
          <p className="font-bold text-foreground">{campaignName || "Inbound WhatsApp Lead"}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-muted-foreground">Assigned Sales Owner:</span>
            <p className="font-bold text-foreground">{owner || "Assigned Agent"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Journey Stage:</span>
            <p className="font-bold text-primary">{journeyStage}</p>
          </div>
        </div>

        <div className="pt-2 border-t grid grid-cols-2 gap-2">
          <Link href={contactId ? `/contacts?id=${contactId}` : "/contacts"}>
            <Button
              size="sm"
              className="w-full h-7 font-bold text-[10px] bg-primary text-primary-foreground gap-1 cursor-pointer"
            >
              Open Customer360 <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
          <Link href="/inbox">
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 font-bold text-[10px] gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3 text-primary" /> Conversation
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
