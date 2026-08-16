'use client'

import React from 'react'
import { 
  Zap, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Bot, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface BusinessPulseRibbonProps {
  quotesPendingCount?: number
  approvalsCount?: number
  isWhatsAppConnected?: boolean
  revenueGrowth?: string
  collectionsStatus?: string
  totalRevenue?: string
}

export function BusinessPulseRibbon({
  quotesPendingCount = 0,
  approvalsCount = 0,
  isWhatsAppConnected = true,
  revenueGrowth = 'Live Ledger',
  collectionsStatus = '100% On-Time',
  totalRevenue = '₹0'
}: BusinessPulseRibbonProps) {
  const router = useRouter()

  const pulseItems = [
    {
      id: 'revenue',
      icon: TrendingUp,
      label: 'Closed Revenue',
      status: totalRevenue,
      tone: 'emerald',
      actionUrl: '/finance',
    },
    {
      id: 'quotes',
      icon: FileText,
      label: 'Active Proposals',
      status: quotesPendingCount > 0 ? `${quotesPendingCount} Pending Action` : 'All Reconciled',
      tone: quotesPendingCount > 0 ? 'amber' : 'emerald',
      actionUrl: '/sales/quotations',
    },
    {
      id: 'whatsapp',
      icon: MessageSquare,
      label: 'WhatsApp Gateway',
      status: isWhatsAppConnected ? 'Connected & Live' : 'Disconnected',
      tone: isWhatsAppConnected ? 'emerald' : 'rose',
      actionUrl: '/settings?tab=whatsapp',
    },
    {
      id: 'ai-sla',
      icon: Bot,
      label: 'AI & SLA Routing',
      status: 'Target < 15s',
      tone: 'emerald',
      actionUrl: '/flows',
    },
    {
      id: 'collections',
      icon: CreditCard,
      label: 'Collections & Aging',
      status: collectionsStatus,
      tone: 'emerald',
      actionUrl: '/finance',
    },
  ]

  const getToneClasses = (tone: string) => {
    switch (tone) {
      case 'emerald':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'amber':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'rose':
        return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
      default:
        return 'text-primary bg-primary/10 border-primary/20'
    }
  }

  return (
    <div className="w-full bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-2xs">
      <div className="flex items-center justify-between gap-4 overflow-x-auto hide-scrollbar text-xs">
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-border/80">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground">
            Live Business Pulse
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 shrink-0 overflow-x-auto hide-scrollbar">
          {pulseItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => router.push(item.actionUrl)}
                className="flex items-center gap-2 group cursor-pointer text-left transition-all hover:opacity-80 shrink-0"
              >
                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 ${getToneClasses(item.tone)}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.2 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {item.status}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
