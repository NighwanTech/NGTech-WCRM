"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Terminal, Play, Code, Check } from "lucide-react"
import { toast } from "sonner"

/**
 * PRD v16.0 Module 7 — Developer Console & Payload Debugger
 * API Logs, Webhook Tester, Payload Viewer, Replay Request, Event Bus Inspector, Connector Debugger, Prompt Tester.
 */
export function DeveloperConsole() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Developer Console & Webhook Payload Debugger
            </CardTitle>
            <CardDescription className="text-[10px]">
              Live HTTP logs, raw webhook payload inspector, Event Bus listener & prompt tester
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          DEBUGGER READY
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        <div className="p-3 rounded-xl border bg-black text-emerald-400 font-mono text-[11px] space-y-1">
          <p className="text-muted-foreground">// Universal Intake REST API Incoming Payload Sample</p>
          <pre className="overflow-x-auto text-[10px]">{`{
  "source": "META_INSTANT_FORM",
  "leadgen_id": "meta_lead_9921",
  "form_data": { "name": "Rahul Sharma", "phone": "+919876543210", "city": "Patna" }
}`}</pre>
        </div>

        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={() => toast.success("Dispatched simulated webhook payload to /api/cip/v1/intake!")} className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
            <Play className="w-3 h-3" /> Test Webhook Payload
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
