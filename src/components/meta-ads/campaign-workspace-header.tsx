'use client'

import React from 'react'
import { useCampaignWorkspace } from './campaign-workspace-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Layers,
  Target,
  Palette,
  Sparkles,
  Rocket,
  TrendingUp,
  Activity,
  MessageSquare,
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Play,
  Pause,
  Archive,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export function CampaignWorkspaceHeader() {
  const { workspaceData, loading, saving, executeFsmTransition } = useCampaignWorkspace()

  if (loading || !workspaceData) {
    return (
      <div className="border-b bg-card px-6 py-4 animate-pulse flex items-center justify-between">
        <div className="h-6 bg-muted rounded w-48" />
        <div className="h-8 bg-muted rounded w-32" />
      </div>
    )
  }

  const { campaign, strategy, audience, creative, budget } = workspaceData
  const currentStatus = campaign.status || 'DRAFT'

  // Completion calculation from API payload
  const hasStrategy = !!strategy
  const hasAudience = !!audience?.primary_location
  const hasCreative = !!creative?.headline
  const hasBudget = !!budget?.daily_budget

  // Health Score Calculation
  let healthScore = 50
  if (hasStrategy) healthScore += 15
  if (hasAudience) healthScore += 15
  if (hasCreative) healthScore += 10
  if (hasBudget) healthScore += 10

  return (
    <div className="border-b bg-card px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
      {/* Left Title & Status Badges */}
      <div className="flex items-center gap-3">
        <Link href="/meta-ads" className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{campaign.name}</h1>
            <Badge variant="outline" className="font-mono text-xs">
              {campaign.version || 'v1.0'}
            </Badge>
            <Badge
              className={
                currentStatus === 'PUBLISHED'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : currentStatus === 'IN_REVIEW'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
              }
            >
              {currentStatus}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
            <span>Health Score: <strong className="text-foreground">{healthScore}/100</strong></span>
            <span>•</span>
            <span>Updated {new Date(campaign.updated_at || Date.now()).toLocaleTimeString()}</span>
            {saving && <span className="text-amber-500 font-medium animate-pulse">• Saving...</span>}
          </p>
        </div>
      </div>

      {/* Top Right FSM Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {currentStatus === 'DRAFT' && (
          <Button
            size="sm"
            onClick={() => executeFsmTransition('IN_REVIEW')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            Submit For Review
          </Button>
        )}

        {currentStatus === 'IN_REVIEW' && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => executeFsmTransition('DRAFT')}
              className="text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              Request Changes
            </Button>
            <Button
              size="sm"
              onClick={() => executeFsmTransition('APPROVED')}
              className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Campaign
            </Button>
          </>
        )}

        {currentStatus === 'APPROVED' && (
          <Button
            size="sm"
            onClick={() => executeFsmTransition('PUBLISHED')}
            className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
          >
            <Rocket className="w-4 h-4" />
            Publish Live
          </Button>
        )}

        {currentStatus === 'PUBLISHED' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => executeFsmTransition('PAUSED')}
            className="text-amber-600 border-amber-200 hover:bg-amber-50 flex items-center gap-1.5"
          >
            <Pause className="w-4 h-4" />
            Pause Delivery
          </Button>
        )}

        {currentStatus === 'PAUSED' && (
          <Button
            size="sm"
            onClick={() => executeFsmTransition('PUBLISHED')}
            className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5"
          >
            <Play className="w-4 h-4" />
            Resume Delivery
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => executeFsmTransition('ARCHIVED')}
          className="text-muted-foreground hover:text-destructive"
        >
          <Archive className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
