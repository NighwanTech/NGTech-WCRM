"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, RefreshCw, Activity, Layers, AlertCircle, Inbox } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface QueueJobItem {
  id: string
  job_type: string
  status: string
  retry_count: number
  created_at: string
}

export default function AdminMetaAdsGovernancePage() {
  const [loading, setLoading] = useState(true)
  const [queueJobs, setQueueJobs] = useState<QueueJobItem[]>([])
  const [stats, setStats] = useState({
    totalAccounts: 0,
    queuedEvents: 0,
    processedEvents: 0,
    failedEvents: 0,
  })

  const fetchGovernanceStats = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // 1. Fetch connected Meta Ad Accounts count
      const { count: accountsCount } = await supabase
        .from("meta_ad_accounts")
        .select("*", { count: "exact", head: true })

      // 2. Fetch real queue jobs
      const { data: jobs } = await supabase
        .from("meta_queue_jobs")
        .select("id, job_type, status, retry_count, created_at")
        .order("created_at", { ascending: false })
        .limit(20)

      const jobList: QueueJobItem[] = jobs || []
      setQueueJobs(jobList)

      const queued = jobList.filter(j => j.status === 'pending' || j.status === 'queued').length
      const processed = jobList.filter(j => j.status === 'completed' || j.status === 'processed').length
      const failed = jobList.filter(j => j.status === 'failed' || j.status === 'error').length

      setStats({
        totalAccounts: accountsCount || 0,
        queuedEvents: queued,
        processedEvents: processed,
        failedEvents: failed,
      })
    } catch (err) {
      console.warn("Failed to fetch meta ads governance stats:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGovernanceStats()
  }, [fetchGovernanceStats])

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
              {queueJobs.length > 0 ? (
                queueJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">{job.id.slice(0, 14)}...</TableCell>
                    <TableCell className="text-sm font-medium">{job.job_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={
                          job.status === "completed" || job.status === "processed"
                            ? "bg-emerald-600"
                            : job.status === "failed" || job.status === "error"
                            ? "bg-rose-600"
                            : "bg-amber-600"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.retry_count || 0}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(job.created_at).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="space-y-1">
                      <Inbox className="w-6 h-6 mx-auto opacity-50 text-muted-foreground" />
                      <p className="font-medium text-xs text-foreground">No Webhook Events in Queue</p>
                      <p className="text-[11px] text-muted-foreground">
                        Incoming Meta Lead Gen and Click-to-WhatsApp webhook events will stream here live.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
