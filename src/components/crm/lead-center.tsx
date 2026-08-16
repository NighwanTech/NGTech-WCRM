"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Users, Search, Filter, Sparkles, Phone, Mail, MapPin, ArrowRight, 
  Download, Upload, Check, RefreshCw, UserCheck, ShieldCheck, Tag, Layers
} from "lucide-react"
import { toast } from "sonner"

export interface LeadRecordItem {
  id: string
  name: string
  phone: string
  email: string
  city: string
  source: 'META' | 'WEBSITE' | 'WHATSAPP' | 'INSTAGRAM' | 'GOOGLE' | 'EXCEL' | 'SHOPIFY' | 'API'
  campaignName: string
  aiScore: number
  buyingIntent: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'NEW' | 'QUALIFIED' | 'ASSIGNED' | 'UNASSIGNED' | 'DUPLICATE_REVIEW' | 'IMPORTED' | 'ARCHIVED'
  assignedOwner: string
  createdAt: string
}

/**
 * PRD v13.0 Component 1 — Lead Center
 * Enterprise command center for all incoming leads before entering the sales pipeline.
 */
export function LeadCenter() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW' | 'QUALIFIED' | 'ASSIGNED' | 'UNASSIGNED' | 'DUPLICATE_REVIEW' | 'IMPORTED' | 'ARCHIVED'>('ALL')
  const [searchQuery, setSearchQuery] = useState("")
  const [leads, setLeads] = useState<LeadRecordItem[]>([])

  const filteredLeads = leads.filter(l => {
    const matchesTab = activeTab === 'ALL' || l.status === activeTab
    const matchesSearch = searchQuery === "" || 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.phone.includes(searchQuery) || 
      l.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Lead Center & Ingestion Hub
            </CardTitle>
            <CardDescription className="text-[10px]">
              Universal command center for all incoming leads before entering the sales pipeline
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground font-mono text-[9px]">
            {leads.length} LEADS
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4 font-mono">
        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b">
          <div className="flex flex-wrap gap-1.5">
            {(['ALL', 'NEW', 'QUALIFIED', 'ASSIGNED', 'UNASSIGNED', 'DUPLICATE_REVIEW', 'IMPORTED', 'ARCHIVED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-primary text-primary-foreground shadow-2xs' 
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
        </div>

        {/* Leads Data Table */}
        <div className="overflow-x-auto border rounded-xl">
          {filteredLeads.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-3">Status / Score</th>
                  <th className="py-2.5 px-3">Lead Name</th>
                  <th className="py-2.5 px-3">Source Channel</th>
                  <th className="py-2.5 px-3">Campaign Attribution</th>
                  <th className="py-2.5 px-3">Sales Owner</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/30 transition-all">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
                          {lead.aiScore} / 100
                        </Badge>
                        <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                          {lead.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>
                        <p className="font-bold text-foreground">{lead.name}</p>
                        <p className="text-[10px] text-muted-foreground">{lead.phone} • {lead.city}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant="secondary" className="font-mono text-[9px]">
                        {lead.source}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-muted-foreground truncate max-w-[200px]">
                      {lead.campaignName}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-foreground">
                      {lead.assignedOwner}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.success(`Opened Customer 360 Workspace for ${lead.name}!`)}
                        className="h-6 text-[10px] font-bold gap-1 text-primary"
                      >
                        Open Lead <ArrowRight className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 px-4 text-center space-y-3">
              <Users className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <div className="space-y-1">
                <p className="font-bold text-foreground text-xs">No Leads in Current View</p>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  Connect Meta Instant Forms or upload a CSV to start receiving and qualifying leads with AI.
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Opening CSV Import dialog...")}
                  className="h-7 text-[10px] font-bold gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Import Leads CSV
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
