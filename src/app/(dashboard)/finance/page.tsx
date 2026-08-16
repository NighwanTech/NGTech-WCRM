'use client'

import React, { useState, useEffect } from 'react'
import { 
  DollarSign, CreditCard, TrendingUp, AlertCircle, FileText, 
  CheckCircle2, Plus, Send, Download, Printer, Trash2, ArrowRight,
  ShieldCheck, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceKpiCard } from '@/components/finance/finance-kpi-card'
import { PaymentStatusBadge, PaymentStatus } from '@/components/sales/payment-status-badge'
import { toast } from 'sonner'

export interface InvoiceItem {
  id: string
  invoiceNumber: string
  clientName: string
  clientPhone?: string
  subtotal: number
  gstAmount: number
  grandTotal: number
  issueDate: string
  dueDate: string
  status: PaymentStatus
  sourceQuoteId?: string
}

export const INVOICES_STORAGE_KEY = 'aiwcrm_finance_invoices_v1'

export default function FinanceDashboardPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(INVOICES_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setInvoices(parsed)
      }
    } catch {}
    setIsLoaded(true)
  }, [])

  const persistInvoices = (newInvoices: InvoiceItem[]) => {
    setInvoices(newInvoices)
    try {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(newInvoices))
    } catch {}
  }

  const handleMarkPaid = (id: string) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' as PaymentStatus } : inv)
    persistInvoices(updated)
    toast.success('Invoice marked as PAID & reconciled in ledger!')
  }

  const handleDeleteInvoice = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id)
    persistInvoices(updated)
    toast.success('Invoice removed from ledger.')
  }

  const handleSendWhatsAppReminder = (inv: InvoiceItem) => {
    const cleanPhone = (inv.clientPhone || '').replace(/\D/g, '')
    const msg = [
      `*GST TAX INVOICE & PAYMENT REMINDER - AIWCRM*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🧾 *Invoice No:* ${inv.invoiceNumber}`,
      `👤 *Billed To:* ${inv.clientName}`,
      `📅 *Due Date:* ${new Date(inv.dueDate).toLocaleDateString('en-IN')}`,
      ``,
      `💵 *Taxable Value:* ₹${inv.subtotal.toLocaleString('en-IN')}`,
      `🏷️ *GST (18% Tax):* +₹${inv.gstAmount.toLocaleString('en-IN')}`,
      `💰 *Total Amount Due:* ₹${inv.grandTotal.toLocaleString('en-IN')}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Status: *${inv.status.toUpperCase()}*`,
      `Please remit payment via UPI/Bank transfer or reply for payment link.`
    ].join('\n')

    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`

    window.open(waUrl, '_blank')
    toast.success(`Payment reminder for ${inv.invoiceNumber} opened in WhatsApp!`)
  }

  // Dynamic KPI Calculations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0)
  const totalCollected = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.grandTotal, 0)
  const outstandingAmount = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.grandTotal, 0)
  const overdueCount = invoices.filter(inv => inv.status === 'Review' || inv.status === 'Draft').length

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
            <span>Finance</span>
            <span>/</span>
            <span className="font-semibold text-foreground">Invoices & Collections Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" /> Invoices & GST Finance Ledger
          </h1>
          <p className="text-xs text-muted-foreground">
            Tax invoices, 18% GST compliance ledger, automated WhatsApp collection reminders & reconciliation
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
          <CheckCircle2 className="w-4 h-4" /> 18% GST COMPLIANT LEDGER
        </span>
      </div>

      {/* Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceKpiCard 
          title="Total Invoiced"
          amount={`₹${totalInvoiced.toLocaleString('en-IN')}`}
          subtext={`${invoices.length} total generated invoices`}
          icon={CreditCard}
          badgeText="Active Ledger"
          badgeVariant="success"
        />
        <FinanceKpiCard 
          title="Payments Collected"
          amount={`₹${totalCollected.toLocaleString('en-IN')}`}
          subtext="Reconciled collections"
          icon={DollarSign}
          badgeText={totalInvoiced > 0 ? `${Math.round((totalCollected / totalInvoiced) * 100)}% Collected` : '0%'}
          badgeVariant="success"
        />
        <FinanceKpiCard 
          title="Outstanding Receivables"
          amount={`₹${outstandingAmount.toLocaleString('en-IN')}`}
          subtext="Pending payment clearance"
          icon={TrendingUp}
          badgeText={invoices.filter(i => i.status !== 'Paid').length > 0 ? `${invoices.filter(i => i.status !== 'Paid').length} Pending` : 'All Clear'}
          badgeVariant={invoices.filter(i => i.status !== 'Paid').length > 0 ? 'warning' : 'success'}
        />
        <FinanceKpiCard 
          title="Audit & Tax Status"
          amount="18% GST"
          subtext="Automated tax ledger"
          icon={ShieldCheck}
          badgeText="Verified"
          badgeVariant="success"
        />
      </div>

      {/* Invoices Ledger Table */}
      <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-foreground">Tax Invoices & Billing Ledger</h3>
            <p className="text-[11px] text-muted-foreground">All commercial invoices converted from quotations or issued to clients</p>
          </div>
          <Badge className="bg-primary text-primary-foreground font-mono text-[10px]">
            {invoices.length} INVOICES
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/40 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">INVOICE #</th>
                <th className="p-3.5">CLIENT NAME</th>
                <th className="p-3.5">TAXABLE VALUE (₹)</th>
                <th className="p-3.5">18% GST (₹)</th>
                <th className="p-3.5">TOTAL PAYABLE (₹)</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono">
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-sans font-medium text-foreground">
                      <div>{inv.clientName}</div>
                      {inv.clientPhone && <div className="text-[10px] text-muted-foreground font-mono">{inv.clientPhone}</div>}
                    </td>
                    <td className="p-3.5 text-muted-foreground">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-emerald-600">+₹{inv.gstAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-bold text-emerald-600">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                    <td className="p-3.5"><PaymentStatusBadge status={inv.status} /></td>
                    <td className="p-3.5 text-right space-x-1.5 font-sans">
                      <Button
                        size="sm"
                        onClick={() => handleSendWhatsAppReminder(inv)}
                        className="h-7 text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white gap-1 rounded-lg shadow-xs cursor-pointer"
                        title="Send WhatsApp Payment Reminder"
                      >
                        <Send className="w-3 h-3" /> WhatsApp
                      </Button>
                      {inv.status !== 'Paid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkPaid(inv.id)}
                          className="h-7 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 rounded-lg border-emerald-500/30 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Mark Paid
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-muted-foreground font-sans space-y-2">
                    <Clock className="w-8 h-8 text-muted-foreground mx-auto opacity-40 mb-2" />
                    <p className="font-bold text-foreground">No Invoices Issued Yet</p>
                    <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                      Convert any Quote in <strong>Quotations & GST</strong> or close a deal to automatically generate GST compliant invoices here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
