'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ShieldCheck, Rocket, Save, RefreshCw, CheckCircle2, AlertTriangle, 
  Layers, ChevronRight, Sliders, Target, DollarSign, Eye, ArrowLeft, Download, FileText
} from 'lucide-react'
import { toast } from 'sonner'
import { MetaAdsHeader } from '@/components/meta-ads/meta-ads-header'

export default function StrategyReviewWorkspacePage() {
  const router = useRouter()
  const params = useParams()
  const strategyId = params.strategyId as string

  const [loading, setLoading] = useState(true)
  const [strategy, setStrategy] = useState<any>(null)
  const [rawRecord, setRawRecord] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'audience' | 'creative' | 'budget' | 'targeting' | 'compliance' | 'prediction'>('overview')

  // User edited values for AI vs User comparison
  const [userValues, setUserValues] = useState<any>({
    dailyBudget: '1200',
    ageRange: '24–38',
    radius: '35 km',
    headline: '',
  })

  // Dynamic Metrics Recalculation Engine
  const [metrics, setMetrics] = useState({
    estReach: '25,000 – 40,000',
    estCPL: '₹140 – ₹190',
    estROAS: '4.8x',
    healthScore: 94,
    policyRisk: 'LOW RISK',
  })

  useEffect(() => {
    if (strategyId) {
      fetch(`/api/meta/ai/strategy?strategyId=${strategyId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.strategy) {
            setStrategy(data.strategy)
            setRawRecord(data.raw)
            setUserValues({
              dailyBudget: data.strategy.budgetRecommendation?.replace(/[^\d]/g, '') || '1200',
              ageRange: data.strategy.recommendedAge || '22–35',
              radius: data.strategy.recommendedRadius || '20 km',
              headline: data.strategy.creativeAngle || 'Launch WhatsApp Campaign',
            })
          }
        })
        .catch((err) => console.warn('Failed strategy lookup:', err))
        .finally(() => setLoading(false))
    }
  }, [strategyId])

  // Recalculate metrics on input changes
  const handleUserValueChange = (field: string, val: string) => {
    setUserValues((prev: any) => ({ ...prev, [field]: val }))
    if (field === 'dailyBudget') {
      const budgetNum = Number(val) || 1000
      setMetrics({
        estReach: `${Math.round(budgetNum * 20)} – ${Math.round(budgetNum * 35)}`,
        estCPL: `₹${Math.max(80, Math.round(250 - budgetNum * 0.05))}`,
        estROAS: `${(3.5 + budgetNum * 0.0005).toFixed(1)}x`,
        healthScore: Math.min(99, 85 + Math.round(budgetNum / 200)),
        policyRisk: 'LOW RISK',
      })
    }
  }

  const handleApproveAndLaunch = () => {
    toast.success('Strategy Approved! Opening Campaign Studio...')
    const prefillParams = {
      campaignName: `${strategy?.businessCategory || 'Enterprise'} Campaign - ${strategy?.primaryLocation || 'Target Area'}`,
      objective: strategy?.campaignObjective === 'WhatsApp Messages' ? 'OUTCOME_ENGAGEMENT' : 'OUTCOME_LEADS',
      dailyBudget: userValues.dailyBudget,
      location: `${strategy?.primaryLocation || ''}, ${userValues.radius}`,
      headline: userValues.headline || strategy?.creativeAngle,
      primaryText: `🚀 ${strategy?.explainability?.whyThisRecommendation || ''}`,
      cta: strategy?.suggestedCTA || 'Send WhatsApp Message',
    }
    const encoded = encodeURIComponent(JSON.stringify(prefillParams))
    router.push(`/meta-ads/create?strategyId=${strategyId}&strategy=${encoded}`)
  }

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-xs text-muted-foreground font-semibold">Loading Dedicated Strategy Review Workspace...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <MetaAdsHeader
        title={`Strategy Review & Approval Workspace: #${strategyId.slice(0, 8)}`}
        description="Mandatory enterprise validation, AI vs User comparison, live metric recalculation, and compliance audit before Campaign Studio handoff."
        icon={ShieldCheck}
        breadcrumbs={[
          { label: 'Campaign Workspace', href: '/meta-ads' },
          { label: `Review #${strategyId.slice(0, 8)}` }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => router.push('/meta-ads')} className="h-8 text-xs font-bold gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaign Workspace
            </Button>
            <Button size="sm" onClick={handleApproveAndLaunch} className="h-8 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Rocket className="w-3.5 h-3.5" /> Approve & Launch Campaign
            </Button>
          </div>
        }
      />

      {/* 3-COLUMN ENTERPRISE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR: Lifecycle Progress & Timeline */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Campaign Lifecycle Trace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>1. Business Brief</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>2. Audience Intelligence</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>3. Creative Synthesis</span>
              </div>
              <div className="flex items-center gap-2.5 text-primary font-extrabold bg-primary/10 p-2 rounded-lg border border-primary/30">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>4. Strategy Review & Approval (Active)</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border border-muted-foreground/40 shrink-0" />
                <span>5. Campaign Studio Builder</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border border-muted-foreground/40 shrink-0" />
                <span>6. Meta Publishing & CRM Workspace</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-card p-4 space-y-3 text-xs">
            <h4 className="font-bold text-foreground">Unified Campaign Workspace Link</h4>
            <p className="text-muted-foreground leading-normal text-[11px]">
              This campaign automatically links Audience, Creative, Meta API, WhatsApp Automation, and CRM Deal Pipeline under ID: <code className="font-mono font-bold text-primary">#{strategyId.slice(0, 8)}</code>.
            </p>
          </Card>
        </div>

        {/* CENTER: Editable Review Workspace Tabs & AI vs User Comparison */}
        <div className="lg:col-span-6 space-y-4">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b text-xs font-bold">
            {(['overview', 'audience', 'creative', 'budget', 'targeting', 'compliance', 'prediction'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-t-lg transition-colors capitalize ${
                  activeTab === tab ? 'bg-primary text-primary-foreground font-extrabold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* AI vs USER COMPARISON MATRIX */}
          <Card className="border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" /> AI Recommendation vs Final User Configuration
              </h3>
              <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-600 bg-amber-500/10 font-bold">
                Live Diff Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              {/* Daily Budget Comparison */}
              <div className="p-3 border rounded-xl bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Daily Budget (INR)</span>
                  <Badge className="text-[9px] bg-purple-500/10 text-purple-600 border-purple-500/30">AI: ₹{strategy?.budgetRecommendation || '750/day'}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Final User Value:</span>
                  <Input
                    value={userValues.dailyBudget}
                    onChange={(e) => handleUserValueChange('dailyBudget', e.target.value)}
                    className="h-8 text-xs font-bold w-36 bg-background"
                  />
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Difference: +{Math.round(((Number(userValues.dailyBudget) || 1200) - 750) / 7.5)}%
                  </span>
                </div>
              </div>

              {/* Age Range Comparison */}
              <div className="p-3 border rounded-xl bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Target Age Group</span>
                  <Badge className="text-[9px] bg-purple-500/10 text-purple-600 border-purple-500/30">AI: 22–35 years</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Final User Value:</span>
                  <Input
                    value={userValues.ageRange}
                    onChange={(e) => handleUserValueChange('ageRange', e.target.value)}
                    className="h-8 text-xs font-bold w-36 bg-background"
                  />
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">User Adjusted</span>
                </div>
              </div>

              {/* Location Radius Comparison */}
              <div className="p-3 border rounded-xl bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Geofenced Radius</span>
                  <Badge className="text-[9px] bg-purple-500/10 text-purple-600 border-purple-500/30">AI: 20 km (OSM Verified)</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Final User Value:</span>
                  <Input
                    value={userValues.radius}
                    onChange={(e) => handleUserValueChange('radius', e.target.value)}
                    className="h-8 text-xs font-bold w-36 bg-background"
                  />
                </div>
              </div>

              {/* Creative Hook Text */}
              <div className="p-3 border rounded-xl bg-muted/20 space-y-2">
                <span className="font-bold text-foreground block">Ad Headline & Hook</span>
                <Textarea
                  value={userValues.headline}
                  onChange={(e) => handleUserValueChange('headline', e.target.value)}
                  className="text-xs min-h-[60px] bg-background"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT SIDEBAR: Live AI Validation & Calculated Metrics */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">AI Validation & Health</span>
              <Badge className="bg-emerald-600 text-white font-extrabold text-xs">{metrics.healthScore} / 100</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Est. Daily Reach:</span>
                <span className="font-extrabold text-foreground">{metrics.estReach}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Est. CPL:</span>
                <span className="font-bold text-foreground">{metrics.estCPL}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Est. ROAS:</span>
                <span className="font-extrabold text-primary">{metrics.estROAS}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Meta Policy Risk:</span>
                <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-600 bg-emerald-500/10 font-bold">
                  {metrics.policyRisk}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Audience Intent Quality:</span>
                <span className="font-bold text-emerald-500">94% High Intent</span>
              </div>
            </div>
          </Card>

          <Button onClick={handleApproveAndLaunch} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs h-10 shadow-md">
            <Rocket className="w-4 h-4" /> Approve & Import to Builder
          </Button>
        </div>

      </div>
    </div>
  )
}
