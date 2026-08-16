'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Plus, Share2, Send, CheckCircle2, List, Sparkles, ArrowRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProposalEditor, ProposalData } from '@/components/sales/proposal-editor'
import { PaymentStatusBadge } from '@/components/sales/payment-status-badge'
import { toast } from 'sonner'

const INITIAL_PROPOSALS: ProposalData[] = []

const DEFAULT_BLANK_PROPOSAL: ProposalData = {
  id: 'prop-new',
  proposalNumber: 'PROP-2026-001',
  title: 'Commercial Statement of Work (SOW)',
  clientName: '',
  contractValue: 0,
  status: 'Draft',
  executiveSummary: 'Commercial scope of work, deliverables outline, and SLA milestones.',
  deliverables: [
    { id: 'd1', title: 'Initial Project Discovery & Onboarding', timeline: 'Week 1' }
  ]
}

import { useRouter } from 'next/navigation'

const PROPOSALS_STORAGE_KEY = 'aiwcrm_sales_proposals_ledger_v1'

export default function SalesProposalsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'editor' | 'list'>('editor')
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [selectedProposal, setSelectedProposal] = useState<ProposalData>(DEFAULT_BLANK_PROPOSAL)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROPOSALS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProposals(parsed)
          setSelectedProposal(parsed[0])
        }
      }
    } catch {}
    setIsLoaded(true)
  }, [])

  const updateAndPersistProposals = (newProposals: ProposalData[]) => {
    setProposals(newProposals)
    try {
      localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(newProposals))
    } catch {}
  }

  const handleSelectProposal = (proposal: ProposalData) => {
    setSelectedProposal(proposal)
    setActiveTab('editor')
    toast.info(`Loaded ${proposal.proposalNumber}: ${proposal.title}`)
  }

  const handleCreateNewProposal = () => {
    const newProp: ProposalData = {
      id: `prop-${Date.now()}`,
      proposalNumber: `PROP-2026-00${proposals.length + 1}`,
      title: 'Commercial Proposal & Statement of Work',
      clientName: 'New Client Company',
      contractValue: 500000,
      status: 'Draft',
      executiveSummary: 'Commercial scope of work and deliverables outline.',
      deliverables: [
        { id: 'd1', title: 'Initial Project Discovery & Onboarding', timeline: 'Week 1' },
        { id: 'd2', title: 'System Deployment & Integrations', timeline: 'Week 2' }
      ]
    }
    const updated = [newProp, ...proposals]
    updateAndPersistProposals(updated)
    setSelectedProposal(newProp)
    setActiveTab('editor')
    toast.success('Created new proposal draft!')
  }

  const handleSaveProposal = (updatedData: ProposalData) => {
    const updated = proposals.some(p => p.proposalNumber === updatedData.proposalNumber)
      ? proposals.map(p => p.proposalNumber === updatedData.proposalNumber ? updatedData : p)
      : [updatedData, ...proposals]
    updateAndPersistProposals(updated)
    setSelectedProposal(updatedData)
    toast.success(`Proposal ${updatedData.proposalNumber} saved!`)
  }

  const handleDeleteProposal = (proposalNumber?: string) => {
    if (!proposalNumber) return
    const updated = proposals.filter(p => p.proposalNumber !== proposalNumber)
    updateAndPersistProposals(updated)
    if (selectedProposal.proposalNumber === proposalNumber) {
      setSelectedProposal(updated[0] || DEFAULT_BLANK_PROPOSAL)
    }
    toast.success(`Proposal ${proposalNumber} deleted`)
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
              <span className="font-semibold text-foreground">Proposals & Statement of Work (SOW)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Proposals & SOW Workspace
            </h1>
            <p className="text-xs text-muted-foreground">
              AI Proposal generator, milestone scopes of work, and real-time client approval tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={activeTab === 'editor' ? 'default' : 'outline'}
            onClick={() => setActiveTab('editor')}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Proposal Editor
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <List className="w-3.5 h-3.5" /> All Proposals ({proposals.length})
          </Button>
          <Button 
            size="sm" 
            onClick={handleCreateNewProposal}
            className="text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> New Proposal
          </Button>
        </div>
      </div>

      {/* Single Page Editor */}
      {activeTab === 'editor' && (
        <ProposalEditor 
          key={selectedProposal.proposalNumber} 
          initialData={selectedProposal} 
          onSave={handleSaveProposal}
        />
      )}

      {/* Proposals List */}
      {activeTab === 'list' && (
        <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-foreground">All Commercial Proposals</h3>
              <p className="text-[11px] text-muted-foreground">Click any proposal to open and edit with full actions</p>
            </div>
            <Button size="sm" className="text-xs gap-1.5 bg-primary text-primary-foreground font-bold" onClick={handleCreateNewProposal}>
              <Plus className="w-3.5 h-3.5" /> Create Proposal
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3.5">PROPOSAL #</th>
                  <th className="p-3.5">PROPOSAL TITLE</th>
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
                      onClick={() => handleSelectProposal(prop)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono font-bold text-foreground">{prop.proposalNumber}</td>
                      <td className="p-3.5 font-medium text-foreground">{prop.title}</td>
                      <td className="p-3.5 text-muted-foreground font-semibold">{prop.clientName}</td>
                      <td className="p-3.5 font-bold text-emerald-600">₹{prop.contractValue?.toLocaleString()}</td>
                      <td className="p-3.5"><PaymentStatusBadge status={prop.status} /></td>
                      <td className="p-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs text-primary hover:bg-primary/10 font-semibold"
                          onClick={() => handleSelectProposal(prop)}
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
                      No proposals created yet. Click <strong>+ New Proposal</strong> above to generate your first statement of work.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
