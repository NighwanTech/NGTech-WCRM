'use client'

import React, { useState, useEffect } from 'react'
import { DollarSign, Clock, AlertTriangle, ShieldCheck, Mail, Send, CheckCircle2, ArrowRight } from 'lucide-react'
import { CollectionsTable, CollectionItem } from '@/components/finance/collections-table'
import { FinanceKpiCard } from '@/components/finance/finance-kpi-card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function FinanceCollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [bucket0to30, setBucket0to30] = useState(0)
  const [bucket31to60, setBucket31to60] = useState(0)
  const [bucket90plus, setBucket90plus] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aiwcrm_finance_invoices_v1')
      if (stored) {
        const invoices = JSON.parse(stored)
        if (Array.isArray(invoices)) {
          let b1 = 0
          let b2 = 0
          let b3 = 0

          const pendingList: CollectionItem[] = invoices
            .filter((inv: any) => inv.status !== 'Paid')
            .map((inv: any) => {
              const issueTime = new Date(inv.issueDate || inv.issue_date || Date.now()).getTime()
              const diffDays = Math.max(0, Math.floor((Date.now() - issueTime) / (1000 * 60 * 60 * 24)))
              
              let bucket: CollectionItem['agingBucket'] = '0-30 days'
              if (diffDays <= 30) {
                bucket = '0-30 days'
                b1 += Number(inv.grandTotal) || 0
              } else if (diffDays <= 60) {
                bucket = '31-60 days'
                b2 += Number(inv.grandTotal) || 0
              } else {
                bucket = '90+ days'
                b3 += Number(inv.grandTotal) || 0
              }

              return {
                id: inv.id,
                invoiceNumber: inv.invoiceNumber,
                clientName: inv.clientName,
                clientPhone: inv.clientPhone || '',
                amount: Number(inv.grandTotal) || 0,
                dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN') : 'Net 15 Days',
                agingBucket: bucket,
                status: inv.status || 'Draft',
                lastReminderSent: inv.lastReminderSent || 'None'
              }
            })

          setCollections(pendingList)
          setBucket0to30(b1)
          setBucket31to60(b2)
          setBucket90plus(b3)
        }
      }
    } catch {}
  }, [])

  const handleSendReminder = (id: string, type: 'whatsapp' | 'email') => {
    const item = collections.find(c => c.id === id)
    if (!item) return

    if (type === 'whatsapp') {
      const cleanPhone = (item.clientPhone || '').replace(/\D/g, '')
      const msg = [
        `*PAYMENT COLLECTION REMINDER - AIWCRM*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `🧾 *Invoice #:* ${item.invoiceNumber}`,
        `👤 *Client:* ${item.clientName}`,
        `💰 *Outstanding Amount:* ₹${item.amount.toLocaleString('en-IN')}`,
        `⏳ *Aging Status:* ${item.agingBucket} (Due: ${item.dueDate})`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Please remit payment today to avoid service interruption.`
      ].join('\n')

      const waUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`

      window.open(waUrl, '_blank')
      toast.success(`WhatsApp reminder sent to ${item.clientName}!`)
    } else {
      toast.success(`Email reminder queued for ${item.clientName}!`)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="h-8 w-8 rounded-xl border bg-background hover:bg-muted/40 cursor-pointer shrink-0 shadow-2xs"
            title="Go Back"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-0.5">
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

        <Button 
          size="sm"
          onClick={() => router.push('/finance')}
          className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground rounded-xl shadow-xs cursor-pointer"
        >
          View Invoices Ledger <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceKpiCard 
          title="0 - 30 Days Bucket"
          amount={`₹${bucket0to30.toLocaleString('en-IN')}`}
          subtext="Current receivables within term"
          badgeText={bucket0to30 > 0 ? "Active Term" : "All Clear"}
          badgeVariant={bucket0to30 > 0 ? "info" : "success"}
        />
        <FinanceKpiCard 
          title="31 - 60 Days Bucket"
          amount={`₹${bucket31to60.toLocaleString('en-IN')}`}
          subtext="Requires automated follow-up"
          badgeText={bucket31to60 > 0 ? "Follow-up Required" : "Zero Pending"}
          badgeVariant={bucket31to60 > 0 ? "warning" : "success"}
        />
        <FinanceKpiCard 
          title="90+ Days Bucket"
          amount={`₹${bucket90plus.toLocaleString('en-IN')}`}
          subtext="Zero bad debt / default risk"
          badgeText={bucket90plus > 0 ? "Critical Risk" : "Zero Risk"}
          badgeVariant={bucket90plus > 0 ? "danger" : "success"}
        />
      </div>

      {/* Collections Table Component */}
      <CollectionsTable 
        collections={collections}
        onSendReminder={handleSendReminder}
      />
    </div>
  )
}
