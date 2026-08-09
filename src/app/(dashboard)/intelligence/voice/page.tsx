'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, BrainCircuit, Search, TrendingUp, AlertTriangle, MessageSquare, DollarSign, BarChart3, Activity } from 'lucide-react'

// Mock Data for the Enterprise Dashboard
const MOCK_INSIGHTS = [
  { id: '1', category: 'OBJECTION', summary: 'Customers are asking for a money-back guarantee before purchasing.', confidence: 92, impact: 'CRITICAL', revenue_opp: 14500, action: 'CREATE_AD', source: 'WHATSAPP', trend: '+15% this week' },
  { id: '2', category: 'COMPETITOR', summary: 'Mentioning Competitor X pricing is 20% lower.', confidence: 85, impact: 'HIGH', revenue_opp: 8200, action: 'SALES_SCRIPT', source: 'WHATSAPP', trend: '+5% this week' },
  { id: '3', category: 'FEATURE_REQUEST', summary: 'Asking for integration with Shopify.', confidence: 78, impact: 'MEDIUM', revenue_opp: 4000, action: 'CRM_TASK', source: 'WEBSITE_CHAT', trend: 'Stable' },
]

export default function CustomerVoiceCenter() {
  const [mining, setMining] = useState(false)
  const [miningMode, setMiningMode] = useState('schedule')
  const [lookbackDays, setLookbackDays] = useState('7')

  const triggerMining = async () => {
    setMining(true)
    setTimeout(() => {
      toast.success('Enterprise Customer Voice extraction complete. Found 3 new insights.')
      setMining(false)
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Intelligence & Voice</h2>
          <p className="text-muted-foreground">Centralized AI analysis of inbound conversations across all channels.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20">
            <BrainCircuit className="w-3 h-3 mr-1" /> Enterprise NLP Active
          </Badge>
        </div>
      </div>

      {/* Control Panel */}
      <Card className="border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Intelligence Pipeline Settings
          </CardTitle>
          <CardDescription>
            Configure how the AI mines your communications for actionable business intelligence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center bg-background p-3 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2 mr-4">
                <Switch 
                  id="auto-mode" 
                  checked={miningMode !== 'manual'} 
                  onCheckedChange={(c) => setMiningMode(c ? 'schedule' : 'manual')} 
                />
                <Label htmlFor="auto-mode" className="font-semibold cursor-pointer">Autonomous Extraction</Label>
              </div>
              
              {miningMode !== 'manual' && (
                <div className="flex items-center gap-2 border-l pl-4">
                  <Label className="text-xs text-muted-foreground">Trigger By:</Label>
                  <Select value={miningMode} onValueChange={(val) => val && setMiningMode(val)}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schedule">Schedule (Daily)</SelectItem>
                      <SelectItem value="volume">Volume (1,000 msgs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2 border-l pl-4">
                <Label className="text-xs text-muted-foreground">Lookback:</Label>
                <Select value={lookbackDays} onValueChange={(val) => val && setLookbackDays(val)}>
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={triggerMining} 
              disabled={mining}
              className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
            >
              {mining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Mine Cross-Channel Data Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Trends Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-600">
              <TrendingUp className="w-3 h-3 mr-1" /> +3 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Revenue Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$26.7K</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600">
              Based on closing 10% of high-intent objections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Sentiment Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">+0.68</div>
            <p className="text-xs text-muted-foreground mt-1">Scale: -1.0 to 1.0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversations Mined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14,208</div>
            <p className="text-xs text-muted-foreground mt-1">Across 3 channels</p>
          </CardContent>
        </Card>
      </div>

      {/* Insight List */}
      <Card>
        <CardHeader>
          <CardTitle>Top Cross-Channel Insights</CardTitle>
          <CardDescription>AI-generated trends extracted from raw customer communications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_INSIGHTS.map(insight => (
              <div key={insight.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      insight.impact === 'CRITICAL' ? 'border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10' : 
                      insight.impact === 'HIGH' ? 'border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' : ''
                    }>
                      {insight.impact} IMPACT
                    </Badge>
                    <Badge variant="secondary">{insight.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" /> {insight.source}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm">{insight.summary}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center text-emerald-600">
                      <TrendingUp className="w-3 h-3 mr-1" /> {insight.trend}
                    </span>
                    <span className="flex items-center text-indigo-600 font-medium">
                      <DollarSign className="w-3 h-3 mr-1" /> Opp: ${insight.revenue_opp.toLocaleString()}
                    </span>
                    <span>AI Confidence: {insight.confidence}%</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <span className="text-xs text-muted-foreground mb-2">Recommended Action</span>
                  <Badge className="bg-indigo-600">{insight.action}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
