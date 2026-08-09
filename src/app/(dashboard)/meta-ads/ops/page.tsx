'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, Activity, Coins, TrendingUp, AlertTriangle, ShieldCheck, DatabaseZap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AIOperationsCenter() {
  const [loading, setLoading] = useState(true)

  // Mock data for Phase 8 demonstration
  const stats = {
    accuracyScore: 88.5, // The post-execution mathematically proven accuracy
    successRate: 94.2,   // Percentage of decisions approved vs rejected
    totalTokensUsed: 1450200,
    estimatedCost: 29.00, // $29.00
    kbGrowth: 412, // Number of insights in KB
    apiHealth: '99.9%',
  }

  const recentLogs = [
    { time: '2 mins ago', agent: 'Visual AI Engine', action: 'Generate Image', cost: '0.040', status: 'SUCCESS' },
    { time: '1 hr ago', agent: 'Predictive Analytics', action: 'Lead Scoring', cost: '0.012', status: 'SUCCESS' },
    { time: '3 hrs ago', agent: 'Autonomous Agent', action: 'Simulate Scaling', cost: '0.018', status: 'SUCCESS' },
    { time: '1 day ago', agent: 'Autonomous Agent', action: 'Budget Enforcer Block', cost: '0.000', status: 'BLOCKED (Safety Limit)' },
    { time: '2 days ago', agent: 'Measurement Worker', action: 'Calculate Accuracy', cost: '0.000', status: 'SUCCESS (Score: 91%)' },
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading AI Operations Center...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/meta-ads">
            <Button variant="outline" size="sm" className="hidden md:flex">
              &larr; Back to Dashboard
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AI Operations & Learning Center</h2>
            <p className="text-muted-foreground">Monitor AI performance, cost governance, and model accuracy.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Activity className="w-3 h-3 mr-1" /> All Systems Nominal
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <ShieldCheck className="w-3 h-3 mr-1" /> Governance Active
          </Badge>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">AI Accuracy Score</CardTitle>
            <Brain className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.accuracyScore}%</div>
            <p className="text-xs text-white/70 mt-1">Calculated via post-execution diff</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendation Success</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Approved by human managers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Governance</CardTitle>
            <Coins className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.estimatedCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.totalTokensUsed.toLocaleString()} tokens consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base Growth</CardTitle>
            <DatabaseZap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.kbGrowth}</div>
            <p className="text-xs text-muted-foreground mt-1">Active lessons stored</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost vs Budget Chart (Simulated) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Execution Cost vs Budget</CardTitle>
            <CardDescription>Monthly token allocation tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Token Budget</span>
                <span className="font-medium">58% Used</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Most Expensive Agent</div>
                <div className="font-semibold">Visual AI Engine</div>
                <div className="text-xs text-muted-foreground">Accounts for 65% of costs</div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 text-emerald-900">
                <div className="text-sm text-emerald-700 mb-1">Estimated Cost Savings</div>
                <div className="font-semibold">$450 / mo</div>
                <div className="text-xs text-emerald-600">Saved by Rule-Based Gating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Agent Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Audit Log</CardTitle>
            <CardDescription>Live execution trace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{log.action}</span>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{log.agent}</span>
                    <Badge variant="outline" className={log.status.includes('BLOCKED') ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-emerald-600 border-emerald-200 bg-emerald-50'}>
                      {log.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cost: ${log.cost}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
