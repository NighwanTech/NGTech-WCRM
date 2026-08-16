"use client"

import { MetaAdsHeader } from "@/components/meta-ads/meta-ads-header"
import { LeadCenter } from "@/components/crm/lead-center"
import { LeadIntelligencePanel } from "@/components/crm/lead-intelligence-panel"
import { UniversalImportCenter } from "@/components/crm/universal-import-center"
import { LeadSourceAnalytics } from "@/components/crm/lead-source-analytics"
import { Customer360Workspace } from "@/components/crm/customer-360-workspace"
import { UniversalOmnichannelInbox } from "@/components/crm/universal-omnichannel-inbox"
import { AdAccountKnowledgeManager } from "@/components/meta-ads/ad-account-knowledge-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plug, Check, ArrowRight, Share2, Sparkles } from "lucide-react"

export default function LeadIntegrationsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <MetaAdsHeader
        title="Universal Customer Acquisition Platform (UCAP) & Lead Operations"
        description="Dedicated Lead Operations workspace module connecting Universal Lead Center, Source Analytics, AI Import Center & Customer 360 Command Center."
        breadcrumbs={[{ label: "Lead Operations" }]}
      />

      {/* Top Telemetry Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <Card className="border bg-card shadow-xs p-3.5 space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">Universal Lead Intake API</span>
          <p className="font-mono font-bold text-foreground text-xs truncate">https://api.wacrm.com/api/cip/v1/intake</p>
          <Badge className="bg-emerald-600 text-white font-mono text-[9px]">ACTIVE (HTTP 200 OK)</Badge>
        </Card>
        <Card className="border bg-card shadow-xs p-3.5 space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">WhatsApp Business API</span>
          <p className="font-bold text-foreground text-xs">+91 98765 43210 (Verified)</p>
          <Badge className="bg-emerald-600 text-white font-mono text-[9px]">AI SALES ASSISTANT ACTIVE</Badge>
        </Card>
        <Card className="border bg-card shadow-xs p-3.5 space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">Google Sheets Sync</span>
          <p className="font-bold text-foreground text-xs">Two-Way Realtime Sync</p>
          <Badge className="bg-emerald-600 text-white font-mono text-[9px]">CONNECTED</Badge>
        </Card>
        <Card className="border bg-card shadow-xs p-3.5 space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold">Universal Import Center</span>
          <p className="font-bold text-foreground text-xs">AI Auto Column Mapping & De-dup</p>
          <Badge className="bg-primary text-primary-foreground font-mono text-[9px]">READY</Badge>
        </Card>
      </div>

      {/* Lead Center Dashboard Component */}
      <LeadCenter />

      {/* Operational Lead Analytics Component */}
      <LeadSourceAnalytics />

      {/* Lead Intelligence Panel & Universal Import Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeadIntelligencePanel />
        <UniversalImportCenter />
      </div>

      {/* Customer 360 Command Center Component */}
      <Customer360Workspace />

      {/* Universal Omnichannel AI Inbox */}
      <UniversalOmnichannelInbox />

      {/* Ad Account Knowledge Base Manager */}
      <AdAccountKnowledgeManager />
    </div>
  )
}
