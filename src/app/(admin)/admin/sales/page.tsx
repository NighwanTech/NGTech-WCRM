'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Briefcase, Plus, FileText, Send, CheckCircle2, DollarSign, 
  Sparkles, Building2, User, Phone, Mail, ArrowRight, Trash2, 
  Share2, ShieldCheck, Download, ExternalLink, Calculator, List,
  Shield, Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

import { ProposalEditor, ProposalData } from '@/components/sales/proposal-editor'
import { QuotationForm } from '@/components/sales/quotation-form'
import { QuotationPreview } from '@/components/sales/quotation-preview'
import { PriceBookManagerModal } from '@/components/sales/pricebook-manager'
import { PaymentStatusBadge } from '@/components/sales/payment-status-badge'

export interface AdminDealItem {
  id: string
  clientName: string
  contactEmail: string
  contactPhone: string
  packageTitle: string
  dealValueInr: number
  gstAmount: number
  grandTotal: number
  stage: 'PROPOSAL_SENT' | 'NEGOTIATION' | 'LEGAL_REVIEW' | 'CLOSED_WON' | 'CLOSED_LOST'
  planTier: 'STARTER' | 'PRO' | 'ENTERPRISE' | 'CUSTOM'
  created_at: string
}

export interface AdminQuoteItem {
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

const AIWCRM_PACKAGES = [
  { id: 'p1', name: 'AIWCRM Enterprise Annual License (Unlimited Agents)', price: 1800000, plan: 'ENTERPRISE' },
  { id: 'p2', name: 'WhatsApp Business API Onboarding & Official Meta Verification', price: 75000, plan: 'PRO' },
  { id: 'p3', name: 'Retell & ElevenLabs Voice AI Calling Node (10,000 Mins)', price: 250000, plan: 'CUSTOM' },
  { id: 'p4', name: 'Custom CRM Pipeline & Meta CAPI Integration SLA', price: 150000, plan: 'ENTERPRISE' }
]

const ADMIN_DEALS_KEY = 'aiwcrm_admin_sales_deals_v1'
const ADMIN_PROPOSALS_KEY = 'aiwcrm_admin_sales_proposals_v1'
const ADMIN_QUOTES_KEY = 'aiwcrm_admin_sales_quotes_v1'

const DEFAULT_BLANK_PROPOSAL: ProposalData = {
  id: 'adm-prop-new',
  proposalNumber: 'SOW-AIW-2026-001',
  title: 'AIWCRM Enterprise Platform Deployment & SOW',
  clientName: '',
  clientPhone: '',
  contractValue: 1800000,
  status: 'Draft',
  executiveSummary: 'AIWCRM Enterprise OS deployment providing multi-tenant WhatsApp Business API, Retell Voice AI integration, Meta Ads tracking, and 24/7 dedicated enterprise SLA.',
  deliverables: [
    { id: 'd1', title: 'WhatsApp Business API Onboarding & Official Meta Verification', timeline: 'Week 1' },
    { id: 'd2', title: 'Custom CRM Pipeline & Automation Flow Setup', timeline: 'Week 2' },
    { id: 'd3', title: 'Retell & ElevenLabs Voice AI Speech Node Integration', timeline: 'Week 3' },
    { id: 'd4', title: 'Security, Compliance & Dedicated SLA Handover', timeline: 'Week 4' }
  ]
}

const DEFAULT_BLANK_QUOTE: AdminQuoteItem = {
  id: 'adm-q-new',
  quoteNumber: 'QT-AIW-2026-001',
  title: 'AIWCRM Commercial Platform Quotation',
  customerName: '',
  customerPhone: '',
  subtotal: 0,
  gstAmount: 0,
  grandTotal: 0,
  status: 'Draft'
}

export default function AdminSalesPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'deals' | 'proposals' | 'quotes'>('deals')
  
  // Deals State
  const [deals, setDeals] = useState<AdminDealItem[]>([])
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false)
  const [isProvisioning, setIsProvisioning] = useState(false)

  // Proposals State
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [selectedProposal, setSelectedProposal] = useState<ProposalData>(DEFAULT_BLANK_PROPOSAL)
  const [proposalSubTab, setProposalSubTab] = useState<'editor' | 'list'>('editor')

  // Quotes State
  const [quotes, setQuotes] = useState<AdminQuoteItem[]>([])
  const [selectedQuote, setSelectedQuote] = useState<AdminQuoteItem>(DEFAULT_BLANK_QUOTE)
  const [quoteSubTab, setQuoteSubTab] = useState<'preview' | 'builder' | 'list'>('builder')
  const [isPriceBookModalOpen, setIsPriceBookModalOpen] = useState(false)

  // Form State for Deals
  const [clientName, setClientName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(AIWCRM_PACKAGES[0].id)
  const [customPrice, setCustomPrice] = useState(AIWCRM_PACKAGES[0].price.toString())
  const [planTier, setPlanTier] = useState<AdminDealItem['planTier']>('ENTERPRISE')

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedDeals = localStorage.getItem(ADMIN_DEALS_KEY)
      if (storedDeals) {
        const parsed = JSON.parse(storedDeals)
        if (Array.isArray(parsed)) setDeals(parsed)
      }

      const storedProps = localStorage.getItem(ADMIN_PROPOSALS_KEY)
      if (storedProps) {
        const parsed = JSON.parse(storedProps)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProposals(parsed)
          setSelectedProposal(parsed[0])
        }
      }

      const storedQuotes = localStorage.getItem(ADMIN_QUOTES_KEY)
      if (storedQuotes) {
        const parsed = JSON.parse(storedQuotes)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuotes(parsed)
          setSelectedQuote(parsed[0])
          setQuoteSubTab('preview')
        }
      }
    } catch {}
  }, [])

  // Deals Helpers
  const persistDeals = (newDeals: AdminDealItem[]) => {
    setDeals(newDeals)
    try {
      localStorage.setItem(ADMIN_DEALS_KEY, JSON.stringify(newDeals))
    } catch {}
  }

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault()
    const pkg = AIWCRM_PACKAGES.find(p => p.id === selectedPackage)
    const baseValue = Number(customPrice) || (pkg?.price || 500000)
    const gst = Math.round(baseValue * 0.18)
    const total = baseValue + gst

    const newDeal: AdminDealItem = {
      id: `deal-adm-${Date.now()}`,
      clientName: clientName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      packageTitle: pkg?.name || 'Custom AIWCRM Solution Package',
      dealValueInr: baseValue,
      gstAmount: gst,
      grandTotal: total,
      stage: 'PROPOSAL_SENT',
      planTier,
      created_at: new Date().toISOString()
    }

    const updated = [newDeal, ...deals]
    persistDeals(updated)
    setIsAddDealModalOpen(false)
    setClientName('')
    setContactEmail('')
    setContactPhone('')
    toast.success(`Enterprise deal created for ${newDeal.clientName}!`)
  }

  const handleStageChange = (id: string, newStage: AdminDealItem['stage']) => {
    const updated = deals.map(d => d.id === id ? { ...d, stage: newStage } : d)
    persistDeals(updated)
    toast.success(`Deal stage updated to ${newStage.replace('_', ' ')}`)
  }

  const handleProvisionClient = async (deal: AdminDealItem) => {
    setIsProvisioning(true)
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert({
          name: deal.clientName,
          plan: deal.planTier.toLowerCase(),
          is_active: true
        })
        .select()

      if (!error) {
        toast.success(`🎉 Client Account "${deal.clientName}" provisioned directly into AIWCRM!`)
        handleStageChange(deal.id, 'CLOSED_WON')
      } else {
        toast.error(`Provisioning note: ${error.message}`)
        handleStageChange(deal.id, 'CLOSED_WON')
      }
    } catch (err: any) {
      toast.success(`Deal marked as CLOSED WON!`)
      handleStageChange(deal.id, 'CLOSED_WON')
    } finally {
      setIsProvisioning(false)
    }
  }

  const handleDeleteDeal = (id: string) => {
    const updated = deals.filter(d => d.id !== id)
    persistDeals(updated)
    toast.success('Deal removed from pipeline')
  }

  // Proposals Helpers
  const persistProposals = (newProps: ProposalData[]) => {
    setProposals(newProps)
    try {
      localStorage.setItem(ADMIN_PROPOSALS_KEY, JSON.stringify(newProps))
    } catch {}
  }

  const handleCreateNewProposal = () => {
    const newProp: ProposalData = {
      id: `adm-prop-${Date.now()}`,
      proposalNumber: `SOW-AIW-2026-00${proposals.length + 1}`,
      title: 'AIWCRM Platform Deployment & Statement of Work',
      clientName: 'New Client Enterprise',
      clientPhone: '',
      contractValue: 1800000,
      status: 'Draft',
      executiveSummary: 'AIWCRM Enterprise SaaS and WhatsApp Business API implementation.',
      deliverables: [
        { id: 'd1', title: 'WhatsApp Business API Onboarding & Verification', timeline: 'Week 1' },
        { id: 'd2', title: 'Custom CRM Pipeline Configuration', timeline: 'Week 2' }
      ]
    }
    const updated = [newProp, ...proposals]
    persistProposals(updated)
    setSelectedProposal(newProp)
    setProposalSubTab('editor')
    toast.success('Created new enterprise proposal draft!')
  }

  const handleSaveProposal = (updatedData: ProposalData) => {
    const updated = proposals.some(p => p.proposalNumber === updatedData.proposalNumber)
      ? proposals.map(p => p.proposalNumber === updatedData.proposalNumber ? updatedData : p)
      : [updatedData, ...proposals]
    persistProposals(updated)
    setSelectedProposal(updatedData)
    toast.success(`Proposal ${updatedData.proposalNumber} saved!`)
  }

  const handleDeleteProposal = (proposalNumber?: string) => {
    if (!proposalNumber) return
    const updated = proposals.filter(p => p.proposalNumber !== proposalNumber)
    persistProposals(updated)
    if (selectedProposal.proposalNumber === proposalNumber) {
      setSelectedProposal(updated[0] || DEFAULT_BLANK_PROPOSAL)
    }
    toast.success(`Proposal ${proposalNumber} deleted`)
  }

  // Quotes Helpers
  const persistQuotes = (newQuotes: AdminQuoteItem[]) => {
    setQuotes(newQuotes)
    try {
      localStorage.setItem(ADMIN_QUOTES_KEY, JSON.stringify(newQuotes))
    } catch {}
  }

  const handleSaveNewQuote = (quoteData: any, sendViaWhatsApp = false) => {
    const mainItemTitle = quoteData?.items?.[0]?.name || `${quoteData?.priceBook || 'AIWCRM'} Quotation`
    const formatted: AdminQuoteItem = {
      id: `adm-q-${Date.now()}`,
      quoteNumber: `QT-AIW-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: mainItemTitle,
      customerName: quoteData?.customerName?.trim() || 'Enterprise Client',
      customerPhone: quoteData?.customerPhone?.trim() || '',
      subtotal: quoteData?.subtotal || 0,
      gstAmount: quoteData?.gstAmount || 0,
      grandTotal: quoteData?.grandTotal || 0,
      status: sendViaWhatsApp ? 'Sent' : 'Draft'
    }

    const updated = [formatted, ...quotes]
    persistQuotes(updated)
    setSelectedQuote(formatted)
    setQuoteSubTab('preview')

    if (sendViaWhatsApp) {
      const cleanPhone = (formatted.customerPhone || '').replace(/\D/g, '')
      const msg = [
        `*OFFICIAL AIWCRM COMMERCIAL QUOTATION*`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📄 *Quote No:* ${formatted.quoteNumber}`,
        `🏢 *Client:* ${formatted.customerName}`,
        `📦 *Package:* ${formatted.title}`,
        ``,
        `💵 *Subtotal:* ₹${formatted.subtotal?.toLocaleString('en-IN')}`,
        `🏷️ *GST (18% Tax):* +₹${formatted.gstAmount?.toLocaleString('en-IN')}`,
        `💰 *Total Payable:* ₹${formatted.grandTotal?.toLocaleString('en-IN')}`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `⏳ *Validity:* 30 Days from date of issuance.`,
        `Reply *APPROVED* to this message to issue enterprise invoice and workspace keys.`
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

  const handleDeleteQuote = (quoteNumber: string) => {
    const updated = quotes.filter(q => q.quoteNumber !== quoteNumber)
    persistQuotes(updated)
    if (selectedQuote.quoteNumber === quoteNumber) {
      setSelectedQuote(updated[0] || DEFAULT_BLANK_QUOTE)
      if (updated.length === 0) setQuoteSubTab('builder')
    }
    toast.success(`Quote ${quoteNumber} deleted`)
  }

  // Pipeline Metrics
  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.stage !== 'CLOSED_LOST' ? d.grandTotal : 0), 0)
  const closedWonValue = deals.filter(d => d.stage === 'CLOSED_WON').reduce((sum, d) => sum + d.grandTotal, 0)
  const activeNegotiations = deals.filter(d => d.stage === 'NEGOTIATION' || d.stage === 'PROPOSAL_SENT').length

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-xs">
      {/* Superadmin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Crown className="w-3.5 h-3.5" /> Super Admin Control
            </span>
            <span>/</span>
            <span className="font-semibold text-foreground">AIWCRM Platform Sales Suite</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> AIWCRM Platform Sales & SOW Hub
          </h1>
          <p className="text-xs text-muted-foreground">
            Role-based enterprise pipeline, Statement of Work (SOW) proposals, dynamic GST rate cards & 1-click workspace provisioning
          </p>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-2xl border">
          <Button
            size="sm"
            variant={activeTab === 'deals' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('deals')}
            className="text-xs font-bold gap-1.5 rounded-xl cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" /> Deals Pipeline ({deals.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'proposals' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('proposals')}
            className="text-xs font-bold gap-1.5 rounded-xl cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> SOW Proposals ({proposals.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'quotes' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('quotes')}
            className="text-xs font-bold gap-1.5 rounded-xl cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" /> Quotations & GST ({quotes.length})
          </Button>
        </div>
      </div>

      {/* ===================== TAB 1: DEALS PIPELINE ===================== */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <Card className="border bg-card p-4 space-y-1 rounded-2xl shadow-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Platform Pipeline</span>
              <p className="text-xl font-extrabold text-foreground">₹{totalPipelineValue.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">All active enterprise sales</span>
            </Card>
            <Card className="border bg-card p-4 space-y-1 rounded-2xl shadow-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Closed-Won Revenue</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{closedWonValue.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-600">Provisioned client workspaces</span>
            </Card>
            <Card className="border bg-card p-4 space-y-1 rounded-2xl shadow-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Active Negotiations</span>
              <p className="text-xl font-extrabold text-primary">{activeNegotiations} Enterprise Accounts</p>
              <span className="text-[10px] text-muted-foreground">Proposal & legal review</span>
            </Card>
          </div>

          {/* Deals Ledger */}
          <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
            <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-foreground">AIWCRM Enterprise Sales Pipeline</h3>
                <p className="text-[11px] text-muted-foreground">Direct sales ledger for onboarding B2B clients to the AIWCRM platform</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddDealModalOpen(true)}
                className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" /> New AIWCRM Deal
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/40 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="p-3.5">CLIENT / COMPANY</th>
                    <th className="p-3.5">AIWCRM PACKAGE</th>
                    <th className="p-3.5">CONTRACT VALUE (₹)</th>
                    <th className="p-3.5">PLAN TIER</th>
                    <th className="p-3.5">STAGE</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {deals.length > 0 ? (
                    deals.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-sans">
                          <div className="font-bold text-foreground">{d.clientName}</div>
                          <div className="text-[10px] text-muted-foreground">{d.contactEmail} • {d.contactPhone}</div>
                        </td>
                        <td className="p-3.5 font-sans font-medium text-foreground max-w-xs truncate">
                          {d.packageTitle}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-emerald-600">₹{d.grandTotal.toLocaleString()}</div>
                          <div className="text-[9px] text-muted-foreground">Base: ₹{d.dealValueInr.toLocaleString()} + 18% GST</div>
                        </td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[9px] font-bold border-primary/30 text-primary">
                            {d.planTier}
                          </Badge>
                        </td>
                        <td className="p-3.5">
                          <Select value={d.stage} onValueChange={(val) => handleStageChange(d.id, val as any)}>
                            <SelectTrigger className="h-6 w-36 text-[10px] font-bold bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
                              <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                              <SelectItem value="LEGAL_REVIEW">Legal Review</SelectItem>
                              <SelectItem value="CLOSED_WON">Closed Won 🎉</SelectItem>
                              <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 font-sans">
                          {d.stage !== 'CLOSED_WON' ? (
                            <Button
                              size="sm"
                              onClick={() => handleProvisionClient(d)}
                              className="h-7 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-xs cursor-pointer rounded-lg"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Won & Provision
                            </Button>
                          ) : (
                            <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
                              PROVISIONED
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDeal(d.id)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground font-sans">
                        No enterprise platform deals created yet. Click <strong>+ New AIWCRM Deal</strong> above to track a high-ticket contract.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: PROPOSALS & SOW ===================== */}
      {activeTab === 'proposals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={proposalSubTab === 'editor' ? 'default' : 'outline'}
                onClick={() => setProposalSubTab('editor')}
                className="text-xs gap-1.5 cursor-pointer rounded-xl"
              >
                <FileText className="w-3.5 h-3.5" /> SOW Editor
              </Button>
              <Button
                size="sm"
                variant={proposalSubTab === 'list' ? 'default' : 'outline'}
                onClick={() => setProposalSubTab('list')}
                className="text-xs gap-1.5 cursor-pointer rounded-xl"
              >
                <List className="w-3.5 h-3.5" /> All Proposals ({proposals.length})
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleCreateNewProposal}
              className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> New Proposal
            </Button>
          </div>

          {proposalSubTab === 'editor' && (
            <ProposalEditor
              key={selectedProposal.proposalNumber}
              initialData={selectedProposal}
              onSave={handleSaveProposal}
            />
          )}

          {proposalSubTab === 'list' && (
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
              <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-foreground">AIWCRM Statement of Work (SOW) Ledger</h3>
                  <p className="text-[11px] text-muted-foreground">Click any proposal to edit, send via WhatsApp, or share E-Sign link</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/40 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b">
                    <tr>
                      <th className="p-3.5">PROPOSAL #</th>
                      <th className="p-3.5">TITLE</th>
                      <th className="p-3.5">CLIENT</th>
                      <th className="p-3.5">CONTRACT VALUE</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {proposals.length > 0 ? (
                      proposals.map((prop) => (
                        <tr
                          key={prop.proposalNumber}
                          onClick={() => {
                            setSelectedProposal(prop)
                            setProposalSubTab('editor')
                          }}
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                        >
                          <td className="p-3.5 font-mono font-bold text-foreground">{prop.proposalNumber}</td>
                          <td className="p-3.5 font-medium text-foreground">{prop.title}</td>
                          <td className="p-3.5 text-muted-foreground font-semibold">{prop.clientName || 'Unassigned'}</td>
                          <td className="p-3.5 font-bold text-emerald-600">₹{prop.contractValue?.toLocaleString()}</td>
                          <td className="p-3.5"><PaymentStatusBadge status={prop.status} /></td>
                          <td className="p-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-primary hover:bg-primary/10 font-semibold"
                              onClick={() => {
                                setSelectedProposal(prop)
                                setProposalSubTab('editor')
                              }}
                            >
                              Edit & Send <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteProposal(prop.proposalNumber)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                          No enterprise proposals generated yet. Click <strong>+ New Proposal</strong> above to draft a statement of work.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: QUOTATIONS & GST ===================== */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPriceBookModalOpen(true)}
                className="text-xs gap-1.5 cursor-pointer text-primary border-primary/30 rounded-xl"
              >
                <DollarSign className="w-3.5 h-3.5" /> Manage Price Books
              </Button>
              <Button
                size="sm"
                variant={quoteSubTab === 'preview' ? 'default' : 'outline'}
                onClick={() => setQuoteSubTab('preview')}
                className="text-xs gap-1.5 cursor-pointer rounded-xl"
              >
                <FileText className="w-3.5 h-3.5" /> Quote Viewer
              </Button>
              <Button
                size="sm"
                variant={quoteSubTab === 'list' ? 'default' : 'outline'}
                onClick={() => setQuoteSubTab('list')}
                className="text-xs gap-1.5 cursor-pointer rounded-xl"
              >
                <List className="w-3.5 h-3.5" /> All Quotes ({quotes.length})
              </Button>
              <Button
                size="sm"
                variant={quoteSubTab === 'builder' ? 'default' : 'outline'}
                onClick={() => setQuoteSubTab('builder')}
                className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Quote
              </Button>
            </div>
          </div>

          {/* Preview */}
          {quoteSubTab === 'preview' && (
            <QuotationPreview
              quoteNumber={selectedQuote.quoteNumber}
              title={selectedQuote.title}
              customerName={selectedQuote.customerName}
              subtotal={selectedQuote.subtotal}
              gstAmount={selectedQuote.gstAmount}
              grandTotal={selectedQuote.grandTotal}
              status={selectedQuote.status}
              onSendWhatsApp={() => {
                const cleanPhone = (selectedQuote.customerPhone || '').replace(/\D/g, '')
                const msg = [
                  `*OFFICIAL AIWCRM COMMERCIAL QUOTATION*`,
                  `━━━━━━━━━━━━━━━━━━━━`,
                  `📄 *Quote No:* ${selectedQuote.quoteNumber}`,
                  `🏢 *Client:* ${selectedQuote.customerName}`,
                  `📦 *Service:* ${selectedQuote.title}`,
                  ``,
                  `💵 *Subtotal:* ₹${selectedQuote.subtotal?.toLocaleString('en-IN')}`,
                  `🏷️ *GST (18% Tax):* +₹${selectedQuote.gstAmount?.toLocaleString('en-IN')}`,
                  `💰 *Total Payable:* ₹${selectedQuote.grandTotal?.toLocaleString('en-IN')}`,
                  `━━━━━━━━━━━━━━━━━━━━`,
                  `⏳ *Validity:* 30 Days from date of issuance.`,
                  `Reply *APPROVED* to this message to proceed with onboarding & invoicing.`
                ].join('\n')

                const waUrl = cleanPhone 
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
                  : `https://wa.me/?text=${encodeURIComponent(msg)}`

                const updated = quotes.map(q => q.quoteNumber === selectedQuote.quoteNumber ? { ...q, status: 'Sent' } : q)
                persistQuotes(updated)
                setSelectedQuote(prev => ({ ...prev, status: 'Sent' }))
                window.open(waUrl, '_blank')
                toast.success(`Quotation opened in WhatsApp!`)
              }}
              onConvertToInvoice={() => {
                const invoiceId = `INV-AIW-2026-${Math.floor(100 + Math.random() * 900)}`
                const newInvoice = {
                  id: `adm-inv-${Date.now()}`,
                  invoiceNumber: invoiceId,
                  clientName: selectedQuote.customerName || 'Enterprise Client',
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

                toast.success(`🎉 Official Enterprise Tax Invoice ${invoiceId} generated for ${selectedQuote.customerName}! Total: ₹${selectedQuote.grandTotal.toLocaleString('en-IN')}`)
              }}
              onConvertToProposal={() => {
                const propNumber = `SOW-AIW-2026-${Math.floor(100 + Math.random() * 900)}`
                const convertedProp: ProposalData = {
                  id: `adm-prop-${Date.now()}`,
                  proposalNumber: propNumber,
                  title: selectedQuote.title || 'AIWCRM Platform Deployment & SOW',
                  clientName: selectedQuote.customerName || 'Enterprise Client',
                  clientPhone: selectedQuote.customerPhone || '',
                  contractValue: selectedQuote.subtotal || selectedQuote.grandTotal,
                  status: 'Draft',
                  executiveSummary: `Commercial Statement of Work generated directly from Quotation ${selectedQuote.quoteNumber}. Total contract value of ₹${selectedQuote.grandTotal?.toLocaleString('en-IN')} (incl. 18% GST).`,
                  deliverables: [
                    { id: 'd1', title: `Phase 1: ${selectedQuote.title} Architecture & Verification`, timeline: 'Week 1' },
                    { id: 'd2', title: 'Phase 2: Core Platform & Integration Deployment', timeline: 'Week 2' },
                    { id: 'd3', title: 'Phase 3: 24/7 SLA Handover & Dedicated Account Key Activation', timeline: 'Week 3' }
                  ]
                }

                const updatedProps = [convertedProp, ...proposals]
                persistProposals(updatedProps)
                setSelectedProposal(convertedProp)
                setActiveTab('proposals')
                setProposalSubTab('editor')
                toast.success(`🎉 Converted Quote #${selectedQuote.quoteNumber} to SOW Proposal ${propNumber}!`)
              }}
            />
          )}

          {/* Builder */}
          {quoteSubTab === 'builder' && (
            <QuotationForm
              onSave={(newQuote: any) => handleSaveNewQuote(newQuote, false)}
              onSendWhatsApp={(newQuote: any) => handleSaveNewQuote(newQuote, true)}
            />
          )}

          {/* List */}
          {quoteSubTab === 'list' && (
            <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
              <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-foreground">AIWCRM Official Quotation Ledger</h3>
                  <p className="text-[11px] text-muted-foreground">Click any quote to view, edit, or dispatch via WhatsApp</p>
                </div>
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
                          onClick={() => {
                            setSelectedQuote(q)
                            setQuoteSubTab('preview')
                          }}
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
                              onClick={() => {
                                setSelectedQuote(q)
                                setQuoteSubTab('preview')
                              }}
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

          {/* Dynamic Price Book Modal */}
          <PriceBookManagerModal
            open={isPriceBookModalOpen}
            onOpenChange={setIsPriceBookModalOpen}
          />
        </div>
      )}

      {/* Add Deal Modal */}
      <Dialog open={isAddDealModalOpen} onOpenChange={setIsAddDealModalOpen}>
        <DialogContent className="sm:max-w-lg w-[95vw] p-0 gap-0 overflow-hidden font-sans border shadow-xl rounded-3xl bg-card">
          <DialogHeader className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-foreground">
                  Create AIWCRM Platform Deal
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Generate an enterprise contract & proposal for selling AIWCRM to a new client
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateDeal}>
            <div className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">
                  Client / Organization Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. Apex Health Systems Ltd"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="h-8 text-xs rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">
                    Contact Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="decision.maker@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="h-8 text-xs rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">
                    WhatsApp Phone Number
                  </Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="h-8 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">
                  Select AIWCRM Package
                </Label>
                <Select 
                  value={selectedPackage} 
                  onValueChange={(val) => {
                    if (val) {
                      setSelectedPackage(val)
                      const pkg = AIWCRM_PACKAGES.find(p => p.id === val)
                      if (pkg) {
                        setCustomPrice(pkg.price.toString())
                        setPlanTier(pkg.plan as any)
                      }
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-xs bg-background rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AIWCRM_PACKAGES.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} (₹{pkg.price.toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">
                    Contract Value (₹ INR) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="h-8 text-xs font-mono rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">
                    Assign Plan Tier
                  </Label>
                  <Select value={planTier} onValueChange={(val) => setPlanTier(val as any)}>
                    <SelectTrigger className="h-8 text-xs bg-background rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STARTER">Starter</SelectItem>
                      <SelectItem value="PRO">Pro</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                      <SelectItem value="CUSTOM">Custom Node</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="px-5 py-3.5 border-t bg-muted/20 flex justify-end gap-2 shrink-0 m-0">
              <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddDealModalOpen(false)} className="h-8 text-xs rounded-xl">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Create Enterprise Contract
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
