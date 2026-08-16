"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Sparkles, Layers, MapPin, Tag } from "lucide-react"

export interface ContactAISummaryProps {
  name?: string
  campaignName?: string
  source?: string
  city?: string
}

/**
 * ContactAISummary Component
 * Renders CRM Contact AI summary card with campaign attribution.
 */
export function ContactAISummary({
  name = "Rahul Sharma",
  campaignName = "Patna Property Investment Campaign 2026",
  source = "Meta Instant Form",
  city = "Patna, Bihar"
}: ContactAISummaryProps) {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2 px-3 bg-muted/20 border-b flex flex-row items-center justify-between">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-primary" /> {name}
        </span>
        <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
          {source}
        </Badge>
      </CardHeader>
      <CardContent className="p-3 space-y-1.5 text-[11px]">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Layers className="w-3 h-3 text-primary" /> <span className="font-bold text-foreground">{campaignName}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3 h-3 text-primary" /> <span>{city}</span>
        </div>
      </CardContent>
    </Card>
  )
}
