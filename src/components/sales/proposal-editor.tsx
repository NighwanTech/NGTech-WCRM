'use client'

import React, { useState } from 'react'
import { 
  FileText, Plus, Save, Share2, Send, Clock, CheckCircle2, 
  History, Trash2, ShieldCheck, Download, Sparkles, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { PaymentStatusBadge, PaymentStatus } from './payment-status-badge'

export interface DeliverableItem {
  id: string
  title: string
  timeline: string
}

export interface ProposalData {
  id?: string
  proposalNumber?: string
  title: string
  clientName: string
  clientPhone?: string
  contractValue?: number
  status: PaymentStatus
  executiveSummary: string
  deliverables: DeliverableItem[]
}

interface ProposalEditorProps {
  initialData?: ProposalData
  onSave?: (data: ProposalData) => void
}

export function ProposalEditor({ initialData, onSave }: ProposalEditorProps) {
  const [proposalNumber, setProposalNumber] = useState(initialData?.proposalNumber || 'PROP-2026-001')
  const [title, setTitle] = useState(initialData?.title || 'Commercial Statement of Work (SOW)')
  const [clientName, setClientName] = useState(initialData?.clientName || '')
  const [clientPhone, setClientPhone] = useState(initialData?.clientPhone || '')
  const [status, setStatus] = useState<PaymentStatus>(initialData?.status || 'Draft')
  const [contractValue, setContractValue] = useState<number>(initialData?.contractValue || 500000)
  const [executiveSummary, setExecutiveSummary] = useState(
    initialData?.executiveSummary ||
    'AIWCRM Enterprise OS deployment providing multi-channel WhatsApp CRM, Retell Voice AI integration, Meta Ads tracking, and automated lead nurturing for sales teams.'
  )
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(
    initialData?.deliverables && initialData.deliverables.length > 0
      ? initialData.deliverables
      : [
          { id: 'd1', title: 'WhatsApp Business API Onboarding & Embedded Signup', timeline: 'Week 1' },
          { id: 'd2', title: 'Sales Pipeline & Automated Workflow Configuration', timeline: 'Week 2' }
        ]
  )

  const addDeliverable = () => {
    setDeliverables([
      ...deliverables,
      { id: Date.now().toString(), title: 'Custom API Webhook & Workflow Integration', timeline: `Week ${deliverables.length + 1}` }
    ])
    toast.success('New milestone added!')
  }

  const deleteDeliverable = (id: string) => {
    if (deliverables.length <= 1) {
      toast.error('A proposal must have at least one milestone.')
      return
    }
    setDeliverables(deliverables.filter(d => d.id !== id))
    toast.success('Milestone removed.')
  }

  const handleShareLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/sales/proposals?id=${proposalNumber}`
    navigator.clipboard.writeText(url)
    toast.success('Client review & E-Sign link copied to clipboard!')
  }

  const handleSendWhatsApp = () => {
    const cleanPhone = clientPhone.replace(/\D/g, '')
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/sales/proposals?id=${proposalNumber}`
    
    const milestoneLines = deliverables.map(d => `• ${d.timeline}: ${d.title}`).join('\n')

    const msg = [
      `*COMMERCIAL PROPOSAL & SOW - AIWCRM*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📄 *Proposal No:* ${proposalNumber}`,
      `🏢 *Client:* ${clientName || 'Valued Client'}`,
      `📑 *Project Title:* ${title}`,
      `💰 *Contract Value:* ₹${contractValue?.toLocaleString('en-IN')}`,
      ``,
      `📋 *Key Milestone Deliverables:*`,
      milestoneLines,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🔗 *Review Scope & E-Sign:* ${shareUrl}`,
      `Reply *APPROVED* to this message to sign and commence onboarding.`
    ].join('\n')

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`

    setStatus('Sent')
    const updatedData: ProposalData = {
      proposalNumber,
      title,
      clientName,
      clientPhone,
      contractValue,
      status: 'Sent',
      executiveSummary,
      deliverables
    }
    if (onSave) onSave(updatedData)

    window.open(waUrl, '_blank')
    toast.success(`Proposal ${proposalNumber} saved & opened in WhatsApp!`)
  }

  const handleApprove = () => {
    setStatus('Paid')
    const updatedData: ProposalData = {
      proposalNumber,
      title,
      clientName,
      clientPhone,
      contractValue,
      status: 'Paid',
      executiveSummary,
      deliverables
    }
    if (onSave) onSave(updatedData)
    toast.success(`Proposal ${proposalNumber} approved & marked signed!`)
  }

  const handleSave = () => {
    const data: ProposalData = {
      proposalNumber,
      title,
      clientName,
      clientPhone,
      contractValue,
      status,
      executiveSummary,
      deliverables
    }
    if (onSave) onSave(data)
    toast.success('Proposal saved successfully!')
  }

  return (
    <div className="space-y-6 border rounded-2xl p-6 bg-card shadow-sm text-xs">
      {/* Top Header with Clean Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-bold text-foreground">Proposal & SOW Builder</h2>
            <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
              {proposalNumber}
            </Badge>
            {/* Status Selector */}
            <Select value={status} onValueChange={(val) => setStatus(val as PaymentStatus)}>
              <SelectTrigger className="h-6 w-32 text-[10px] font-bold border-primary/30 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Review">Under Review</SelectItem>
                <SelectItem value="Sent">Sent to Client</SelectItem>
                <SelectItem value="Paid">Approved / Signed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Client: <span className="font-bold text-foreground">{clientName || 'Not Specified'}</span> • Contract: <span className="font-bold text-emerald-600">₹{contractValue.toLocaleString()}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleShareLink} className="h-8 text-xs font-semibold gap-1.5 cursor-pointer">
            <Share2 className="w-3.5 h-3.5" /> Share Link
          </Button>
          <Button size="sm" variant="outline" onClick={handleApprove} className="h-8 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 gap-1.5 cursor-pointer">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approve SOW
          </Button>
          <Button size="sm" onClick={handleSendWhatsApp} className="h-8 text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white gap-1.5 cursor-pointer shadow-xs">
            <Send className="w-3.5 h-3.5" /> Send via WhatsApp
          </Button>
          <Button size="sm" onClick={handleSave} className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs">
            <Save className="w-3.5 h-3.5" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Proposal Title
          </label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold text-xs h-8 bg-background"
            placeholder="e.g. Enterprise CRM & WhatsApp Automation Proposal"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Client / Company Name
          </label>
          <Input 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)}
            className="font-semibold text-xs h-8 bg-background"
            placeholder="e.g. Apex Health Systems"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            WhatsApp Phone Number
          </label>
          <Input 
            value={clientPhone} 
            onChange={(e) => setClientPhone(e.target.value)}
            className="font-mono text-xs h-8 bg-background"
            placeholder="e.g. +91 98765 43210"
          />
        </div>
      </div>

      {/* Executive Summary */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Executive Summary & Project Objectives
        </label>
        <textarea
          rows={3}
          value={executiveSummary}
          onChange={(e) => setExecutiveSummary(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Deliverables & Milestones */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-1 border-b">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              Scope of Work & Milestone Deliverables
            </label>
            <p className="text-[10px] text-muted-foreground">
              Key delivery phases, timelines, and deliverables for client sign-off
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={addDeliverable} className="h-7 text-xs font-bold gap-1.5 cursor-pointer text-primary">
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </Button>
        </div>

        <div className="space-y-2">
          {deliverables.map((d, index) => (
            <div key={d.id} className="flex items-center gap-2.5 p-2.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                {index + 1}
              </span>
              <Input 
                value={d.title}
                onChange={(e) => {
                  const updated = [...deliverables]
                  updated[index].title = e.target.value
                  setDeliverables(updated)
                }}
                placeholder="Milestone description..."
                className="h-8 text-xs flex-1 bg-background"
              />
              <Input 
                value={d.timeline}
                onChange={(e) => {
                  const updated = [...deliverables]
                  updated[index].timeline = e.target.value
                  setDeliverables(updated)
                }}
                placeholder="e.g. Week 1"
                className="h-8 text-xs w-28 text-center bg-background shrink-0"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => deleteDeliverable(d.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                title="Delete Milestone"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
