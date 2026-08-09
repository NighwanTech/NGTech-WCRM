"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Target, Users, Image as ImageIcon, IndianRupee, Loader2 } from "lucide-react"

export function CampaignBuilderWizard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [campaignData, setCampaignData] = useState({
    objective: 'LEAD_GENERATION',
    name: '',
    targetAudiencePrompt: '',
    generatedAudiences: [],
    adCopyPrompt: '',
    generatedAdCopy: '',
    dailyBudget: ''
  })

  const handleNext = async () => {
    if (step === 2 && campaignData.generatedAudiences.length === 0) {
      // Trigger AI Audience Generation
      setLoading(true)
      try {
        const res = await fetch("/api/meta/ai/generate-audience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: campaignData.targetAudiencePrompt })
        })
        const data = await res.json()
        if (data.audiences) {
          setCampaignData(prev => ({ ...prev, generatedAudiences: data.audiences }))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    } else if (step === 3 && !campaignData.generatedAdCopy) {
      // Trigger AI Ad Copy Generation
      setLoading(true)
      try {
        const res = await fetch("/api/meta/ai/generate-copy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: campaignData.adCopyPrompt, objective: campaignData.objective })
        })
        const data = await res.json()
        if (data.copy) {
          setCampaignData(prev => ({ ...prev, generatedAdCopy: data.copy }))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    } else {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => setStep(prev => Math.max(1, prev - 1))

  const handleLaunch = async () => {
    setLoading(true)
    try {
      // Call launch API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(5) // Success step
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border bg-card shadow-lg max-w-4xl mx-auto">
      <CardHeader className="bg-muted/30 border-b pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" /> AI Campaign Builder
            </CardTitle>
            <CardDescription className="mt-1">
              Let the Autonomous AI Agent craft your campaign strategy based on historical CRM ROI.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Step {step} of 4
          </div>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex justify-between mt-6 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          </div>
          {[
            { num: 1, label: "Objective", icon: Target },
            { num: 2, label: "Audience", icon: Users },
            { num: 3, label: "Creative", icon: ImageIcon },
            { num: 4, label: "Budget", icon: IndianRupee }
          ].map(s => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 bg-card px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.num ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-muted text-muted-foreground'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-8 pb-8 min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <Label className="text-base font-semibold">Campaign Objective</Label>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div 
                  className={`p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors ${campaignData.objective === 'LEAD_GENERATION' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                  onClick={() => setCampaignData(prev => ({ ...prev, objective: 'LEAD_GENERATION' }))}
                >
                  <h4 className="font-semibold mb-1">Lead Generation</h4>
                  <p className="text-sm text-muted-foreground">Collect leads via forms or direct them to WhatsApp for immediate conversation.</p>
                </div>
                <div 
                  className={`p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors ${campaignData.objective === 'SALES' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                  onClick={() => setCampaignData(prev => ({ ...prev, objective: 'SALES' }))}
                >
                  <h4 className="font-semibold mb-1">Sales (Conversion)</h4>
                  <p className="text-sm text-muted-foreground">Drive catalog sales or website conversions optimized for deep funnel ROI.</p>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold">Campaign Name</Label>
              <Input 
                className="mt-2" 
                placeholder="e.g. Q4 WhatsApp Lead Gen" 
                value={campaignData.name}
                onChange={e => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Describe Your Ideal Target Audience
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                The AI will use your description combined with historical CRM data (who actually converted to paying customers) to build the perfect Meta Audience.
              </p>
              <Textarea 
                placeholder="e.g. Small business owners in Mumbai and Bangalore looking for marketing automation software."
                value={campaignData.targetAudiencePrompt}
                onChange={e => setCampaignData(prev => ({ ...prev, targetAudiencePrompt: e.target.value }))}
                className="h-24"
              />
            </div>
            
            {campaignData.generatedAudiences.length > 0 && (
              <div className="p-4 bg-muted/30 rounded-xl border">
                <h4 className="font-semibold text-sm mb-3">AI Suggested Interests (Based on Past CRM ROI):</h4>
                <div className="flex flex-wrap gap-2">
                  {campaignData.generatedAudiences.map((aud, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/20">
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Ad Creative & Copy Generation
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Tell the AI what this ad is about. It will generate high-converting copy optimized for Meta.
              </p>
              <Textarea 
                placeholder="e.g. We are offering a 14-day free trial of our AI WhatsApp CRM. Highlight the 24/7 autonomous replies."
                value={campaignData.adCopyPrompt}
                onChange={e => setCampaignData(prev => ({ ...prev, adCopyPrompt: e.target.value }))}
                className="h-24"
              />
            </div>

            {campaignData.generatedAdCopy && (
              <div className="p-4 bg-muted/30 rounded-xl border relative">
                <h4 className="font-semibold text-sm mb-2">AI Generated Ad Copy:</h4>
                <Textarea 
                  value={campaignData.generatedAdCopy} 
                  onChange={e => setCampaignData(prev => ({ ...prev, generatedAdCopy: e.target.value }))}
                  className="min-h-[120px] text-sm"
                />
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <Label className="text-base font-semibold">Daily Budget Configuration</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Set the starting daily budget. The AI Agent can automatically scale this later if the ROI rules are met.
              </p>
              <div className="relative max-w-xs">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  className="pl-9" 
                  placeholder="1000"
                  value={campaignData.dailyBudget}
                  onChange={e => setCampaignData(prev => ({ ...prev, dailyBudget: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Campaign Ready for Launch
              </h4>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                This campaign complies with your budget governance rules. Upon launch, it will be handed over to the Autonomous AI Agent for continuous optimization.
              </p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center justify-center text-center h-[300px] animate-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Campaign Launched!</h2>
            <p className="text-muted-foreground max-w-md">
              "{campaignData.name}" has been published to Meta. The Autonomous AI Agent is now monitoring performance and will begin optimizing once data flows in.
            </p>
          </div>
        )}
      </CardContent>

      {step < 5 && (
        <CardFooter className="bg-muted/20 border-t p-6 flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1 || loading}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNext} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                (step === 2 && !campaignData.generatedAudiences.length) || (step === 3 && !campaignData.generatedAdCopy) 
                  ? <><Sparkles className="w-4 h-4" /> Generate with AI</> 
                  : <>Continue <ArrowRight className="w-4 h-4" /></>
              }
            </Button>
          ) : (
            <Button onClick={handleLaunch} disabled={loading || !campaignData.dailyBudget} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Target className="w-4 h-4" /> Publish Campaign</>}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
