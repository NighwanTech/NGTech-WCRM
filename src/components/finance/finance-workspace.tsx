"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CreditCard, TrendingUp, AlertTriangle } from "lucide-react"

/**
 * PRD v14.0 Module 9 — Finance Workspace
 * Quotations ➔ Invoices ➔ Payments ➔ Outstanding ➔ Collections ➔ Cash Flow AI predictions.
 */
export function FinanceWorkspace() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Finance & Collections Hub
            </CardTitle>
            <CardDescription className="text-[10px]">
              Invoicing, GST compliance, collections ledger & cash flow forecasting
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          CASH FLOW HEALTHY
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Invoiced</span>
            <p className="text-base font-extrabold text-foreground">₹21,24,000</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Payments Collected</span>
            <p className="text-base font-extrabold text-emerald-600">₹18,40,000</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Outstanding Collections</span>
            <p className="text-base font-extrabold text-primary">₹2,84,000</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Overdue Risk</span>
            <p className="text-base font-extrabold text-foreground">0 Overdue</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
