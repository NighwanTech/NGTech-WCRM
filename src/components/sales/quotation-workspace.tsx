"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Sparkles, Check, ArrowRight } from "lucide-react"
import { toast } from "sonner"

/**
 * PRD v14.0 Module 3 — Quotation Workspace
 * Product & Service Pricing, Taxes, Discount Rules, Multi-Currency, AI Pricing Recommendations.
 */
export function QuotationWorkspace() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Quotation Engine & Discount Rules
            </CardTitle>
            <CardDescription className="text-[10px]">
              Multi price books, tax calculation (18% GST) & AI discount recommendations
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          QUOTE #QT-2026-991
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        <div className="p-3 rounded-xl border bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground text-xs">Meta Ads OS Enterprise Plan (12 Months)</span>
            <span className="font-bold text-foreground">₹18,00,000</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground text-[10px]">
            <span>18% GST Tax Included</span>
            <span>+₹3,24,000</span>
          </div>
          <div className="flex items-center justify-between font-bold text-emerald-600 text-xs border-t pt-1">
            <span>Total Payable Amount</span>
            <span>₹21,24,000</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={() => toast.success("Quotation delivered to customer via WhatsApp AI Assistant!")} className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
            <Sparkles className="w-3 h-3" /> Send Quote via WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
