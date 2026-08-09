"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetaCampaign } from "@/lib/meta/graph-api"
import { PauseCircle, PlayCircle, Loader2 } from "lucide-react"

interface TableProps {
  campaigns: MetaCampaign[]
  loading?: boolean
}

export function CampaignsTable({ campaigns: initialCampaigns, loading }: TableProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    setCampaigns(initialCampaigns)
  }, [initialCampaigns])

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading Meta Ad Campaigns...
      </div>
    )
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card">
        No active Meta Ad campaigns found for this ad account.
      </div>
    )
  }

  const handleToggleStatus = async (campaignId: string, currentStatus: string) => {
    setActionLoading(campaignId)
    const newAction = currentStatus === "ACTIVE" ? "pause" : "resume"
    
    try {
      const res = await fetch("/api/meta/campaigns/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, action: newAction })
      })
      const data = await res.json()
      if (data.success) {
        setCampaigns(prev => prev.map(c => 
          c.id === campaignId ? { ...c, status: currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE" } : c
        ))
      }
    } catch (err) {
      console.error("Failed to toggle campaign status", err)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Campaign Name</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Objective</TableHead>
            <TableHead className="font-semibold text-right">Daily Budget</TableHead>
            <TableHead className="font-semibold text-right">Ad Spend</TableHead>
            <TableHead className="font-semibold text-right">Leads</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((c) => {
            const isACTIVE = c.status === "ACTIVE"
            const isLoading = actionLoading === c.id
            return (
              <TableRow key={c.id} className="hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                <TableCell>
                  <Badge variant={isACTIVE ? "default" : "secondary"}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.objective || "LEAD_GENERATION"}
                </TableCell>
                <TableCell className="text-right font-medium">₹{c.daily_budget}</TableCell>
                <TableCell className="text-right font-medium">₹{c.spend}</TableCell>
                <TableCell className="text-right font-medium">{c.leads || 0}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleToggleStatus(c.id, c.status || 'PAUSED')}
                    disabled={isLoading}
                    className="h-8 px-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     isACTIVE ? <PauseCircle className="w-4 h-4 text-amber-500" /> : 
                     <PlayCircle className="w-4 h-4 text-emerald-500" />}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
