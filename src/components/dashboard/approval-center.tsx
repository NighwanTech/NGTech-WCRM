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
export function ApprovalCenter({ pendingApprovals = [] }: { pendingApprovals?: any[] }) {
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
          {pendingApprovals.length} APPROVALS PENDING
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {pendingApprovals.length > 0 ? (
          pendingApprovals.map(app => (
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
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto" />
            <p className="font-bold text-foreground text-xs">No Pending Approvals</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              All quotation discounts, campaign budget escalations, and contract approvals are up to date.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
