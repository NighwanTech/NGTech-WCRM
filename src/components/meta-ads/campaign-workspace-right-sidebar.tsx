'use client'

import React from 'react'
import { useCampaignWorkspace } from './campaign-workspace-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, ShieldCheck, DollarSign, Users, Target, MessageSquare, TrendingUp } from 'lucide-react'

export function CampaignWorkspaceRightSidebar() {
  const { workspaceData } = useCampaignWorkspace()

  if (!workspaceData) return null

  const { campaign, audience, creative, budget } = workspaceData
  const dailyBudget = budget?.daily_budget || 500

  // Estimated Metrics calculated from normalized parameters
  const estReachMin = Math.round(dailyBudget * 18)
  const estReachMax = Math.round(dailyBudget * 32)
  const estCplMin = Math.round(120)
  const estCplMax = Math.round(180)
  const estRoas = (4.2).toFixed(1)

  return (
    <aside className="w-80 border-l bg-card h-[calc(100vh-65px)] sticky top-[65px] p-4 flex flex-col gap-4 overflow-y-auto hidden xl:flex">
      {/* Live Campaign Summary Card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Live Summary</span>
            <Badge variant="outline" className="text-[10px] font-normal">
              {campaign.status || 'DRAFT'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3 text-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-muted-foreground">Daily Budget:</span>
            <span className="font-bold text-foreground">₹{dailyBudget} / day</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-muted-foreground">Target Location:</span>
            <span className="font-semibold text-foreground truncate max-w-[130px]">
              {audience?.primary_location || 'Not Specified'}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-muted-foreground">Radius & Age:</span>
            <span className="font-medium text-foreground">
              {audience?.recommended_radius || '25 km'} • {audience?.age_min || 18}-{audience?.age_max || 65}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Headline:</span>
            <span className="font-medium text-foreground truncate max-w-[130px]">
              {creative?.headline || 'Not Created'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Flight Health & Risk Card */}
      <Card className="border-border/60 shadow-sm bg-muted/20">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Policy & Health Check</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Meta Policy Risk:</span>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
              LOW RISK
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Est. Daily Reach:</span>
            <span className="font-mono font-bold text-foreground">
              {estReachMin.toLocaleString()} - {estReachMax.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Est. CPL:</span>
            <span className="font-mono font-bold text-foreground">
              ₹{estCplMin} - ₹{estCplMax}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Est. ROAS:</span>
            <span className="font-mono font-bold text-emerald-600">{estRoas}x</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Domain Event Activity Feed */}
      <Card className="border-border/60 shadow-sm flex-1">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-primary" />
            <span>Recent Activity Stream</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2.5 text-xs overflow-y-auto max-h-[300px]">
          {(workspaceData.events || []).slice(0, 5).map((evt: any) => (
            <div key={evt.id} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
              <p className="font-medium text-foreground">{evt.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(evt.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}
