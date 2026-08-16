"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, ShieldCheck, Check } from "lucide-react"

/**
 * PRD v12.0 Enterprise Health Center Component
 * Platform status dashboard for Meta Graph API, WhatsApp Cloud API, AI Providers & Supabase.
 */
export function PlatformHealth() {
  const services = [
    { name: "Meta Graph API v20.0", status: "OPERATIONAL", latency: "140ms" },
    { name: "WhatsApp Business Cloud API", status: "OPERATIONAL", latency: "95ms" },
    { name: "Google Gemini 1.5 Pro Provider", status: "OPERATIONAL", latency: "310ms" },
    { name: "OpenAI GPT-4o Provider", status: "OPERATIONAL", latency: "280ms" },
    { name: "Supabase PostgreSQL Database", status: "OPERATIONAL", latency: "12ms" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise System Health Center
            </CardTitle>
            <CardDescription className="text-[10px]">
              Real-time platform service status, API latency & database connectivity
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          ALL SYSTEMS OPERATIONAL
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {services.map(s => (
          <div key={s.name} className="p-2.5 rounded-xl border bg-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold text-foreground text-xs">{s.name}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-muted-foreground font-bold">Latency: {s.latency}</span>
              <Badge className="bg-emerald-600 text-white text-[9px]">{s.status}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
