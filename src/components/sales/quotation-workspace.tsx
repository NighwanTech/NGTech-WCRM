"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Sparkles, Check, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import Link from "next/link"

/**
 * PRD v14.0 Module 3 — Quotation Workspace
 * Product & Service Pricing, Taxes, Discount Rules, Multi-Currency, AI Pricing Recommendations.
 */
export function QuotationWorkspace({ quotes = [] }: { quotes?: any[] }) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Quotation Engine & 18% GST Invoicing
            </CardTitle>
            <CardDescription className="text-[10px]">
              Multi price books, tax calculation (18% GST) & AI discount recommendations
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono text-[9px]">
          QUOTATION ENGINE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        {quotes.length > 0 ? (
          quotes.map((q, idx) => (
            <div key={idx} className="p-3 rounded-xl border bg-card space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs">{q.title}</span>
                <span className="font-bold text-foreground">₹{q.amount?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                <span>18% GST Tax Included</span>
                <span>+₹{q.tax?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-emerald-600 text-xs border-t pt-1">
                <span>Total Payable Amount</span>
                <span>₹{q.total?.toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-2">
            <DollarSign className="w-6 h-6 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">No Quotations Issued</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Create GST-compliant quotations with automated 18% tax calculation and instant WhatsApp delivery.
            </p>
            <div className="pt-2">
              <Link href="/sales/quotations">
                <Button size="sm" className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer">
                  <Sparkles className="w-3 h-3" /> Create GST Quotation
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
