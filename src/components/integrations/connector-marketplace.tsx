"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plug, RefreshCw, Check, Sparkles } from "lucide-react"

export interface MarketplaceConnector {
  id: string
  name: string
  category: string
  status: 'INSTALLED' | 'AVAILABLE' | 'UPDATE_AVAILABLE'
  healthScore: number
}

/**
 * PRD v12.0 Connector Marketplace Component
 * Enterprise connector hub supporting Installed, Available, Updates, Health & Logs.
 */
export function ConnectorMarketplace() {
  const [connectors] = useState<MarketplaceConnector[]>([
    { id: "m1", name: "Meta Ads & Pages Graph API", category: "Advertising", status: "INSTALLED", healthScore: 99 },
    { id: "m2", name: "WhatsApp Cloud API", category: "Messaging", status: "INSTALLED", healthScore: 98 },
    { id: "m3", name: "Google Ads & Analytics", category: "Advertising", status: "AVAILABLE", healthScore: 100 },
    { id: "m4", name: "Shopify / WooCommerce", category: "Ecommerce", status: "UPDATE_AVAILABLE", healthScore: 94 },
    { id: "m5", name: "Stripe & Razorpay Payments", category: "Finance", status: "INSTALLED", healthScore: 97 }
  ])

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Plug className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Connector Marketplace
            </CardTitle>
            <CardDescription className="text-[10px]">
              Installable integrations for Meta, Google, WhatsApp, Commerce & Payments
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {connectors.filter(c => c.status === 'INSTALLED').length} Installed
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {connectors.map(c => (
          <div key={c.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-xs">{c.name}</span>
                <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                  {c.category}
                </Badge>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">Health Score: {c.healthScore}% • Status: {c.status}</p>
            </div>
            <Button size="sm" variant={c.status === 'INSTALLED' ? 'outline' : 'default'} className="h-7 text-[10px] font-bold">
              {c.status === 'INSTALLED' ? 'Configure' : 'Install Connector'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
