"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CreditCard, TrendingUp, AlertTriangle } from "lucide-react"

/**
 * PRD v14.0 Module 9 — Finance Workspace
 * Quotations ➔ Invoices ➔ Payments ➔ Outstanding ➔ Collections ➔ Cash Flow AI predictions.
 */
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

export function FinanceWorkspace({
  totalInvoiced,
  paymentsCollected,
  outstandingCollections,
  overdueCount
}: {
  totalInvoiced?: number
  paymentsCollected?: number
  outstandingCollections?: number
  overdueCount?: number
}) {
  const [liveInvoiced, setLiveInvoiced] = useState(totalInvoiced ?? 0)
  const [liveCollected, setLiveCollected] = useState(paymentsCollected ?? 0)
  const [liveOutstanding, setLiveOutstanding] = useState(outstandingCollections ?? 0)
  const [liveOverdue, setLiveOverdue] = useState(overdueCount ?? 0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aiwcrm_finance_invoices_v1')
      if (stored) {
        const invs = JSON.parse(stored)
        if (Array.isArray(invs) && invs.length > 0) {
          const tot = invs.reduce((sum: number, i: any) => sum + (Number(i.grandTotal) || 0), 0)
          const col = invs.filter((i: any) => i.status === 'Paid').reduce((sum: number, i: any) => sum + (Number(i.grandTotal) || 0), 0)
          setLiveInvoiced(tot)
          setLiveCollected(col)
          setLiveOutstanding(tot - col)
          setLiveOverdue(invs.filter((i: any) => i.status !== 'Paid').length)
        }
      }
    } catch {}
  }, [])

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
        <Link href="/finance" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
          Full Invoices Ledger <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Invoiced</span>
            <p className="text-base font-extrabold text-foreground">₹{liveInvoiced.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Payments Collected</span>
            <p className="text-base font-extrabold text-emerald-600">₹{liveCollected.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Outstanding Collections</span>
            <p className="text-base font-extrabold text-primary">₹{liveOutstanding.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Overdue Risk</span>
            <p className="text-base font-extrabold text-foreground">{liveOverdue} Pending</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
