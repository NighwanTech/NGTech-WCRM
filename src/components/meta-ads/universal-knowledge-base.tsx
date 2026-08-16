"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Sparkles } from "lucide-react"

export interface KnowledgeItem {
  id: string
  title: string
  category: string
  content: string
}

/**
 * CTO Refinement #7 — Universal Organization Knowledge Base Component
 * Manages organization-wide knowledge (Products, Pricing, FAQs, Sales Scripts, Case Studies).
 */
export function UniversalKnowledgeBase() {
  const [items] = useState<KnowledgeItem[]>([
    { id: "k1", title: "Patna Real Estate Pricing 2026", category: "PRICING", content: "Residential plots in Patna starting at ₹25 Lakhs with 10% instant discount." },
    { id: "k2", title: "Healthcare Consultation Script", category: "SALES_SCRIPT", content: "Verified medical specialist consultation FAQs and WhatsApp booking workflow." },
    { id: "k3", title: "Restaurant Delivery SOPs", category: "SOP", content: "Offer 25% discount code for direct WhatsApp food delivery orders." }
  ])

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Universal Organization Knowledge Base
            </CardTitle>
            <CardDescription className="text-[10px]">
              AI Brain storing company details, pricing, sales scripts, and case studies
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {items.length} Knowledge Assets Active
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {items.map(item => (
          <div key={item.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-xs">{item.title}</span>
              <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                {item.category}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{item.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
