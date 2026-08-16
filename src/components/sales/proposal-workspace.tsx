"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, Download, Check, History } from "lucide-react"
import { toast } from "sonner"

import Link from "next/link"

/**
 * PRD v14.0 Module 2 — Proposal Workspace
 * AI Proposal Generation, Scope of Work, Deliverables, Pricing, Version History & PDF Export.
 */
export function ProposalWorkspace({ proposals = [] }: { proposals?: any[] }) {
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
          PROPOSAL ENGINE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        {proposals.length > 0 ? (
          proposals.map((p, idx) => (
            <div key={idx} className="p-3 rounded-xl border bg-muted/20 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">{p.title}</span>
              <p className="font-bold text-foreground">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">Client: {p.client} • Value: ₹{p.value?.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-2">
            <FileText className="w-6 h-6 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">No Active Proposals</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Select a deal from your pipeline or click below to generate an AI-powered Commercial Proposal & SOW.
            </p>
            <div className="pt-2">
              <Link href="/sales/proposals">
                <Button size="sm" className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer">
                  <Sparkles className="w-3 h-3" /> Create Commercial Proposal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
