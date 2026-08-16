'use client'

import React from 'react'
import { DollarSign, Clock, AlertTriangle, ShieldCheck, Mail, Send } from 'lucide-react'
import { CollectionsTable } from '@/components/finance/collections-table'
import { FinanceKpiCard } from '@/components/finance/finance-kpi-card'
import { toast } from 'sonner'

export default function FinanceCollectionsPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Finance</span>
            <span>/</span>
            <span className="font-semibold text-foreground">Collections & Cash Flow</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Collections & Aging Ledger
          </h1>
          <p className="text-xs text-muted-foreground">
            Aging analysis, automated payment reminders, and collection queue SLA tracking
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceKpiCard 
          title="0 - 30 Days Bucket"
          amount="₹2,84,000"
          subtext="Current receivables within term"
          badgeText="Normal SLA"
          badgeVariant="info"
        />
        <FinanceKpiCard 
          title="31 - 60 Days Bucket"
          amount="₹1,50,000"
          subtext="Requires automated follow-up"
          badgeText="Follow-up Required"
          badgeVariant="warning"
        />
        <FinanceKpiCard 
          title="90+ Days Bucket"
          amount="₹0"
          subtext="Zero bad debt / default risk"
          badgeText="Zero Risk"
          badgeVariant="success"
        />
      </div>

      {/* Collections Table Component */}
      <CollectionsTable 
        onSendReminder={(id, type) => {
          toast.success(`Collection reminder sent via ${type.toUpperCase()}!`)
        }}
      />
    </div>
  )
}
