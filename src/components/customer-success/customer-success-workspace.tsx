"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles, UserCheck, TrendingUp } from "lucide-react"

/**
 * PRD v14.0 Module 10 — Customer Success Workspace
 * Lifecycle: Onboarding ➔ Training ➔ Support ➔ Renewal ➔ Upsell ➔ Referral ➔ NPS.
 */
export function CustomerSuccessWorkspace({ accounts = [] }: { accounts?: any[] }) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Customer Success & Retention Hub
            </CardTitle>
            <CardDescription className="text-[10px]">
              NPS tracking, onboarding milestones, churn prediction & AI upsell opportunities
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          {accounts.length} ACTIVE CLIENTS
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {accounts.length > 0 ? (
          accounts.map(acc => (
            <div key={acc.name} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <span className="font-bold text-foreground text-xs">{acc.name}</span>
                <p className="text-[10px] text-muted-foreground">NPS: {acc.nps} / 10 • Recommended AI Upsell: {acc.upsell}</p>
              </div>
              <Badge className="bg-emerald-600 text-white text-[9px]">
                {acc.health}
              </Badge>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <Heart className="w-5 h-5 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">No Active Customer Accounts</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Onboarded enterprise clients will track onboarding milestones, health scores, and renewal timelines here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
