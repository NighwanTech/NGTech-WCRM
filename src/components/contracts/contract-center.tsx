"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheck, ShieldCheck, Clock } from "lucide-react"

/**
 * PRD v14.0 Module 8 — Contract Lifecycle Management
 * Stages: Draft ➔ Review ➔ Approval ➔ Signature ➔ Active ➔ Renewal ➔ Expired.
 */
export function ContractCenter({ contracts = [] }: { contracts?: any[] }) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Contract Lifecycle & Compliance Center
            </CardTitle>
            <CardDescription className="text-[10px]">
              E-Signatures, automated renewal tracking & compliance monitoring
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          {contracts.length} CONTRACTS
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {contracts.length > 0 ? (
          contracts.map(c => (
            <div key={c.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <span className="font-bold text-foreground text-xs">{c.title}</span>
                <p className="text-[10px] text-muted-foreground">Renewal Date: {c.renewalDate} • Amount: ₹{c.amountInr?.toLocaleString()}</p>
              </div>
              <Badge className="bg-emerald-600 text-white text-[9px]">
                {c.status}
              </Badge>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <FileCheck className="w-5 h-5 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">No Active Contracts</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Master service agreements, SLAs, and commercial contracts will track e-signatures and renewal dates here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
