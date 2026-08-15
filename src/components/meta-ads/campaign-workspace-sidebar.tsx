'use client'

import React from 'react'
import { useCampaignWorkspace } from './campaign-workspace-context'
import {
  Layers,
  Target,
  Palette,
  Sparkles,
  Rocket,
  TrendingUp,
  Clock,
  MessageSquare,
  Building2,
  Check,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const WORKSPACE_TABS = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'brief', label: 'Business Brief', icon: Sparkles },
  { id: 'audience', label: '1. Audience', icon: Target },
  { id: 'creative', label: '2. Creative', icon: Palette },
  { id: 'budget', label: '3. Budget', icon: Rocket },
  { id: 'review', label: '4. Strategy Review', icon: Sparkles },
  { id: 'publishing', label: '5. Publishing & Meta', icon: Rocket },
  { id: 'analytics', label: '6. Analytics & ROI', icon: TrendingUp },
  { id: 'timeline', label: 'Timeline & Audit', icon: Clock },
  { id: 'whatsapp', label: 'WhatsApp & CRM', icon: MessageSquare }
]

export function CampaignWorkspaceSidebar() {
  const { activeTab, setActiveTab, workspaceData } = useCampaignWorkspace()

  if (!workspaceData) return null

  const { strategy, audience, creative, budget } = workspaceData

  // Section completion status
  const statusMap: Record<string, boolean> = {
    brief: !!strategy?.business_category,
    audience: !!audience?.primary_location,
    creative: !!creative?.headline,
    budget: !!budget?.daily_budget,
    review: !!strategy && !!audience && !!creative,
    publishing: !!workspaceData.campaign?.meta_campaign_id
  }

  return (
    <aside className="w-64 border-r bg-card h-[calc(100vh-65px)] sticky top-[65px] flex flex-col p-3 gap-1 overflow-y-auto">
      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Campaign Workflow
      </div>
      {WORKSPACE_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        const isComplete = statusMap[tab.id]

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </div>
            {statusMap[tab.id] !== undefined && (
              <div>
                {isComplete ? (
                  <Check className={cn('w-4 h-4', isActive ? 'text-primary-foreground' : 'text-emerald-500')} />
                ) : (
                  <AlertCircle className={cn('w-4 h-4', isActive ? 'text-primary-foreground/70' : 'text-amber-500')} />
                )}
              </div>
            )}
          </button>
        )
      })}
    </aside>
  )
}
