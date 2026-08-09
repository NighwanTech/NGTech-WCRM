"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, MessageSquare, Users, ShoppingBag, Check, Rocket, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { AIAdStrategyOutput } from "@/lib/meta/ai-ad-engine"

export default function CreateAIAdPage() {
  const router = useRouter()
  const { account } = useAuth()
  const workspaceId = account?.id

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

  const [launching, setLaunching] = useState(false)

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
        router.push("/meta-ads")
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

      {/* Progress Steps */}
      <div className="flex items-center justify-between border-b pb-4 text-xs font-semibold text-muted-foreground">
        <span className={step >= 1 ? "text-primary font-bold" : ""}>1. Business Goal</span>
        <span>→</span>
        <span className={step >= 2 ? "text-primary font-bold" : ""}>2. Business Profile</span>
        <span>→</span>
        <span className={step >= 3 ? "text-primary font-bold" : ""}>3. AI Target Audience</span>
        <span>→</span>
        <span className={step >= 4 ? "text-primary font-bold" : ""}>4. AI Ad Copy</span>
        <span>→</span>
        <span className={step >= 5 ? "text-primary font-bold" : ""}>5. Budget & Launch</span>
      </div>

      {/* STEP 1: BUSINESS GOAL */}
      {step === 1 && (
        <Card className="border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Select Your Primary Ad Goal</CardTitle>
            <CardDescription>What business result do you want to achieve with this campaign?</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setGoal("whatsapp")}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                goal === "whatsapp" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <MessageSquare className="w-8 h-8 text-amber-500 mb-3" />
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
              <ShoppingBag className="w-8 h-8 text-emerald-500 mb-3" />
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
              <Button onClick={() => setStep(5)} className="gap-2">
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
            <CardDescription>Review campaign budget and publish to Meta in one click.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Button onClick={handleLaunchAd} disabled={launching} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
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
