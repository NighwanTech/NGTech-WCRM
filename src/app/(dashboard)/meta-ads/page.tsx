"use client"

import { useEffect, useState } from "react"
import { CampaignMetricsCards } from "@/components/meta-ads/campaign-metrics-card"
import { CampaignsTable } from "@/components/meta-ads/campaigns-table"
import { AIInsightsPanel } from "@/components/meta-ads/ai-insights-panel"
import { AdFunnelView } from "@/components/meta-ads/ad-funnel-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, RefreshCw, Settings, FileText, Plus, Rocket, Image as ImageIcon, LineChart, BrainCircuit, Activity, Building2, Palette, Target, Sparkles, BookOpen, FlaskConical, GitCommit } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { MetaCampaign } from "@/lib/meta/graph-api"
import { MetaAdsHeader } from "@/components/meta-ads/meta-ads-header"

export default function MetaAdsDashboardPage() {
  const { account } = useAuth()
  const workspaceId = account?.id

  const [connected, setConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [timeRangeDays, setTimeRangeDays] = useState<number>(30)
  const [syncing, setSyncing] = useState<boolean>(false)

  const fetchDashboardData = async (targetAccId?: string, rangeDays = timeRangeDays) => {
    setLoading(true)
    try {
      const activeId = targetAccId !== undefined ? targetAccId : selectedAccountId
      const queryParam = activeId ? `?adAccountId=${encodeURIComponent(activeId)}` : ""

      const [campRes, anaRes] = await Promise.all([
        fetch(`/api/meta/campaigns${queryParam}`),
        fetch(`/api/meta/analytics?days=${rangeDays}${queryParam ? `&${queryParam.slice(1)}` : ""}`)
      ])
      
      const campData = await campRes.json()
      const anaData = await anaRes.json()

      setConnected(campData.connected)
      setCampaigns(campData.campaigns || [])
      setAnalytics(anaData.analytics || null)

      if (campData.adAccounts && campData.adAccounts.length > 0) {
        setAdAccounts(campData.adAccounts)
        if (!activeId) {
          setSelectedAccountId(campData.selectedAccount?.ad_account_id || campData.adAccounts[0].ad_account_id)
        }
      }
    } catch (err) {
      console.error("Failed to fetch meta ads dashboard data:", err)
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncNow = async () => {
    setSyncing(true)
    try {
      await fetch('/api/meta/v1/sync', { method: 'POST' })
      await fetchDashboardData()
    } catch (err) {
      console.error("Failed to trigger sync", err)
    } finally {
      setSyncing(false)
    }
  }

  const handleAccountChange = (newAccId: string) => {
    setSelectedAccountId(newAccId)
    fetchDashboardData(newAccId)
  }

  useEffect(() => {
    fetchDashboardData(undefined, timeRangeDays)
  }, [timeRangeDays])

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
    <div className="w-full max-w-full min-w-0 space-y-6">
      <MetaAdsHeader
        title="Enterprise Campaign Operating System"
        description="Unified Campaign Workspace: Strategy → Audience → Creative → Review → Campaign Studio → WhatsApp Lead → CRM Deal → Net ROI"
        icon={Megaphone}
        breadcrumbs={[]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {adAccounts.length > 0 && (
              <div className="flex items-center gap-2 bg-muted/70 px-3 py-1.5 rounded-xl border shadow-2xs">
                <Building2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground font-semibold shrink-0">Account:</span>
                <select
                  value={selectedAccountId}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer max-w-[200px] truncate"
                >
                  {adAccounts.map((acc) => (
                    <option key={acc.id || acc.ad_account_id} value={acc.ad_account_id} className="bg-popover text-popover-foreground">
                      {acc.account_name || acc.ad_account_id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-muted/70 px-2.5 py-1.5 rounded-xl border shadow-2xs">
              <span className="text-xs text-muted-foreground font-semibold shrink-0">Range:</span>
              <select
                value={timeRangeDays}
                onChange={(e) => setTimeRangeDays(parseInt(e.target.value, 10))}
                className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value={7} className="bg-popover text-popover-foreground">Last 7 Days</option>
                <option value={30} className="bg-popover text-popover-foreground">Last 30 Days</option>
                <option value={90} className="bg-popover text-popover-foreground">Last 90 Days</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncNow}
              disabled={syncing}
              className="gap-1.5 text-xs h-9 font-semibold text-primary border-primary/30 hover:bg-primary/5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Now"}
            </Button>

            <Link href="/meta-ads/settings">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9 font-semibold text-foreground border-border hover:bg-muted">
                <Settings className="w-3.5 h-3.5 text-muted-foreground" /> Settings
              </Button>
            </Link>

            <Link href={selectedAccountId ? `/meta-ads/create?adAccountId=${selectedAccountId}` : `/meta-ads/create`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-xs text-xs h-9">
                <Rocket className="w-4 h-4" /> Create Ad with AI
              </Button>
            </Link>
          </div>
        }
      />

      {/* AI OS Modules Navigation Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2 sm:gap-3">
        <Link href="/meta-ads/copilot">
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-primary/10 border-primary/30 text-primary">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-bold text-[11px]">AI Copilot</span>
          </Button>
        </Link>
        <Link href="/meta-ads/decision-ledger">
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400">
            <GitCommit className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-[11px]">Decision Ledger</span>
          </Button>
        </Link>
        <Link href="/meta-ads/create">
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-muted/50 border-dashed">
            <Rocket className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-[11px]">AI Studio</span>
          </Button>
        </Link>
        <Link href={campaigns && campaigns.length > 0 ? `/meta-ads/campaign/${campaigns[0].id}?tab=creative` : `/meta-ads/creative-studio`}>
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-muted/50 border-dashed">
            <Palette className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-[11px]">Creative Studio</span>
          </Button>
        </Link>
        <Link href={campaigns && campaigns.length > 0 ? `/meta-ads/campaign/${campaigns[0].id}?tab=audience` : `/meta-ads/audience-studio`}>
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-muted/50 border-dashed">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-[11px]">Audience Studio</span>
          </Button>
        </Link>
        <Link href="/meta-ads/prompt-studio">
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-muted/50 border-dashed">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-[11px]">Prompt Studio</span>
          </Button>
        </Link>
        <Link href="/meta-ads/knowledge-base">
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-muted/50 border-dashed">
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span className="font-bold text-[11px]">Knowledge Base</span>
          </Button>
        </Link>
        <Link href="/meta-ads/experiments">
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-muted/50 border-dashed">
            <FlaskConical className="w-4 h-4 text-pink-600" />
            <span className="font-bold text-[11px]">Experiment Lab</span>
          </Button>
        </Link>
        <Link href="/meta-ads/settings/sync-health">
          <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center justify-center gap-1 hover:bg-muted/50 border-dashed">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-[11px]">Sync Health</span>
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
          <CardTitle className="text-xl font-bold">
            {selectedAccountId ? (
              <span>Campaigns for <span className="text-primary font-mono text-base">{adAccounts.find(a => a.ad_account_id === selectedAccountId)?.account_name || selectedAccountId}</span></span>
            ) : (
              "Active Meta Ad Campaigns"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignsTable campaigns={campaigns} loading={loading} adAccountId={selectedAccountId} />
        </CardContent>
      </Card>
    </div>
  )
}
