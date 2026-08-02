'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Bot,
  X,
  Send,
  ArrowRight,
  Compass,
  Zap,
  Command,
  HelpCircle,
  MessageSquare,
  Search,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'

interface CopilotStep {
  title: string
  description: string
  actionUrl?: string
  actionLabel?: string
}

export function CopilotGuidanceAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [responseText, setResponseText] = useState<string | null>(null)
  const [steps, setSteps] = useState<CopilotStep[]>([])
  const [primaryActionUrl, setPrimaryActionUrl] = useState<string | undefined>()
  const [primaryActionLabel, setPrimaryActionLabel] = useState<string | undefined>()

  const router = useRouter()

  // Keyboard shortcut listener: Cmd + K, Ctrl + K, or Esc to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAskCopilot = async (customQuery?: string) => {
    const q = (customQuery || query).trim()
    if (!q) return

    setLoading(true)
    setResponseText(null)
    setSteps([])

    try {
      const res = await fetch('/api/workspace/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (data.success) {
        setResponseText(data.responseText)
        setSteps(data.steps || [])
        setPrimaryActionUrl(data.primaryActionUrl)
        setPrimaryActionLabel(data.primaryActionLabel)
      }
    } catch (err) {
      console.error(err)
      setResponseText('Trouble reaching Copilot service. You can browse features directly.')
    } finally {
      setLoading(false)
    }
  }

  const navigateTo = (url?: string) => {
    if (!url) return
    setIsOpen(false)
    router.push(url)
  }

  // Draggable floating position state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = React.useRef<{ startX: number; startY: number; initialX: number; initialY: number; hasMoved: boolean }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  })

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const clientX = e.clientX
    const clientY = e.clientY

    const currentX = position ? position.x : (window.innerWidth - 170)
    const currentY = position ? position.y : (window.innerHeight - 70)

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentX,
      initialY: currentY,
      hasMoved: false,
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.startX
      const dy = moveEvent.clientY - dragStartRef.current.startY

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragStartRef.current.hasMoved = true
        setIsDragging(true)
      }

      if (dragStartRef.current.hasMoved) {
        const newX = Math.max(10, Math.min(window.innerWidth - 160, dragStartRef.current.initialX + dx))
        const newY = Math.max(10, Math.min(window.innerHeight - 50, dragStartRef.current.initialY + dy))
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

  return (
    <>
      {/* Draggable Compact Floating Trigger Pill */}
      <div
        style={
          position
            ? { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 50 }
            : { position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }
        }
        className="touch-none select-none"
      >
        <button
          onPointerDown={handlePointerDown}
          onClick={() => {
            if (!dragStartRef.current.hasMoved && !isDragging) {
              setIsOpen(true)
            }
          }}
          className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs px-3.5 py-2 shadow-2xl transition-transform border border-white/20 group active:scale-95 ${
            isDragging ? 'cursor-grabbing scale-105 shadow-emerald-500/50' : 'cursor-grab hover:scale-105'
          }`}
          title="Drag anywhere or click (Cmd+K)"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="h-3.5 w-3.5 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
          </div>
          <span className="tracking-tight text-[11px] font-bold">AI Saathi</span>
          <span className="hidden sm:inline-flex items-center gap-0.5 rounded-md bg-black/30 px-1.5 py-0.5 text-[9px] font-mono text-emerald-200">
            <Command className="h-2 w-2" /> K
          </span>
        </button>
      </div>

      {/* Modal & Cmd+K Palette Backdrop */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-2xl rounded-3xl border border-border/80 bg-card/95 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
            
            {/* Ambient Background Radial Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                    WCRM AI Saathi
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Smart Assistant
                    </span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Ask how to use any feature in Hindi or English (उदा. Broadcast, Pipelines)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 border-b border-border/40 bg-background/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAskCopilot()
                }}
                className="flex items-center gap-2 relative"
              >
                <Search className="absolute left-3.5 h-4 w-4 text-emerald-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. How do I create a WhatsApp Broadcast? or How to set up BYOK keys?"
                  className="w-full h-11 rounded-2xl border border-border/60 bg-background px-4 pl-10 pr-24 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-emerald-500 focus:outline-none shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-1.5 h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1"
                >
                  {loading ? 'Asking…' : <><Send className="h-3 w-3" /> Ask</>}
                </button>
              </form>
            </div>

            {/* Content Area */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 font-sans">
              {/* Quick Feature Shortcuts Pills */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" /> Quick Step Guides & Actions
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: '💳 Billing & Invoices', query: 'How to pay bill and view invoices?' },
                    { label: '📢 Create Broadcast', query: 'How do I create a WhatsApp Broadcast?' },
                    { label: '🔑 Setup BYOK Keys', query: 'How to set up BYOK API Keys?' },
                    { label: '🤖 Visual Flow Builder', query: 'How to build automated visual AI workflows?' },
                    { label: '📥 Shared Team Inbox', query: 'How to use Shared Team Inbox and assign reps?' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item.query)
                        handleAskCopilot(item.query)
                      }}
                      className="px-3 py-1.5 rounded-full border border-border/60 bg-card hover:bg-emerald-500/10 hover:border-emerald-500/40 text-xs font-semibold text-foreground transition-all duration-200"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Text & Walkthrough Steps */}
              {responseText && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground font-medium leading-relaxed">
                    {responseText}
                  </div>

                  {steps.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground">Step-by-Step Walkthrough:</span>
                      <div className="space-y-2">
                        {steps.map((st, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md flex items-start justify-between gap-3 hover:border-emerald-500/30 transition-all"
                          >
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                {st.title}
                              </h4>
                              <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                                {st.description}
                              </p>
                            </div>

                            {st.actionUrl && (
                              <button
                                onClick={() => navigateTo(st.actionUrl)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] shrink-0 transition-all flex items-center gap-1"
                              >
                                {st.actionLabel || 'Go'} <ChevronRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary Direct Shortcut Button */}
                  {primaryActionUrl && (
                    <div className="pt-2">
                      <button
                        onClick={() => navigateTo(primaryActionUrl)}
                        className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-xl flex items-center justify-center gap-2"
                      >
                        {primaryActionLabel || 'Take Me There'} <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-border/40 bg-background/50 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Press <kbd className="font-mono text-foreground font-bold">Esc</kbd> to close</span>
              <a
                href="https://wa.me/918092225777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:underline font-semibold flex items-center gap-1"
              >
                Human WhatsApp Support <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
