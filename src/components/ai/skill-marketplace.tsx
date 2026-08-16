"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, Cpu } from "lucide-react"

export interface AISkillItem {
  id: string
  name: string
  category: string
  description: string
  enabled: boolean
}

/**
 * PRD v12.0 Module 4 — AI Skill Marketplace
 * Reusable AI Skill plugins (Lead Qualification, Proposal Writer, Sales Coach, Campaign Optimizer).
 */
export function AISkillMarketplace() {
  const [skills] = useState<AISkillItem[]>([
    { id: "sk_1", name: "AI Lead Qualification", category: "CRM", description: "Evaluates purchase intent, urgency, and calculates 0-100 lead score.", enabled: true },
    { id: "sk_2", name: "WhatsApp Sales Coach", category: "SALES", description: "Generates context-aware replies, objection handling, and discount tips.", enabled: true },
    { id: "sk_3", name: "PDF Proposal & Quote Writer", category: "FINANCE", description: "Auto-generates formal quotes and proposals from lead data.", enabled: true },
    { id: "sk_4", name: "Meta Campaign Optimizer", category: "MARKETING", description: "Detects creative fatigue and scales campaign budgets.", enabled: true }
  ])

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Skill Marketplace & Plugin Engine
            </CardTitle>
            <CardDescription className="text-[10px]">
              Configure reusable AI skills assigned to default LLM providers
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {skills.filter(s => s.enabled).length} Skills Active
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {skills.map(sk => (
          <div key={sk.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-xs">{sk.name}</span>
                <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                  {sk.category}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{sk.description}</p>
            </div>
            <Badge className="bg-emerald-600 text-white font-mono text-[9px] shrink-0">
              ENABLED
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
