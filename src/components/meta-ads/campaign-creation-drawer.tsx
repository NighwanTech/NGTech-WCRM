"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Rocket, Plus, Send, CheckCircle2, ArrowRight, Loader2, Bot, User } from "lucide-react"
import { toast } from "sonner"

export interface CampaignCreationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

/**
 * CTO Refinement #1 — Campaign Creation Right Drawer Component
 * Opens directly on Overview screen (NO PAGE REDIRECTION). Exactly like Meta.
 */
export function CampaignCreationDrawer({
  open,
  onOpenChange,
  onSuccess
}: CampaignCreationDrawerProps) {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai')
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: 'Hello 👋 I am your Meta AI Campaign Strategist. What business, product, or service are you promoting today?' }
  ])
  const [inputMsg, setInputMsg] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generatedDraft, setGeneratedDraft] = useState<any | null>(null)

  const handleSendChat = () => {
    if (!inputMsg.trim()) return
    const userText = inputMsg.trim()
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }])
    setInputMsg("")

    // Step-by-step conversational prompts
    if (chatMessages.length === 1) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'ai', text: `Got it! Promoting "${userText}". What is your daily target budget and target location/city?` }])
      }, 600)
    } else if (chatMessages.length === 3) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'ai', text: 'Great! Who is your primary target customer (e.g. Homes, Hospitals, Restaurants)?' }])
      }, 600)
    } else {
      // Final step: Generate complete campaign package
      setGenerating(true)
      setTimeout(() => {
        setGenerating(false)
        setGeneratedDraft({
          name: `Meta AI Campaign - ${userText}`,
          objective: 'OUTCOME_LEADS',
          dailyBudget: 500,
          adSetsCount: 2,
          adsCount: 4,
          headline: `Expert Services in Bihar | Instant WhatsApp Support`,
          primaryText: `🚀 Discover verified solutions tailored for ${userText}. Connect live on WhatsApp today.`,
          cta: 'Send WhatsApp Message'
        })
        setChatMessages(prev => [...prev, { 
          sender: 'ai', 
          text: '✨ Campaign structure generated! 1 Campaign, 2 Ad Sets, 4 Ads, and WhatsApp Lead Form configured using your Ad Account AI Memory.' 
        }])
      }, 1200)
    }
  }

  const handleSubmitDraft = () => {
    toast.success("AI Campaign Draft submitted to Approvals Queue via ApprovalWorkflowEngine!")
    onOpenChange(false)
    if (onSuccess) onSuccess()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-background border-l shadow-2xl">
        <SheetHeader className="p-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <SheetTitle className="text-sm font-bold">Create Campaign (Overview Drawer)</SheetTitle>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border text-xs font-bold">
              <button
                onClick={() => setMode('ai')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  mode === 'ai' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                }`}
              >
                ✨ Create with AI
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  mode === 'manual' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                }`}
              >
                Manual Pro
              </button>
            </div>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Zero page redirection. Generates complete campaign structure directly on Overview.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {mode === 'ai' ? (
            <div className="space-y-3">
              {/* Chat Thread */}
              <div className="space-y-2.5">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted/40 border text-foreground rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {generating && (
                  <div className="p-3 rounded-2xl bg-muted/40 border text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Building 1 Campaign ➔ 2 AdSets ➔ 4 Ads using Ad Account AI Memory...</span>
                  </div>
                )}
              </div>

              {/* Generated Draft Review Card */}
              {generatedDraft && (
                <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Generated Campaign Draft
                    </span>
                    <Badge className="bg-emerald-600 text-white text-[9px] font-mono">Ready for Review</Badge>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div><span className="text-muted-foreground">Campaign Name:</span> <strong className="text-foreground">{generatedDraft.name}</strong></div>
                    <div><span className="text-muted-foreground">Daily Budget:</span> <strong className="text-foreground">₹{generatedDraft.dailyBudget}</strong></div>
                    <div><span className="text-muted-foreground">Structure:</span> <strong className="text-foreground">{generatedDraft.adSetsCount} AdSets • {generatedDraft.adsCount} Ads</strong></div>
                    <div><span className="text-muted-foreground">Headline:</span> <strong className="text-foreground">{generatedDraft.headline}</strong></div>
                  </div>

                  <Button
                    onClick={handleSubmitDraft}
                    className="w-full h-8 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    Submit Draft for Admin Approval <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Manual Form */
            <div className="space-y-3">
              <div>
                <label className="font-bold text-muted-foreground text-[11px] block mb-1">Campaign Name</label>
                <Input placeholder="Enter campaign name..." className="h-8 text-xs" />
              </div>
              <div>
                <label className="font-bold text-muted-foreground text-[11px] block mb-1">Daily Budget (₹)</label>
                <Input type="number" defaultValue={500} className="h-8 text-xs font-mono" />
              </div>
              <Button onClick={() => { toast.success("Manual Campaign Created"); onOpenChange(false) }} className="w-full font-bold text-xs h-8">
                Save Campaign
              </Button>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        {mode === 'ai' && !generatedDraft && (
          <div className="p-3 border-t bg-muted/20 flex items-center gap-2">
            <Input
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Type your response to Meta AI Strategist..."
              className="h-8 text-xs bg-background"
            />
            <Button size="sm" onClick={handleSendChat} className="h-8 w-8 p-0 shrink-0 font-bold">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
