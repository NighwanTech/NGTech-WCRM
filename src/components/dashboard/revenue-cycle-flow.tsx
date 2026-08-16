'use client'

import React from 'react'
import { 
  DollarSign, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface RevenueCycleFlowProps {
  pipelineValue?: string
  quotesValue?: string
  invoicesValue?: string
  collectedValue?: string
  gstLiability?: string
  openDealsCount?: number
  leadsCount?: number
}

export function RevenueCycleFlow({
  pipelineValue = '₹0',
  quotesValue = '₹0',
  invoicesValue = '₹0',
  collectedValue = '₹0',
  gstLiability = '18% GST Compliant',
  openDealsCount = 0,
  leadsCount = 0
}: RevenueCycleFlowProps) {
  const router = useRouter()

  const steps = [
    { 
      label: 'Deals Pipeline', 
      value: pipelineValue, 
      sub: `${openDealsCount} active deals`, 
      url: '/pipelines',
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-500 hover:bg-blue-500/10' 
    },
    { 
      label: 'Quotations & SOW', 
      value: quotesValue, 
      sub: 'GST price book', 
      url: '/sales/quotations',
      color: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-500 hover:bg-indigo-500/10' 
    },
    { 
      label: 'Tax Invoices', 
      value: invoicesValue, 
      sub: '18% GST ledger', 
      url: '/finance',
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10' 
    },
    { 
      label: 'Collections', 
      value: collectedValue, 
      sub: 'Reconciled UPI/Bank', 
      url: '/finance',
      color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10' 
    },
  ]

  const funnelStages = [
    { name: 'Leads Captured', count: `${leadsCount} Leads`, pct: '100%', drop: '—', width: 'w-full', bg: 'bg-primary/20 text-primary', url: '/contacts' },
    { name: 'Qualified Pipeline', count: `${openDealsCount} Deals`, pct: 'Active', drop: '—', width: 'w-[75%]', bg: 'bg-primary/35 text-primary', url: '/pipelines' },
    { name: 'Quotations & SOW', count: `${quotesValue}`, pct: 'Proposal', drop: '—', width: 'w-[55%]', bg: 'bg-primary/55 text-primary-foreground', url: '/sales/quotations' },
    { name: 'Closed Revenue', count: `${invoicesValue}`, pct: 'Closed', drop: '—', width: 'w-[40%]', bg: 'bg-emerald-600 text-white', url: '/finance' },
  ]

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-5 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full-Cycle Revenue & Sales Funnel</h3>
          <p className="text-sm font-bold text-foreground truncate">Operational Deal Flow & Cash Flow Progression (Clickable)</p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" /> {gstLiability}
        </span>
      </div>

      {/* ── 1. Linear Revenue Step Chain (Clickable Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => (
          <div 
            key={step.label}
            onClick={() => router.push(step.url)}
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 cursor-pointer transition-all duration-150 hover:shadow-xs group min-w-0 ${step.color}`}
            title={`Open ${step.label} Workspace`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
              <span>{`Step 0${idx + 1}`}</span>
              <span className="opacity-80 flex items-center gap-1">
                {step.label} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">{step.value}</span>
              <p className="text-[11px] opacity-70 mt-0.5">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 2. Interactive Sales Funnel Visualization ── */}
      <div className="pt-2 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Enterprise Sales Funnel Conversion Rate
          </h4>
          <span className="text-[11px] text-muted-foreground font-medium">Click stage to view records</span>
        </div>

        <div className="space-y-1.5">
          {funnelStages.map((stage) => (
            <div 
              key={stage.name} 
              onClick={() => router.push(stage.url)}
              className="flex items-center gap-3 text-xs cursor-pointer p-1 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <span className="w-36 font-semibold text-foreground truncate shrink-0">{stage.name}</span>
              <div className="flex-1 bg-muted/40 h-7 rounded-lg overflow-hidden flex items-center p-1">
                <div 
                  className={`h-full rounded-md flex items-center justify-between px-3 font-bold text-[11px] transition-all duration-500 ${stage.width} ${stage.bg}`}
                >
                  <span>{stage.count}</span>
                  <span>{stage.pct}</span>
                </div>
              </div>
              <span className="w-14 text-right text-[11px] text-muted-foreground font-medium shrink-0">
                {stage.drop}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
