"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, TrendingUp, DollarSign, Users, Clock, ShieldCheck } from "lucide-react"

/**
 * PRD v13.0 Component — Lead Source Analytics
 * Operational dashboard answering: Leads by source, Cost per lead, Conversion rate by source, Duplicate rate, AI score, SLA response time.
 */
export function LeadSourceAnalytics() {
  const sources = [
    { name: "Meta Instant Forms", leads: 420, cpl: "₹142", conversion: "28.4%", roas: "4.8x" },
    { name: "WhatsApp Cloud API", leads: 310, cpl: "₹98", conversion: "34.2%", roas: "5.4x" },
    { name: "Website Forms", leads: 180, cpl: "₹185", conversion: "22.1%", roas: "3.9x" },
    { name: "Excel AI Import", leads: 140, cpl: "₹0", conversion: "18.5%", roas: "N/A" }
  ]

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
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          REALTIME AGGREGATION
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Acquired Leads</span>
            <p className="text-base font-extrabold text-foreground">1,050 Leads</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Blended CPL</span>
            <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹138.00</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Duplicate Rate</span>
            <p className="text-base font-extrabold text-primary">3.2% Auto-Merged</p>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Avg AI SLA Response</span>
            <p className="text-base font-extrabold text-foreground">1.4 Minutes</p>
          </div>
        </div>

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
      </CardContent>
    </Card>
  )
}
