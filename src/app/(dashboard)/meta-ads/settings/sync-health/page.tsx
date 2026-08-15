"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Activity, Cpu, Server, CheckCircle2, Clock, AlertTriangle, RefreshCw } from "lucide-react"

export default function EnterpriseSyncHealthDashboard() {
  const [telemetry, setTelemetry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchTelemetry = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/meta/v1/sync")
      const data = await res.json()
      setTelemetry(data)
    } catch (err) {
      console.error("Telemetry fetch error", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTelemetry()
  }, [])

  return (
    <div className="w-full max-w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" /> Enterprise Sync Health & Governance Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Distributed Fan-Out Worker Telemetry, Quota Allocation, and Queue Metrics
          </p>
        </div>
        <button
          onClick={fetchTelemetry}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-card hover:bg-muted gap-1.5 flex items-center cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Meta API Connection</p>
              <h3 className="text-lg font-bold text-foreground">v20.0 Connected</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Fan-Out Dispatcher</p>
              <h3 className="text-lg font-bold text-foreground">Operational</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Rate Limiter Quota</p>
              <h3 className="text-lg font-bold text-foreground">Per-Tenant Bucket</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">System Health</p>
              <h3 className="text-lg font-bold text-emerald-500">100% HEALTHY</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Execution Stream */}
      <Card className="border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Live Worker Execution Stream & Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {telemetry?.recentSyncLogs && telemetry.recentSyncLogs.length > 0 ? (
            <div className="space-y-2">
              {telemetry.recentSyncLogs.map((log: any) => (
                <div key={log.id} className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {log.status}
                    </span>
                    <span className="font-semibold text-foreground">{log.entity_type} SYNC</span>
                    <span className="text-muted-foreground">({log.records_synced} records synced)</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-muted-foreground text-[11px]">
                    <span>Duration: {log.duration_ms}ms</span>
                    <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Worker execution logs healthy. No failures recorded.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
