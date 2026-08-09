"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, RefreshCw, Activity, Layers, AlertCircle } from "lucide-react"

export default function AdminMetaAdsGovernancePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAccounts: 0,
    queuedEvents: 0,
    processedEvents: 0,
    failedEvents: 0,
  })

  const fetchGovernanceStats = async () => {
    setLoading(true)
    setTimeout(() => {
      setStats({
        totalAccounts: 1,
        queuedEvents: 0,
        processedEvents: 12,
        failedEvents: 0,
      })
      setLoading(false)
    }, 600)
  }

  useEffect(() => {
    fetchGovernanceStats()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Superadmin Meta Ads Governance</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Global monitoring of Meta Ad Accounts, Webhook Health Queue, and CAPI Delivery across all tenant workspaces.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchGovernanceStats} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Status
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Connected Accounts</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalAccounts}</h3>
            </div>
            <Layers className="w-8 h-8 text-blue-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Processed Queue</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600">{stats.processedEvents}</h3>
            </div>
            <Activity className="w-8 h-8 text-emerald-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pending Queue</p>
              <h3 className="text-2xl font-bold mt-1 text-amber-600">{stats.queuedEvents}</h3>
            </div>
            <RefreshCw className="w-8 h-8 text-amber-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Failed Events</p>
              <h3 className="text-2xl font-bold mt-1 text-rose-600">{stats.failedEvents}</h3>
            </div>
            <AlertCircle className="w-8 h-8 text-rose-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* Webhook Queue Monitoring */}
      <Card className="border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Webhook Queue Health Monitor</CardTitle>
          <CardDescription>
            Fault-tolerant event queue monitoring for incoming Meta Lead Ads & Click-to-WhatsApp webhooks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Queue ID</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retry Count</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs">q_meta_102938475</TableCell>
                <TableCell className="text-sm font-medium">leadgen (Page Lead)</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-emerald-600">
                    Processed
                  </Badge>
                </TableCell>
                <TableCell>0</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">Just now</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
