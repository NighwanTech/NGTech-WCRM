'use client'

import React, { useEffect, useState } from 'react'
import { 
  History, 
  Briefcase, 
  FileText, 
  CreditCard, 
  Users, 
  Megaphone,
  ArrowUpRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RecentRecord {
  id: string
  title: string
  type: 'deal' | 'proposal' | 'quote' | 'invoice' | 'contact' | 'campaign'
  url: string
  sub?: string
}

export function RecentlyOpenedStrip() {
  const router = useRouter()
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const db = createClient()
    Promise.all([
      db.from('contacts').select('id, name, phone, created_at').order('created_at', { ascending: false }).limit(3),
      db.from('deals').select('id, name, value, created_at').order('created_at', { ascending: false }).limit(2),
    ]).then(([contactsRes, dealsRes]) => {
      const records: RecentRecord[] = []
      if (contactsRes.data) {
        contactsRes.data.forEach((c: any) => {
          if (c.name || c.phone) {
            records.push({ 
              id: `c-${c.id}`, 
              title: c.name || c.phone, 
              type: 'contact', 
              sub: 'Contact', 
              url: '/contacts' 
            })
          }
        })
      }
      if (dealsRes.data) {
        dealsRes.data.forEach((d: any) => {
          records.push({ 
            id: `d-${d.id}`, 
            title: d.name || 'Deal', 
            type: 'deal', 
            sub: `₹${(d.value || 0).toLocaleString('en-IN')}`, 
            url: '/pipelines' 
          })
        })
      }
      setRecentRecords(records)
    }).catch(() => {
      setRecentRecords([])
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const getIcon = (type: RecentRecord['type']) => {
    switch (type) {
      case 'deal': return <Briefcase className="w-3 h-3 text-blue-500" />
      case 'proposal': return <FileText className="w-3 h-3 text-indigo-500" />
      case 'quote': return <FileText className="w-3 h-3 text-amber-500" />
      case 'invoice': return <CreditCard className="w-3 h-3 text-emerald-500" />
      case 'contact': return <Users className="w-3 h-3 text-purple-500" />
      case 'campaign': return <Megaphone className="w-3 h-3 text-rose-500" />
    }
  }

  return (
    <div className="w-full bg-card border border-border/80 rounded-xl p-2 sm:px-3 sm:py-2 flex items-center gap-3 overflow-x-auto text-xs shadow-2xs">
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-muted-foreground text-[10.5px] shrink-0 pr-2 border-r border-border/70">
        <History className="w-3.5 h-3.5 text-primary" />
        <span>Recent Objects</span>
      </div>

      <div className="flex items-center gap-2 shrink-0 overflow-x-auto hide-scrollbar">
        {recentRecords.length > 0 ? (
          recentRecords.map((rec) => (
            <button
              key={rec.id}
              type="button"
              onClick={() => router.push(rec.url)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-muted/80 border border-border/60 transition-colors cursor-pointer shrink-0 text-left group"
            >
              {getIcon(rec.type)}
              <span className="font-semibold text-foreground text-[11px] truncate">{rec.title}</span>
              {rec.sub && (
                <span className="text-[10px] text-muted-foreground font-mono">({rec.sub})</span>
              )}
              <ArrowUpRight className="w-3 h-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))
        ) : (
          <span className="text-[11px] text-muted-foreground font-medium">
            {loading ? 'Loading recent items...' : 'Live workspace active. Newly created contacts and deals will appear here automatically.'}
          </span>
        )}
      </div>
    </div>
  )
}
