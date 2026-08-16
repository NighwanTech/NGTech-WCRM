'use client'

import React, { useState } from 'react'
import { FileText, Plus, Save, Share2, Send, Clock, CheckCircle2, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PaymentStatusBadge, PaymentStatus } from './payment-status-badge'

interface DeliverableItem {
  id: string
  title: string
  timeline: string
}

export function ProposalEditor() {
  const [title, setTitle] = useState('Enterprise CRM & WhatsApp Automation Proposal')
  const [status, setStatus] = useState<PaymentStatus>('Review')
  const [executiveSummary, setExecutiveSummary] = useState(
    'AIWCRM Enterprise OS deployment providing multi-channel WhatsApp CRM, Retell Voice AI integration, Meta Ads tracking, and automated lead nurturing for sales teams.'
  )
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([
    { id: 'd1', title: 'WhatsApp Business API Onboarding & Embedded Signup', timeline: 'Week 1' },
    { id: 'd2', title: 'Sales Pipeline & Automated Workflow Configuration', timeline: 'Week 2' },
    { id: 'd3', title: 'Retell & ElevenLabs Voice AI Calling Integration', timeline: 'Week 3' },
    { id: 'd4', title: 'Team Training & 24/7 SLA Support Setup', timeline: 'Week 4' }
  ])

  const addDeliverable = () => {
    setDeliverables([
      ...deliverables,
      { id: Date.now().toString(), title: 'Custom API Webhook Integration', timeline: 'Week 5' }
    ])
  }

  return (
    <div className="space-y-6 border rounded-xl p-6 bg-card">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Proposal & Statement of Work (SOW) Builder</h2>
            <PaymentStatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground">Version 1.2 — Last edited 10 mins ago</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs gap-1">
            <History className="w-3.5 h-3.5" /> History
          </Button>
          <Button size="sm" variant="outline" className="text-xs gap-1">
            <Share2 className="w-3.5 h-3.5" /> Share Link
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1">
            <Send className="w-3.5 h-3.5" /> Send via WhatsApp
          </Button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
          Proposal Title
        </label>
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="font-semibold text-sm"
        />
      </div>

      {/* Executive Summary */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
          Executive Summary
        </label>
        <textarea
          rows={3}
          value={executiveSummary}
          onChange={(e) => setExecutiveSummary(e.target.value)}
          className="w-full rounded-md border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Deliverables & Milestones */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Scope of Work & Deliverables
          </label>
          <Button size="sm" variant="ghost" onClick={addDeliverable} className="text-xs gap-1 text-indigo-400">
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </Button>
        </div>

        <div className="space-y-2">
          {deliverables.map((d, index) => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20 text-xs">
              <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-xs">
                {index + 1}
              </span>
              <Input 
                value={d.title}
                onChange={(e) => {
                  const updated = [...deliverables]
                  updated[index].title = e.target.value
                  setDeliverables(updated)
                }}
                className="h-8 text-xs flex-1"
              />
              <Input 
                value={d.timeline}
                onChange={(e) => {
                  const updated = [...deliverables]
                  updated[index].timeline = e.target.value
                  setDeliverables(updated)
                }}
                className="h-8 text-xs w-28 text-center"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
