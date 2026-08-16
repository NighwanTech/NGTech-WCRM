"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleLeft, ToggleRight, ShieldCheck } from "lucide-react"

/**
 * PRD v16.0 Module 4 — Feature Flags Manager
 * Granular feature toggling per Organization, Department, User, Role for AI Agents, Prompt Studio, Voice, Workflow, Finance.
 */
export function FeatureFlagsManager() {
  const [flags, setFlags] = useState([
    { id: "ff_1", key: "ENABLE_AI_AGENT_STUDIO", description: "Allows creation of autonomous AI Employee Agents", enabled: true },
    { id: "ff_2", key: "ENABLE_PROMPT_STUDIO_ENVIRONMENTS", description: "Dev/Test/Prod environment isolation for prompts", enabled: true },
    { id: "ff_3", key: "ENABLE_VOICE_BOT_INTAKE", description: "Voice call transcription & AI lead intake connector", enabled: true },
    { id: "ff_4", key: "ENABLE_AUTOMATED_GST_INVOICING", description: "Realtime 18% GST invoice generation on proposal win", enabled: true }
  ])

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ToggleRight className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Feature Flags & Toggles
            </CardTitle>
            <CardDescription className="text-[10px]">
              Granular feature toggling per organization, role & beta deployment group
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {flags.filter(f => f.enabled).length} Enabled
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {flags.map(f => (
          <div key={f.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{f.key}</span>
              <p className="text-[10px] text-muted-foreground">{f.description}</p>
            </div>
            <Button
              size="sm"
              variant={f.enabled ? "default" : "outline"}
              onClick={() => toggleFlag(f.id)}
              className="h-7 text-[10px] font-bold"
            >
              {f.enabled ? "ENABLED" : "DISABLED"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
