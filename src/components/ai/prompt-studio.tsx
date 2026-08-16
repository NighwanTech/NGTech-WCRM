"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCode, Sparkles, RotateCcw, Check } from "lucide-react"

/**
 * PRD v12.0 Module 5 — Prompt Studio
 * Allows organization administrators to customize, preview, test, and rollback AI prompts.
 */
export function PromptStudio() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Organization Prompt Studio
            </CardTitle>
            <CardDescription className="text-[10px]">
              Customize system instructions, prompt versioning & test LLM outputs
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          VERSION 2.4 (ACTIVE)
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <label className="font-bold text-foreground text-xs">System Prompt: Lead Qualification & WhatsApp Sales Assistant</label>
          <textarea
            readOnly
            value="You are an enterprise AI Sales Assistant for AIWCRM. Analyze customer inquiry, evaluate location in Bihar/Patna, calculate purchase intent, and offer 10% instant booking discount."
            className="w-full h-20 p-2.5 rounded-xl border bg-muted/20 font-mono text-[11px] resize-none"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold gap-1">
            <RotateCcw className="w-3 h-3" /> Rollback V2.3
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
            <Sparkles className="w-3 h-3" /> Save Prompt Version
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
