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

  const [leads, setLeads] = useState<LeadRecordItem[]>([
    {
      id: "lead_101",
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      email: "rahul.sharma@example.com",
      city: "Patna, Bihar",
      source: "META",
      campaignName: "Patna Property Investment 2026",
      aiScore: 96,
      buyingIntent: "HIGH",
      status: "QUALIFIED",
      assignedOwner: "Sunil Kumar",
      createdAt: "Today at 09:15 AM"
    },
    {
      id: "lead_102",
      name: "Priya Singh",
      phone: "+91 98123 45678",
      email: "priya.singh@example.com",
      city: "Gaya, Bihar",
      source: "WHATSAPP",
      campaignName: "Healthcare Doctor Consultation",
      aiScore: 91,
      buyingIntent: "HIGH",
      status: "NEW",
      assignedOwner: "Rahul Sharma",
      createdAt: "Today at 10:20 AM"
    },
    {
      id: "lead_103",
      name: "Amit Kumar",
      phone: "+91 97777 88888",
      email: "amit.kumar@example.com",
      city: "Muzaffarpur",
      source: "EXCEL",
      campaignName: "B2B Bulk Buyers Batch #14",
      aiScore: 84,
      buyingIntent: "MEDIUM",
      status: "IMPORTED",
      assignedOwner: "Unassigned",
      createdAt: "Yesterday"
    }
  ])

  const filteredLeads = leads.filter(l => {
    if (activeTab !== 'ALL' && l.status !== activeTab) return false
    if (searchQuery && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.phone.includes(searchQuery)) return false
    return true
  })

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Lead Center — Enterprise Acquisition Gateway
            </CardTitle>
            <CardDescription className="text-[10px]">
              Master command center for leads from Meta, Website, WhatsApp, Google, Shopify & Excel
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
            {filteredLeads.length} Leads Displayed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Filters & Sub-Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 bg-muted/40 p-1 rounded-xl border">
            {(['ALL', 'NEW', 'QUALIFIED', 'ASSIGNED', 'UNASSIGNED', 'DUPLICATE_REVIEW', 'IMPORTED', 'ARCHIVED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === tab ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted/60'
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
        </div>
      </CardContent>
    </Card>
  )
}
