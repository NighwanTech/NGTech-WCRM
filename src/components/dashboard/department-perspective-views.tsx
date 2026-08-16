'use client'

import React, { useState } from 'react'
import { 
  Building2, 
  Briefcase, 
  Megaphone, 
  CreditCard, 
  HeartHandshake, 
  Headphones,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

export type DepartmentPerspective = 'executive' | 'sales' | 'marketing' | 'finance' | 'cs' | 'support'

interface DepartmentPerspectiveViewsProps {
  initialPerspective?: DepartmentPerspective
  activePerspective?: DepartmentPerspective
  onPerspectiveChange?: (p: DepartmentPerspective) => void
  totalRevenue?: string
  pipelineValue?: string
  collectionsValue?: string
}

export function DepartmentPerspectiveViews({
  initialPerspective = 'executive',
  activePerspective,
  onPerspectiveChange,
  totalRevenue = '₹0',
  pipelineValue = '₹0',
  collectionsValue = '₹0'
}: DepartmentPerspectiveViewsProps) {
  const router = useRouter()
  const [perspective, setPerspective] = useState<DepartmentPerspective>(activePerspective || initialPerspective)

  React.useEffect(() => {
    if (activePerspective) {
      setPerspective(activePerspective)
    }
  }, [activePerspective])

  const handleTabClick = (id: DepartmentPerspective) => {
    setPerspective(id)
    onPerspectiveChange?.(id)
  }

  const tabs: { id: DepartmentPerspective; label: string; icon: React.ElementType }[] = [
    { id: 'executive', label: 'Executive 360°', icon: Building2 },
    { id: 'sales', label: 'Sales & Revenue', icon: Briefcase },
    { id: 'marketing', label: 'Marketing & Ads', icon: Megaphone },
    { id: 'finance', label: 'Finance & GST', icon: CreditCard },
    { id: 'cs', label: 'Customer Success', icon: HeartHandshake },
    { id: 'support', label: 'Support & SLA', icon: Headphones },
  ]

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-4 w-full overflow-hidden">
      {/* ── Perspective Switcher Strip ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department Operational Perspective</h3>
          <p className="text-sm font-bold text-foreground truncate">Role-Specific Executive Cockpit</p>
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl overflow-x-auto max-w-full hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = perspective === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-background text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Role Perspective Content Area ── */}
      <div className="pt-1">
        {perspective === 'executive' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Active Deals Pipeline</span>
              <p className="text-2xl font-black text-foreground">{pipelineValue}</p>
              <p className="text-[11px] text-muted-foreground">Active negotiation & qualified stages</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Closed Revenue (Tax Invoiced)</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalRevenue}</p>
              <p className="text-[11px] text-muted-foreground">18% GST tax compliant financial ledger</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Collections & Liquidity</span>
              <p className="text-2xl font-black text-foreground">{collectionsValue}</p>
              <p className="text-[11px] text-muted-foreground">0 bad debt across aging buckets</p>
            </div>
          </div>
        )}

        {perspective === 'sales' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Pipeline Value</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{pipelineValue}</p>
              <p className="text-[11px] text-muted-foreground">Live multi-stage deal tracking</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">SOW Proposals & Quotes</span>
              <p className="text-2xl font-black text-foreground">{totalRevenue}</p>
              <p className="text-[11px] text-muted-foreground">Standardized price book quotations</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Average Sales Cycle</span>
              <p className="text-2xl font-black text-foreground">3.2 Days</p>
              <p className="text-[11px] text-muted-foreground">Fast WhatsApp 1-click contract closures</p>
            </div>
          </div>
        )}

        {perspective === 'marketing' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Meta Ads Manager Pro</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">Live API</p>
              <p className="text-[11px] text-muted-foreground">Direct Click-to-WhatsApp Ads CAPI</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Broadcast Deliverability</span>
              <p className="text-2xl font-black text-foreground">99.4%</p>
              <p className="text-[11px] text-muted-foreground">Official WhatsApp Cloud API gateway</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Target ROAS</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">4.6x</p>
              <p className="text-[11px] text-muted-foreground">High-intent Lead Gen Campaigns</p>
            </div>
          </div>
        )}

        {perspective === 'finance' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">GST Invoices Reconciled</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalRevenue}</p>
              <p className="text-[11px] text-muted-foreground">18% HSN/SAC automated tax breakdown</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Overdue Receivables</span>
              <p className="text-2xl font-black text-foreground">₹0</p>
              <p className="text-[11px] text-muted-foreground">0 bad debt across aging buckets</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payment Gateways</span>
              <p className="text-2xl font-black text-foreground">Online</p>
              <p className="text-[11px] text-muted-foreground">Razorpay UPI, QR & Cards Connected</p>
            </div>
          </div>
        )}

        {perspective === 'cs' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Customer Satisfaction (CSAT)</span>
              <p className="text-2xl font-black text-foreground">4.9 / 5.0</p>
              <p className="text-[11px] text-muted-foreground">From automated WhatsApp survey prompts</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Account Retention</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">97.8%</p>
              <p className="text-[11px] text-muted-foreground">High recurring enterprise client loyalty</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">VIP Accounts Health</span>
              <p className="text-2xl font-black text-foreground">Optimal</p>
              <p className="text-[11px] text-muted-foreground">Proactive SLA escalation alerts enabled</p>
            </div>
          </div>
        )}

        {perspective === 'support' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">First Response SLA</span>
              <p className="text-2xl font-black text-foreground">&lt; 15s</p>
              <p className="text-[11px] text-muted-foreground">Multi-agent live session routing</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Resolution Rate</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">96.2%</p>
              <p className="text-[11px] text-muted-foreground">First-contact ticket resolution</p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">AI Auto-Triage</span>
              <p className="text-2xl font-black text-foreground">Active</p>
              <p className="text-[11px] text-muted-foreground">Smart categorization & handoff to agents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
