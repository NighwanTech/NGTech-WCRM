"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, TrendingUp, DollarSign, Target, Sparkles, HelpCircle } from "lucide-react"
import { toast } from "sonner"

/**
 * PRD v14.0 Module 12 — Upgraded CEO & Executive Command Center
 * Executive AI summary ("Good Morning Sandeep...") & instant Executive AI Q&A answers.
 */
export function CEOCommandCenter() {
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null)

  const executiveQuestions = [
    { q: "What should I focus on today?", a: "Focus on closing 3 High-Intent Patna Commercial Complex deals (₹25L value) and approving ₹5.6L quotation discounts." },
    { q: "Which sales rep is performing best?", a: "Sunil Kumar (Patna Desk) achieved 94% win rate with ₹18.4L closed revenue this month." },
    { q: "Which campaign generated highest revenue?", a: "Patna Property Investment 2026 campaign generated ₹25L pipeline at 4.8x ROAS." },
    { q: "Which customers may churn?", a: "Zero active churn risk detected across top Bihar accounts (NPS average 9.1/10)." }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              CEO & Executive Command Center (Upgraded REP Engine)
            </CardTitle>
            <CardDescription className="text-[10px]">
              Executive AI decision engine & instant business Q&A intelligence
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          EXECUTIVE AI ACTIVE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        {/* Executive AI Morning Greeting Stream */}
        <div className="p-3.5 rounded-xl border bg-primary/5 space-y-1.5 text-xs">
          <span className="font-bold text-primary flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Good Morning Sandeep 👋 Executive Business Summary:
          </span>
          <p className="text-foreground leading-relaxed">
            34 new leads acquired • ₹18.4L pipeline added • ₹5.6L awaiting quotation approval • Revenue forecast exceeded target by +11%.
          </p>
        </div>

        {/* Core Financial Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Monthly Revenue</span>
            <p className="text-lg font-extrabold text-foreground">₹18,40,000</p>
            <span className="text-[9px] text-emerald-600 font-bold">+18.5% MoM</span>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Quarterly Forecast</span>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">₹55,20,000</p>
            <span className="text-[9px] text-muted-foreground">82% Win Probability</span>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Blended Marketing ROI</span>
            <p className="text-lg font-extrabold text-primary">4.8X ROAS</p>
            <span className="text-[9px] text-muted-foreground">₹3.8L Spend</span>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Target Achievement</span>
            <p className="text-lg font-extrabold text-foreground">94.2%</p>
            <span className="text-[9px] text-emerald-600 font-bold">On Track</span>
          </div>
        </div>

        {/* Instant Executive AI Q&A Bar */}
        <div className="space-y-2 pt-2 border-t">
          <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-primary" /> Instant Executive AI Answers
          </span>
          <div className="flex flex-wrap gap-2">
            {executiveQuestions.map(item => (
              <Button
                key={item.q}
                size="sm"
                variant="outline"
                onClick={() => setActiveAnswer(item.a)}
                className="h-7 text-[10px] font-bold"
              >
                {item.q}
              </Button>
            ))}
          </div>

          {activeAnswer && (
            <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              ✨ Executive AI: {activeAnswer}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
