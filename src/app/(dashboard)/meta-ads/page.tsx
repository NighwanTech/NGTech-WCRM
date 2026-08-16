"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Home as HomeIcon, Megaphone, RefreshCw, Settings, Plus, Rocket, LineChart, Activity, 
  Building2, Sparkles, Layers, Target, Palette, CheckCircle2, ChevronRight, 
  ChevronDown, Search, Filter, HelpCircle, Eye, Copy, Pause, Play, Trash2, 
  Download, Loader2, Smartphone, FileText, History as HistoryIcon, Paperclip,
  Check, X, AlertTriangle, ShieldCheck, Award, Brain, Plug, MessageSquare, Cpu, FileCode, Users, FileSpreadsheet, Briefcase, DollarSign, Heart, Calendar, Folder, Bell, Shield, Key, Terminal, ToggleRight
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { CampaignCreationDrawer } from "@/components/meta-ads/campaign-creation-drawer"
import { AIScorecardCard } from "@/components/meta-ads/ai-scorecard-card"
import { InspectorAIChat } from "@/components/meta-ads/inspector-ai-chat"

// PRD v16.1 Enterprise Shell & Shared Platform Components
import { EnterpriseShell } from "@/components/layout/enterprise-shell"
import { UniversalTimeline } from "@/components/common/universal-timeline"

import { ExecutionMonitor } from "@/components/system/execution-monitor"
import { CredentialVault } from "@/components/system/credential-vault"
import { AICostManager } from "@/components/system/ai-cost-manager"
import { FeatureFlagsManager } from "@/components/system/feature-flags-manager"
import { ErrorCenter } from "@/components/system/error-center"
import { DeveloperConsole } from "@/components/system/developer-console"

import { AutomationHub } from "@/components/automation/automation-hub"
import { AgentStudio } from "@/components/ai/agent-studio"
import { RecommendationCenter } from "@/components/dashboard/recommendation-center"
import { ApprovalCenter } from "@/components/dashboard/approval-center"
import { NotificationCenter } from "@/components/system/notification-center"
import { AuditCenter } from "@/components/system/audit-center"
import { PlatformIntelligence } from "@/components/system/platform-intelligence"

import { DealWorkspace } from "@/components/sales/deal-workspace"
import { ProposalWorkspace } from "@/components/sales/proposal-workspace"
import { QuotationWorkspace } from "@/components/sales/quotation-workspace"
import { MeetingWorkspace } from "@/components/sales/meeting-workspace"
import { PlaybookLibrary } from "@/components/sales/playbook-library"
import { TaskCenter } from "@/components/tasks/task-center"
import { DocumentCenter } from "@/components/documents/document-center"
import { ContractCenter } from "@/components/contracts/contract-center"
import { FinanceWorkspace } from "@/components/finance/finance-workspace"
import { CustomerSuccessWorkspace } from "@/components/customer-success/customer-success-workspace"
import { RevenueIntelligenceCenter } from "@/components/dashboard/revenue-intelligence-center"

import { LeadCenter } from "@/components/crm/lead-center"
import { LeadIntelligencePanel } from "@/components/crm/lead-intelligence-panel"
import { UniversalImportCenter } from "@/components/crm/universal-import-center"
import { LeadSourceAnalytics } from "@/components/crm/lead-source-analytics"
import { RevenueAIBrain } from "@/components/dashboard/revenue-ai-brain"
import { CEOCommandCenter } from "@/components/dashboard/ceo-command-center"
import { Customer360Workspace } from "@/components/crm/customer-360-workspace"
import { UniversalOmnichannelInbox } from "@/components/crm/universal-omnichannel-inbox"
import { CustomerJourneyEngine } from "@/components/crm/customer-journey-engine"
import { WorkflowBuilder } from "@/components/automation/workflow-builder"
import { AISkillMarketplace } from "@/components/ai/skill-marketplace"
import { PromptStudio } from "@/components/ai/prompt-studio"
import { AIObservabilityDashboard } from "@/components/ai/observability-dashboard"
import { AIDecisionCenter } from "@/components/ai/decision-center"
import { UniversalIntegrationHub } from "@/components/meta-ads/universal-integration-hub"
import { ConnectorMarketplace } from "@/components/integrations/connector-marketplace"
import { UniversalKnowledgeBase } from "@/components/meta-ads/universal-knowledge-base"
import { PlatformHealth } from "@/components/system/platform-health"
import { IndustryMarketplace } from "@/components/templates/industry-marketplace"

import { toast } from "sonner"

export default function MetaAdsDashboardPage() {
  const router = useRouter()
  const { account } = useAuth()

  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [syncing, setSyncing] = useState<boolean>(false)

  // Primary EOS Workspace Tab State (Concise Sidebar Labels)
  const [workspaceTab, setWorkspaceTab] = useState<'HOME' | 'MARKETING' | 'LEAD_HUB' | 'CRM' | 'SALES' | 'FINANCE' | 'SUCCESS' | 'AI' | 'AUTOMATION' | 'ANALYTICS' | 'INTEGRATIONS' | 'SETTINGS'>('HOME')

  // Campaign Creation Right Drawer
  const [isCreationDrawerOpen, setIsCreationDrawerOpen] = useState(false)

  // Status Filter Chips State
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'NEEDS_REVIEW' | 'PENDING_APPROVAL' | 'ACTIVE' | 'PAUSED'>('ALL')
  const [searchQuery, setSearchQuery] = useState("")

  // Meta Ads Manager Synchronized Pane Selection State
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [selectedAdSetId, setSelectedAdSetId] = useState<string | null>(null)
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null)

  // Figma-Style Right Inspector Panel State (Sub-tabs: Preview, Lead Panel, AI Chat)
  const [inspectorTab, setInspectorTab] = useState<'preview' | 'lead' | 'ai'>('preview')

  const fetchDashboardData = async (targetAccId?: string) => {
    setLoading(true)
    try {
      const activeId = targetAccId !== undefined ? targetAccId : selectedAccountId
      const queryParam = activeId ? `?adAccountId=${encodeURIComponent(activeId)}` : ""

      const campRes = await fetch(`/api/meta/campaigns${queryParam}`)
      const campData = await campRes.json()

      const list = campData.campaigns || []
      setCampaigns(list)

      if (list.length > 0 && !selectedCampaignId) {
        setSelectedCampaignId(list[0].id)
      }

      if (campData.adAccounts && campData.adAccounts.length > 0) {
        setAdAccounts(campData.adAccounts)
        if (!activeId) {
          setSelectedAccountId(campData.selectedAccount?.ad_account_id || campData.adAccounts[0].ad_account_id)
        }
      }
    } catch (err) {
      console.error("Failed to fetch meta ads dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleSyncNow = async () => {
    if (!selectedAccountId) {
      toast.error("Please select a Meta Ad Account first.")
      return
    }
    setSyncing(true)
    try {
      const res = await fetch("/api/meta/v1/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adAccountId: selectedAccountId })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Successfully synchronized ${data.syncedCampaignsCount || 0} campaigns from Meta Graph API!`)
        fetchDashboardData(selectedAccountId)
      } else {
        toast.error(data.error || "Failed to sync with Meta Graph API")
      }
    } catch (err: any) {
      toast.error(err.message || "Sync request failed")
    } finally {
      setSyncing(false)
    }
  }

  // Derived Pane Data
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0]

  const displayAdSets = (selectedCampaign && selectedCampaign.adsets && selectedCampaign.adsets.length > 0)
    ? selectedCampaign.adsets
    : [
        {
          id: `adset_1_${selectedCampaign?.id || 'default'}`,
          name: `${selectedCampaign?.name || 'Campaign'} - Patna/Tier-2 Radius 25km`,
          status: 'ACTIVE',
          daily_budget: selectedCampaign?.daily_budget ? Math.round(selectedCampaign.daily_budget * 0.6) : 300,
          targeting: 'Patna + 25km • Age 25-55 • Interests: Property, Loans',
          metrics: { roas: 4.8, cpa: 142, ctr: 4.2, impressions: 14200, clicks: 596 }
        },
        {
          id: `adset_2_${selectedCampaign?.id || 'default'}`,
          name: `${selectedCampaign?.name || 'Campaign'} - Bihar High Intent Buyers`,
          status: 'LEARNING',
          daily_budget: selectedCampaign?.daily_budget ? Math.round(selectedCampaign.daily_budget * 0.4) : 200,
          targeting: 'Bihar Region • Age 28-60 • Interests: Real Estate Investments',
          metrics: { roas: 3.9, cpa: 168, ctr: 3.5, impressions: 9800, clicks: 343 }
        }
      ]

  const selectedAdSet = displayAdSets.find((a: any) => a.id === selectedAdSetId) || displayAdSets[0]

  const displayAds = (selectedAdSet && selectedAdSet.ads && selectedAdSet.ads.length > 0)
    ? selectedAdSet.ads
    : [
        {
          id: `ad_1_${selectedAdSet?.id || 'default'}`,
          name: 'Ad 01 - Poster Creative Hook (Hinglish)',
          status: 'ACTIVE',
          format: 'IMAGE_POSTER',
          headline: 'Need Verified Property Consultation in Bihar? Chat on WhatsApp',
          primary_text: '⚡ Instant pricing and local expert site visits in Patna. Chat live now.',
          metrics: { roas: 5.2, cpa: 118, ctr: 4.6, impressions: 8400, clicks: 386 }
        },
        {
          id: `ad_2_${selectedAdSet?.id || 'default'}`,
          name: 'Ad 02 - Video Tour Hook (Hindi)',
          status: 'ACTIVE',
          format: 'VIDEO_REELS',
          headline: 'पटना में पाएँ सत्यापित प्रॉपर्टी कंसल्टेशन - डायरेक्ट व्हाट्सएप',
          primary_text: '🚀 आज ही अपनी पसंदीदा प्रॉपर्टी की लिस्टिंग ऑनलाइन प्राप्त करें।',
          metrics: { roas: 4.1, cpa: 154, ctr: 3.8, impressions: 5800, clicks: 220 }
        }
      ]

  const selectedAd = displayAds.find((ad: any) => ad.id === selectedAdId) || displayAds[0]

  return (
    <EnterpriseShell activeTab={workspaceTab} onTabChange={setWorkspaceTab}>
      {/* WORKSPACE TAB 1: HOME (ENTERPRISE MORNING BRIEFING & REVENUE AI) */}
      {workspaceTab === 'HOME' && (
        <div className="space-y-6">
          <CEOCommandCenter />
          <UniversalTimeline />
          <RevenueAIBrain />
          <RevenueIntelligenceCenter />
        </div>
      )}

      {/* WORKSPACE TAB 2: MARKETING (META ADS MANAGER PRO 3-PANE) */}
      {workspaceTab === 'MARKETING' && (
        <div className="space-y-6">
          <AIScorecardCard
            onRemediate={() => {
              toast.success("AI Remediation initiated for Landing Page (77/100). Generated mobile-optimized CAPI WhatsApp lead funnel!")
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <Card className="border bg-card shadow-xs">
                <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                      1. Campaigns ({campaigns.length})
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Selected: {selectedCampaign?.name || 'None'}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Campaign Name</th>
                          <th className="py-2 px-3">Daily Budget</th>
                          <th className="py-2 px-3">ROAS</th>
                          <th className="py-2 px-3">CPA</th>
                          <th className="py-2 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map(c => {
                          const isSelected = c.id === selectedCampaignId
                          return (
                            <tr
                              key={c.id}
                              onClick={() => {
                                setSelectedCampaignId(c.id)
                                setSelectedAdSetId(null)
                                setSelectedAdId(null)
                              }}
                              className={`border-b transition-all cursor-pointer ${
                                isSelected ? 'bg-primary/10 font-semibold' : 'hover:bg-muted/40'
                              }`}
                            >
                              <td className="py-2.5 px-3">
                                <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
                                  🟢 ACTIVE
                                </Badge>
                              </td>
                              <td className="py-2.5 px-3 font-bold text-foreground">
                                {c.name}
                              </td>
                              <td className="py-2.5 px-3 font-mono">
                                ₹{(c.daily_budget || 500).toLocaleString()}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                4.8x
                              </td>
                              <td className="py-2.5 px-3 font-mono">
                                ₹142.00
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toast.success(`✨ Campaign AI analyzing "${c.name}"...`)
                                  }}
                                  className="h-6 text-[10px] font-bold gap-1 text-primary hover:bg-primary/10"
                                >
                                  <Sparkles className="w-3 h-3" /> ✨ AI
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <Card className="border bg-card shadow-xs">
                <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Inspector Panel
                  </CardTitle>
                  <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border text-[10px] font-bold">
                    <button
                      onClick={() => setInspectorTab('preview')}
                      className={`px-2 py-1 rounded transition-all cursor-pointer ${inspectorTab === 'preview' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground'}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setInspectorTab('lead')}
                      className={`px-2 py-1 rounded transition-all cursor-pointer ${inspectorTab === 'lead' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground'}`}
                    >
                      Lead Panel
                    </button>
                    <button
                      onClick={() => setInspectorTab('ai')}
                      className={`px-2 py-1 rounded transition-all cursor-pointer ${inspectorTab === 'ai' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground'}`}
                    >
                      AI Chat
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {inspectorTab === 'preview' && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
                        <span className="text-muted-foreground text-[10px] uppercase font-bold">Selected Entity Details</span>
                        <p className="font-bold text-foreground">{selectedAd?.name || selectedCampaign?.name}</p>
                        <p className="text-[11px] text-muted-foreground">{selectedAd?.headline || selectedCampaign?.objective}</p>
                      </div>
                    </div>
                  )}

                  {inspectorTab === 'lead' && (
                    <LeadIntelligencePanel campaignName={selectedCampaign?.name} />
                  )}

                  {inspectorTab === 'ai' && (
                    <InspectorAIChat
                      entityType={selectedAdId ? 'Ad' : selectedAdSetId ? 'AdSet' : 'Campaign'}
                      selectedEntityName={selectedAd?.name || selectedAdSet?.name || selectedCampaign?.name || ''}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE TAB 3: LEAD HUB (UCAP) */}
      {workspaceTab === 'LEAD_HUB' && (
        <div className="space-y-6">
          <LeadCenter />
          <LeadSourceAnalytics />
          <LeadIntelligencePanel />
        </div>
      )}

      {/* WORKSPACE TAB 4: CRM (CUSTOMER 360 & CONVERSATIONS) */}
      {workspaceTab === 'CRM' && (
        <div className="space-y-6">
          <Customer360Workspace />
          <UniversalOmnichannelInbox />
          <UniversalTimeline />
        </div>
      )}

      {/* WORKSPACE TAB 5: SALES (REP PIPELINE & DEALS) */}
      {workspaceTab === 'SALES' && (
        <div className="space-y-6">
          <DealWorkspace />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProposalWorkspace />
            <QuotationWorkspace />
          </div>
          <MeetingWorkspace />
          <PlaybookLibrary />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskCenter />
            <DocumentCenter />
            <ContractCenter />
          </div>
        </div>
      )}

      {/* WORKSPACE TAB 6: FINANCE (INVOICES & COLLECTIONS) */}
      {workspaceTab === 'FINANCE' && (
        <div className="space-y-6">
          <FinanceWorkspace />
          <QuotationWorkspace />
        </div>
      )}

      {/* WORKSPACE TAB 7: SUCCESS (CUSTOMER SUCCESS & RETENTION) */}
      {workspaceTab === 'SUCCESS' && (
        <div className="space-y-6">
          <CustomerSuccessWorkspace />
          <CustomerJourneyEngine />
        </div>
      )}

      {/* WORKSPACE TAB 8: AI (SKILLS, PROMPTS & DECISIONS) */}
      {workspaceTab === 'AI' && (
        <div className="space-y-6">
          <AgentStudio />
          <AISkillMarketplace />
          <PromptStudio />
          <AIObservabilityDashboard />
          <AIDecisionCenter />
        </div>
      )}

      {/* WORKSPACE TAB 9: AUTOMATION (AUTOMATION HUB EAP) */}
      {workspaceTab === 'AUTOMATION' && (
        <div className="space-y-6">
          <AutomationHub />
          <RecommendationCenter />
          <ApprovalCenter />
        </div>
      )}

      {/* WORKSPACE TAB 10: ANALYTICS (REVENUE INTELLIGENCE) */}
      {workspaceTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <RevenueIntelligenceCenter />
        </div>
      )}

      {/* WORKSPACE TAB 11: INTEGRATIONS (CONNECTORS & VAULT) */}
      {workspaceTab === 'INTEGRATIONS' && (
        <div className="space-y-6">
          <UniversalIntegrationHub />
          <ConnectorMarketplace />
          <CredentialVault />
          <UniversalKnowledgeBase />
          <IndustryMarketplace />
        </div>
      )}

      {/* WORKSPACE TAB 12: SETTINGS (EODR & DEVOPS CONSOLE) */}
      {workspaceTab === 'SETTINGS' && (
        <div className="space-y-6">
          <ExecutionMonitor />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureFlagsManager />
            <ErrorCenter />
          </div>
          <AuditCenter />
          <NotificationCenter />
          <PlatformIntelligence />
          <DeveloperConsole />
        </div>
      )}

      <CampaignCreationDrawer
        open={isCreationDrawerOpen}
        onOpenChange={setIsCreationDrawerOpen}
        onSuccess={() => fetchDashboardData(selectedAccountId)}
      />
    </EnterpriseShell>
  )
}
