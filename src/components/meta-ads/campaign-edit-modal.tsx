"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetaCampaign } from "@/lib/meta/graph-api"
import { Sparkles, PlayCircle, PauseCircle, Loader2, Save, CheckCircle2, TrendingUp, Users, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface CampaignEditModalProps {
  campaign: MetaCampaign | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedCampaign: MetaCampaign) => void
}

export function CampaignEditModal({ campaign, open, onOpenChange, onUpdate }: CampaignEditModalProps) {
  if (!campaign) return null

  const [name, setName] = useState(campaign.name)
  const [dailyBudget, setDailyBudget] = useState(Number(campaign.daily_budget) || 500)
  const [status, setStatus] = useState(campaign.status || "PAUSED")
  const [saving, setSaving] = useState(false)

  // AI Audit State
  const [auditing, setAuditing] = useState(false)
  const [aiAudit, setAiAudit] = useState<any>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const isACTIVE = status === "ACTIVE"

  // 1. Save Settings to Meta Graph API
  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Update Name if changed
      if (name !== campaign.name) {
        await fetch("/api/meta/campaigns/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: campaign.id,
            action: "update_name",
            payload: { name },
          }),
        })
      }

      // Update Budget
      await fetch("/api/meta/campaigns/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          action: "update_budget",
          payload: { dailyBudget },
        }),
      })

      const updated = {
        ...campaign,
        name,
        daily_budget: dailyBudget.toString(),
        status,
      }
      onUpdate(updated)
      toast.success("Campaign updated successfully in Meta!")
    } catch {
      toast.error("Failed to update campaign")
    } finally {
      setSaving(false)
    }
  }

  // 2. Toggle Status (Pause / Resume)
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
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus(newStatus)
        onUpdate({ ...campaign, status: newStatus })
        toast.success(`Campaign ${newStatus.toLowerCase()} successfully!`)
      }
    } catch {
      toast.error("Failed to change campaign status")
    } finally {
      setSaving(false)
    }
  }

  // 3. Trigger AI Recommendations & Copy Audit
  const handleGenerateAIAudit = async () => {
    setAuditing(true)
    try {
      const res = await fetch("/api/meta/ai/campaign-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: campaign.name,
          objective: campaign.objective,
          dailyBudget: Number(campaign.daily_budget),
          spend: Number(campaign.spend),
          impressions: Number(campaign.impressions),
          clicks: Number(campaign.clicks),
        }),
      })
      const data = await res.json()
      if (data.success && data.audit) {
        setAiAudit(data.audit)
        toast.success("AI Strategic Audit generated!")
      }
    } catch {
      toast.error("Failed to generate AI Audit")
    } finally {
      setAuditing(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold truncate max-w-[420px]">
                {campaign.name}
              </DialogTitle>
              <DialogDescription className="text-xs font-mono">
                ID: {campaign.id} • Objective: {campaign.objective || "ENGAGEMENT"}
              </DialogDescription>
            </div>
            <Badge variant={isACTIVE ? "default" : "secondary"} className="shrink-0 font-semibold">
              ● {status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="settings" className="w-full mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="settings">Campaign Settings & Budget</TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="gap-1.5 font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" /> AI Recommendations
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: SETTINGS & BUDGET */}
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="campName">Campaign Name</Label>
              <Input
                id="campName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campBudget">Daily Budget (₹ INR)</Label>
                <Input
                  id="campBudget"
                  type="number"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign Status</Label>
                <div>
                  <Button
                    variant="outline"
                    onClick={handleToggleStatus}
                    disabled={saving}
                    className={`w-full gap-2 font-semibold ${
                      isACTIVE ? "text-amber-600 border-amber-500/30 hover:bg-amber-50" : "text-emerald-600 border-emerald-500/30 hover:bg-emerald-50"
                    }`}
                  >
                    {isACTIVE ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    {isACTIVE ? "Pause Campaign" : "Activate / Resume Campaign"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className="p-4 rounded-xl border bg-muted/30 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-bold">Ad Spend</p>
                <p className="text-lg font-bold text-foreground">₹{campaign.spend || "0"}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-bold">Impressions</p>
                <p className="text-lg font-bold text-foreground">{campaign.impressions || "0"}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-bold">Clicks</p>
                <p className="text-lg font-bold text-foreground">{campaign.clicks || "0"}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSaveSettings} disabled={saving} className="bg-primary text-primary-foreground gap-2 font-semibold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes to Meta
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: AI RECOMMENDATIONS & COPY */}
          <TabsContent value="ai-recommendations" className="space-y-4 pt-4">
            {!aiAudit ? (
              <div className="p-8 text-center space-y-4 border rounded-xl bg-primary/5">
                <Sparkles className="w-10 h-10 text-primary mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-foreground">Get AI Optimization & Copy Audit</h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    AI will analyze this campaign's target audience, budget efficiency, and generate high-converting ad copy variations.
                  </p>
                </div>
                <Button onClick={handleGenerateAIAudit} disabled={auditing} className="gap-2 font-bold shadow-md">
                  {auditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate AI Recommendations
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Health Grade & Strategic Findings */}
                <div className="p-4 rounded-xl border bg-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">Campaign Health Rating</span>
                    <Badge className="bg-emerald-600 text-white font-bold text-xs">
                      Grade: {aiAudit.healthGrade}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{aiAudit.statusAnalysis}</p>
                </div>

                {/* Key Strategic Recommendations */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Actionable Recommendations
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

                {/* Recommended Ad Headlines */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    High-Converting Ad Headlines (Click to Copy)
                  </Label>
                  <div className="space-y-2">
                    {aiAudit.suggestedHeadlines.map((hl: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => handleCopy(hl)}
                        className="p-3 rounded-lg border bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-between text-xs transition-all"
                      >
                        <span className="font-semibold text-foreground">{hl}</span>
                        {copiedText === hl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Target Interests */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    High-Intent Target Audience Interests
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {aiAudit.suggestedInterests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="px-2.5 py-1 text-xs bg-primary/10 text-primary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleGenerateAIAudit} disabled={auditing} className="gap-1.5 text-xs">
                    <Sparkles className="w-3 h-3" /> Refresh AI Recommendations
                  </Button>
                  <Button size="sm" onClick={() => onOpenChange(false)}>Close</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
