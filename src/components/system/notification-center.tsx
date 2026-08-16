"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, Mail, Smartphone, Check } from "lucide-react"

/**
 * PRD v15.0 Module 8 — Enterprise Notification Hub
 * Channels: WhatsApp, Email, SMS, Push, Slack, Teams, In-App.
 */
export function NotificationCenter() {
  const notifications = [
    { title: "WhatsApp Lead Greeting Sent to Rahul Sharma", channel: "WHATSAPP", status: "DELIVERED" },
    { title: "Invoice #INV-2026-101 PDF Delivered to Patna Real Estate", category: "EMAIL", status: "DELIVERED" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Omnichannel Notification Hub
            </CardTitle>
            <CardDescription className="text-[10px]">
              Delivery status, read receipts & automated retry queue across WhatsApp, Email & Push
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
          HUB ONLINE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {notifications.map(n => (
          <div key={n.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{n.title}</span>
              <p className="text-[10px] text-muted-foreground">Channel: {n.channel}</p>
            </div>
            <Badge className="bg-emerald-600 text-white text-[9px]">
              {n.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
