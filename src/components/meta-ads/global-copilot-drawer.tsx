"use client"

import { useState } from "react"
import { Sparkles, X, Send, Loader2, Bot, ShieldCheck, Activity, Cpu } from "lucide-react"

export function GlobalCopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; reasoningSteps?: string[] }>>([
    { role: 'assistant', content: 'Hello! I am your Enterprise Marketing Intelligence Copilot. How can I assist your campaign strategy today?' }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")

    const newMessages = [...messages, { role: 'user' as const, content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch("/api/meta/v1/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      if (data.success && data.response) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: data.response.content,
            reasoningSteps: data.response.reasoningSteps
          }
        ])
      }
    } catch (err) {
      console.error("Copilot request failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Copilot Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-2 border-primary/20"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold pr-1">AI Copilot</span>
      </button>

      {/* Global Collapsible Copilot Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l shadow-2xl flex flex-col transition-all duration-300">
          {/* Drawer Header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  AI Marketing Copilot <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </h3>
                <p className="text-[10px] text-muted-foreground">Powered by Enterprise Platform SDK & Gemini 1.5 Pro</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted/40 border text-foreground'
                  }`}
                >
                  {m.content}
                </div>

                {/* Reasoning Steps Display */}
                {m.reasoningSteps && m.reasoningSteps.length > 0 && (
                  <div className="mt-1.5 p-2 rounded-lg bg-muted/20 border text-[10px] text-muted-foreground space-y-1 font-mono max-w-[85%]">
                    {m.reasoningSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-primary shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-muted/20 w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Assembling Enterprise Context & Reasoning...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t bg-card flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Copilot, run simulations, or approve actions..."
              className="flex-1 px-3 py-2 text-xs rounded-lg border bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
