"use client"

import { useEffect, useState } from "react"
import { CampaignMetricsCards } from "@/components/meta-ads/campaign-metrics-card"
import { CampaignsTable } from "@/components/meta-ads/campaigns-table"
import { AIInsightsPanel } from "@/components/meta-ads/ai-insights-panel"
import { AdFunnelView } from "@/components/meta-ads/ad-funnel-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, RefreshCw, Settings, FileText, Plus, Sparkles, Rocket, Image as ImageIcon, LineChart, BrainCircuit, Activity } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { MetaCampaign } from "@/lib/meta/graph-api"

export default function MetaAdsDashboardPage() {
  const { account } = useAuth()
  const workspaceId = account?.id

  const [connected, setConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [campRes, anaRes] = await Promise.all([
        fetch(`/api/meta/campaigns`),
        fetch(`/api/meta/analytics?days=30`)
      ])
      
      const campData = await campRes.json()
      const anaData = await anaRes.json()

      setConnected(campData.connected)
      setCampaigns(campData.campaigns || [])
      setAnalytics(anaData.analytics || null)
    } catch (err) {
      console.error("Failed to fetch meta ads dashboard data:", err)
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Aggregate metrics fallback if analytics missing
  const totalSpend = analytics?.totalSpend || 0
  const totalClicks = analytics?.clicks || 0
  const totalLeads = analytics?.crmLeads || 0
  const cpl = analytics?.cpl || 0
  const roas = analytics?.roas || 0
  const whatsappChats = analytics?.whatsappChats || 0
  const dealsWon = analytics?.dealsWon || 0
  const impressions = analytics?.impressions || 0

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Meta Ads OS</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Autonomous Meta Ad creation, Click-to-WhatsApp attribution, and end-to-end CRM sales tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/meta-ads/create">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-md">
              <Rocket className="w-4 h-4" /> Create Ad with AI
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Link href="/meta-ads/lead-forms">
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="w-4 h-4" /> Lead Forms
            </Button>
          </Link>
          <Link href="/meta-ads/settings">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* AI OS Modules Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/meta-ads/assets">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 border-dashed">
            <ImageIcon className="w-6 h-6 text-purple-500" />
            <span className="font-semibold text-sm">Asset Library</span>
          </Button>
        </Link>
        <Link href="/meta-ads/analytics">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 border-dashed">
            <LineChart className="w-6 h-6 text-emerald-500" />
            <span className="font-semibold text-sm">Predictive Analytics</span>
          </Button>
        </Link>
        <Link href="/meta-ads/decisions">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 border-dashed">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            <span className="font-semibold text-sm">Decision Center</span>
          </Button>
        </Link>
        <Link href="/meta-ads/ops">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 border-dashed">
            <Activity className="w-6 h-6 text-amber-500" />
            <span className="font-semibold text-sm">Operations Center</span>
          </Button>
        </Link>
      </div>

      {/* Connection Notice if disconnected */}
      {connected === false && (
        <Card className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-base">Meta Ad Account Not Connected</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Connect your Facebook Business Manager to start tracking Lead Ads and Click-to-WhatsApp performance.
              </p>
            </div>
            <Link href="/meta-ads/settings">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                <Plus className="w-4 h-4" /> Connect Facebook Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <CampaignMetricsCards
        totalSpend={totalSpend}
        totalLeads={totalLeads}
        totalClicks={totalClicks}
        totalConversations={whatsappChats}
        cpl={cpl}
        roas={roas}
      />

      {/* Sales Conversion Funnel */}
      <AdFunnelView
        impressions={impressions}
        clicks={totalClicks}
        whatsappChats={whatsappChats}
        crmLeads={totalLeads}
        dealsWon={dealsWon}
      />

      {/* AI Insights & Optimization Panel */}
      <AIInsightsPanel />

      {/* Campaigns Table */}
      <Card className="border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Active Meta Ad Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignsTable campaigns={campaigns} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
