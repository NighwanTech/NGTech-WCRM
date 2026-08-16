"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Sparkles, ShieldCheck, UserCheck, Check } from "lucide-react"

/**
 * PRD v15.0 Module 3 — AI Agent Studio
 * Enterprise AI Employee Builder (Marketing Agent, Sales Agent, Finance Agent, Support Agent, CEO Assistant).
 */
export function AgentStudio() {
  const agents = [
    { name: "Patna Sales Copilot Agent", role: "Sales Specialist", provider: "Gemini 1.5 Pro", status: "DEPLOYED" },
    { name: "WhatsApp AI Customer Assistant", role: "Support & Intake", provider: "GPT-4o", status: "DEPLOYED" },
    { name: "Collections & Billing Reminder Agent", role: "Finance Operations", provider: "Claude 3.5 Sonnet", status: "DEPLOYED" },
    { name: "Meta Ad Campaign Optimizer Agent", role: "Marketing Specialist", provider: "DeepSeek V3", status: "DEPLOYED" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Agent Studio — Enterprise AI Employee Builder
            </CardTitle>
            <CardDescription className="text-[10px]">
              Deploy autonomous AI agents configured with custom tools, prompts, memory & LLM providers
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {agents.length} Deployed Agents
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {agents.map(a => (
          <div key={a.name} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-xs">{a.name}</span>
                <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
                  {a.role}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">Provider: {a.provider} • Governance Policy: Human Review Over 90 Score</p>
            </div>
            <Badge className="bg-emerald-600 text-white font-mono text-[9px] shrink-0">
              {a.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
