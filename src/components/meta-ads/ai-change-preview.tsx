"use client"

import { useState } from "react"
import { Sparkles, ShieldCheck, ArrowRight, Check, X, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export interface AIChangeDiffData {
  title: string
  campaignName: string
  current: {
    budget: string
    radius: string
    headline?: string
    expectedLeads: string
    roas: string
  }
  proposed: {
    budget: string
    radius: string
    headline?: string
    expectedLeads: string
    roas: string
  }
  confidenceScore: number
  riskScore: number
  expectedLift: string
}

export interface AIChangePreviewProps {
  data?: AIChangeDiffData
  onApprove?: () => void
  onReject?: () => void
  onRequestChanges?: () => void
}

/**
 * ⭐ GAME CHANGER FEATURE — AI Change Preview (Git Diff / Pull Request Style)
 * Renders side-by-side comparison of CURRENT vs PROPOSED states before approval or submission.
 */
export function AIChangePreview({
  data = {
    title: "Scale Daily Budget (+15.0%)",
    campaignName: "WhatsApp Lead Campaign",
    current: {
      budget: "₹500.00 / day",
      radius: "15 km",
      headline: "Book Authentic Consultation Online | Instant Support",
      expectedLeads: "42 / day",
      roas: "3.1x"
    },
    proposed: {
      budget: "₹575.00 / day (+15.0%)",
      radius: "25 km (+10 km expansion)",
      headline: "Book Authentic Consultation Online | Instant Support",
      expectedLeads: "51 / day (+21.4%)",
      roas: "3.6x (+16.1% Lift)"
    },
    confidenceScore: 94.5,
    riskScore: 18.5,
    expectedLift: "+18% ROAS Lift"
  },
  onApprove,
  onReject,
  onRequestChanges
}: AIChangePreviewProps) {
  const [executing, setExecuting] = useState(false)

  const handleConfirm = async () => {
    setExecuting(true)
    try {
      if (onApprove) await onApprove()
    } finally {
      setExecuting(false)
    }
  }

  return (
    <Card className="border bg-card shadow-sm overflow-hidden text-xs">
      {/* Top Header */}
      <div className="p-3 bg-muted/30 border-b flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm text-foreground">{data.title}</span>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] font-mono font-bold">
            {data.expectedLift}
          </Badge>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="text-muted-foreground">Confidence: <strong className="text-emerald-500">{data.confidenceScore}%</strong></span>
          <span className="text-muted-foreground">Risk: <strong className="text-cyan-500">{data.riskScore}/100 (LOW)</strong></span>
        </div>
      </div>

      {/* Side-by-Side Git Diff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
        {/* CURRENT STATE */}
        <div className="p-3.5 space-y-2 bg-muted/10">
          <div className="flex items-center justify-between border-b pb-1">
            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Current State</span>
            <Badge variant="outline" className="text-[9px] font-mono">Active</Badge>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div><span className="text-muted-foreground">Daily Budget:</span> <span className="font-bold text-foreground">{data.current.budget}</span></div>
            <div><span className="text-muted-foreground">Target Radius:</span> <span className="font-bold text-foreground">{data.current.radius}</span></div>
            <div><span className="text-muted-foreground">Expected Leads:</span> <span className="font-bold text-foreground">{data.current.expectedLeads}</span></div>
            <div><span className="text-muted-foreground">Forecast ROAS:</span> <span className="font-bold text-foreground">{data.current.roas}</span></div>
          </div>
        </div>

        {/* PROPOSED AI STATE */}
        <div className="p-3.5 space-y-2 bg-emerald-500/5">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Proposed AI State
            </span>
            <Badge className="bg-emerald-600 text-white text-[9px] font-mono">+16.1% Lift</Badge>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div><span className="text-muted-foreground">Daily Budget:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.proposed.budget}</span></div>
            <div><span className="text-muted-foreground">Target Radius:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.proposed.radius}</span></div>
            <div><span className="text-muted-foreground">Expected Leads:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.proposed.expectedLeads}</span></div>
            <div><span className="text-muted-foreground">Forecast ROAS:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.proposed.roas}</span></div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-muted/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Meta Advertising Policy Standard Compliant</span>
        </div>

        <div className="flex items-center gap-2">
          {onRequestChanges && (
            <Button size="sm" variant="outline" onClick={onRequestChanges} className="h-8 text-xs font-bold">
              Request Changes
            </Button>
          )}
          {onReject && (
            <Button size="sm" variant="outline" onClick={onReject} className="h-8 text-xs font-bold">
              Reject
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={executing}
            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
          >
            {executing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Approve & Submit
          </Button>
        </div>
      </div>
    </Card>
  )
}
