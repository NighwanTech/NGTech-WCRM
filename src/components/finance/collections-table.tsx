'use client'

import React from 'react'
import { Send, Clock, AlertTriangle, ShieldCheck, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaymentStatusBadge, PaymentStatus } from '@/components/sales/payment-status-badge'

export interface CollectionItem {
  id: string
  invoiceNumber: string
  clientName: string
  clientPhone: string
  amount: number
  dueDate: string
  agingBucket: '0-30 days' | '31-60 days' | '61-90 days' | '90+ days'
  status: PaymentStatus
  lastReminderSent?: string
}

interface CollectionsTableProps {
  collections?: CollectionItem[]
  onSendReminder?: (id: string, type: 'whatsapp' | 'email') => void
}

const DEFAULT_COLLECTIONS: CollectionItem[] = []

export function CollectionsTable({
  collections = DEFAULT_COLLECTIONS,
  onSendReminder
}: CollectionsTableProps) {
  if (!collections || collections.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center space-y-2">
        <Clock className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
        <p className="font-bold text-foreground text-xs">No Pending Collections</p>
        <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
          Invoices and receivable aging balances will automatically sync here as sales deals close.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm text-foreground">Collections Queue & Aging Ledger</h3>
          <p className="text-xs text-muted-foreground">Automated WhatsApp & Email payment reminders with SLA tracking</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Cash Flow Healthy
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b">
            <tr>
              <th className="p-3">INVOICE #</th>
              <th className="p-3">CLIENT / COMPANY</th>
              <th className="p-3">AMOUNT</th>
              <th className="p-3">DUE DATE</th>
              <th className="p-3">AGING BUCKET</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">LAST REMINDER</th>
              <th className="p-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {collections.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3 font-mono font-semibold text-foreground">{item.invoiceNumber}</td>
                <td className="p-3 font-medium text-foreground">{item.clientName}</td>
                <td className="p-3 font-bold text-emerald-500">₹{item.amount.toLocaleString('en-IN')}</td>
                <td className="p-3 text-muted-foreground">{item.dueDate}</td>
                <td className="p-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    item.agingBucket === '0-30 days' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {item.agingBucket}
                  </span>
                </td>
                <td className="p-3"><PaymentStatusBadge status={item.status} /></td>
                <td className="p-3 text-muted-foreground">{item.lastReminderSent || 'None'}</td>
                <td className="p-3 text-right space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-[11px] gap-1 text-emerald-500 hover:text-emerald-400"
                    onClick={() => onSendReminder && onSendReminder(item.id, 'whatsapp')}
                  >
                    <Send className="w-3 h-3" /> WhatsApp
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 text-[11px] gap-1 text-muted-foreground"
                    onClick={() => onSendReminder && onSendReminder(item.id, 'email')}
                  >
                    <Mail className="w-3 h-3" /> Email
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
