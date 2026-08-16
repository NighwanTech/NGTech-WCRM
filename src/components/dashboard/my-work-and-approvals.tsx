'use client'

import React, { useEffect, useState } from 'react'
import { 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  ArrowRight, 
  Send, 
  FileText, 
  Zap, 
  Percent, 
  Receipt,
  UserCheck,
  PhoneCall,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ApprovalItem {
  id: string
  type: 'proposal' | 'campaign' | 'discount' | 'invoice' | 'workflow'
  title: string
  requestedBy: string
  value?: string
  date: string
}

export function MyWorkAndApprovals() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'work' | 'approvals'>('work')
  const [workFilter, setWorkFilter] = useState<'all' | 'meetings' | 'tasks' | 'deals' | 'calls'>('all')
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [myWorkItems, setMyWorkItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const db = createClient()
    Promise.all([
      db.from('deals').select('id, name, value, status, created_at').eq('status', 'open').order('created_at', { ascending: false }).limit(4),
      db.from('contacts').select('id, name, phone, created_at').order('created_at', { ascending: false }).limit(3)
    ]).then(([dealsRes, contactsRes]) => {
      const items: any[] = []
      if (dealsRes.data) {
        dealsRes.data.forEach((d: any) => {
          items.push({
            id: `d-${d.id}`,
            category: 'deals',
            title: `Active Negotiation: ${d.name || 'Deal'}`,
            entity: `₹${(d.value || 0).toLocaleString('en-IN')}`,
            dueTime: 'Active Pipeline',
            icon: Briefcase,
            actionText: 'View Deal',
            actionUrl: '/pipelines'
          })
        })
      }
      if (contactsRes.data) {
        contactsRes.data.forEach((c: any) => {
          items.push({
            id: `c-${c.id}`,
            category: 'calls',
            title: `Customer Outreach: ${c.name || c.phone}`,
            entity: 'Inbound Contact',
            dueTime: 'Today',
            icon: PhoneCall,
            actionText: 'Open Chat',
            actionUrl: '/contacts'
          })
        })
      }
      setMyWorkItems(items)
    }).catch(() => {
      setMyWorkItems([])
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const filteredWorkItems = workFilter === 'all' 
    ? myWorkItems 
    : myWorkItems.filter(item => item.category === workFilter)

  const handleApprove = (id: string, title: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
    toast.success(`Approved: ${title}!`)
  }

  const handleReject = (id: string, title: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
    toast.error(`Declined: ${title}`)
  }

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-4 w-full overflow-hidden">
      {/* ── Main Tab Navigation Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('work')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'work' 
                  ? 'bg-background text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              💼 My Work & Action Items ({myWorkItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('approvals')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'approvals' 
                  ? 'bg-background text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📥 Approvals ({approvals.length})
            </button>
          </div>
        </div>

        {/* Work Category Filter Chips */}
        {activeTab === 'work' && (
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
            {(['all', 'deals', 'calls', 'meetings', 'tasks'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setWorkFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer shrink-0 ${
                  workFilter === cat 
                    ? 'bg-primary text-primary-foreground shadow-2xs' 
                    : 'bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── TAB 1: My Work Items List ── */}
      {activeTab === 'work' && (
        <div className="space-y-2.5">
          {filteredWorkItems.length > 0 ? (
            filteredWorkItems.map((item) => {
              const Icon = item.icon
              return (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-foreground text-xs truncate">{item.title}</div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground/80">{item.entity}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground/60" /> {item.dueTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => router.push(item.actionUrl)}
                    className="h-8 text-xs font-bold rounded-xl justify-between sm:justify-center gap-1.5 bg-primary text-primary-foreground shrink-0 cursor-pointer shadow-2xs"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )
            })
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              {loading ? 'Loading active work items...' : 'No pending tasks or action items. All assigned deals and leads are up to date.'}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: Approvals Inbox ── */}
      {activeTab === 'approvals' && (
        <div className="space-y-2.5">
          {approvals.length > 0 ? (
            approvals.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-xl border bg-card border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-xs">{item.title}</span>
                    {item.value && (
                      <Badge variant="outline" className="text-[10px] font-mono font-bold border-primary/30 text-primary">
                        {item.value}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Requested by: <strong className="text-foreground/80">{item.requestedBy}</strong></span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(item.id, item.title)}
                    className="h-8 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(item.id, item.title)}
                    className="h-8 text-xs font-semibold gap-1 text-rose-500 hover:bg-rose-500/10 border-rose-500/30 rounded-xl cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Inbox zero. All approval requests, discount overrides, and proposal reviews have been resolved.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
