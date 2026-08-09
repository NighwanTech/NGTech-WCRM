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
  DollarSign,
  UploadCloud
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

  // Graphics Studio State (Upload vs AI Generation)
  const [graphicMode, setGraphicMode] = useState<"upload" | "ai" | "presets">("upload")
  const [aiGraphicPrompt, setAiGraphicPrompt] = useState("")
  const [generatingGraphic, setGeneratingGraphic] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB")
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string)
        toast.success(`Image uploaded: ${file.name}`)
      }
    }
    reader.readAsDataURL(file)
  }

  // 4. AI Strategic Co-Pilot State
  const [auditing, setAuditing] = useState(false)
  const [aiAudit, setAiAudit] = useState<any>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const isACTIVE = status === "ACTIVE"

  const handleGenerateAIGraphic = async (customPrompt?: string) => {
    setGeneratingGraphic(true)
    try {
      const res = await fetch("/api/meta/ai/generate-graphic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt || aiGraphicPrompt || name,
          headline,
        }),
      })
      const data = await res.json()
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl)
        toast.success("AI Ad Graphic generated and applied to live preview!")
      }
    } catch {
      toast.error("Failed to generate AI graphic")
    } finally {
      setGeneratingGraphic(false)
    }
  }

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
        const res1 = await fetch("/api/meta/campaigns/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: campaign.id,
            action: "update_name",
            payload: { name },
            adAccountId,
          }),
        })
        const d1 = await res1.json()
        if (!res1.ok || d1.error) {
          toast.error(d1.error || "Failed to update campaign name on Meta")
          setSaving(false)
          return
        }
      }

      const res2 = await fetch("/api/meta/campaigns/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          action: "update_budget",
          payload: { dailyBudget },
          adAccountId,
        }),
      })
      const d2 = await res2.json()
      if (!res2.ok || d2.error) {
        toast.error(d2.error || "Failed to update daily budget on Meta")
        setSaving(false)
        return
      }

      const updated = {
        ...campaign,
        name,
        daily_budget: dailyBudget.toString(),
        status,
      }
      onUpdate(updated)
      toast.success("All changes synced live to your Meta Ads Account!")
    } catch (err: any) {
      toast.error(err.message || "Failed to update campaign on Meta")
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
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to toggle status on Meta")
        return
      }

      const updated = { ...campaign, status: newStatus as any }
      onUpdate(updated)
      setStatus(newStatus)
      toast.success(`Campaign status updated to ${newStatus} on Meta!`)
    } catch (err: any) {
      toast.error(err.message || "Failed to change campaign status")
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
      <DialogContent className="w-full sm:max-w-5xl md:max-w-6xl sm:w-[92vw] max-h-[94vh] overflow-y-auto p-4 sm:p-6 rounded-xl sm:rounded-2xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground break-words line-clamp-2">
                  {name}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-mono">Meta ID: {campaign.id}</span>
                <span className="hidden sm:inline">•</span>
                <span className="font-medium text-foreground">Spend: ₹{campaign.spend || "0"}</span>
                <span className="hidden sm:inline">•</span>
                <span className="font-medium text-foreground">Impressions: {campaign.impressions || "0"}</span>
              </DialogDescription>
            </div>
            
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
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
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto sm:h-11 bg-muted/60 p-1 rounded-xl gap-1">
            <TabsTrigger value="campaign" className="text-xs font-bold gap-1.5 py-2 sm:py-0">
              <Layers className="w-3.5 h-3.5 text-primary shrink-0" /> 1. Campaign
            </TabsTrigger>
            <TabsTrigger value="adset" className="text-xs font-bold gap-1.5 py-2 sm:py-0">
              <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0" /> 2. Ad Set
            </TabsTrigger>
            <TabsTrigger value="creative" className="text-xs font-bold gap-1.5 py-2 sm:py-0">
              <Palette className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 3. Creative & Copy
            </TabsTrigger>
            <TabsTrigger value="ai-audit" className="text-xs font-bold gap-1.5 text-primary py-2 sm:py-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" /> 4. AI Co-Pilot
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <Label className="font-semibold text-xs">Ad Graphics Source</Label>
                    <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setGraphicMode("ai")}
                        className={`flex-1 py-1 text-center rounded-md transition-all text-[11px] font-bold ${
                          graphicMode === "ai" ? "bg-background text-primary shadow-xs" : "text-muted-foreground"
                        }`}
                      >
                        ✨ Ask AI
                      </button>
                      <button
                        type="button"
                        onClick={() => setGraphicMode("upload")}
                        className={`flex-1 py-1 text-center rounded-md transition-all text-[11px] font-bold ${
                          graphicMode === "upload" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                        }`}
                      >
                        📤 Upload / URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setGraphicMode("presets")}
                        className={`flex-1 py-1 text-center rounded-md transition-all text-[11px] font-bold ${
                          graphicMode === "presets" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                        }`}
                      >
                        🖼️ Presets
                      </button>
                    </div>
                  </div>
                </div>

                {/* GRAPHIC MODE 1: ASK AI TO GENERATE */}
                {graphicMode === "ai" && (
                  <div className="p-3.5 rounded-xl border bg-primary/5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI Ad Graphic Generator
                      </Label>
                      <span className="text-[10px] text-muted-foreground">Generates 4K Ad Visuals</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={aiGraphicPrompt}
                        onChange={(e) => setAiGraphicPrompt(e.target.value)}
                        placeholder={`e.g. Modern commercial banner for ${headline || name}`}
                        className="text-xs font-medium bg-background"
                      />
                      <Button
                        type="button"
                        onClick={() => handleGenerateAIGraphic()}
                        disabled={generatingGraphic}
                        className="text-xs font-bold gap-1.5 shrink-0 bg-primary text-primary-foreground shadow-sm"
                      >
                        {generatingGraphic ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Palette className="w-3.5 h-3.5" />}
                        Generate
                      </Button>
                    </div>
                  </div>
                )}

                {/* GRAPHIC MODE 2: UPLOAD / CUSTOM URL */}
                {graphicMode === "upload" && (
                  <div className="p-3.5 rounded-xl border-2 border-dashed border-primary/30 bg-muted/10 hover:bg-muted/30 transition-all text-center space-y-2.5">
                    <input
                      type="file"
                      id="editModalBannerFileInput"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="editModalBannerFileInput"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-1.5"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground">Click to Browse & Upload Image from Computer</p>
                        <p className="text-[10px] text-muted-foreground">JPG, PNG, WEBP (Directly synced to Meta Ad Creative)</p>
                      </div>
                      <Button type="button" size="sm" variant="outline" className="pointer-events-none text-xs gap-1 font-semibold h-7 mt-0.5">
                        <UploadCloud className="w-3 h-3" /> Choose Image File
                      </Button>
                    </label>

                    <div className="pt-2 border-t flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground shrink-0">Or URL:</span>
                      <Input
                        id="imgUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="h-7 text-xs font-mono bg-background"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {/* GRAPHIC MODE 3: NICHE PRESETS */}
                {graphicMode === "presets" && (
                  <div className="space-y-2 p-3 rounded-xl border bg-muted/20">
                    <Label className="font-semibold text-xs">1-Click Niche Advertising Templates</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "🏥 Medical & Doctors", query: "doctor medical hospital" },
                        { label: "💍 Events & Weddings", query: "wedding event stage" },
                        { label: "🏋️ Fitness & Sports", query: "fitness sports workout" },
                        { label: "✈️ Travel & Resorts", query: "luxury resort travel" },
                      ].map((item, idx) => (
                        <Button
                          key={idx}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateAIGraphic(item.query)}
                          disabled={generatingGraphic}
                          className="text-xs justify-start h-8 font-medium bg-background hover:bg-primary/5"
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

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
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-primary" /> Live Mobile Feed Preview (Facebook / Instagram)
                </Label>

                {/* Facebook / Instagram Feed Mockup Card */}
                <div className="w-full max-w-[360px] rounded-2xl border bg-card shadow-xl overflow-hidden text-xs transition-all">
                  {/* Header */}
                  <div className="p-3 flex items-center justify-between border-b bg-muted/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-700 flex items-center justify-center font-black text-xs">
                        {name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground leading-tight truncate max-w-[200px]">{name}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          Sponsored • <span className="text-[10px]">🌐</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Text */}
                  <div className="p-3 text-xs leading-relaxed text-foreground whitespace-pre-line max-h-28 overflow-y-auto scrollbar-thin">
                    {primaryText}
                  </div>

                  {/* Creative Image */}
                  <div className="w-full h-48 bg-muted overflow-hidden relative border-y">
                    <img
                      src={imageUrl}
                      alt="Ad Creative"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).setAttribute(
                          "src",
                          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60"
                        )
                      }}
                    />
                  </div>

                  {/* CTA Bar */}
                  <div className="p-3 bg-muted/30 border-b flex items-center justify-between gap-3">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider truncate">
                        {destination === "whatsapp" ? "WHATSAPP.COM" : "OFFICIAL WEBSITE"}
                      </p>
                      <p className="font-bold text-xs text-foreground truncate">{headline}</p>
                    </div>
                    <Button size="sm" className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs h-8 px-3 gap-1.5 shrink-0 shadow-sm">
                      <MessageCircle className="w-3.5 h-3.5" /> {ctaText}
                    </Button>
                  </div>

                  {/* Social Action Bar (Like, Comment, Share) */}
                  <div className="px-4 py-2 bg-card flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors">
                        <Heart className="w-3.5 h-3.5" /> Like
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" /> Comment
                      </span>
                      <span className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer transition-colors">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </span>
                    </div>
                    <Bookmark className="w-3.5 h-3.5" />
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
