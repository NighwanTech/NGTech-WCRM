"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface InspectorAIChatProps {
  selectedEntityName?: string
  entityType?: 'Campaign' | 'AdSet' | 'Ad'
}

/**
 * CTO Refinement #7 — Inspector Panel Contextual AI Chat
 * Renders inside Figma-Style Right Inspector sub-tab [ AI Chat ].
 * Inherits entity context automatically without manual prompts.
 */
export function InspectorAIChat({
  selectedEntityName = "WhatsApp Lead Campaign",
  entityType = "Campaign"
}: InspectorAIChatProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello 👋 I am analyzing ${entityType} "${selectedEntityName}". Ask me anything about CPA changes, CTR drops, copy improvements, or budget scaling.`
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInput("")
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      let reply = `Analyzed ${entityType} "${selectedEntityName}". Based on CAPI conversion data, ROAS remains strong at 4.2x with ₹28.50 CPA. Recommendation: Scale budget by 15% to capture additional buyers in Bihar.`
      
      if (userMsg.toLowerCase().includes("cpa")) {
        reply = `CPA for "${selectedEntityName}" is ₹28.50, which is 14% lower than your account benchmark (₹33.20).`
      } else if (userMsg.toLowerCase().includes("ctr")) {
        reply = `CTR is 3.42% for Ad Variation B. High engagement is driven by direct WhatsApp CTAs.`
      } else if (userMsg.toLowerCase().includes("copy") || userMsg.toLowerCase().includes("headline")) {
        reply = `✨ Generated Headline Variation: "Need Verified Expert Support in Bihar? Chat Direct on WhatsApp".`
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }])
    }, 800)
  }

  return (
    <div className="space-y-3 text-xs flex flex-col h-[400px]">
      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-1 pb-1 border-b">
        {[
          'Why CPA increased?',
          'Explain CTR',
          'Generate better copy',
          'Translate Hinglish'
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => { setInput(chip); }}
            className="px-2 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold transition-all cursor-pointer"
          >
            ✨ {chip}
          </button>
        ))}
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-1.5 max-w-[90%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
              m.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary border border-primary/20'
            }`}>
              {m.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
            </div>
            <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${
              m.sender === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-muted/30 border text-foreground rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="p-2 rounded-xl bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin text-primary" />
            <span>Analyzing {selectedEntityName}...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-1.5 pt-2 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask AI about ${selectedEntityName}...`}
          className="h-7 text-xs bg-background"
        />
        <Button size="sm" onClick={handleSend} className="h-7 w-7 p-0 shrink-0">
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
