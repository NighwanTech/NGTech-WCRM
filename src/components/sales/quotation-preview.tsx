'use client'

import React from 'react'
import { FileText, Send, CheckCircle, Download, ExternalLink, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaymentStatusBadge, PaymentStatus } from './payment-status-badge'

interface QuotationPreviewProps {
  quoteNumber?: string
  title?: string
  customerName?: string
  subtotal?: number
  gstAmount?: number
  grandTotal?: number
  status?: PaymentStatus
  onSendWhatsApp?: () => void
  onConvertToInvoice?: () => void
  onConvertToProposal?: () => void
}

export function QuotationPreview({
  quoteNumber = 'QT-2026-991',
  title = 'Meta Ads OS Enterprise Plan (12 Months)',
  customerName = 'Germopick Healthcare',
  subtotal = 1800000,
  gstAmount = 324000,
  grandTotal = 2124000,
  status = 'Sent',
  onSendWhatsApp,
  onConvertToInvoice,
  onConvertToProposal
}: QuotationPreviewProps) {
  return (
    <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
      {/* Top Banner Header - Clean High-Contrast */}
      <div className="bg-muted/40 p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">
              AI Quotation Engine & Discount Rules
            </span>
            <PaymentStatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi price books, tax calculation (18% GST) & AI discount recommendations
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full shrink-0">
          QUOTE #{quoteNumber}
        </span>
      </div>

      {/* Main Commercial Card Content */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">Prepared for: <span className="font-semibold text-foreground">{customerName}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">18% GST Tax Included</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+₹{gstAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-muted/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-border/50">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Payable Amount</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ₹{grandTotal.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-xs gap-1 cursor-pointer" onClick={onConvertToProposal}>
              <FileText className="w-3.5 h-3.5" /> Convert to Proposal
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1 cursor-pointer" onClick={onConvertToInvoice}>
              <CheckCircle className="w-3.5 h-3.5" /> Convert to Invoice
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground text-xs gap-1 cursor-pointer" onClick={onSendWhatsApp}>
              <Send className="w-3.5 h-3.5" /> Send Quote via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
