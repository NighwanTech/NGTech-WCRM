"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Check, X } from "lucide-react"
import { toast } from "sonner"

/**
 * PRD v15.0 Module 7 — Enterprise Approval Center
 * Multi-level approval workspace: AI ➔ Manager ➔ Director ➔ CEO ➔ Execute.
 */
export function ApprovalCenter() {
  const pendingApprovals = [
    { title: "Quotation #QT-2026-991 Special 10% Discount (₹2,12,400 value)", requestedBy: "Sunil Kumar", tier: "DIRECTOR_LEVEL" },
    { title: "Increase Patna Campaign Budget from ₹1,000 to ₹1,150/day", requestedBy: "AI Marketing Agent", tier: "MANAGER_LEVEL" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Multi-Tier Approval Workspace
            </CardTitle>
            <CardDescription className="text-[10px]">
              Governance approval queue for AI agents, quotations, contracts & budget escalations
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {pendingApprovals.length} Approvals Pending
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {pendingApprovals.map(app => (
          <div key={app.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{app.title}</span>
              <p className="text-[10px] text-muted-foreground">Requested By: {app.requestedBy} • Tier: {app.tier}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button size="sm" onClick={() => toast.success("Approved & Executed!")} className="h-7 text-[10px] font-bold bg-emerald-600 text-white gap-1">
                <Check className="w-3 h-3" /> Approve
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
