"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, Layers, Users, Briefcase, FileText, DollarSign, Rocket, 
  Cpu, Plug, Shield, BookOpen, CreditCard, Megaphone, UserCheck, Heart
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CategorizedCreateOption {
  id: string
  title: string
  category: 'Marketing' | 'Lead Hub' | 'CRM' | 'Sales' | 'Finance' | 'Automation' | 'System'
  description: string
  actionUrl: string
  icon: any
}

const CATEGORIZED_OPTIONS: CategorizedCreateOption[] = [
  // Marketing
  { id: '1', title: 'New Meta Ad Campaign', category: 'Marketing', description: 'Launch Meta Ads campaign with AI budget & copy hook', actionUrl: '/meta-ads/create', icon: Layers },
  { id: '2', title: 'New Target Audience', category: 'Marketing', description: 'Mine Bihar lookalikes & interest clusters', actionUrl: '/meta-ads/audience-studio', icon: Users },
  { id: '3', title: 'New Ad Creative / Format', category: 'Marketing', description: 'Generate AI poster banners & reel scripts', actionUrl: '/meta-ads/creative-studio', icon: Layers },

  // Lead Hub
  { id: '4', title: 'New Lead (UCAP Pipeline)', category: 'Lead Hub', description: 'Register inbound lead into intake pipeline', actionUrl: '/meta-ads/lead-integrations', icon: Users },
  { id: '5', title: 'Import Leads (Excel / CSV)', category: 'Lead Hub', description: 'AI column auto-mapping & de-duplication import', actionUrl: '/meta-ads/lead-integrations', icon: Users },

  // CRM
  { id: '6', title: 'New Contact Record', category: 'CRM', description: 'Add new contact to Customer 360 Workspace', actionUrl: '/contacts', icon: UserCheck },
  { id: '7', title: 'New Company Account', category: 'CRM', description: 'Create enterprise account profile', actionUrl: '/contacts', icon: UserCheck },

  // Sales
  { id: '8', title: 'New Sales Deal', category: 'Sales', description: 'Open deal card in Sales REP pipeline', actionUrl: '/pipelines', icon: Briefcase },
  { id: '9', title: 'New Proposal & Scope of Work', category: 'Sales', description: 'Generate AI commercial proposal document', actionUrl: '/meta-ads', icon: FileText },
  { id: '10', title: 'New Quotation (18% GST Engine)', category: 'Sales', description: 'Create formal quotation with price book discounts', actionUrl: '/meta-ads', icon: DollarSign },
  { id: '11', title: 'Schedule Client Meeting', category: 'Sales', description: 'Log call transcript & action items', actionUrl: '/meta-ads', icon: Briefcase },

  // Finance
  { id: '12', title: 'New GST Invoice', category: 'Finance', description: 'Issue tax invoice & Razorpay payment link', actionUrl: '/meta-ads', icon: CreditCard },
  { id: '13', title: 'Record Payment Receipt', category: 'Finance', description: 'Log collections payment to financial ledger', actionUrl: '/meta-ads', icon: DollarSign },

  // Automation
  { id: '14', title: 'New Workflow Automation', category: 'Automation', description: 'Build visual drag & drop automation in EAP Hub', actionUrl: '/flows', icon: Rocket },
  { id: '15', title: 'New AI Agent Employee', category: 'Automation', description: 'Deploy autonomous AI specialist agent', actionUrl: '/meta-ads/copilot', icon: Cpu },

  // System
  { id: '16', title: 'New Platform User', category: 'System', description: 'Invite sales rep or manager with role permissions', actionUrl: '/settings?tab=overview', icon: Shield },
  { id: '17', title: 'New Integration Connector', category: 'System', description: 'Connect WhatsApp, Shopify, Google, WooCommerce', actionUrl: '/meta-ads/settings', icon: Plug },
  { id: '18', title: 'Upload Knowledge Document', category: 'System', description: 'Upload PDF / Doc to Context Engine Memory', actionUrl: '/meta-ads/knowledge-base', icon: BookOpen }
]

export function GlobalCreateModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const categories = ['ALL', 'Marketing', 'Lead Hub', 'CRM', 'Sales', 'Finance', 'Automation', 'System']

  const filtered = CATEGORIZED_OPTIONS.filter(o => selectedCategory === 'ALL' || o.category === selectedCategory)

  const handleSelect = (opt: CategorizedCreateOption) => {
    onOpenChange(false)
    toast.success(`Opening ${opt.title} at ${opt.actionUrl}...`)
    router.push(opt.actionUrl)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden font-mono text-xs">
        <DialogHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Universal Quick Create Menu (Grouped by Business Area)
              </DialogTitle>
              <p className="text-[10px] text-muted-foreground">Categorized creation menu across Marketing, Sales, Finance & Automation</p>
            </div>
          </div>
        </DialogHeader>

        {/* Business Area Category Filter Chips */}
        <div className="flex items-center gap-1 bg-muted/40 p-2 border-b overflow-x-auto text-[10px] font-bold">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2.5 py-1 rounded transition-all shrink-0 cursor-pointer ${
                selectedCategory === c ? 'bg-primary text-primary-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 max-h-[440px] overflow-y-auto font-mono text-xs">
          {filtered.map(opt => {
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
                    <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary shrink-0">
                      {opt.category}
                    </Badge>
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
