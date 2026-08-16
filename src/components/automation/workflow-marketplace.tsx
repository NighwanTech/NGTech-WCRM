"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react"

/**
 * PRD v15.0 Module 12 — Workflow Marketplace
 * Ready-to-use enterprise automation blueprint templates.
 */
export function WorkflowMarketplace() {
  const templates = [
    { name: "Meta Lead ➔ WhatsApp Instant AI Welcome Funnel", category: "Acquisition" },
    { name: "High-Value Proposal ➔ PDF Quotation Auto-Delivery", category: "Sales" },
    { name: "Overdue Invoice ➔ Automated Payment Reminder & DLQ", category: "Finance" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Workflow Blueprint Marketplace
            </CardTitle>
            <CardDescription className="text-[10px]">
              Pre-built automation blueprints for Marketing, Sales, Finance & CS
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {templates.length} Templates Available
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {templates.map(t => (
          <div key={t.name} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{t.name}</span>
              <p className="text-[10px] text-muted-foreground">Category: {t.category}</p>
            </div>
            <Button size="sm" className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
              Install Blueprint <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
