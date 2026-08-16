'use client'

import React, { useState, useEffect } from 'react'
import { Plus, FileText, Send, DollarSign, Calculator, Sparkles, Filter, Search, List, ArrowRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QuotationForm } from '@/components/sales/quotation-form'
import { QuotationPreview } from '@/components/sales/quotation-preview'
import { PaymentStatusBadge } from '@/components/sales/payment-status-badge'
import { toast } from 'sonner'

export interface QuoteItem {
  id: string
  quoteNumber: string
  title: string
  customerName: string
  customerPhone?: string
  subtotal: number
  gstAmount: number
  grandTotal: number
  status: any
}

const INITIAL_QUOTES: QuoteItem[] = []

const DEFAULT_BLANK_QUOTE: QuoteItem = {
  id: 'q-new',
  quoteNumber: 'QT-2026-001',
  title: 'Commercial Quotation & GST Breakdown',
  customerName: '',
  customerPhone: '',
  subtotal: 0,
  gstAmount: 0,
  grandTotal: 0,
  status: 'Draft'
}

import { useRouter } from 'next/navigation'

import { PriceBookManagerModal } from '@/components/sales/pricebook-manager'

const QUOTES_STORAGE_KEY = 'aiwcrm_sales_quotations_ledger_v1'

export default function SalesQuotationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'preview' | 'builder' | 'list'>('builder')
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem>(DEFAULT_BLANK_QUOTE)
  const [isPriceBookModalOpen, setIsPriceBookModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUOTES_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuotes(parsed)
          setSelectedQuote(parsed[0])
          setActiveTab('preview')
        }
      }
    } catch {}
    setIsLoaded(true)
  }, [])

  // Sync to localStorage
  const updateAndPersistQuotes = (newQuotes: QuoteItem[]) => {
    setQuotes(newQuotes)
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(newQuotes))
    } catch {}
  }

  const handleSendWhatsApp = () => {
    if (!selectedQuote) return
    const cleanPhone = (selectedQuote.customerPhone || '').replace(/\D/g, '')
    const msg = [
      `*COMMERCIAL QUOTATION - AIWCRM*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📄 *Quote No:* ${selectedQuote.quoteNumber}`,
      `👤 *Client:* ${selectedQuote.customerName || 'Valued Client'}`,
      `📦 *Service / Scope:* ${selectedQuote.title}`,
      ``,
      `💵 *Subtotal:* ₹${selectedQuote.subtotal?.toLocaleString('en-IN')}`,
      `🏷️ *GST (18% Tax):* +₹${selectedQuote.gstAmount?.toLocaleString('en-IN')}`,
      `💰 *Total Payable:* ₹${selectedQuote.grandTotal?.toLocaleString('en-IN')}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `⏳ *Validity:* 30 Days from date of issuance.`,
      `Reply to this message with *APPROVED* to proceed with onboarding & invoicing.`
    ].join('\n')

    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`

    // Update status to 'Sent' in memory and localStorage
    const updated = quotes.map(q => q.quoteNumber === selectedQuote.quoteNumber ? { ...q, status: 'Sent' } : q)
    updateAndPersistQuotes(updated)
    setSelectedQuote(prev => ({ ...prev, status: 'Sent' }))

    window.open(waUrl, '_blank')
    toast.success(`Quotation ${selectedQuote.quoteNumber} prepared and opened in WhatsApp!`)
  }

  const handleSelectQuote = (q: QuoteItem) => {
    setSelectedQuote(q)
    setActiveTab('preview')
    toast.info(`Loaded Quote ${q.quoteNumber}`)
  }

  const handleDeleteQuote = (quoteNumber: string) => {
    const updated = quotes.filter(q => q.quoteNumber !== quoteNumber)
    updateAndPersistQuotes(updated)
    if (selectedQuote.quoteNumber === quoteNumber) {
      setSelectedQuote(updated[0] || DEFAULT_BLANK_QUOTE)
      if (updated.length === 0) setActiveTab('builder')
    }
    toast.success(`Quote ${quoteNumber} deleted`)
  }

  const handleSaveNewQuote = (quoteData: any, sendViaWhatsApp = false) => {
    const mainItemTitle = quoteData?.items?.[0]?.name || `${quoteData?.priceBook || 'Commercial'} Quotation`
    const formatted: QuoteItem = {
      id: `q-${Date.now()}`,
      quoteNumber: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: mainItemTitle,
      customerName: quoteData?.customerName?.trim() || 'Valued Client',
      customerPhone: quoteData?.customerPhone?.trim() || '',
      subtotal: quoteData?.subtotal || 0,
      gstAmount: quoteData?.gstAmount || 0,
      grandTotal: quoteData?.grandTotal || 0,
      status: sendViaWhatsApp ? 'Sent' : 'Draft'
    }

    const updated = [formatted, ...quotes]
    updateAndPersistQuotes(updated)
    setSelectedQuote(formatted)
    setActiveTab('preview')

    if (sendViaWhatsApp) {
      const cleanPhone = (formatted.customerPhone || '').replace(/\D/g, '')
      const msg = [
        `*COMMERCIAL QUOTATION - AIWCRM*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📄 *Quote No:* ${formatted.quoteNumber}`,
        `👤 *Client:* ${formatted.customerName}`,
        `📦 *Service:* ${formatted.title}`,
        ``,
        `💵 *Subtotal:* ₹${formatted.subtotal?.toLocaleString('en-IN')}`,
        `🏷️ *GST (18% Tax):* +₹${formatted.gstAmount?.toLocaleString('en-IN')}`,
        `💰 *Total Payable:* ₹${formatted.grandTotal?.toLocaleString('en-IN')}`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `⏳ *Validity:* 30 Days from date of issuance.`,
        `Reply to this message with *APPROVED* to proceed with onboarding & invoicing.`
      ].join('\n')

      const waUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`

      window.open(waUrl, '_blank')
      toast.success(`Quotation ${formatted.quoteNumber} saved & opened in WhatsApp!`)
    } else {
      toast.success(`Quotation ${formatted.quoteNumber} saved successfully!`)
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
              <span>Sales (REP)</span>
              <span>/</span>
              <span className="font-semibold text-foreground">Quotations & GST Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Quotations & GST Workspace
            </h1>
            <p className="text-xs text-muted-foreground">
              Multi price-book quotation engine, 18% GST calculation, AI discount guard & WhatsApp dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsPriceBookModalOpen(true)}
            className="text-xs gap-1.5 cursor-pointer text-primary border-primary/30"
          >
            <DollarSign className="w-3.5 h-3.5" /> Manage Price Books
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('preview')}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Quote Viewer
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <List className="w-3.5 h-3.5" /> All Quotes ({quotes.length})
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'builder' ? 'default' : 'outline'}
            onClick={() => setActiveTab('builder')}
            className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Quote
          </Button>
        </div>
      </div>

      {/* Quote Preview / Viewer */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <QuotationPreview 
            quoteNumber={selectedQuote.quoteNumber}
            title={selectedQuote.title}
            customerName={selectedQuote.customerName}
            subtotal={selectedQuote.subtotal}
            gstAmount={selectedQuote.gstAmount}
            grandTotal={selectedQuote.grandTotal}
            status={selectedQuote.status}
            onSendWhatsApp={handleSendWhatsApp}
            onConvertToInvoice={() => {
              const invoiceId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`
              const newInvoice = {
                id: `inv-${Date.now()}`,
                invoiceNumber: invoiceId,
                clientName: selectedQuote.customerName || 'Valued Client',
                clientPhone: selectedQuote.customerPhone || '',
                subtotal: selectedQuote.subtotal || 0,
                gstAmount: selectedQuote.gstAmount || 0,
                grandTotal: selectedQuote.grandTotal || 0,
                issueDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Draft',
                sourceQuoteId: selectedQuote.quoteNumber
              }

              try {
                const existing = JSON.parse(localStorage.getItem('aiwcrm_finance_invoices_v1') || '[]')
                localStorage.setItem('aiwcrm_finance_invoices_v1', JSON.stringify([newInvoice, ...existing]))
              } catch {}

              toast.success(`🎉 Tax Invoice ${invoiceId} generated from Quote #${selectedQuote.quoteNumber}! Total: ₹${selectedQuote.grandTotal.toLocaleString('en-IN')}`)
              router.push('/finance')
            }}
            onConvertToProposal={() => {
              const propNumber = `PROP-2026-${Math.floor(100 + Math.random() * 900)}`
              const newProp = {
                id: `prop-${Date.now()}`,
                proposalNumber: propNumber,
                title: selectedQuote.title || 'Commercial Statement of Work (SOW)',
                clientName: selectedQuote.customerName || 'Valued Client',
                clientPhone: selectedQuote.customerPhone || '',
                contractValue: selectedQuote.subtotal || selectedQuote.grandTotal,
                status: 'Draft' as const,
                executiveSummary: `Commercial Statement of Work generated directly from Quotation ${selectedQuote.quoteNumber}. Total contract valuation of ₹${selectedQuote.grandTotal?.toLocaleString('en-IN')} (incl. 18% GST).`,
                deliverables: [
                  { id: 'd1', title: `Phase 1: ${selectedQuote.title} Kickoff & Discovery`, timeline: 'Week 1' },
                  { id: 'd2', title: 'Phase 2: Core Platform & Integration Deployment', timeline: 'Week 2' },
                  { id: 'd3', title: 'Phase 3: Team Training & SLA Activation', timeline: 'Week 3' }
                ]
              }

              try {
                const existing = JSON.parse(localStorage.getItem('aiwcrm_sales_proposals_ledger_v1') || '[]')
                localStorage.setItem('aiwcrm_sales_proposals_ledger_v1', JSON.stringify([newProp, ...existing]))
              } catch {}

              toast.success(`🎉 Converted Quote #${selectedQuote.quoteNumber} into Proposal ${propNumber}!`)
              router.push('/sales/proposals')
            }}
          />
        </div>
      )}

      {/* Quote Form Builder */}
      {activeTab === 'builder' && (
        <QuotationForm 
          onSave={(newQuote: any) => handleSaveNewQuote(newQuote, false)}
          onSendWhatsApp={(newQuote: any) => handleSaveNewQuote(newQuote, true)}
        />
      )}

      {/* Quotations List */}
      {activeTab === 'list' && (
        <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-foreground">Commercial Quotation Ledger</h3>
              <p className="text-[11px] text-muted-foreground">Click any quotation to view, edit, or dispatch via WhatsApp</p>
            </div>
            <Button size="sm" className="text-xs gap-1.5 bg-primary text-primary-foreground font-bold" onClick={() => setActiveTab('builder')}>
              <Plus className="w-3.5 h-3.5" /> Create Quote
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3.5">QUOTE #</th>
                  <th className="p-3.5">CLIENT NAME</th>
                  <th className="p-3.5">SUBTOTAL</th>
                  <th className="p-3.5">18% GST</th>
                  <th className="p-3.5">TOTAL PAYABLE</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quotes.length > 0 ? (
                  quotes.map((q) => (
                    <tr 
                      key={q.quoteNumber} 
                      onClick={() => handleSelectQuote(q)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono font-bold text-foreground">{q.quoteNumber}</td>
                      <td className="p-3.5 font-medium text-foreground">{q.customerName}</td>
                      <td className="p-3.5 text-muted-foreground font-mono">₹{q.subtotal.toLocaleString()}</td>
                      <td className="p-3.5 text-emerald-600 font-mono">+₹{q.gstAmount.toLocaleString()}</td>
                      <td className="p-3.5 font-bold text-emerald-600 font-mono">₹{q.grandTotal.toLocaleString()}</td>
                      <td className="p-3.5"><PaymentStatusBadge status={q.status} /></td>
                      <td className="p-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs text-primary hover:bg-primary/10 font-semibold"
                          onClick={() => handleSelectQuote(q)}
                        >
                          View & Send <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteQuote(q.quoteNumber)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-muted-foreground">
                      No quotations generated yet. Use the <strong>Create New Quote</strong> builder to calculate GST and generate quotes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic Price Book Manager Modal */}
      <PriceBookManagerModal
        open={isPriceBookModalOpen}
        onOpenChange={setIsPriceBookModalOpen}
      />
    </div>
  )
}
