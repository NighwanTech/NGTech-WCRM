"use client"

import { useState, useRef } from "react"
import { Sparkles, X, Send, Loader2, Bot, ShieldCheck, Cpu } from "lucide-react"

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export function GlobalCopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; reasoningSteps?: string[] }>>([
    { role: 'assistant', content: 'Hello! I am your AI Copilot. How can I help optimize your Meta campaigns today?' }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  // Draggable button position state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; hasMoved: boolean }>({
    startX: 0, startY: 0, initialX: 0, initialY: 0, hasMoved: false
  })

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only primary pointer
    if (e.button !== 0) return
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position ? position.x : rect.left,
      initialY: position ? position.y : rect.top,
      hasMoved: false
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.startX
      const deltaY = moveEvent.clientY - dragStartRef.current.startY
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragStartRef.current.hasMoved = true
        setIsDragging(true)
      }
      if (dragStartRef.current.hasMoved) {
        const newX = Math.max(12, Math.min(window.innerWidth - target.offsetWidth - 12, dragStartRef.current.initialX + deltaX))
        const newY = Math.max(12, Math.min(window.innerHeight - target.offsetHeight - 12, dragStartRef.current.initialY + deltaY))
        setPosition({ x: newX, y: newY })
      }
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      setTimeout(() => setIsDragging(false), 50)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

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
      {/* Draggable Flexible Copilot Launcher Button - Mobile Only */}
      <div
        style={
          position
            ? { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 50 }
            : { position: 'fixed', bottom: '24px', right: '16px', zIndex: 50 }
        }
        className="touch-none select-none md:hidden"
      >
        <button
          onPointerDown={handlePointerDown}
          onClick={() => {
            if (!dragStartRef.current.hasMoved && !isDragging) {
              setIsOpen(true)
            }
          }}
          className={cn(
            "p-3 sm:px-4 sm:py-3 rounded-full bg-primary text-primary-foreground shadow-2xl transition-all flex items-center gap-2 border-2 border-primary/20 group active:scale-95",
            isDragging ? "cursor-grabbing scale-105 shadow-primary/50" : "cursor-grab hover:scale-105"
          )}
          title="Drag anywhere or tap to open Copilot"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse shrink-0" />
          <span className="text-xs font-bold hidden xs:inline pr-1">AI Copilot</span>
        </button>
      </div>

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
