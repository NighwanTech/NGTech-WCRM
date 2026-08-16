"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, Download, Check, History } from "lucide-react"
import { toast } from "sonner"

/**
 * PRD v14.0 Module 2 — Proposal Workspace
 * AI Proposal Generation, Scope of Work, Deliverables, Pricing, Version History & PDF Export.
 */
export function ProposalWorkspace() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Proposal & Scope of Work Builder
            </CardTitle>
            <CardDescription className="text-[10px]">
              Auto-generates formal commercial proposals, SOW & pricing schedules
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          VERSION 3.1
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Proposal Title</span>
          <p className="font-bold text-foreground">Enterprise Real Estate Marketing & Lead Intelligence Proposal</p>
          <p className="text-[11px] text-muted-foreground">Client: Patna Real Estate Developers Ltd • Value: ₹25,00,000</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Downloaded PDF Proposal!")} className="h-7 text-[10px] font-bold gap-1">
            <Download className="w-3 h-3" /> Export PDF
          </Button>
          <Button size="sm" onClick={() => toast.success("Submitted for Approval Workflow!")} className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
            <Check className="w-3 h-3" /> Submit for Approval
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
