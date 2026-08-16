"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  FlaskConical, Sparkles, Trophy, ArrowUpRight, CheckCircle2, Play, Pause, 
  Settings2, BarChart2, ShieldCheck, RefreshCw, Loader2 
} from "lucide-react"
import { toast } from "sonner"

export interface ABVariant {
  id: string
  name: string
  headline: string
  primaryText: string
  cta: string
  creative: string
  budgetShare: string
  impressions: number
  clicks: number
  ctr: number
  cpa: number
  roas: number
  conversions: number
  confidence: number
  isWinner?: boolean
}

export interface ABTestingModuleProps {
  campaignId?: string
  campaignName?: string
  onPublishWinner?: (variant: ABVariant) => void
}

/**
 * Integrated First-Class Enterprise A/B Testing Module
 * Renders directly inside campaign creation and workspace workflows.
 */
export function ABTestingModule({
  campaignId,
  campaignName = "WhatsApp Lead Generation Campaign",
  onPublishWinner
}: ABTestingModuleProps) {
  const [testType, setTestType] = useState<string>("CREATIVE_AND_COPY")
  const [successMetric, setSuccessMetric] = useState<string>("ROAS")
  const [trafficSplit, setTrafficSplit] = useState<string>("50/50")
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(95)
  const [autoPublish, setAutoPublish] = useState<boolean>(true)
  const [running, setRunning] = useState<boolean>(true)

  // AI-Generated Variants (A/B/C/D)
  const [variants, setVariants] = useState<ABVariant[]>([
    {
      id: "var_a",
      name: "Variant A (Current Baseline)",
      headline: "Book Authentic Consultation Online | Instant WhatsApp",
      primaryText: "🚀 Discover authentic verified services tailored to your needs. Connect with our direct expert team on WhatsApp today.",
      cta: "Send WhatsApp Message",
      creative: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      budgetShare: "50%",
      impressions: 14200,
      clicks: 340,
      ctr: 2.39,
      cpa: 34.20,
      roas: 3.1,
      conversions: 24,
      confidence: 82.0,
      isWinner: false
    },
    {
      id: "var_b",
      name: "Variant B (AI Optimized Winner)",
      headline: "Need Expert Support in Bihar? Chat Direct on WhatsApp",
      primaryText: "⚡ Get instant verified pricing and direct consultation with local specialists in Patna. Click below to start chatting now.",
      cta: "Send WhatsApp Message",
      creative: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      budgetShare: "50%",
      impressions: 15800,
      clicks: 540,
      ctr: 3.42,
      cpa: 28.50,
      roas: 4.2,
      conversions: 42,
      confidence: 96.5,
      isWinner: true
    }
  ])

  const winnerVariant = variants.find(v => v.isWinner)

  const handleGenerateMoreVariants = () => {
    toast.info("Generating Variant C (Aggressive) & Variant D (Conservative) using AI Knowledge Base...")
    setVariants(prev => [
      ...prev,
      {
        id: "var_c",
        name: "Variant C (Aggressive Offer)",
        headline: "Save 25% Today Only | Exclusive Patna Package Offer",
        primaryText: "Limited time pricing available for Bihar residents. Unlock direct savings when you chat with our team on WhatsApp.",
        cta: "Claim Discount Now",
        creative: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
        budgetShare: "25%",
        impressions: 4200,
        clicks: 160,
        ctr: 3.80,
        cpa: 24.10,
        roas: 4.5,
        conversions: 15,
        confidence: 88.0
      }
    ])
    toast.success("Variant C added to active A/B test!")
  }

  const handlePublishWinnerAction = async (variant: ABVariant) => {
    toast.info(`Submitting winning variant "${variant.name}" to Admin Approval Queue via ApprovalWorkflowEngine...`)
    if (onPublishWinner) onPublishWinner(variant)
    else {
      toast.success(`Winner "${variant.name}" approved & scheduled for Meta Graph API publishing!`)
    }
  }

  return (
    <Card className="border bg-card shadow-xs space-y-4">
      {/* Header */}
      <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-purple-500" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Integrated Enterprise A/B Testing Module
            </CardTitle>
            <CardDescription className="text-[10px]">
              Live statistical confidence monitoring & AI-generated variant optimization for {campaignName}
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px] font-mono font-bold">
          Statistical Confidence: 96.5%
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Test Controls Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-xl border">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Test Variable:</span>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full mt-1 h-7 px-2 rounded border bg-background text-xs font-bold"
            >
              <option value="CREATIVE_AND_COPY">Creative & Headline Copy</option>
              <option value="AUDIENCE_SEGMENTS">Audience Targeting Segments</option>
              <option value="PLACEMENTS">Advantage+ vs Feeds Only</option>
              <option value="OFFER_LANDING_PAGE">Offer & CTA Button</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Success Metric:</span>
            <select
              value={successMetric}
              onChange={(e) => setSuccessMetric(e.target.value)}
              className="w-full mt-1 h-7 px-2 rounded border bg-background text-xs font-bold"
            >
              <option value="ROAS">ROAS (Return on Ad Spend)</option>
              <option value="CPA">Cost Per Acquisition (CPA)</option>
              <option value="CTR">Click-Through Rate (CTR)</option>
              <option value="LEADS">Total WhatsApp Leads</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Confidence Threshold:</span>
            <select
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full mt-1 h-7 px-2 rounded border bg-background text-xs font-bold"
            >
              <option value={95}>95% Confidence (Standard)</option>
              <option value={99}>99% Confidence (Strict Enterprise)</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Auto-Publish Winner:</span>
            <button
              onClick={() => setAutoPublish(!autoPublish)}
              className={`w-full mt-1 h-7 px-2 rounded border font-bold text-xs flex items-center justify-between cursor-pointer ${
                autoPublish ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-muted text-muted-foreground'
              }`}
            >
              <span>{autoPublish ? 'ENABLED' : 'DISABLED'}</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Winner Highlight Recommendation Box */}
        {winnerVariant && (
          <div className="p-3.5 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  AI Decision: Winning Variant Identified ({winnerVariant.name})
                </span>
              </div>
              <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                +35.5% ROAS Lift (4.2x vs 3.1x)
              </Badge>
            </div>

            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Statistical confidence reached <strong>96.5%</strong> (exceeding the {confidenceThreshold}% threshold). 
              Variant B produced 42 WhatsApp leads at <strong>₹28.50 CPA</strong> compared to Variant A's ₹34.20 CPA.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">
                Requires ApprovalWorkflowEngine approval before live Graph API publish.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handlePublishWinnerAction(winnerVariant)}
                  className="h-7 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Publish Winner Live
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Variant Cards Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {variants.map(variant => (
            <div 
              key={variant.id} 
              className={`p-3 rounded-xl border bg-card space-y-2.5 transition-all ${
                variant.isWinner ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''
              }`}
            >
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="font-bold text-foreground truncate max-w-[180px]">{variant.name}</span>
                {variant.isWinner && (
                  <Badge className="bg-emerald-600 text-white text-[9px] font-bold">WINNER</Badge>
                )}
              </div>

              <div className="flex gap-2">
                <img src={variant.creative} alt="variant creative" className="w-14 h-14 rounded object-cover border shrink-0" />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-bold text-foreground text-[11px] truncate">{variant.headline}</p>
                  <p className="text-muted-foreground text-[10px] line-clamp-2">{variant.primaryText}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 p-2 rounded-lg bg-muted/20 text-center font-mono text-[10px]">
                <div>
                  <span className="text-muted-foreground block text-[9px]">CTR</span>
                  <strong className="text-foreground">{variant.ctr}%</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px]">CPA</span>
                  <strong className="text-foreground">₹{variant.cpa}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px]">ROAS</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{variant.roas}x</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t">
                <span>Leads: <strong className="text-foreground">{variant.conversions}</strong></span>
                <span>Confidence: <strong className="text-emerald-500">{variant.confidence}%</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Generate More Variants Action */}
        <div className="flex items-center justify-between pt-2 border-t text-xs">
          <span className="text-muted-foreground">Test Duration: <strong>Day 4 of 14</strong></span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateMoreVariants}
            className="h-7 text-xs font-bold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" /> + Generate AI Variant C & D
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
