"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, Rocket, Users, Palette, TrendingUp, GitCommit, Sparkles, 
  Settings, FileText, Layers, ExternalLink, Plus, FileSpreadsheet, Briefcase, DollarSign, Plug, Play, Zap
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface SearchItem {
  id: string
  title: string
  category: 'Command' | 'Action' | 'Module' | 'Customer'
  description: string
  url: string
  actionName?: string
  icon: any
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: '1', title: 'Create Campaign Studio (Pro & AI Wizard)', category: 'Action', description: 'Build new Meta ad campaigns manually or with AI', actionName: 'Create Campaign', url: '/meta-ads/create', icon: Plus },
  { id: '2', title: 'Create Lead (Universal Lead Platform)', category: 'Action', description: 'Manually register a new lead in UCAP', actionName: 'Create Lead', url: '/meta-ads/lead-integrations', icon: Users },
  { id: '3', title: 'Create Enterprise Deal', category: 'Action', description: 'Create new deal in Sales REP pipeline', actionName: 'Create Deal', url: '/meta-ads', icon: Briefcase },
  { id: '4', title: 'Create Quotation with AI Pricing', category: 'Action', description: 'Generate formal quotation with GST discount rules', actionName: 'Create Quote', url: '/meta-ads', icon: DollarSign },
  { id: '5', title: 'Import Excel / CSV Leads File', category: 'Action', description: 'AI column auto-mapping & de-duplication import', actionName: 'Import Excel', url: '/meta-ads/lead-integrations', icon: FileSpreadsheet },
  { id: '6', title: 'Run Workflow Automation', category: 'Action', description: 'Execute Enterprise Automation Hub workflow', actionName: 'Run Workflow', url: '/meta-ads/copilot', icon: Play },
  { id: '7', title: 'Generate Proposal & SOW Document', category: 'Action', description: 'AI-generated commercial proposal & deliverables', actionName: 'Generate Proposal', url: '/meta-ads', icon: FileText },
  { id: '8', title: 'Open Rahul Sharma (Customer 360)', category: 'Customer', description: 'High-intent Bihar property buyer profile', actionName: 'Open Customer', url: '/meta-ads/lead-integrations', icon: Sparkles },
  { id: '9', title: 'Connect WhatsApp Cloud API', category: 'Action', description: 'Verify & link WhatsApp AI sales assistant', actionName: 'Connect WhatsApp', url: '/meta-ads/settings', icon: Plug },
  { id: '10', title: 'Publish Campaign to Meta Graph API', category: 'Action', description: 'Push campaign live to Meta Ad Account', actionName: 'Publish Campaign', url: '/meta-ads', icon: Rocket },

  { id: '11', title: 'Overview & Campaigns Dashboard', category: 'Module', description: 'View all active campaigns, metrics & ad accounts', url: '/meta-ads', icon: Layers },
  { id: '12', title: 'Universal Lead Operations (UCAP)', category: 'Module', description: 'Master Lead Center & source analytics', url: '/meta-ads/lead-integrations', icon: Users },
  { id: '13', title: 'Sales & Deals Execution (REP)', category: 'Module', description: 'Pipeline, proposals, quotes & playbooks', url: '/meta-ads', icon: Briefcase },
  { id: '14', title: 'Enterprise Automation Hub (EAP)', category: 'Module', description: 'Workflows, AI Agents, Rules & Scheduler', url: '/meta-ads/copilot', icon: Zap }
]

/**
 * PRD v16.0 Enterprise Command Palette (Ctrl + K / Cmd + K)
 */
export function GlobalSearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  // Keyboard shortcut listener for Ctrl + K / Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredItems = SEARCH_ITEMS.filter(item =>
    !query.trim() ||
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    (item.actionName && item.actionName.toLowerCase().includes(query.toLowerCase())) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (item: SearchItem) => {
    setOpen(false)
    setQuery("")
    if (item.category === 'Action') {
      toast.success(`Executed Command: ${item.actionName || item.title}`)
    }
    router.push(item.url)
  }

  return (
    <>
      {/* Search trigger button for Header */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-muted/40 hover:bg-muted/70 text-xs text-muted-foreground transition-all cursor-pointer"
        title="Global Search & Command Palette (Ctrl + K)"
      >
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="hidden sm:inline-block font-medium">Search Enterprise EOS (Ctrl + K)...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-background border rounded text-muted-foreground shadow-2xs">
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command (e.g. Create Quote, Open Rahul Sharma, Run Campaign)..."
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium h-8"
                autoFocus
              />
            </div>
          </DialogHeader>

          <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 text-xs">
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-xs font-mono">
                No matching enterprise commands or records found.
              </div>
            ) : (
              filteredItems.map(item => {
                const Icon = item.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="p-2.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/40 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground truncate">{item.title}</span>
                          <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary shrink-0">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
