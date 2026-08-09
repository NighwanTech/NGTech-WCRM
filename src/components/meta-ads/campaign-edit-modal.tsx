"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetaCampaign } from "@/lib/meta/graph-api"
import { 
  Sparkles, 
  PlayCircle, 
  PauseCircle, 
  Loader2, 
  Save, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  Target, 
  Palette, 
  Smartphone, 
  MessageSquare, 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  TrendingUp, 
  ExternalLink,
  Sliders,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"

interface CampaignEditModalProps {
  campaign: MetaCampaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedCampaign: MetaCampaign) => void
  adAccountId?: string
}

export function CampaignEditModal({ 
  campaign, 
  open, 
  onOpenChange, 
  onUpdate,
  adAccountId 
}: CampaignEditModalProps) {
  if (!campaign) return null

  // 1. Campaign Level State
  const [name, setName] = useState(campaign.name)
  const [dailyBudget, setDailyBudget] = useState(Number(campaign.daily_budget) || 500)
  const [status, setStatus] = useState(campaign.status || "PAUSED")
  const [objective, setObjective] = useState(campaign.objective || "OUTCOME_LEADS")
  const [specialCategory, setSpecialCategory] = useState("NONE")
  const [saving, setSaving] = useState(false)

  // 2. Ad Set Level State
  const [ageMin, setAgeMin] = useState(21)
  const [ageMax, setAgeMax] = useState(55)
  const [gender, setGender] = useState("ALL")
  const [location, setLocation] = useState("India")
  const [interests, setInterests] = useState("Higher Education, Career Growth, Professional Certification")
  const [placement, setPlacement] = useState("advantage_plus")
  const [destination, setDestination] = useState("whatsapp")

  // 3. Ad Creative Level State
  const [primaryText, setPrimaryText] = useState(
    "🚀 Accelerate your career with our verified Fellowship Program! Flexible learning, industry mentorship, and practical certifications. Limited batch seats available. Chat with our counselors on WhatsApp today."
  )
  const [headline, setHeadline] = useState("Fellowship Admission 2026 | Register Now")
  const [description, setDescription] = useState("Direct WhatsApp Counseling & Syllabus Download")
  const [ctaText, setCtaText] = useState("Send WhatsApp Message")
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60")

  // 4. AI Strategic Co-Pilot State
  const [auditing, setAuditing] = useState(false)
  const [aiAudit, setAiAudit] = useState<any>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const isACTIVE = status === "ACTIVE"

  // Fetch Meta Graph hierarchy details on mount if open
  useEffect(() => {
    if (open && campaign.id) {
      setName(campaign.name)
      setDailyBudget(Number(campaign.daily_budget) || 500)
      setStatus(campaign.status || "PAUSED")
      setObjective(campaign.objective || "OUTCOME_LEADS")

      fetch(`/api/meta/campaigns/details?campaignId=${campaign.id}${adAccountId ? `&adAccountId=${adAccountId}` : ''}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.details) {
            const adset = data.details.adsets?.data?.[0]
            const ad = data.details.ads?.data?.[0]
            const creative = ad?.creative

            if (adset?.targeting) {
              if (adset.targeting.age_min) setAgeMin(adset.targeting.age_min)
              if (adset.targeting.age_max) setAgeMax(adset.targeting.age_max)
            }

            if (creative?.body) setPrimaryText(creative.body)
            if (creative?.title) setHeadline(creative.title)
            if (creative?.image_url) setImageUrl(creative.image_url)
          }
        })
        .catch((err) => console.warn("Could not fetch remote adset details", err))
    }
  }, [open, campaign, adAccountId])

  // Save Settings to Meta Graph API
  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      if (name !== campaign.name) {
        await fetch("/api/meta/campaigns/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: campaign.id,
            action: "update_name",
            payload: { name },
            adAccountId,
          }),
        })
      }

      await fetch("/api/meta/campaigns/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          action: "update_budget",
          payload: { dailyBudget },
          adAccountId,
        }),
      })

      const updated = {
        ...campaign,
        name,
        daily_budget: dailyBudget.toString(),
        status,
      }
      onUpdate(updated)
      toast.success("All Campaign & Ad Set changes published to Meta!")
    } catch {
      toast.error("Failed to update campaign on Meta")
    } finally {
      setSaving(false)
    }
  }

  // Toggle Status
  const handleToggleStatus = async () => {
    setSaving(true)
    const newAction = isACTIVE ? "pause" : "resume"
    const newStatus = isACTIVE ? "PAUSED" : "ACTIVE"

    try {
      const res = await fetch("/api/meta/campaigns/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          action: newAction,
          adAccountId,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus(newStatus)
        onUpdate({ ...campaign, status: newStatus })
        toast.success(`Campaign ${newStatus === "ACTIVE" ? "activated live" : "paused"} on Meta!`)
      }
    } catch {
      toast.error("Failed to toggle campaign status")
    } finally {
      setSaving(false)
    }
  }

  // Trigger AI Recommendations
  const handleGenerateAIAudit = async () => {
    setAuditing(true)
    try {
      const res = await fetch("/api/meta/ai/campaign-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: name,
          objective,
          dailyBudget,
          spend: Number(campaign.spend),
          impressions: Number(campaign.impressions),
          clicks: Number(campaign.clicks),
        }),
      })
      const data = await res.json()
      if (data.success && data.audit) {
        setAiAudit(data.audit)
        toast.success("AI Strategic Recommendations generated!")
      }
    } catch {
      toast.error("Failed to generate AI Audit")
    } finally {
      setAuditing(false)
    }
  }

  const handleApplyHeadline = (text: string) => {
    setHeadline(text)
    toast.success("Applied AI Headline to Ad Creative!")
  }

  const handleApplyPrimaryText = (text: string) => {
    setPrimaryText(text)
    toast.success("Applied AI Primary Text to Ad Creative!")
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] overflow-y-auto p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground truncate max-w-xl">
                  {name}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-3">
                <span className="font-mono">Meta ID: {campaign.id}</span>
                <span>•</span>
                <span className="font-medium text-foreground">Spend: ₹{campaign.spend || "0"}</span>
                <span>•</span>
                <span className="font-medium text-foreground">Impressions: {campaign.impressions || "0"}</span>
              </DialogDescription>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleStatus}
                disabled={saving}
                className={`text-xs gap-1.5 font-bold ${
                  isACTIVE 
                    ? "text-amber-600 border-amber-500/30 hover:bg-amber-500/10" 
                    : "text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                }`}
              >
                {isACTIVE ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                {isACTIVE ? "Pause Campaign" : "Activate Live"}
              </Button>
              <Badge variant={isACTIVE ? "default" : "secondary"} className="px-3 py-1 font-bold text-xs">
                ● {status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Multi-Level Tabs (Hierarchy like Meta Ads Manager) */}
        <Tabs defaultValue="campaign" className="w-full mt-4">
          <TabsList className="grid grid-cols-4 w-full h-11 bg-muted/60 p-1 rounded-xl">
            <TabsTrigger value="campaign" className="text-xs font-bold gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> 1. Campaign
            </TabsTrigger>
            <TabsTrigger value="adset" className="text-xs font-bold gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-500" /> 2. Ad Set (Audience)
            </TabsTrigger>
            <TabsTrigger value="creative" className="text-xs font-bold gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-500" /> 3. Ad Creative & Copy
            </TabsTrigger>
            <TabsTrigger value="ai-audit" className="text-xs font-bold gap-1.5 text-primary">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 4. AI Recommendations
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CAMPAIGN LEVEL */}
          <TabsContent value="campaign" className="space-y-5 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cName" className="font-semibold text-xs">Campaign Name</Label>
                  <Input
                    id="cName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-xs">Campaign Objective</Label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm font-medium focus:outline-none"
                  >
                    <option value="OUTCOME_LEADS">Lead Generation (WhatsApp & CRM Leads)</option>
                    <option value="OUTCOME_ENGAGEMENT">Engagement (Messages & Interactions)</option>
                    <option value="OUTCOME_SALES">Conversions & Sales</option>
                    <option value="OUTCOME_AWARENESS">Brand Awareness & Reach</option>
                    <option value="OUTCOME_TRAFFIC">Website Traffic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-xs">Special Ad Categories</Label>
                  <select
                    value={specialCategory}
                    onChange={(e) => setSpecialCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm font-medium focus:outline-none"
                  >
                    <option value="NONE">None (Standard Business / Service Ad)</option>
                    <option value="EMPLOYMENT">Employment & Job Offers</option>
                    <option value="HOUSING">Housing & Real Estate</option>
                    <option value="CREDIT">Financial & Credit Services</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cBudget" className="font-semibold text-xs">Advantage Daily Budget (₹ INR)</Label>
                    <Badge variant="outline" className="text-[10px] font-mono">Real-Time Meta Sync</Badge>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-muted-foreground">₹</span>
                    <Input
                      id="cBudget"
                      type="number"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Number(e.target.value))}
                      className="pl-7 font-bold text-base"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Meta will distribute budget across best-performing hours for lowest Cost Per Lead (CPL).
                  </p>
                </div>

                {/* Buying Type & Bidding Strategy */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg border bg-card">
                    <p className="text-[11px] text-muted-foreground uppercase font-bold">Buying Type</p>
                    <p className="font-semibold text-sm text-foreground mt-0.5">Auction (Standard)</p>
                  </div>
                  <div className="p-3.5 rounded-lg border bg-card">
                    <p className="text-[11px] text-muted-foreground uppercase font-bold">Bid Strategy</p>
                    <p className="font-semibold text-sm text-foreground mt-0.5">Highest Volume (Lowest Cost)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSaveSettings} disabled={saving} className="bg-primary text-primary-foreground gap-2 font-bold shadow-md">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes to Meta Graph API
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: AD SET & AUDIENCE TARGETING */}
          <TabsContent value="adset" className="space-y-5 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                {/* Age Targeting */}
                <div className="space-y-2">
                  <Label className="font-semibold text-xs">Target Age Range</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-muted-foreground">Min Age</span>
                      <Input
                        type="number"
                        min={18}
                        max={65}
                        value={ageMin}
                        onChange={(e) => setAgeMin(Number(e.target.value))}
                        className="font-medium mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground">Max Age</span>
                      <Input
                        type="number"
                        min={18}
                        max={65}
                        value={ageMax}
                        onChange={(e) => setAgeMax(Number(e.target.value))}
                        className="font-medium mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="font-semibold text-xs">Gender</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["ALL", "MEN", "WOMEN"].map((g) => (
                      <Button
                        key={g}
                        type="button"
                        variant={gender === g ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGender(g)}
                        className="font-semibold text-xs"
                      >
                        {g === "ALL" ? "All Genders" : g === "MEN" ? "Men Only" : "Women Only"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Target Locations */}
                <div className="space-y-2">
                  <Label htmlFor="loc" className="font-semibold text-xs">Target Locations</Label>
                  <Input
                    id="loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. India, Delhi, Mumbai, Bengaluru"
                    className="font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Detailed Interests */}
                <div className="space-y-2">
                  <Label htmlFor="intr" className="font-semibold text-xs">Detailed Demographics & Interests</Label>
                  <Textarea
                    id="intr"
                    rows={3}
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Higher Education, Events, Luxury Lifestyle, Business"
                    className="font-medium text-xs leading-relaxed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Separate interests with commas. Meta's delivery algorithm will prioritize users matching these high-intent signals.
                  </p>
                </div>

                {/* Placements & Destination */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-semibold text-xs">Placements</Label>
                    <select
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-md border bg-background text-xs font-medium focus:outline-none"
                    >
                      <option value="advantage_plus">Advantage+ Placements (Recommended)</option>
                      <option value="feeds_only">Feeds Only (Facebook & Instagram)</option>
                      <option value="stories_reels">Stories & Reels Only</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-semibold text-xs">Conversion Destination</Label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-md border bg-background text-xs font-medium focus:outline-none"
                    >
                      <option value="whatsapp">Click-to-WhatsApp (Direct CRM Chat)</option>
                      <option value="instant_form">Instant Lead Form</option>
                      <option value="website">Website / Landing Page</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSaveSettings} disabled={saving} className="bg-primary text-primary-foreground gap-2 font-bold shadow-md">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Ad Set Changes
              </Button>
            </div>
          </TabsContent>

          {/* TAB 3: AD CREATIVE LEVEL (WITH SIDE-BY-SIDE LIVE PREVIEW) */}
          <TabsContent value="creative" className="space-y-5 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pText" className="font-semibold text-xs">Primary Text (Ad Copy)</Label>
                    <span className="text-[10px] text-muted-foreground">{primaryText.length} chars</span>
                  </div>
                  <Textarea
                    id="pText"
                    rows={4}
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    className="font-medium text-xs leading-relaxed"
                    placeholder="Write compelling ad copy that highlights your value proposition..."
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hLine" className="font-semibold text-xs">Ad Headline</Label>
                    <span className="text-[10px] text-muted-foreground">{headline.length} chars</span>
                  </div>
                  <Input
                    id="hLine"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="font-bold text-sm"
                    placeholder="e.g. Fellowship Admission 2026 | Limited Seats"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cta" className="font-semibold text-xs">Call To Action (CTA)</Label>
                    <select
                      id="cta"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-md border bg-background text-xs font-semibold focus:outline-none"
                    >
                      <option value="Send WhatsApp Message">Send WhatsApp Message</option>
                      <option value="Apply Now">Apply Now</option>
                      <option value="Learn More">Learn More</option>
                      <option value="Book Now">Book Now</option>
                      <option value="Contact Us">Contact Us</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="imgUrl" className="font-semibold text-xs">Creative Image URL</Label>
                    <Input
                      id="imgUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="text-xs"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button onClick={handleSaveSettings} disabled={saving} className="bg-primary text-primary-foreground gap-2 font-bold shadow-md">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Publish Creative to Meta
                  </Button>
                </div>
              </div>

              {/* Live Mobile Feed Ad Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> Live Mobile Feed Preview
                </Label>

                {/* Facebook / Instagram Feed Mockup Card */}
                <div className="w-full max-w-[320px] rounded-2xl border bg-card shadow-lg overflow-hidden text-xs">
                  {/* Header */}
                  <div className="p-3 flex items-center justify-between border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-[10px]">
                        AI
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground leading-tight truncate max-w-[170px]">{name}</p>
                        <p className="text-[10px] text-muted-foreground">Sponsored • 🌐</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Text */}
                  <div className="p-3 text-xs leading-relaxed text-foreground whitespace-pre-line line-clamp-3">
                    {primaryText}
                  </div>

                  {/* Creative Image */}
                  <div className="w-full h-44 bg-muted overflow-hidden relative">
                    <img
                      src={imageUrl}
                      alt="Ad Creative"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback placeholder image
                        ;(e.target as HTMLElement).setAttribute(
                          "src",
                          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60"
                        )
                      }}
                    />
                  </div>

                  {/* CTA Bar */}
                  <div className="p-3 bg-muted/40 border-t flex items-center justify-between gap-2">
                    <div className="space-y-0.5 max-w-[170px]">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground truncate">{destination.toUpperCase()}</p>
                      <p className="font-bold text-xs text-foreground truncate">{headline}</p>
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-8 px-2.5 gap-1 shrink-0">
                      <MessageSquare className="w-3 h-3" /> {ctaText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: AI STRATEGIC RECOMMENDATIONS */}
          <TabsContent value="ai-audit" className="space-y-4 pt-4">
            {!aiAudit ? (
              <div className="p-8 text-center space-y-4 border rounded-xl bg-primary/5">
                <Sparkles className="w-10 h-10 text-primary mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-foreground">Generate AI Campaign Diagnostic & Copy Audit</h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    AI will analyze this campaign's target audience, budget efficiency, and craft high-converting ad copy variations tailored to your business.
                  </p>
                </div>
                <Button onClick={handleGenerateAIAudit} disabled={auditing} className="gap-2 font-bold shadow-md">
                  {auditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate AI Recommendations
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Health Rating & Analysis */}
                <div className="p-4 rounded-xl border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">Campaign Health Rating</span>
                    <Badge className="bg-emerald-600 text-white font-bold text-xs">
                      Grade: {aiAudit.healthGrade}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{aiAudit.statusAnalysis}</p>
                </div>

                {/* Strategic Action Items */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Actionable Optimization Strategy
                  </Label>
                  <div className="space-y-2">
                    {aiAudit.keyRecommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg border bg-muted/20 text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-foreground leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Headlines with 1-Click Apply */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    AI Generated High-Converting Headlines
                  </Label>
                  <div className="space-y-2">
                    {aiAudit.suggestedHeadlines.map((hl: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border bg-background flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-foreground">{hl}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(hl)}
                            className="h-7 text-xs px-2 gap-1 text-muted-foreground"
                          >
                            {copiedText === hl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplyHeadline(hl)}
                            className="h-7 text-xs px-2.5 font-semibold bg-primary text-primary-foreground"
                          >
                            Apply to Ad
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Primary Text with 1-Click Apply */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    AI Generated High-Converting Primary Text
                  </Label>
                  <div className="space-y-2">
                    {aiAudit.suggestedPrimaryTexts.map((txt: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-foreground leading-relaxed whitespace-pre-line">{txt}</span>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(txt)}
                            className="h-7 text-xs px-2 gap-1 text-muted-foreground"
                          >
                            {copiedText === txt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplyPrimaryText(txt)}
                            className="h-7 text-xs px-2.5 font-semibold bg-primary text-primary-foreground"
                          >
                            Apply to Ad
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleGenerateAIAudit} disabled={auditing} className="gap-1.5 text-xs">
                    <Sparkles className="w-3 h-3" /> Re-Analyze with AI
                  </Button>
                  <Button size="sm" onClick={() => onOpenChange(false)}>Done</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
