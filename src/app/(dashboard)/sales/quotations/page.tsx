'use client'

import React, { useState } from 'react'
import { Plus, FileText, Send, DollarSign, Calculator, Sparkles, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QuotationForm } from '@/components/sales/quotation-form'
import { QuotationPreview } from '@/components/sales/quotation-preview'
import { PaymentStatusBadge } from '@/components/sales/payment-status-badge'
import { toast } from 'sonner'

export default function SalesQuotationsPage() {
  const [activeTab, setActiveTab] = useState<'preview' | 'builder' | 'history'>('preview')

  const handleSendWhatsApp = (data?: any) => {
    toast.success('Quote sent successfully via WhatsApp!')
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
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

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('preview')}
            className="text-xs gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Quote Preview
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'builder' ? 'default' : 'outline'}
            onClick={() => setActiveTab('builder')}
            className="text-xs gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Create New Quote
          </Button>
        </div>
      </div>

      {/* Main Content Workspace */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <QuotationPreview 
            onSendWhatsApp={handleSendWhatsApp}
            onConvertToInvoice={() => toast.info('Quote converted to Invoice successfully!')}
            onConvertToProposal={() => setActiveTab('builder')}
          />

          {/* Quotations History Ledger */}
          <div className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
              <h3 className="font-bold text-sm text-foreground">Recent Quotation Ledger</h3>
              <div className="flex items-center gap-2">
                <Input placeholder="Filter quotes..." className="h-8 text-xs w-48" />
              </div>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3">QUOTE #</th>
                  <th className="p-3">CLIENT NAME</th>
                  <th className="p-3">SUBTOTAL</th>
                  <th className="p-3">18% GST</th>
                  <th className="p-3">TOTAL PAYABLE</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono font-semibold text-foreground">QT-2026-991</td>
                  <td className="p-3 font-medium text-foreground">Germopick Healthcare</td>
                  <td className="p-3 text-muted-foreground">₹18,00,000</td>
                  <td className="p-3 text-emerald-400 font-medium">+₹3,24,000</td>
                  <td className="p-3 font-bold text-emerald-500">₹21,24,000</td>
                  <td className="p-3"><PaymentStatusBadge status="Sent" /></td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-400" onClick={handleSendWhatsApp}>
                      Resend WhatsApp
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="border rounded-xl p-6 bg-card">
          <QuotationForm 
            onSave={() => {
              toast.success('Quote Draft Saved!')
              setActiveTab('preview')
            }}
            onSendWhatsApp={() => {
              handleSendWhatsApp()
              setActiveTab('preview')
            }}
          />
        </div>
      )}
    </div>
  )
}
