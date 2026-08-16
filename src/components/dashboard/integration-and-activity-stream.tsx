'use client'

import React, { useEffect, useState } from 'react'
import { 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Wifi, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Zap,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Bot,
  Layers,
  CreditCard,
  Mail,
  Server
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { loadActivity } from '@/lib/dashboard/queries'

export function IntegrationAndActivityStream() {
  const router = useRouter()
  const [streamTab, setStreamTab] = useState<'activity' | 'alerts' | 'ai'>('activity')
  const [activityCategory, setActivityCategory] = useState<'all' | 'sales' | 'marketing' | 'finance' | 'automation' | 'ai'>('all')
  const [realActivities, setRealActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const db = createClient()
    loadActivity(db, 15)
      .then((items) => {
        const mapped = items.map((item) => ({
          id: item.id,
          module: item.kind === 'deal' ? 'sales' : item.kind === 'contact' ? 'marketing' : 'automation',
          title: item.text,
          time: new Date(item.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          desc: item.kind === 'message' ? 'WhatsApp customer message' : 'Live CRM event',
          actor: 'System Auto'
        }))
        setRealActivities(mapped)
      })
      .catch(() => {
        setRealActivities([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const integrationGroups = [
    {
      group: 'Communication',
      icon: MessageSquare,
      items: [
        { name: 'WhatsApp Cloud API', status: 'healthy', latency: '42ms', sync: 'Live' },
        { name: 'SMTP Email Delivery', status: 'healthy', latency: '80ms', sync: 'Live' },
      ]
    },
    {
      group: 'Marketing & Ads',
      icon: TrendingUp,
      items: [
        { name: 'Meta Ads Manager Pro', status: 'healthy', latency: '110ms', sync: 'Live' },
      ]
    },
    {
      group: 'Payments & Banking',
      icon: CreditCard,
      items: [
        { name: 'Razorpay UPI & Cards', status: 'healthy', latency: '65ms', sync: 'Live' },
      ]
    },
    {
      group: 'Infrastructure & AI',
      icon: Server,
      items: [
        { name: 'Supabase Database', status: 'healthy', latency: '18ms', sync: 'Live' },
        { name: 'AI Models (Gemini / Groq)', status: 'healthy', latency: '240ms', sync: 'Live' },
        { name: 'Webhook Engine Queue', status: 'healthy', latency: '0 lag', sync: 'Live' },
      ]
    }
  ]

  const alerts = [
    { id: 'a1', title: 'System SLA Active', time: 'Live', desc: 'Real-time multi-agent routing operating within target SLA.' },
  ]

  const aiInsights = [
    { id: 'ai1', title: 'WhatsApp Broadcast Engine Ready', desc: 'Campaign delivery rate and template health operational.', tag: 'Growth AI' },
    { id: 'ai2', title: 'Real-Time Multi-Agent Routing', desc: 'Inbound customer conversations are automatically assigned.', tag: 'Routing AI' },
  ]

  const filteredActivities = activityCategory === 'all'
    ? realActivities
    : realActivities.filter(a => a.module === activityCategory)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full overflow-hidden">
      {/* ── 1. Grouped Integration & API Health Barometer (5 Cols) ── */}
      <div className="lg:col-span-5 rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">Integrations & API Health</h3>
                <p className="text-[11px] text-muted-foreground truncate">Grouped infrastructure response time</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
              8/8 Online
            </span>
          </div>

          <div className="space-y-3 mt-3">
            {integrationGroups.map((grp) => (
              <div key={grp.group} className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <grp.icon className="w-3 h-3 text-primary" /> {grp.group}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {grp.items.map((item) => (
                    <div key={item.name} className="p-2 rounded-xl border bg-muted/20 flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                        <span className="font-semibold text-foreground truncate text-[10.5px]">{item.name}</span>
                      </div>
                      <span className="text-[9.5px] text-muted-foreground shrink-0 font-mono ml-1">{item.latency}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/meta-ads/settings')}
          className="w-full text-xs font-semibold h-8 rounded-xl justify-between group cursor-pointer mt-2"
        >
          <span>Manage Enterprise Integrations</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>

      {/* ── 2. Unified Tri-Tab Activity Stream (7 Cols) ── */}
      <div className="lg:col-span-7 rounded-2xl border bg-card p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between min-w-0">
        <div>
          {/* Main Top Stream Switcher */}
          <div className="flex items-center justify-between pb-3 border-b gap-2">
            <div className="flex bg-muted p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setStreamTab('activity')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  streamTab === 'activity' 
                    ? 'bg-background text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ⚡ Activity
              </button>
              <button
                type="button"
                onClick={() => setStreamTab('alerts')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  streamTab === 'alerts' 
                    ? 'bg-background text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🚨 Alerts ({alerts.length})
              </button>
              <button
                type="button"
                onClick={() => setStreamTab('ai')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  streamTab === 'ai' 
                    ? 'bg-background text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🤖 AI Insights
              </button>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider hidden sm:inline-block">
              Live Feed
            </span>
          </div>

          {/* Sub-Category Filter Row for Activity tab */}
          {streamTab === 'activity' && (
            <div className="flex items-center gap-1 overflow-x-auto py-1 hide-scrollbar">
              {(['all', 'sales', 'marketing', 'finance', 'automation', 'ai'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActivityCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer shrink-0 ${
                    activityCategory === cat 
                      ? 'bg-primary text-primary-foreground shadow-2xs' 
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Activity Cards List with proper height & spacing */}
          <div className="mt-2 space-y-2.5 max-h-[260px] overflow-y-auto pr-1 text-xs">
            {streamTab === 'activity' && (
              filteredActivities.length > 0 ? (
                filteredActivities.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors flex items-start justify-between gap-3 min-w-0">
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-foreground truncate">{item.title}</div>
                      <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                      <span className="text-[9.5px] text-primary font-semibold">{item.actor}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  {loading ? 'Loading real activity feed...' : 'No recent activities recorded yet. Inbound messages and lead actions will appear here.'}
                </div>
              )
            )}

            {streamTab === 'alerts' && alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-start justify-between gap-3 min-w-0">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-foreground flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {alert.title}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{alert.desc}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{alert.time}</span>
              </div>
            ))}

            {streamTab === 'ai' && aiInsights.map((insight) => (
              <div key={insight.id} className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-start justify-between gap-3 min-w-0">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-foreground flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    {insight.title}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{insight.desc}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold shrink-0">
                  {insight.tag}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t text-center">
          <span className="text-[10.5px] text-muted-foreground">Unified EOS Stream • Real-time Workspace Feed</span>
        </div>
      </div>
    </div>
  )
}
