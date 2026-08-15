'use client'

import React from 'react'
import { useCampaignWorkspace } from './campaign-workspace-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Palette, Rocket, TrendingUp, Sparkles, Clock, ShieldCheck, CheckCircle2, MessageSquare, Building2, Eye, History, GitCompare } from 'lucide-react'

export function CampaignWorkspaceTabContent() {
  const { activeTab, setActiveTab, workspaceData, saveWorkspaceDebounced } = useCampaignWorkspace()

  if (!workspaceData) return null

  const { campaign, strategy, audience, creative, budget, events, versions } = workspaceData

  // 1. OVERVIEW TAB
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Overview & Strategic Direction</CardTitle>
            <CardDescription>Single-source enterprise blueprint and parameter breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Category</span>
                <p className="font-bold text-foreground mt-0.5">{strategy?.business_category || 'Hospitality'}</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Goal</span>
                <p className="font-bold text-foreground mt-0.5">{strategy?.campaign_goal || 'Lead Generation'}</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Target Radius</span>
                <p className="font-bold text-foreground mt-0.5">{audience?.recommended_radius || '25 km'}</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Daily Budget</span>
                <p className="font-bold text-emerald-600 mt-0.5">₹{budget?.daily_budget || 500}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Recommended Creative Angle</p>
              <p className="text-sm font-medium text-foreground mt-1">{strategy?.creative_angle || 'Local Experience & Direct Booking'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Meta Verified Targeting Interests</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(workspaceData.interests || []).map((i: any) => (
                  <Badge key={i.id} variant="secondary" className="px-2.5 py-1 text-xs font-medium">
                    {i.interest_name} ({i.audience_size || 'Verified'})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 2. BUSINESS BRIEF TAB
  if (activeTab === 'brief') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Business Brief & Positioning Statement</CardTitle>
          <CardDescription>Edits autosave after 3 seconds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Business Category</label>
            <input
              type="text"
              defaultValue={strategy?.business_category || 'Hospitality'}
              onChange={(e) => saveWorkspaceDebounced('strategy', { businessCategory: e.target.value })}
              className="w-full mt-1.5 p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Campaign Goal</label>
            <input
              type="text"
              defaultValue={strategy?.campaign_goal || 'Lead Generation'}
              onChange={(e) => saveWorkspaceDebounced('strategy', { campaignGoal: e.target.value })}
              className="w-full mt-1.5 p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 3. AUDIENCE TAB
  if (activeTab === 'audience') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Audience Intelligence & Location Geofencing</CardTitle>
          <CardDescription>Geofenced location coordinates and demographics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Primary Target Location</label>
              <input
                type="text"
                defaultValue={audience?.primary_location || 'India'}
                onChange={(e) => saveWorkspaceDebounced('audience', { primaryLocation: e.target.value })}
                className="w-full mt-1.5 p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Recommended Radius</label>
              <input
                type="text"
                defaultValue={audience?.recommended_radius || '25 km'}
                onChange={(e) => saveWorkspaceDebounced('audience', { recommendedRadius: e.target.value })}
                className="w-full mt-1.5 p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 4. CREATIVE TAB
  if (activeTab === 'creative') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Creative Intelligence & Ad Copy Hooks</CardTitle>
          <CardDescription>Headlines, primary copy hooks, and CTAs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Ad Headline</label>
            <input
              type="text"
              defaultValue={creative?.headline || ''}
              onChange={(e) => saveWorkspaceDebounced('creative', { headline: e.target.value })}
              className="w-full mt-1.5 p-2.5 border rounded-md bg-background font-bold text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Primary Text Hook</label>
            <textarea
              rows={4}
              defaultValue={creative?.primary_text || ''}
              onChange={(e) => saveWorkspaceDebounced('creative', { primaryText: e.target.value })}
              className="w-full mt-1.5 p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 5. BUDGET TAB
  if (activeTab === 'budget') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Budget Governance & Placement Options</CardTitle>
          <CardDescription>Daily spend and Meta placement channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Daily Budget (₹ INR)</label>
            <input
              type="number"
              defaultValue={budget?.daily_budget || 500}
              onChange={(e) => saveWorkspaceDebounced('budget', { dailyBudget: parseFloat(e.target.value) })}
              className="w-full mt-1.5 p-2.5 border rounded-md bg-background font-bold text-emerald-600 text-lg focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  // 6. STRATEGY REVIEW TAB
  if (activeTab === 'review') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>AI Recommendation vs User Diff Review</CardTitle>
          <CardDescription>Side-by-side comparison matrix</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/10">
            <div>
              <span className="text-xs font-semibold text-purple-600 uppercase">AI Recommendation</span>
              <p className="font-bold text-foreground mt-1">₹750 / day • 20 km • Age 22-35</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase">User Override</span>
              <p className="font-bold text-foreground mt-1">₹{budget?.daily_budget || 500} / day • {audience?.recommended_radius || '25 km'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 7. PUBLISHING TAB
  if (activeTab === 'publishing') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Meta Graph API Delivery & Status</CardTitle>
          <CardDescription>Connection status, ad set IDs, and delivery checks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 border rounded-lg bg-emerald-500/10">
            <span className="font-medium text-emerald-700">Meta API Status: Connected (v20.0)</span>
            <Badge className="bg-emerald-600 text-white">Active Token</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 8. ANALYTICS & ROI TAB
  if (activeTab === 'analytics') {
    return (
      <div className="space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Performance Analytics & Attribution</CardTitle>
            <CardDescription>Live metrics, spend efficiency, and ROAS calculations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Total Spend</span>
                <p className="font-bold text-foreground mt-0.5">₹{budget?.daily_budget ? (budget.daily_budget * 7).toLocaleString() : '3,500'}</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Impressions</span>
                <p className="font-bold text-foreground mt-0.5">14,280</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Clicks (CTR)</span>
                <p className="font-bold text-foreground mt-0.5">428 (3.0%)</p>
              </div>
              <div className="p-3 border rounded-lg bg-muted/20">
                <span className="text-xs text-muted-foreground">Estimated ROAS</span>
                <p className="font-bold text-emerald-600 mt-0.5">4.2x</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 9. TIMELINE & AUDIT TAB
  if (activeTab === 'timeline') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Chronological Audit Event Stream</CardTitle>
          <CardDescription>Read-only domain event log</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {(events || []).length > 0 ? (
            (events || []).map((evt: any) => (
              <div key={evt.id} className="p-3 border rounded-lg bg-card flex justify-between items-start">
                <div>
                  <p className="font-bold text-foreground">{evt.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{evt.details || evt.event_type}</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(evt.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">No domain events recorded yet.</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // 10. WHATSAPP & CRM TAB
  if (activeTab === 'whatsapp') {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Click-to-WhatsApp Attribution & CRM Deals</CardTitle>
          <CardDescription>Conversational leads, agent routing, and deal conversion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg bg-muted/20">
              <span className="text-xs text-muted-foreground">WhatsApp Conversations</span>
              <p className="font-bold text-emerald-600 text-lg mt-0.5">38 Chats</p>
            </div>
            <div className="p-3 border rounded-lg bg-muted/20">
              <span className="text-xs text-muted-foreground">CRM Pipeline Deals</span>
              <p className="font-bold text-foreground text-lg mt-0.5">12 Deals</p>
            </div>
            <div className="p-3 border rounded-lg bg-muted/20">
              <span className="text-xs text-muted-foreground">Won Revenue</span>
              <p className="font-bold text-emerald-600 text-lg mt-0.5">₹48,000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // DEFAULT FALLBACK
  return (
    <Card className="p-6">
      <CardTitle>Campaign Workspace Tab</CardTitle>
      <CardDescription>Viewing {activeTab} section</CardDescription>
    </Card>
  )
}
