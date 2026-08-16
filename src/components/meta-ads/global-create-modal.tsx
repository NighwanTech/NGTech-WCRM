"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, Layers, Users, Briefcase, FileText, DollarSign, Rocket, 
  Cpu, Plug, Shield, BookOpen, CreditCard 
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CreateOption {
  id: string
  title: string
  category: 'Marketing' | 'Sales' | 'Finance' | 'Automation' | 'System'
  description: string
  actionUrl: string
  icon: any
}

const CREATE_OPTIONS: CreateOption[] = [
  { id: '1', title: 'New Meta Ad Campaign', category: 'Marketing', description: 'Launch Meta Ads campaign with AI budget & copy hook', actionUrl: '/meta-ads/create', icon: Layers },
  { id: '2', title: 'New Lead (Universal Lead Hub)', category: 'Sales', description: 'Register inbound lead into UCAP pipeline', actionUrl: '/meta-ads/lead-integrations', icon: Users },
  { id: '3', title: 'New CRM Contact / Company', category: 'Sales', description: 'Create Customer 360 profile record', actionUrl: '/meta-ads', icon: Users },
  { id: '4', title: 'New Commercial Deal', category: 'Sales', description: 'Open deal card in Sales REP pipeline', actionUrl: '/meta-ads', icon: Briefcase },
  { id: '5', title: 'New Proposal & Scope of Work', category: 'Sales', description: 'Generate AI commercial proposal document', actionUrl: '/meta-ads', icon: FileText },
  { id: '6', title: 'New Quotation (18% GST Engine)', category: 'Finance', description: 'Create formal quotation with price book discounts', actionUrl: '/meta-ads', icon: DollarSign },
  { id: '7', title: 'New GST Invoice', category: 'Finance', description: 'Issue tax invoice & Razorpay payment link', actionUrl: '/meta-ads', icon: CreditCard },
  { id: '8', title: 'New Workflow Automation', category: 'Automation', description: 'Build visual drag & drop automation in EAP Hub', actionUrl: '/meta-ads/copilot', icon: Rocket },
  { id: '9', title: 'New AI Agent Employee', category: 'Automation', description: 'Deploy autonomous AI specialist agent', actionUrl: '/meta-ads/copilot', icon: Cpu },
  { id: '10', title: 'New Integration Connector', category: 'System', description: 'Connect WhatsApp, Shopify, Google, WooCommerce', actionUrl: '/meta-ads/settings', icon: Plug },
  { id: '11', title: 'New Platform User', category: 'System', description: 'Invite sales rep or manager with role permissions', actionUrl: '/meta-ads/settings', icon: Shield },
  { id: '12', title: 'New Knowledge Document', category: 'System', description: 'Upload PDF / Doc to Context Engine Memory', actionUrl: '/meta-ads/knowledge-base', icon: BookOpen }
]

export function GlobalCreateModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()

  const handleSelect = (opt: CreateOption) => {
    onOpenChange(false)
    toast.success(`Opening ${opt.title}...`)
    router.push(opt.actionUrl)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Universal Quick Create Menu
              </DialogTitle>
              <p className="text-[10px] text-muted-foreground">Select an object or workflow to create across AIWCRM Enterprise OS</p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 max-h-[420px] overflow-y-auto font-mono text-xs">
          {CREATE_OPTIONS.map(opt => {
            const Icon = opt.icon
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="p-3 rounded-xl border hover:border-primary/50 hover:bg-muted/40 transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground truncate">{opt.title}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{opt.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
