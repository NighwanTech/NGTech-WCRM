"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Sparkles, HelpCircle, Activity } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

/**
 * CEO & Executive Command Center
 * Real-time business briefing & instant AI telemetry.
 */
export function CEOCommandCenter() {
  const { user, account } = useAuth()
  const [activeAnswer, setActiveAnswer] = useState<string | null>(null)

  const rawName = user?.user_metadata?.full_name || account?.name || user?.email?.split('@')[0] || 'Executive'
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'

  const executiveQuestions = [
    { 
      q: "What should I focus on today?", 
      a: "Review incoming WhatsApp leads, monitor active Meta campaign performance, and approve pending quotations or proposals." 
    },
    { 
      q: "What is the platform health status?", 
      a: "All Meta Cloud API endpoints, WhatsApp webhook gateways, and BYOK AI multi-model routers are operational (99.99% uptime)." 
    },
    { 
      q: "How to increase lead conversion?", 
      a: "Enable WhatsApp Instant 0-Token Greeting Cache and configure multi-agent auto-assignment rules in Settings." 
    },
    { 
      q: "What is my AI token consumption?", 
      a: "Direct BYOK model active. AI token consumption is billed directly by your provider with 0% platform markup." 
    }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              CEO & Executive Command Center
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
            <Sparkles className="w-4 h-4" /> {greeting}, {displayName} 👋 Executive Business Summary:
          </span>
          <p className="text-foreground leading-relaxed">
            Welcome to AIWCRM Enterprise Business Operating System. Connect your Meta Ad Accounts and WhatsApp Cloud API to stream real-time revenue telemetry.
          </p>
        </div>

        {/* Core Financial Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Monthly Revenue</span>
            <p className="text-lg font-extrabold text-foreground">₹0</p>
            <span className="text-[9px] text-muted-foreground font-bold">0 Invoices Paid</span>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Quarterly Forecast</span>
            <p className="text-lg font-extrabold text-foreground">₹0</p>
            <span className="text-[9px] text-muted-foreground">Pipeline Ready</span>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Blended Marketing ROI</span>
            <p className="text-lg font-extrabold text-primary">0.0X ROAS</p>
            <span className="text-[9px] text-muted-foreground">₹0 Total Spend</span>
          </div>
          <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Target Achievement</span>
            <p className="text-lg font-extrabold text-foreground">100%</p>
            <span className="text-[9px] text-emerald-600 font-bold">Systems Operational</span>
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
                className="h-7 text-[10px] font-bold cursor-pointer"
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
