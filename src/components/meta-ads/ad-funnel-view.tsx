"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Eye, MousePointer, MessageSquare, Users, CheckCircle2 } from "lucide-react"

interface FunnelProps {
  impressions?: number
  clicks?: number
  whatsappChats?: number
  crmLeads?: number
  dealsWon?: number
}

export function AdFunnelView({
  impressions = 12500,
  clicks = 620,
  whatsappChats = 280,
  crmLeads = 115,
  dealsWon = 18,
}: FunnelProps) {
  const steps = [
    { label: "Ad Impressions", value: impressions.toLocaleString(), icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Link Clicks", value: clicks.toLocaleString(), icon: MousePointer, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "WhatsApp Chats", value: whatsappChats.toLocaleString(), icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "CRM Leads Created", value: crmLeads.toLocaleString(), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Deals Closed Won", value: dealsWon.toLocaleString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ]

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">End-to-End Sales Attribution Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1 p-4 rounded-xl border bg-card text-center space-y-1 hover:border-primary/50 transition-colors">
                  <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${step.bg}`}>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mt-2">{step.value}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{step.label}</p>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
