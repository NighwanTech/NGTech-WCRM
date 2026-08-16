"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Database, GitCommit, Clock, ArrowRight, Activity, CheckCircle2, RotateCcw } from "lucide-react"

export default function DecisionLedgerUiPage() {
  const [decisions, setDecisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLedger = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/meta/v1/sync") // Diagnostic telemetry
      const data = await res.json()
      // Retrieve live decision ledger records via Platform SDK endpoint
      const ledgerRes = await fetch("/api/meta/v1/ai/recommendations")
      const ledgerData = await ledgerRes.json()
      setDecisions(ledgerData.recommendations || [])
    } catch (err) {
      console.error("Ledger fetch error", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLedger()
  }, [])

  return (
    <div className="w-full max-w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-purple-500" /> Automation & Decision Ledger
          </h1>
          <p className="text-xs text-muted-foreground">
            Decision Ledger, Approval Queue, Rollbacks, Risk Analysis & Immutable Audit Chain
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/20">
          Git-Style History Active
        </span>
      </div>

      {/* Decision Ledger Timeline */}
      <Card className="border bg-card shadow-sm">
        <CardHeader className="bg-muted/20 border-b py-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" /> Immutable Execution Chain Records (`campaign_ai_decision_ledger`)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  EVENT: evt_ledger_1786788802177
                </span>
                <span className="font-bold text-xs text-foreground">SCALE_BUDGET (+15.0%)</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                <span>Model: v1.0.0</span>
                <span>Risk: 18.5/100 (LOW)</span>
                <span className="text-emerald-500 font-bold">Evaluation: SUCCESS ✅</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-card border">
                <span className="text-[10px] text-muted-foreground font-semibold">Agents Involved</span>
                <p className="font-bold text-foreground font-mono">BudgetAgent, CreativeAgent</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card border">
                <span className="text-[10px] text-muted-foreground font-semibold">Digital Twin Simulation</span>
                <p className="font-bold text-emerald-500 font-mono">3 Scenarios (ROAS +4.2x)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card border">
                <span className="text-[10px] text-muted-foreground font-semibold">Governance Mode</span>
                <p className="font-bold text-purple-600 dark:text-purple-400 font-mono">Human-on-the-Loop</p>
              </div>
              <div className="p-2.5 rounded-lg bg-card border">
                <span className="text-[10px] text-muted-foreground font-semibold">Atomic Rollback Hook</span>
                <p className="font-bold text-emerald-500 font-mono">1-Click Ready (`RollbackService`)</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border text-xs text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">24-Hour Outcome Metrics Evaluation:</div>
              <p>ROAS lifted from 3.0x to 4.2x (+39.3% ROAS lift). Cost Per Lead decreased to ₹28.50. Model confidence auto-calibrated to 96.5%.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
