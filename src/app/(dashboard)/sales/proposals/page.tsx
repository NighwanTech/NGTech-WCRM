'use client'

import React, { useState } from 'react'
import { FileText, Plus, Share2, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProposalEditor } from '@/components/sales/proposal-editor'
import { PaymentStatusBadge } from '@/components/sales/payment-status-badge'
import { toast } from 'sonner'

export default function SalesProposalsPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'list'>('editor')

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
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

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={activeTab === 'editor' ? 'default' : 'outline'}
            onClick={() => setActiveTab('editor')}
            className="text-xs gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Proposal Editor
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
            className="text-xs gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> All Proposals
          </Button>
        </div>
      </div>

      {activeTab === 'editor' && <ProposalEditor />}

      {activeTab === 'list' && (
        <div className="border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
            <h3 className="font-bold text-sm text-foreground">Active Proposals & SOW Documents</h3>
            <Button size="sm" className="text-xs gap-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => setActiveTab('editor')}>
              <Plus className="w-3.5 h-3.5" /> Create Proposal
            </Button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3">PROPOSAL #</th>
                <th className="p-3">PROPOSAL TITLE</th>
                <th className="p-3">CLIENT</th>
                <th className="p-3">VERSION</th>
                <th className="p-3">CONTRACT VALUE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-3 font-mono font-semibold text-foreground">PROP-2026-001</td>
                <td className="p-3 font-medium text-foreground">Enterprise CRM & WhatsApp Automation Proposal</td>
                <td className="p-3 text-muted-foreground">Germopick Healthcare</td>
                <td className="p-3 font-mono">v1.2</td>
                <td className="p-3 font-bold text-emerald-500">₹21,24,000</td>
                <td className="p-3"><PaymentStatusBadge status="Review" /></td>
                <td className="p-3 text-right space-x-1">
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-400" onClick={() => toast.success('SOW Share Link Copied!')}>
                    <Share2 className="w-3 h-3" /> Share Link
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
