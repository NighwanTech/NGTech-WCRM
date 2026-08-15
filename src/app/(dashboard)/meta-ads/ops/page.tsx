'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, Activity, Coins, TrendingUp, ShieldCheck, DatabaseZap, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RulesManager } from '@/components/meta-ads/rules-manager'

import { MetaAdsHeader } from '@/components/meta-ads/meta-ads-header'

export default function AIOperationsCenter() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    accuracyScore: 94.8,
    successRate: 96.5,
    totalTokensUsed: 14500,
    estimatedCost: 0.05,
    activeRules: 0,
    apiHealth: '99.9% Nominal',
  })
  const [recentLogs, setRecentLogs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/meta/ops')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.stats) setStats(data.stats)
          if (data.recentLogs) setRecentLogs(data.recentLogs)
        }
      })
      .catch((err) => console.error('Failed to fetch ops data:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <MetaAdsHeader
        title="AI Operations & Learning Center"
        description="Monitor AI token performance, cost governance, autonomous rules, and Graph API telemetry."
        icon={Activity}
        breadcrumbs={[{ label: 'Operations & Rules' }]}
        actions={
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 font-bold text-xs">
              <Activity className="w-3 h-3 mr-1" /> {stats.apiHealth}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 font-bold text-xs">
              <ShieldCheck className="w-3 h-3 mr-1" /> Governance Active
            </Badge>
          </div>
        }
      />

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">AI Accuracy Score</CardTitle>
            <Brain className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${stats.accuracyScore}%`}
            </div>
            <p className="text-xs text-white/80 mt-1">Calculated via live decision feedback</p>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendation Success</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : `${stats.successRate}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved by workspace managers</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Token Governance</CardTitle>
            <Coins className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : `$${stats.estimatedCost.toFixed(2)}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stats.totalTokensUsed.toLocaleString()} tokens consumed</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Optimization Rules</CardTitle>
            <DatabaseZap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : stats.activeRules}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live autonomous safety rules</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost vs Budget Chart */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <CardTitle>AI Execution Cost vs Budget</CardTitle>
            <CardDescription>Monthly token allocation & cost control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Token Budget</span>
                <span className="font-semibold text-foreground">12% Used</span>
              </div>
              <Progress value={12} className="h-2 bg-primary/10 [&>div]:bg-primary" />
            </div>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border">
                <div className="text-xs text-muted-foreground mb-1">Primary AI Engine</div>
                <div className="font-bold text-foreground">Gemini 1.5 Pro & Groq</div>
                <div className="text-xs text-muted-foreground mt-0.5">High-speed reasoning & copy generation</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Cost Efficiency</div>
                <div className="font-bold">Active Cost Gating</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Cached requests prevent token waste</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Agent Audit Log */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Real-Time Audit Log</CardTitle>
            <CardDescription>Live execution trace & safety checks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-foreground">{log.action}</span>
                    <span className="text-[10px] text-muted-foreground">{log.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] text-muted-foreground">{log.agent}</span>
                    <Badge variant="outline" className="text-[10px] py-0 text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embedded Live Optimization Rules Manager */}
      <div className="pt-2">
        <RulesManager />
      </div>
    </div>
  )
}
