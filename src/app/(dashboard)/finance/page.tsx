'use client'

import React from 'react'
import { DollarSign, CreditCard, TrendingUp, AlertCircle, FileText, CheckCircle2 } from 'lucide-react'
import { FinanceKpiCard } from '@/components/finance/finance-kpi-card'
import { CollectionsTable } from '@/components/finance/collections-table'
import { PaymentStatusBadge } from '@/components/sales/payment-status-badge'
import { toast } from 'sonner'

export default function FinanceDashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>Finance</span>
            <span>/</span>
            <span className="font-semibold text-foreground">Invoices & Collections Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise Finance & Collections Hub
          </h1>
          <p className="text-xs text-muted-foreground">
            Invoicing, 18% GST compliance ledger, outstanding collections & cash flow forecasting
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" /> CASH FLOW HEALTHY
        </span>
      </div>

      {/* Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceKpiCard 
          title="Total Invoiced"
          amount="₹21,24,000"
          subtext="18% GST included"
          icon={CreditCard}
          badgeText="+12.4% MoM"
          badgeVariant="success"
        />
        <FinanceKpiCard 
          title="Payments Collected"
          amount="₹18,40,000"
          subtext="Bank & Razorpay collections"
          icon={DollarSign}
          badgeText="86.6% Collected"
          badgeVariant="success"
        />
        <FinanceKpiCard 
          title="Outstanding Collections"
          amount="₹2,84,000"
          subtext="Pending within SLA"
          icon={TrendingUp}
          badgeText="Active Ledger"
          badgeVariant="warning"
        />
        <FinanceKpiCard 
          title="Overdue Risk"
          amount="₹0"
          subtext="0 Overdue Invoices"
          icon={AlertCircle}
          badgeText="0 Risk"
          badgeVariant="success"
        />
      </div>

      {/* Collections Table Component */}
      <CollectionsTable 
        onSendReminder={(id, type) => {
          toast.success(`Payment reminder sent via ${type.toUpperCase()}!`)
        }}
      />
    </div>
  )
}
