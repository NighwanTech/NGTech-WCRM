"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, MessageSquare, Users, ShoppingBag, Check, Rocket, Loader2, Building2, Palette, Image as ImageIcon } from "lucide-react"
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

  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>(initialAdAccountId)

  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState("whatsapp")
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [location, setLocation] = useState("India")
  const [dailyBudget, setDailyBudget] = useState(500)

  const [generating, setGenerating] = useState(false)
  const [strategy, setStrategy] = useState<AIAdStrategyOutput | null>(null)

  const [selectedHeadline, setSelectedHeadline] = useState("")
  const [selectedPrimaryText, setSelectedPrimaryText] = useState("")
  const [selectedCta, setSelectedCta] = useState("Send WhatsApp Message")

  // Graphics Studio State
  const [graphicMode, setGraphicMode] = useState<"ai" | "upload" | "presets">("ai")
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80")
  const [aiGraphicPrompt, setAiGraphicPrompt] = useState("")
  const [generatingGraphic, setGeneratingGraphic] = useState(false)

  const [launching, setLaunching] = useState(false)

  const handleGenerateAIGraphic = async (customPrompt?: string) => {
    setGeneratingGraphic(true)
    try {
      const res = await fetch("/api/meta/ai/generate-graphic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt || aiGraphicPrompt || businessName || businessType,
          headline: selectedHeadline,
          businessType,
        }),
      })
      const data = await res.json()
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl)
        toast.success("AI Graphic banner generated!")
      }
    } catch {
      toast.error("Failed to generate graphic")
    } finally {
      setGeneratingGraphic(false)
    }
  }

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

  // Step 2 -> Step 3: Trigger AI Generation
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
        setDailyBudget(data.strategy.recommendedDailyBudget || 500)
        setStep(3)
      }
    } catch (err) {
      console.error("AI Strategy generation failed:", err)
    } finally {
      setGenerating(false)
    }
  }

  // Step 5: Launch Ad
  const handleLaunchAd = async () => {
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
          dailyBudget,
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
        router.push(selectedAdAccountId ? `/meta-ads?adAccountId=${selectedAdAccountId}` : "/meta-ads")
      }
    } catch (err) {
      console.error("Ad launch failed:", err)
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/meta-ads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">AI Meta Ad Builder</h1>
              <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 animate-pulse" /> Autonomous Ad OS
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Launch high-converting Facebook & Instagram ads powered by AI targeting and copy generation.
            </p>
          </div>
        </div>

        {/* Target Ad Account Selector */}
        {adAccounts.length > 0 && (
          <div className="flex items-center gap-2 bg-muted/70 px-3.5 py-2 rounded-xl border shadow-sm self-start md:self-auto">
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
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className="text-xs font-medium hidden md:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: CAMPAIGN GOAL */}
      {step === 1 && (
        <Card className="border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>What is your primary advertising goal?</CardTitle>
            <CardDescription>Select the core objective for this autonomous ad campaign.</CardDescription>
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
              <Button onClick={() => setStep(2)} className="gap-2">
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
                placeholder="e.g. AIWCRM Solutions"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Category / Offering</Label>
              <Input
                id="businessType"
                placeholder="e.g. WhatsApp Automation & AI Sales CRM"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Target Location</Label>
              <Input
                id="location"
                placeholder="e.g. India, Delhi, Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleGenerateStrategy} disabled={generating || !businessName} className="gap-2">
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
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="font-bold text-foreground">{strategy.audience.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-bold text-foreground">{strategy.audience.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Meta Objective</p>
                <p className="font-bold text-foreground text-xs font-mono">{strategy.suggestedObjective}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">High-Intent Interests</p>
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
              <Button onClick={() => setStep(4)} className="gap-2">
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
            {/* Headlines */}
            <div className="space-y-3">
              <Label className="font-semibold text-sm">Select Headline Option</Label>
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

            {/* Primary Text */}
            <div className="space-y-3">
              <Label className="font-semibold text-sm">Select Primary Text Option</Label>
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
              <Button onClick={() => setStep(4.5)} className="gap-2 font-bold">
                Continue to Ad Graphics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4.5: AD CREATIVE GRAPHICS (UPLOAD VS ASK AI VS PRESETS) */}
      {step === 4.5 && (
        <Card className="border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" /> Ad Graphics Studio
            </CardTitle>
            <CardDescription>Choose your ad visual banner — Ask AI to generate one, upload your own, or pick a template.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-muted p-1 text-sm font-semibold max-w-md">
              <button
                type="button"
                onClick={() => setGraphicMode("ai")}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all text-xs font-bold ${
                  graphicMode === "ai" ? "bg-background text-primary shadow-xs" : "text-muted-foreground"
                }`}
              >
                ✨ Ask AI to Create
              </button>
              <button
                type="button"
                onClick={() => setGraphicMode("upload")}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all text-xs font-bold ${
                  graphicMode === "upload" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                📤 Upload / URL
              </button>
              <button
                type="button"
                onClick={() => setGraphicMode("presets")}
                className={`flex-1 py-1.5 text-center rounded-lg transition-all text-xs font-bold ${
                  graphicMode === "presets" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                🖼️ Niche Templates
              </button>
            </div>

            {/* AI Generation Mode */}
            {graphicMode === "ai" && (
              <div className="p-4 rounded-xl border bg-primary/5 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-bold text-xs text-primary flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Ad Banner Prompt
                  </Label>
                  <span className="text-[10px] text-muted-foreground">Creates High-CTR Visuals</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={aiGraphicPrompt}
                    onChange={(e) => setAiGraphicPrompt(e.target.value)}
                    placeholder={`e.g. High-converting modern banner for ${selectedHeadline || businessName}`}
                    className="font-medium text-sm bg-background flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => handleGenerateAIGraphic()}
                    disabled={generatingGraphic}
                    className="gap-2 font-bold shrink-0 bg-primary text-primary-foreground shadow-sm w-full sm:w-auto"
                  >
                    {generatingGraphic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
                    Generate Graphic
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Mode */}
            {graphicMode === "upload" && (
              <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                <Label htmlFor="createImgUrl" className="font-semibold text-xs">Image URL / Asset Link</Label>
                <Input
                  id="createImgUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or your custom banner link"
                  className="font-mono text-xs bg-background"
                />
              </div>
            )}

            {/* Presets Mode */}
            {graphicMode === "presets" && (
              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <Label className="font-semibold text-xs">Curated High-Converting Business Templates</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
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
                      className="text-xs h-9 font-medium bg-background hover:bg-primary/5 justify-center"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Visual Graphic Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Graphic Preview</Label>
              <div className="w-full max-w-md h-52 rounded-xl overflow-hidden border bg-muted relative">
                <img
                  src={imageUrl}
                  alt="Ad Banner Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLElement).setAttribute(
                      "src",
                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80"
                    )
                  }}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
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
            <CardTitle>Set Daily Budget & Launch Ad</CardTitle>
            <CardDescription>Review campaign budget, target ad account, and publish to Meta in one click.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Selector in Step 5 */}
            {adAccounts.length > 0 && (
              <div className="p-3.5 rounded-xl border bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">Publishing To:</span>
                  <span className="text-xs font-bold text-foreground">
                    {adAccounts.find((a) => a.ad_account_id === selectedAdAccountId)?.account_name || selectedAdAccountId}
                  </span>
                </div>
                <select
                  value={selectedAdAccountId}
                  onChange={(e) => setSelectedAdAccountId(e.target.value)}
                  className="bg-background border rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  {adAccounts.map((acc) => (
                    <option key={acc.id || acc.ad_account_id} value={acc.ad_account_id}>
                      {acc.account_name || acc.ad_account_id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="budget">Daily Ad Budget (₹ INR)</Label>
              <Input
                id="budget"
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">AI Recommended Daily Budget: ₹500/day</p>
            </div>

            {/* Preview Summary */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <h4 className="font-bold text-sm text-foreground">Campaign Summary</h4>
              <p className="text-xs font-semibold text-primary">{selectedHeadline}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3">{selectedPrimaryText}</p>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
              <Button onClick={handleLaunchAd} disabled={launching} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-md">
                {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                Launch Campaign via Meta API
              </Button>
            </div>
          </CardContent>
        </Card>
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
