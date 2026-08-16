'use client'

import React, { useState } from 'react'
import { 
  Flame, 
  Users, 
  FileText, 
  CreditCard, 
  TrendingDown, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Send,
  Zap,
  ShieldAlert,
  FolderSync,
  Megaphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

export interface PriorityItem {
  id: string
  title: string
  subtitle: string
  category: 'critical' | 'attention' | 'info'
  workspace: string
  icon: React.ElementType
  actionLabel: string
  actionUrl: string
}

interface TodaysPriorityCenterProps {
  pendingQuotesCount?: number
  overdueInvoicesCount?: number
  unassignedLeadsCount?: number
}

export function TodaysPriorityCenter({
  pendingQuotesCount = 0,
  overdueInvoicesCount = 0,
  unassignedLeadsCount = 0
}: TodaysPriorityCenterProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'critical' | 'attention' | 'info'>('all')

  const priorities: PriorityItem[] = [
    {
      id: 'leads',
      title: unassignedLeadsCount > 0 
        ? `${unassignedLeadsCount} Inbound Leads Waiting for Assignment` 
        : 'All Inbound Leads Assigned & Actively Routed',
      subtitle: unassignedLeadsCount > 0 
        ? 'Leads captured via WhatsApp & Ads requiring instant sales rep assignment.' 
        : 'Zero lead assignment backlog across all channels.',
      category: unassignedLeadsCount > 0 ? 'critical' : 'info',
      workspace: 'Lead Hub & CRM',
      icon: Users,
      actionLabel: unassignedLeadsCount > 0 ? 'Assign Leads' : 'View Contacts',
      actionUrl: '/contacts'
    },
    {
      id: 'quotes',
      title: pendingQuotesCount > 0 
        ? `${pendingQuotesCount} Quotations & Proposals Awaiting Client Decision` 
        : 'All Proposals & Quotations Reconciled',
      subtitle: pendingQuotesCount > 0 
        ? 'Send WhatsApp contract link reminders to accelerate closing cycle.' 
        : 'No pending client quotations awaiting response.',
      category: pendingQuotesCount > 0 ? 'attention' : 'info',
      workspace: 'Sales Workspace',
      icon: FileText,
      actionLabel: 'View Quotations',
      actionUrl: '/sales/quotations'
    },
    {
      id: 'invoices',
      title: overdueInvoicesCount > 0 
        ? `${overdueInvoicesCount} Invoices Pending Payment Reconciliation` 
        : 'GST Invoices Ledger Reconciled & 100% Tax Compliant',
      subtitle: overdueInvoicesCount > 0 
        ? 'Dispatch automated UPI/NEFT payment reminder notices.' 
        : 'All client payments on schedule with zero bad debt risk.',
      category: overdueInvoicesCount > 0 ? 'attention' : 'info',
      workspace: 'Finance & GST',
      icon: CreditCard,
      actionLabel: 'View Invoices Ledger',
      actionUrl: '/finance'
    },
    {
      id: 'ai-approval',
      title: 'AI Routing & Automation Rules Operational',
      subtitle: 'Dynamic lead routing and automated responses running normally.',
      category: 'info',
      workspace: 'AI Studio Copilot',
      icon: Sparkles,
      actionLabel: 'View Flows',
      actionUrl: '/flows'
    },
    {
      id: 'campaign',
      title: 'Meta Ads & WhatsApp Broadcast Engine Online',
      subtitle: 'Connected with Meta Graph API & WhatsApp Cloud API.',
      category: 'info',
      workspace: 'Marketing Pro',
      icon: Megaphone,
      actionLabel: 'Manage Ads',
      actionUrl: '/meta-ads'
    }
  ]

  const filteredPriorities = filter === 'all' 
    ? priorities 
    : priorities.filter(p => p.category === filter)

  const getCategoryBadge = (category: PriorityItem['category']) => {
    switch (category) {
      case 'critical':
        return <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[9.5px] uppercase font-bold tracking-wider">CRITICAL</Badge>
      case 'attention':
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[9.5px] uppercase font-bold tracking-wider">ATTENTION REQUIRED</Badge>
      case 'info':
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9.5px] uppercase font-bold tracking-wider">INFORMATIONAL</Badge>
    }
  }

  const criticalCount = priorities.filter(p => p.category === 'critical').length

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-4 w-full overflow-hidden">
      {/* ── Header with Category Filter Chips ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Today&apos;s Priority & Action Center
              </h3>
              {criticalCount > 0 ? (
                <Badge className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0">
                  {criticalCount} Action Required
                </Badge>
              ) : (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2 py-0">
                  All Systems Normal
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              Operational tasks across all departments
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl shrink-0 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' 
                ? 'bg-background text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({priorities.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'critical' 
                ? 'bg-rose-500 text-white shadow-xs' 
                : 'text-muted-foreground hover:text-rose-500'
            }`}
          >
            Critical ({priorities.filter(p => p.category === 'critical').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('attention')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'attention' 
                ? 'bg-amber-500 text-white shadow-xs' 
                : 'text-muted-foreground hover:text-amber-500'
            }`}
          >
            Attention ({priorities.filter(p => p.category === 'attention').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('info')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'info' 
                ? 'bg-emerald-500 text-white shadow-xs' 
                : 'text-muted-foreground hover:text-emerald-500'
            }`}
          >
            Info ({priorities.filter(p => p.category === 'info').length})
          </button>
        </div>
      </div>

      {/* ── Priority Action Cards List ── */}
      <div className="space-y-2.5">
        {filteredPriorities.map((item) => {
          const Icon = item.icon
          return (
            <div 
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.category === 'critical'
                  ? 'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10'
                  : item.category === 'attention'
                  ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
                  : 'border-border/60 bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  item.category === 'critical'
                    ? 'bg-rose-500/20 text-rose-500'
                    : item.category === 'attention'
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'bg-primary/10 text-primary'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-xs">{item.title}</span>
                    {getCategoryBadge(item.category)}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                  <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider block">
                    {item.workspace}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => router.push(item.actionUrl)}
                className={`h-8 text-xs font-bold px-3.5 rounded-xl justify-between sm:justify-center gap-1.5 cursor-pointer shrink-0 ${
                  item.category === 'critical'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                    : item.category === 'attention'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted hover:bg-muted/80 text-foreground border border-border/80'
                }`}
              >
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
