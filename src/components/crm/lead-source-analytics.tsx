"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, TrendingUp, DollarSign, Users, Clock, ShieldCheck, Inbox } from "lucide-react"

export interface LeadSourceItem {
  name: string
  leads: number
  cpl: string
  conversion: string
  roas: string
}

export function LeadSourceAnalytics({
  sources = [],
  totalLeads = 0,
  blendedCpl = "₹0.00",
  duplicateRate = "0.0%",
  avgSla = "0.0 Mins"
}: {
  sources?: LeadSourceItem[]
  totalLeads?: number
  blendedCpl?: string
  duplicateRate?: string
  avgSla?: string
}) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Lead Operations & Acquisition Analytics
            </CardTitle>
            <CardDescription className="text-[10px]">
              Cost per lead (CPL), conversion rates, duplicate rates & AI qualification SLAs
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono text-[9px]">
          REALTIME ATTRIBUTION
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Acquired Leads</span>
            <p className="text-base font-extrabold text-foreground">{totalLeads} Leads</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Blended CPL</span>
            <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{blendedCpl}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Duplicate Rate</span>
            <p className="text-base font-extrabold text-primary">{duplicateRate}</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Avg AI SLA Response</span>
            <p className="text-base font-extrabold text-foreground">{avgSla}</p>
          </div>
        </div>

        {sources.length > 0 ? (
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 px-3">Intake Channel</th>
                  <th className="py-2 px-3">Lead Volume</th>
                  <th className="py-2 px-3">Cost Per Lead</th>
                  <th className="py-2 px-3">Conversion Rate</th>
                  <th className="py-2 px-3">Blended ROAS</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.name} className="border-b hover:bg-muted/30 transition-all">
                    <td className="py-2.5 px-3 font-bold text-foreground">{s.name}</td>
                    <td className="py-2.5 px-3 font-mono">{s.leads}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">{s.cpl}</td>
                    <td className="py-2.5 px-3 font-mono">{s.conversion}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-primary">{s.roas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <Inbox className="w-5 h-5 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">No Channel Telemetry Logged Yet</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Cost per lead and conversion attribution across Meta Instant Forms, WhatsApp API, and Website Forms will calculate automatically as campaigns generate leads.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
