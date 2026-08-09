"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Sparkles, 
  MessageSquare, 
  Users, 
  ShoppingBag, 
  Check, 
  Rocket, 
  Loader2, 
  Building2, 
  Palette, 
  Sliders, 
  Target, 
  Layers, 
  Smartphone, 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark, 
  Save 
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { AIAdStrategyOutput } from "@/lib/meta/ai-ad-engine"
import { toast } from "sonner"

function CreateAIAdContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialAdAccountId = searchParams.get("adAccountId") || ""

  const { account } = useAuth()
  const workspaceId = account?.id

  // Mode: "manual" (Pro Studio) vs "wizard" (AI Step-by-Step)
  const [creationMode, setCreationMode] = useState<"manual" | "wizard">("manual")

  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>(initialAdAccountId)

  // =====================
  // MANUAL PRO STUDIO STATE
  // =====================
  const [manualName, setManualName] = useState("New Ad Campaign | " + new Date().toLocaleDateString("en-IN"))
  const [manualObjective, setManualObjective] = useState("OUTCOME_ENGAGEMENT")
  const [manualBudget, setManualBudget] = useState(500)
  const [manualAgeMin, setManualAgeMin] = useState(21)
  const [manualAgeMax, setManualAgeMax] = useState(55)
  const [manualGender, setManualGender] = useState("ALL")
  const [manualLocation, setManualLocation] = useState("India")
  const [manualInterests, setManualInterests] = useState("Higher Education, Professional Growth, Spiritual Travel")
  const [manualDestination, setManualDestination] = useState("whatsapp")
  const [manualPlacement, setManualPlacement] = useState("advantage_plus")

  const [manualPrimaryText, setManualPrimaryText] = useState(
    "🚀 Discover authentic verified services tailored to your needs. Connect with our dedicated expert team on WhatsApp today for instant guidance and transparent packages."
  )
  const [manualHeadline, setManualHeadline] = useState("Book Your Consultation Online | Instant Support")
  const [manualCta, setManualCta] = useState("Send WhatsApp Message")

  // =====================
  // GRAPHICS STUDIO STATE
  // =====================
  const [graphicMode, setGraphicMode] = useState<"ai" | "upload" | "presets">("ai")
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80")
  const [aiGraphicPrompt, setAiGraphicPrompt] = useState("")
  const [generatingGraphic, setGeneratingGraphic] = useState(false)

  // =====================
  // WIZARD STATE
  // =====================
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState("whatsapp")
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [location, setLocation] = useState("India")
  const [generating, setGenerating] = useState(false)
  const [strategy, setStrategy] = useState<AIAdStrategyOutput | null>(null)
  const [selectedHeadline, setSelectedHeadline] = useState("")
  const [selectedPrimaryText, setSelectedPrimaryText] = useState("")
  const [selectedCta, setSelectedCta] = useState("Send WhatsApp Message")

  const [launching, setLaunching] = useState(false)

  // Fetch connected ad accounts on mount
  useEffect(() => {
    fetch("/api/meta/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.adAccounts && data.adAccounts.length > 0) {
          setAdAccounts(data.adAccounts)
          if (!selectedAdAccountId) {
            setSelectedAdAccountId(initialAdAccountId || data.adAccounts[0].ad_account_id)
          }
        }
      })
      .catch((err) => console.error("Failed to load ad accounts for builder", err))
  }, [initialAdAccountId, selectedAdAccountId])

  // AI Graphic Generator
  const handleGenerateAIGraphic = async (customPrompt?: string) => {
    setGeneratingGraphic(true)
    try {
      const res = await fetch("/api/meta/ai/generate-graphic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt || aiGraphicPrompt || manualName || businessName || businessType,
          headline: creationMode === "manual" ? manualHeadline : selectedHeadline,
          businessType: businessType || manualInterests,
        }),
      })
      const data = await res.json()
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl)
        toast.success("AI Graphic banner generated & applied to preview!")
      }
    } catch {
      toast.error("Failed to generate graphic")
    } finally {
      setGeneratingGraphic(false)
    }
  }

  // AI Enhance Copy for Manual Mode
  const handleAIEnhanceCopy = async () => {
    try {
      const res = await fetch("/api/meta/ai/campaign-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: manualName,
          objective: manualObjective,
          dailyBudget: manualBudget,
          spend: 0,
          impressions: 0,
          clicks: 0,
        }),
      })
      const data = await res.json()
      if (data.success && data.audit) {
        if (data.audit.suggestedHeadlines?.[0]) setManualHeadline(data.audit.suggestedHeadlines[0])
        if (data.audit.suggestedPrimaryTexts?.[0]) setManualPrimaryText(data.audit.suggestedPrimaryTexts[0])
        toast.success("AI enhanced your Headline & Primary Copy!")
      }
    } catch {
      toast.error("Failed to fetch AI suggestions")
    }
  }

  // Launch Ad from Manual Studio
  const handleManualLaunch = async () => {
    if (!workspaceId || !manualName) return
    setLaunching(true)

    try {
      const res = await fetch("/api/meta/ai/launch-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          adAccountId: selectedAdAccountId,
          name: manualName,
          objective: manualObjective,
          dailyBudget: manualBudget,
          headline: manualHeadline,
          primaryText: manualPrimaryText,
          ctaText: manualCta,
          ageMin: manualAgeMin,
          ageMax: manualAgeMax,
          location: manualLocation,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Campaign launched live on Meta!")
        router.push(selectedAdAccountId ? `/meta-ads?adAccountId=${selectedAdAccountId}` : "/meta-ads")
      } else {
        toast.error(data.error || "Failed to launch campaign")
      }
    } catch (err: any) {
      console.error("Ad launch failed:", err)
      toast.error("Ad launch failed")
    } finally {
      setLaunching(false)
    }
  }

  // Wizard AI Strategy Generation
  const handleGenerateStrategy = async () => {
    if (!businessName || !businessType) return
    setGenerating(true)

    try {
      const res = await fetch("/api/meta/ai/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, businessType, location, goal }),
      })
      const data = await res.json()

      if (data.success && data.strategy) {
        setStrategy(data.strategy)
        setSelectedHeadline(data.strategy.headlines[0] || "")
        setSelectedPrimaryText(data.strategy.primaryTexts[0] || "")
        setSelectedCta(data.strategy.ctaOptions[0] || "Send WhatsApp Message")
        setManualBudget(data.strategy.recommendedDailyBudget || 500)
        setStep(3)
      }
    } catch (err) {
      console.error("AI Strategy generation failed:", err)
    } finally {
      setGenerating(false)
    }
  }

  // Wizard Launch
  const handleWizardLaunch = async () => {
    if (!workspaceId || !businessName) return
    setLaunching(true)

    try {
      const res = await fetch("/api/meta/ai/launch-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          adAccountId: selectedAdAccountId,
          name: `${businessName} AI Campaign`,
          objective: strategy?.suggestedObjective || "OUTCOME_ENGAGEMENT",
          dailyBudget: manualBudget,
          headline: selectedHeadline,
          primaryText: selectedPrimaryText,
          ctaText: selectedCta,
          ageMin: strategy?.audience.ageMin || 18,
          ageMax: strategy?.audience.ageMax || 65,
          location,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success("Campaign launched live on Meta!")
        router.push(selectedAdAccountId ? `/meta-ads?adAccountId=${selectedAdAccountId}` : "/meta-ads")
      }
    } catch (err) {
      console.error("Ad launch failed:", err)
      toast.error("Ad launch failed")
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header with Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/meta-ads">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Create Meta Ad Campaign</h1>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Configure your campaign manually with full Meta Ads controls or use the AI Wizard.
            </p>
          </div>
        </div>

        {/* Target Ad Account Selector */}
        {adAccounts.length > 0 && (
          <div className="flex items-center gap-2 bg-muted/70 px-3.5 py-2 rounded-xl border shadow-xs self-start md:self-auto">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Target Ad Account</p>
              <select
                value={selectedAdAccountId}
                onChange={(e) => setSelectedAdAccountId(e.target.value)}
                className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer max-w-[220px] truncate"
              >
                {adAccounts.map((acc) => (
                  <option key={acc.id || acc.ad_account_id} value={acc.ad_account_id} className="bg-popover text-popover-foreground">
                    {acc.account_name || acc.ad_account_id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* MODE SWITCHER TABS: MANUAL PRO STUDIO VS AI GUIDED WIZARD */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-muted p-1 border shadow-xs">
          <button
            type="button"
            onClick={() => setCreationMode("manual")}
            className={`px-5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              creationMode === "manual" ? "bg-background text-primary shadow-sm ring-1 ring-primary/20" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="w-4 h-4" /> 🛠️ Pro Manual Ad Studio
          </button>
          <button
            type="button"
            onClick={() => setCreationMode("wizard")}
            className={`px-5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              creationMode === "wizard" ? "bg-background text-primary shadow-sm ring-1 ring-primary/20" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4 text-primary" /> ✨ AI Guided Ad Wizard
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. PRO MANUAL AD STUDIO VIEW (FULL CONTROL LIKE META ADS) */}
      {/* ========================================================= */}
      {creationMode === "manual" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Campaign Level */}
            <Card className="border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> 1. Campaign Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Campaign Name</Label>
                  <Input
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Gaya Pind Daan Special Promo 2026"
                    className="font-medium text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Campaign Objective</Label>
                    <select
                      value={manualObjective}
                      onChange={(e) => setManualObjective(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-md border bg-background text-xs font-medium focus:outline-none"
                    >
                      <option value="OUTCOME_ENGAGEMENT">WhatsApp Chat Engagement</option>
                      <option value="OUTCOME_LEADS">Lead Generation (Forms)</option>
                      <option value="OUTCOME_SALES">Conversions & Sales</option>
                      <option value="OUTCOME_AWARENESS">Brand Awareness</option>
                      <option value="OUTCOME_TRAFFIC">Website Traffic</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Daily Budget (₹ INR)</Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={manualBudget}
                        onChange={(e) => setManualBudget(Number(e.target.value))}
                        className="pl-6 h-9 font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Ad Set Level (Audience & Targeting) */}
            <Card className="border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" /> 2. Audience & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Age Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        min={18}
                        max={65}
                        value={manualAgeMin}
                        onChange={(e) => setManualAgeMin(Number(e.target.value))}
                        className="h-8 text-xs font-medium"
                      />
                      <Input
                        type="number"
                        min={18}
                        max={65}
                        value={manualAgeMax}
                        onChange={(e) => setManualAgeMax(Number(e.target.value))}
                        className="h-8 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Gender</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {["ALL", "MEN", "WOMEN"].map((g) => (
                        <Button
                          key={g}
                          type="button"
                          variant={manualGender === g ? "default" : "outline"}
                          size="sm"
                          onClick={() => setManualGender(g)}
                          className="h-8 text-[11px] font-bold px-1"
                        >
                          {g === "ALL" ? "All" : g === "MEN" ? "Men" : "Women"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Target Locations</Label>
                  <Input
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="e.g. India, Delhi, Patna, Kolkata, Mumbai"
                    className="text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Detailed Interests & Demographics</Label>
                  <Textarea
                    rows={2}
                    value={manualInterests}
                    onChange={(e) => setManualInterests(e.target.value)}
                    placeholder="e.g. Spiritual Tourism, Hindu Rituals, Gaya, Religious Travel"
                    className="text-xs font-medium leading-relaxed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Ad Creative, Copy & Graphics Studio */}
            <Card className="border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-500" /> 3. Ad Copy & Graphics Studio
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAIEnhanceCopy}
                    className="text-xs gap-1.5 font-bold text-primary border-primary/30 hover:bg-primary/5 h-7 px-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Enhance with AI
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Primary Text (Ad Copy)</Label>
                  <Textarea
                    rows={3}
                    value={manualPrimaryText}
                    onChange={(e) => setManualPrimaryText(e.target.value)}
                    className="text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Headline</Label>
                    <Input
                      value={manualHeadline}
                      onChange={(e) => setManualHeadline(e.target.value)}
                      className="text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Call To Action (CTA)</Label>
                    <select
                      value={manualCta}
                      onChange={(e) => setManualCta(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-md border bg-background text-xs font-semibold focus:outline-none"
                    >
                      <option value="Send WhatsApp Message">Send WhatsApp Message</option>
                      <option value="Book Now">Book Now</option>
                      <option value="Apply Now">Apply Now</option>
                      <option value="Learn More">Learn More</option>
                      <option value="Contact Us">Contact Us</option>
                    </select>
                  </div>
                </div>

                {/* GRAPHICS STUDIO (AI VS UPLOAD VS PRESETS) */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-foreground">Ad Banner Graphics</Label>
                    <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setGraphicMode("ai")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                          graphicMode === "ai" ? "bg-background text-primary shadow-xs" : "text-muted-foreground"
                        }`}
                      >
                        ✨ Ask AI
                      </button>
                      <button
                        type="button"
                        onClick={() => setGraphicMode("upload")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                          graphicMode === "upload" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                        }`}
                      >
                        📤 Upload / URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setGraphicMode("presets")}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                          graphicMode === "presets" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                        }`}
                      >
                        🖼️ Presets
                      </button>
                    </div>
                  </div>

                  {graphicMode === "ai" && (
                    <div className="p-3 rounded-xl border bg-primary/5 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={aiGraphicPrompt}
                          onChange={(e) => setAiGraphicPrompt(e.target.value)}
                          placeholder={`e.g. High-converting banner for ${manualHeadline || manualName}`}
                          className="text-xs font-medium bg-background"
                        />
                        <Button
                          type="button"
                          onClick={() => handleGenerateAIGraphic()}
                          disabled={generatingGraphic}
                          className="gap-1.5 text-xs font-bold shrink-0 bg-primary text-primary-foreground"
                        >
                          {generatingGraphic ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Palette className="w-3.5 h-3.5" />}
                          Generate
                        </Button>
                      </div>
                    </div>
                  )}

                  {graphicMode === "upload" && (
                    <div className="p-3 rounded-xl border bg-muted/20 space-y-1.5">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or paste custom banner link"
                        className="text-xs font-mono bg-background"
                      />
                    </div>
                  )}

                  {graphicMode === "presets" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: "🏥 Medical", query: "doctor medical hospital" },
                        { label: "💍 Weddings", query: "wedding event stage" },
                        { label: "🛕 Religious / Pind Daan", query: "spiritual river temple ceremony" },
                        { label: "🏋️ Sports", query: "fitness sports workout" },
                      ].map((item, idx) => (
                        <Button
                          key={idx}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateAIGraphic(item.query)}
                          disabled={generatingGraphic}
                          className="text-xs h-8 font-medium justify-center"
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 flex justify-end">
                  <Button
                    onClick={handleManualLaunch}
                    disabled={launching || !manualName}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm h-10 px-6 gap-2 shadow-md"
                  >
                    {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                    Publish Campaign to Meta Graph API
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Mobile Feed Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-primary" /> Live Mobile Feed Preview (Facebook / Instagram)
            </Label>

            {/* Mobile Feed Ad Mockup Card */}
            <div className="w-full max-w-[360px] rounded-2xl border bg-card shadow-xl overflow-hidden text-xs transition-all sticky top-6">
              {/* Header */}
              <div className="p-3 flex items-center justify-between border-b bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-700 flex items-center justify-center font-black text-xs">
                    {manualName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-foreground leading-tight truncate max-w-[200px]">{manualName}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      Sponsored • <span className="text-[10px]">🌐</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Text */}
              <div className="p-3 text-xs leading-relaxed text-foreground whitespace-pre-line max-h-28 overflow-y-auto scrollbar-thin">
                {manualPrimaryText}
              </div>

              {/* Graphic Banner */}
              <div className="w-full h-48 bg-muted overflow-hidden relative border-y">
                <img
                  src={imageUrl}
                  alt="Ad Banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLElement).setAttribute(
                      "src",
                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80"
                    )
                  }}
                />
              </div>

              {/* CTA Bar */}
              <div className="p-3 bg-muted/30 border-b flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider truncate">
                    {manualDestination === "whatsapp" ? "WHATSAPP.COM" : "OFFICIAL SITE"}
                  </p>
                  <p className="font-bold text-xs text-foreground truncate">{manualHeadline}</p>
                </div>
                <Button size="sm" className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs h-8 px-3 gap-1.5 shrink-0 shadow-sm">
                  <MessageCircle className="w-3.5 h-3.5" /> {manualCta}
                </Button>
              </div>

              {/* Social Action Bar */}
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
      )}

      {/* ========================================================= */}
      {/* 2. AI GUIDED AD WIZARD (STEP-BY-STEP)                     */}
      {/* ========================================================= */}
      {creationMode === "wizard" && (
        <div className="space-y-6">
          {/* STEP INDICATOR */}
          <div className="flex items-center justify-between max-w-2xl mx-auto py-2">
            {[
              { num: 1, label: "Goal" },
              { num: 2, label: "Profile" },
              { num: 3, label: "Audience" },
              { num: 4, label: "Ad Copy" },
              { num: 5, label: "Launch" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step === s.num
                      ? "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20"
                      : step > s.num
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: CAMPAIGN GOAL */}
          {step === 1 && (
            <Card className="border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Select Your Ad Objective</CardTitle>
                <CardDescription>What is the primary conversion goal for this campaign?</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setGoal("whatsapp")}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    goal === "whatsapp" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <MessageSquare className="w-8 h-8 text-emerald-500 mb-3" />
                  <h4 className="font-bold text-base">Click-to-WhatsApp</h4>
                  <p className="text-xs text-muted-foreground mt-1">Drive prospects straight into WhatsApp automated AI chats.</p>
                </div>

                <div
                  onClick={() => setGoal("leads")}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    goal === "leads" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Users className="w-8 h-8 text-blue-500 mb-3" />
                  <h4 className="font-bold text-base">Lead Generation</h4>
                  <p className="text-xs text-muted-foreground mt-1">Capture customer lead form submissions directly into CRM.</p>
                </div>

                <div
                  onClick={() => setGoal("sales")}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    goal === "sales" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <ShoppingBag className="w-8 h-8 text-indigo-500 mb-3" />
                  <h4 className="font-bold text-base">Website Conversions</h4>
                  <p className="text-xs text-muted-foreground mt-1">Drive targeted website traffic and product sales.</p>
                </div>

                <div className="md:col-span-3 pt-4 flex justify-end">
                  <Button onClick={() => setStep(2)} className="gap-2 font-bold">
                    Continue to Business Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: BUSINESS PROFILE */}
          {step === 2 && (
            <Card className="border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Tell AI About Your Business</CardTitle>
                <CardDescription>Enter minimal details and AI will craft your targeting and ad copy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business / Product Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g. Pind Daan Wale / IMC"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Category / Offering</Label>
                  <Input
                    id="businessType"
                    placeholder="e.g. Pind Daan at Gaya Ji / Medical Fellowship"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Target Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. India, Delhi, Mumbai, Bihar"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handleGenerateStrategy} disabled={generating || !businessName} className="gap-2 font-bold">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate AI Ad Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: AI TARGET AUDIENCE PREVIEW */}
          {step === 3 && strategy && (
            <Card className="border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> AI Generated Target Audience
                </CardTitle>
                <CardDescription>AI has optimized demographic and interest targeting for maximum CTR.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border">
                  <div>
                    <p className="text-xs text-muted-foreground">Target Age</p>
                    <p className="font-bold text-foreground">{strategy.audience.ageMin} - {strategy.audience.ageMax} Years</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target Location</p>
                    <p className="font-bold text-foreground">{strategy.audience.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Suggested Objective</p>
                    <p className="font-bold text-foreground">{strategy.suggestedObjective}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Recommended Budget</p>
                    <p className="font-bold text-foreground">₹{strategy.recommendedDailyBudget}/day</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Targeted Facebook Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {strategy.audience.interests.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={() => setStep(4)} className="gap-2 font-bold">
                    Continue to AI Ad Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: AI AD COPY SELECTION */}
          {step === 4 && strategy && (
            <Card className="border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Select Your AI Generated Ad Copy</CardTitle>
                <CardDescription>Pick your favorite AI headline and primary text variation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-semibold text-sm">Select Headline</Label>
                  {strategy.headlines.map((hl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedHeadline(hl)}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        selectedHeadline === hl ? "border-primary bg-primary/5 font-semibold" : "hover:border-primary/50"
                      }`}
                    >
                      <span className="text-sm">{hl}</span>
                      {selectedHeadline === hl && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold text-sm">Select Primary Text</Label>
                  {strategy.primaryTexts.map((txt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPrimaryText(txt)}
                      className={`p-4 rounded-lg border cursor-pointer flex items-start justify-between whitespace-pre-line text-xs transition-all ${
                        selectedPrimaryText === txt ? "border-primary bg-primary/5" : "hover:border-primary/50"
                      }`}
                    >
                      <span className="text-foreground leading-relaxed">{txt}</span>
                      {selectedPrimaryText === txt && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                  <Button onClick={() => setStep(5)} className="gap-2 font-bold">
                    Continue to Launch
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: BUDGET & ONE-CLICK LAUNCH */}
          {step === 5 && (
            <Card className="border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Review & Launch Ad</CardTitle>
                <CardDescription>Review campaign budget and publish live to Meta in one click.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                  <h4 className="font-bold text-sm text-foreground">Campaign Summary</h4>
                  <p className="text-xs font-semibold text-primary">{selectedHeadline}</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3">{selectedPrimaryText}</p>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
                  <Button onClick={handleWizardLaunch} disabled={launching} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-md">
                    {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                    Launch Campaign via Meta API
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default function CreateAIAdPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-4xl mx-auto flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <CreateAIAdContent />
    </Suspense>
  )
}
