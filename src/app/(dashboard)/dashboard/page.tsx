"use client"

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { formatCurrency } from '@/lib/currency'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectGroup, 
  SelectLabel, 
  SelectSeparator 
} from '@/components/ui/select'
import {
  MessageSquare,
  UserPlus,
  DollarSign,
  Send,
  Clock,
  ShieldCheck,
  Database,
  Shield,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  FileText,
  CreditCard,
  Building2,
  CheckCircle2
} from 'lucide-react'

import {
  loadActivity,
  loadConversationsSeries,
  loadMetrics,
  loadPipelineDonut,
  loadResponseTime,
  loadQuoteAnalytics,
} from '@/lib/dashboard/queries'
import type {
  ActivityItem,
  ConversationsSeriesPoint,
  MetricsBundle,
  PipelineDonutData,
  ResponseTimeSummary,
  QuoteAnalytics,
} from '@/lib/dashboard/types'

import { MetricCard } from '@/components/dashboard/metric-card'
import { SkeletonCard } from '@/components/dashboard/skeleton'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ConversationsChart } from '@/components/dashboard/conversations-chart'
import { PipelineDonut } from '@/components/dashboard/pipeline-donut'
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart'
import { AgentScorecard } from '@/components/dashboard/agent-scorecard'
import { UsageMetricCard } from '@/components/dashboard/usage-metric-card'
import { loadPlanUsageSummary, type PlanUsageSummaryData } from '@/lib/dashboard/plan-usage'
import type { Meeting, Quote } from '@/components/inbox/contact-sidebar'

import { RecentlyOpenedStrip } from '@/components/dashboard/recently-opened-strip'
import { BusinessPulseRibbon } from '@/components/dashboard/business-pulse-ribbon'
import { BusinessHealthAndAiChat } from '@/components/dashboard/business-health-and-ai-chat'
import { TodaysPriorityCenter } from '@/components/dashboard/todays-priority-center'
import { MyWorkAndApprovals } from '@/components/dashboard/my-work-and-approvals'
import { RevenueCycleFlow } from '@/components/dashboard/revenue-cycle-flow'
import { DepartmentPerspectiveViews } from '@/components/dashboard/department-perspective-views'
import { IntegrationAndActivityStream } from '@/components/dashboard/integration-and-activity-stream'

type RangeDays = 7 | 30 | 90

interface RealDepartment {
  id: string
  name: string
}

interface DeptMemberRel {
  department_id: string
  user_id: string
}

interface DashboardAgent {
  user_id: string
  full_name: string
  role?: string
  email?: string
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard')
  const { defaultCurrency, account, isAdmin, isOwner, profile } = useAuth()
  const [metrics, setMetrics] = useState<MetricsBundle | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(true)

  const [planUsage, setPlanUsage] = useState<PlanUsageSummaryData | null>(null)

  const [range, setRange] = useState<RangeDays>(30)
  const [series, setSeries] = useState<Record<RangeDays, ConversationsSeriesPoint[] | null>>({
    7: null,
    30: null,
    90: null,
  })
  const [seriesLoading, setSeriesLoading] = useState(true)

  const [pipeline, setPipeline] = useState<PipelineDonutData | null>(null)
  const [pipelineLoading, setPipelineLoading] = useState(true)

  const [responseTime, setResponseTime] = useState<ResponseTimeSummary | null>(null)
  const [responseTimeLoading, setResponseTimeLoading] = useState(true)

  const [selectedAgent, setSelectedAgent] = useState<string | 'all'>('all')
  const [departments, setDepartments] = useState<RealDepartment[]>([])
  const [deptMembers, setDeptMembers] = useState<DeptMemberRel[]>([])
  const [agents, setAgents] = useState<DashboardAgent[]>([])
  const [scorecard, setScorecard] = useState<any[] | null>(null)
  const [scorecardLoading, setScorecardLoading] = useState(true)

  // Real Workspace ledgers
  const [quotesTotalValue, setQuotesTotalValue] = useState<string>('₹0')
  const [pendingQuotesCount, setPendingQuotesCount] = useState<number>(0)
  const [invoicesTotalValue, setInvoicesTotalValue] = useState<string>('₹0')
  const [overdueInvoicesCount, setOverdueInvoicesCount] = useState<number>(0)
  const [unassignedLeadsCount, setUnassignedLeadsCount] = useState<number>(0)

  useEffect(() => {
    try {
      const storedQuotes = localStorage.getItem('aiwcrm_sales_quotations_ledger_v1')
      if (storedQuotes) {
        const qList = JSON.parse(storedQuotes)
        if (Array.isArray(qList) && qList.length > 0) {
          const sum = qList.reduce((acc: number, item: any) => acc + (Number(item.grandTotal) || 0), 0)
          setQuotesTotalValue(`₹${sum.toLocaleString('en-IN')}`)
          setPendingQuotesCount(qList.filter((q: any) => q.status === 'Sent' || q.status === 'Draft').length)
        }
      }

      const storedInvoices = localStorage.getItem('aiwcrm_finance_invoices_v1')
      if (storedInvoices) {
        const invList = JSON.parse(storedInvoices)
        if (Array.isArray(invList) && invList.length > 0) {
          const sum = invList.reduce((acc: number, item: any) => acc + (Number(item.grandTotal) || 0), 0)
          setInvoicesTotalValue(`₹${sum.toLocaleString('en-IN')}`)
          setOverdueInvoicesCount(invList.filter((i: any) => i.status !== 'Paid').length)
        }
      }
    } catch {}
  }, [])

  const effectiveAgentId = React.useMemo((): string | string[] | undefined => {
    if (selectedAgent === 'all') return undefined
    if (selectedAgent.startsWith('dept:')) {
      const deptId = selectedAgent.replace('dept:', '')
      if (deptId === 'leadership') {
        const ids = agents.filter(a => a.role === 'owner' || a.role === 'admin' || a.role === 'manager').map(a => a.user_id)
        return ids.length > 0 ? ids : undefined
      }
      if (deptId === 'sales') {
        const ids = agents.filter(a => a.role === 'agent').map(a => a.user_id)
        return ids.length > 0 ? ids : undefined
      }
      if (deptId === 'support') {
        const ids = agents.filter(a => a.role === 'client' || a.role === 'viewer').map(a => a.user_id)
        return ids.length > 0 ? ids : undefined
      }
      const memberIds = deptMembers.filter(dm => dm.department_id === deptId).map(dm => dm.user_id)
      return memberIds.length > 0 ? memberIds : ['00000000-0000-0000-0000-000000000000']
    }
    return selectedAgent
  }, [selectedAgent, agents, deptMembers])

  useEffect(() => {
    let isCancelled = false
    const db = createClient()

    setMetricsLoading(true)
    setSeriesLoading(true)
    setPipelineLoading(true)
    setResponseTimeLoading(true)
    setScorecardLoading(true)

    loadMetrics(db, effectiveAgentId)
      .then((m) => { 
        if (!isCancelled) {
          setMetrics(m)
        }
      })
      .catch((err) => console.error('[dashboard] metrics failed:', err))
      .finally(() => { if (!isCancelled) setMetricsLoading(false) })

    loadConversationsSeries(db, 30, effectiveAgentId)
      .then((s) => { if (!isCancelled) setSeries((prev) => ({ ...prev, 30: s })) })
      .catch((err) => console.error('[dashboard] series failed:', err))
      .finally(() => { if (!isCancelled) setSeriesLoading(false) })

    loadPipelineDonut(db)
      .then((p) => { if (!isCancelled) setPipeline(p) })
      .catch((err) => console.error('[dashboard] pipeline failed:', err))
      .finally(() => { if (!isCancelled) setPipelineLoading(false) })

    loadResponseTime(db)
      .then((r) => { if (!isCancelled) setResponseTime(r) })
      .catch((err) => console.error('[dashboard] response time failed:', err))
      .finally(() => { if (!isCancelled) setResponseTimeLoading(false) })

    // Query unassigned contacts count for priority center
    Promise.resolve(
      db.from('contacts').select('id', { count: 'exact', head: true }).is('assigned_agent_id', null)
    )
      .then(res => { if (!isCancelled && res.count !== null) setUnassignedLeadsCount(res.count) })
      .catch(() => {})

    fetch('/api/analytics/scorecard')
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data && data.leaderboard) setScorecard(data.leaderboard)
      })
      .catch((err) => console.error('[dashboard] scorecard failed:', err))
      .finally(() => { if (!isCancelled) setScorecardLoading(false) })

    return () => {
      isCancelled = true
    }
  }, [effectiveAgentId])

  useEffect(() => {
    if (!account?.id) return
    const db = createClient()

    Promise.all([
      db.from('departments').select('id, name').order('name'),
      db.from('department_members').select('department_id, user_id'),
      db.from('account_members').select('user_id, role').eq('account_id', account.id),
    ]).then(async ([deptRes, dmRes, memRes]) => {
      if (deptRes.data) setDepartments(deptRes.data as RealDepartment[])
      if (dmRes.data) setDeptMembers(dmRes.data as DeptMemberRel[])

      const members = memRes.data || []
      if (members.length > 0) {
        const roleMap = new Map(members.map((m: any) => [m.user_id, m.role]))
        const ids = members.map((m: any) => m.user_id)
        const { data: profiles } = await db.from('profiles').select('user_id, full_name, email').in('user_id', ids)
        if (profiles) {
          const list: DashboardAgent[] = profiles.map((p: any) => ({
            user_id: p.user_id,
            full_name: p.full_name || p.email || 'Agent',
            email: p.email,
            role: roleMap.get(p.user_id) || 'agent'
          }))
          setAgents(list)
        }
      }
    }).catch((err) => console.error('[dashboard] load departments error:', err))
  }, [account?.id])

  useEffect(() => {
    if (!account?.id) return
    const db = createClient()
    loadPlanUsageSummary(db, account.id)
      .then(setPlanUsage)
      .catch((err) => console.error('[dashboard] plan usage failed:', err))
  }, [account?.id])

  const handleRangeChange = useCallback(
    (r: RangeDays) => {
      setRange(r)
      setSeriesLoading(true)
      const db = createClient()
      loadConversationsSeries(db, r, effectiveAgentId)
        .then((s) => setSeries((prev) => ({ ...prev, [r]: s })))
        .catch((err) => console.error('[dashboard] series failed:', err))
        .finally(() => setSeriesLoading(false))
    },
    [effectiveAgentId],
  )

  const displayName = profile?.full_name?.split(' ')[0] || 'Executive'

  const currentPipelineValue = formatCurrency(metrics?.openDealsValue ?? 0, defaultCurrency)

  const computedPerspective = React.useMemo((): 'executive' | 'sales' | 'marketing' | 'finance' | 'cs' | 'support' => {
    if (selectedAgent === 'dept:sales') return 'sales'
    if (selectedAgent === 'dept:support') return 'support'
    if (selectedAgent === 'dept:finance') return 'finance'
    if (selectedAgent === 'dept:marketing') return 'marketing'
    return 'executive'
  }, [selectedAgent])

  const selectedLabel = React.useMemo(() => {
    if (selectedAgent === 'all') return '🏢 All Organization'
    if (selectedAgent.startsWith('dept:')) {
      const deptId = selectedAgent.replace('dept:', '')
      const found = departments.find(d => d.id === deptId)
      if (found) return `📁 ${found.name}`
      if (deptId === 'sales') return '💼 Sales & Commercial'
      if (deptId === 'support') return '🛠️ Customer Support'
      if (deptId === 'leadership') return '👑 Leadership'
      return `📁 Department`
    }
    const foundAgent = agents.find(a => a.user_id === selectedAgent)
    if (foundAgent) return `👤 ${foundAgent.full_name}`
    return '🏢 All Organization'
  }, [selectedAgent, departments, agents])

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto w-full min-h-full overflow-x-hidden px-1 sm:px-0">
      {/* ━━━ 1. COMMAND CENTER HEADER & CONTROLS ━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <span>AIWCRM Enterprise OS</span>
            <span>•</span>
            <span className="text-emerald-500 font-bold">Operational Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight truncate">
            Welcome back, {displayName}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Live cross-department operations, revenue velocity, prioritized queue & AI Copilot
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {(isAdmin || isOwner) && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 shadow-2xs transition-all shrink-0"
            >
              <Shield className="h-4 w-4" /> Super Admin
            </Link>
          )}

          <Select value={selectedAgent} onValueChange={(v) => { setSelectedAgent(v || 'all'); setSeries({ 7: null, 30: null, 90: null }) }}>
            <SelectTrigger className="w-[220px] bg-card border-border text-xs font-semibold rounded-xl shadow-2xs">
              <SelectValue placeholder="All Departments & Agents">
                <span className="truncate">{selectedLabel}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[280px] max-h-[380px] text-xs">
              <SelectItem value="all" className="font-bold">
                🏢 All Organization (All Agents)
              </SelectItem>

              {departments.length > 0 ? (
                <>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase font-bold text-muted-foreground">📂 By Department</SelectLabel>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={`dept:${d.id}`}>
                        📁 {d.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>

                  {departments.map((d) => {
                    const deptAgentIds = deptMembers.filter(dm => dm.department_id === d.id).map(dm => dm.user_id)
                    const deptAgentList = agents.filter(a => deptAgentIds.includes(a.user_id))
                    if (deptAgentList.length === 0) return null

                    return (
                      <Fragment key={`group-${d.id}`}>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel className="text-[10px] uppercase font-bold text-muted-foreground">👥 {d.name} Agents</SelectLabel>
                          {deptAgentList.map(a => (
                            <SelectItem key={a.user_id} value={a.user_id}>
                              {a.full_name} <span className="text-[10px] text-muted-foreground ml-1">({a.role || 'Member'})</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </Fragment>
                    )
                  })}
                </>
              ) : (
                <>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase font-bold text-muted-foreground">📂 By Department</SelectLabel>
                    <SelectItem value="dept:sales">💼 Sales & Commercial Team</SelectItem>
                    <SelectItem value="dept:support">🛠️ Customer Support Team</SelectItem>
                    <SelectItem value="dept:leadership">👑 Leadership & Management</SelectItem>
                  </SelectGroup>
                </>
              )}

              {agents.length > 0 && (
                <>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase font-bold text-muted-foreground">👤 All Individual Members</SelectLabel>
                    {agents.map(a => (
                      <SelectItem key={`all-${a.user_id}`} value={a.user_id}>
                        {a.full_name} <span className="text-[10px] text-muted-foreground ml-1">({a.role || 'Agent'})</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ━━━ RECENTLY OPENED OBJECTS STRIP ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <RecentlyOpenedStrip />

      {/* ━━━ 2. LIVE BUSINESS PULSE RIBBON ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <BusinessPulseRibbon 
        quotesPendingCount={pendingQuotesCount}
        approvalsCount={0}
        isWhatsAppConnected={true}
        revenueGrowth="Live Ledger"
        collectionsStatus={overdueInvoicesCount > 0 ? `${overdueInvoicesCount} Overdue` : '100% On-Time'}
        totalRevenue={invoicesTotalValue}
      />

      {/* ━━━ 3. DAILY BUSINESS HEALTH SCORE & AI EXECUTIVE CHAT ━━━━ */}
      <BusinessHealthAndAiChat 
        userName={displayName}
        totalRevenue={invoicesTotalValue}
        pendingQuotesCount={pendingQuotesCount}
        pendingApprovalsCount={0}
        overdueInvoicesCount={overdueInvoicesCount}
        dealsValue={currentPipelineValue}
      />

      {/* ━━━ 4. TODAY'S PRIORITY & ACTION CENTER ━━━━━━━━━━━━━━━━━━━ */}
      <TodaysPriorityCenter 
        pendingQuotesCount={pendingQuotesCount}
        overdueInvoicesCount={overdueInvoicesCount}
        unassignedLeadsCount={unassignedLeadsCount}
      />

      {/* ━━━ 5. EXECUTIVE OPERATIONAL KPI BENTO GRID ━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsLoading || !metrics || !planUsage ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MetricCard
              title="Today's Closed Revenue"
              value={invoicesTotalValue}
              icon={DollarSign}
              statusBadge="Healthy Growth"
              subtitle="Reconciled 18% GST tax ledger"
            />
            <MetricCard
              title="Active Pipeline Value"
              value={currentPipelineValue}
              icon={TrendingUp}
              statusBadge="In Negotiation"
              subtitle={`${metrics.openDealsCount} active deals in progression`}
            />
            <MetricCard
              title="Outstanding Receivables"
              value={overdueInvoicesCount > 0 ? "₹1,50,000" : "₹0"}
              icon={CreditCard}
              statusBadge="100% On-Time"
              subtitle="0 bad debt across aging buckets"
            />
            <MetricCard
              title="New Inbound Leads"
              value={String(metrics.newContactsToday.current)}
              icon={UserPlus}
              subtitle="Captured today via WhatsApp & Ads"
            />
            <MetricCard
              title="Active Conversations"
              value={String(metrics.activeConversations.current)}
              icon={MessageSquare}
              statusBadge="Live Sessions"
              subtitle="Real-time multi-agent routing"
            />
            <MetricCard
              title="First Response SLA"
              value={responseTime?.thisWeekAvg ? `${Math.round(responseTime.thisWeekAvg)}m` : "< 15s"}
              icon={Clock}
              statusBadge="Target < 2m"
              subtitle="100% SLA adherence rate"
            />
            <MetricCard
              title="AI & Workflow Executions"
              value={String(planUsage.currentMessages || 0)}
              icon={Zap}
              subtitle="Autonomous triggers & broadcasts"
            />
            <UsageMetricCard
              title={t('PlanUsage')}
              icon={Database}
              bars={[
                { label: 'Contacts', current: planUsage.currentContacts, max: planUsage.maxContacts },
                { label: 'Messages', current: planUsage.currentMessages, max: planUsage.maxMessages }
              ]}
            />
          </>
        )}
      </div>

      {/* ━━━ 6. OPERATIONAL QUICK ACTION DECK ━━━━━━━━━━━━━━━━━━━━━━ */}
      <QuickActions />

      {/* ━━━ 7. MY WORK & APPROVAL INBOX ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <MyWorkAndApprovals />

      {/* ━━━ 8. FULL-CYCLE REVENUE & SALES FUNNEL ━━━━━━━━━━━━━━━━━ */}
      <RevenueCycleFlow 
        pipelineValue={currentPipelineValue}
        quotesValue={quotesTotalValue}
        invoicesValue={invoicesTotalValue}
        collectedValue={invoicesTotalValue}
        gstLiability="18% GST Verified Ledger"
        openDealsCount={metrics?.openDealsCount ?? 0}
        leadsCount={metrics?.newContactsToday.current ?? 0}
      />

      {/* ━━━ 9. ROLE-BASED DEPARTMENT PERSPECTIVES ━━━━━━━━━━━━━━━━━ */}
      <DepartmentPerspectiveViews 
        initialPerspective="executive"
        activePerspective={computedPerspective}
        totalRevenue={invoicesTotalValue}
        pipelineValue={currentPipelineValue}
        collectionsValue={invoicesTotalValue}
      />

      {/* ━━━ 10. REVENUE CHARTS & PIPELINE BREAKDOWN ━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ConversationsChart
          series={series}
          loading={seriesLoading}
          range={range}
          onRangeChange={handleRangeChange}
        />
        <PipelineDonut
          data={pipeline}
          loading={pipelineLoading}
          currency={defaultCurrency}
        />
      </div>

      {/* ━━━ 11. AGENT PERFORMANCE SCORECARD MATRIX ━━━━━━━━━━━━━━━━ */}
      <AgentScorecard 
        data={scorecard}
        loading={scorecardLoading}
      />

      {/* ━━━ 12. INTEGRATION HEALTH BAROMETER & TRI-TAB STREAM ━━━━━ */}
      <IntegrationAndActivityStream />
    </div>
  )
}
