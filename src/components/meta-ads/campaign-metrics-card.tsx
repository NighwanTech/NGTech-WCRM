"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, MousePointer, Target, MessageSquare, TrendingUp } from "lucide-react"

interface MetricsProps {
  totalSpend: number
  totalLeads: number
  totalClicks: number
  totalConversations: number
  cpl: number
  roas: number
}

export function CampaignMetricsCards({
  totalSpend,
  totalLeads,
  totalClicks,
  totalConversations,
  cpl,
  roas,
}: MetricsProps) {
  const metrics = [
    {
      title: "Total Ad Spend",
      value: `₹${totalSpend.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Leads Captured",
      value: totalLeads.toLocaleString('en-IN'),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Avg Cost Per Lead (CPL)",
      value: `₹${cpl.toFixed(2)}`,
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Click-to-WhatsApp Chats",
      value: totalConversations.toLocaleString('en-IN'),
      icon: MessageSquare,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Link Clicks",
      value: totalClicks.toLocaleString('en-IN'),
      icon: MousePointer,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Return on Ad Spend (ROAS)",
      value: `${roas.toFixed(2)}x`,
      icon: TrendingUp,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon
        return (
          <Card key={i} className="border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-foreground">{m.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${m.bgColor}`}>
                <Icon className={`w-6 h-6 ${m.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
