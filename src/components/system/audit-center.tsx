"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, FileText, Check } from "lucide-react"

/**
 * PRD v15.0 Module 9 — Enterprise Audit Center
 * Tracks User Actions, AI Decisions, Workflow Executions, Quotations, Invoices, Security & API Calls.
 */
export function AuditCenter() {
  const auditLogs = [
    { event: "AI Decision Logged: Approved 10% Quotation Discount", category: "AI_DECISION", actor: "System AI", time: "Today at 09:16 AM" },
    { event: "Lead Payload Processed via UCAP Intake Endpoint", category: "API_CALL", actor: "Meta Webhook", time: "Today at 10:20 AM" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Audit Center & Event Log
            </CardTitle>
            <CardDescription className="text-[10px]">
              Immutable audit trail of user actions, AI decisions, workflow execution & API security
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {auditLogs.length} Events Logged Today
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {auditLogs.map(l => (
          <div key={l.event} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{l.event}</span>
              <p className="text-[10px] text-muted-foreground">Actor: {l.actor} • Category: {l.category} • Time: {l.time}</p>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
              AUDITED
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
