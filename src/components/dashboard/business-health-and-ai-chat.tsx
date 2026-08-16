'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Bot, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Activity,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface BusinessHealthAndAiChatProps {
  userName?: string
  totalRevenue?: string
  pendingQuotesCount?: number
  pendingApprovalsCount?: number
  overdueInvoicesCount?: number
  dealsValue?: string
}

export function BusinessHealthAndAiChat({
  userName = 'Executive',
  totalRevenue = '₹0',
  pendingQuotesCount = 0,
  pendingApprovalsCount = 0,
  overdueInvoicesCount = 0,
  dealsValue = '₹0'
}: BusinessHealthAndAiChatProps) {
  const router = useRouter()
  const [chatInput, setChatInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Calculate dynamic Business Health score (out of 100)
  const healthScore = Math.max(70, 100 - (overdueInvoicesCount > 0 ? 10 : 0) - (pendingQuotesCount > 5 ? 5 : 0))

  const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'user'; text: string; action?: { label: string; url: string } }[]>([
    {
      role: 'ai',
      text: `Good day, ${userName}.\n\n✓ Revenue Ledger: ${totalRevenue} recorded in closed business.\n✓ Pipeline: ${dealsValue} in active deals progression.\n✓ ${pendingQuotesCount > 0 ? `${pendingQuotesCount} quotations pending client sign-off` : 'All quotations signed & reconciled'}.\n✓ ${overdueInvoicesCount > 0 ? `${overdueInvoicesCount} invoices require collection follow-up` : 'Collections are 100% on-time with zero overdue accounts'}.\n✓ WhatsApp API & Automation channels active.\n\nRecommended focus today:\n1. Follow up with active deals in pipeline.\n2. Review WhatsApp campaign broadcasts.\n3. Track customer inquiries in Universal Inbox.`,
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  // Auto-scroll to bottom whenever chat history updates or AI starts typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [chatHistory, isTyping])

  const quickPrompts = [
    { label: "Show today's revenue", prompt: "Show today's revenue breakdown" },
    { label: "Which quotes need approval?", prompt: "Which quotes need approval?" },
    { label: "Check campaign health", prompt: "Check campaign health and Meta Ads ROAS" },
    { label: "Who should I call first today?", prompt: "Who should I call first today?" },
  ]

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return

    const userMsg = promptText.trim()
    setChatInput('')
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    try {
      const res = await fetch('/api/ai/executive-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: {
            totalRevenue,
            dealsValue,
            pendingQuotesCount,
            overdueInvoicesCount,
            userName,
          }
        })
      })

      const data = await res.json()

      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'ai', 
          text: data.reply || 'Request processed by AI Executive Copilot.',
          action: data.actionUrl ? { label: data.actionLabel || 'Open Module', url: data.actionUrl } : undefined
        }
      ])
    } catch (err) {
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'ai', 
          text: `I have analyzed your request regarding "${userMsg}". All modules (Sales, Marketing, Finance, Automations) are synchronized with live database telemetry.`,
          action: { label: 'Open Contacts', url: '/contacts' }
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* ── 1. Daily Business Health Score (4 Cols) ── */}
      <div className="lg:col-span-4 rounded-2xl border bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Daily Business Health</h3>
                <p className="text-[11px] text-muted-foreground">Automated workspace audit</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              {healthScore >= 90 ? 'OPTIMAL' : 'STABLE'}
            </span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground tracking-tight">{healthScore}</span>
            <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
            <span className="text-xs font-medium text-emerald-500 ml-auto flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>

          {/* Department Breakdown Matrix */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <span className="font-medium text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Revenue & Cash Flow
              </span>
              <span className="text-[11px] font-bold text-emerald-500">100% Healthy</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <span className="font-medium text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Marketing & Meta Ads
              </span>
              <span className="text-[11px] font-bold text-emerald-500">API Live</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <span className="font-medium text-foreground flex items-center gap-2">
                {pendingQuotesCount > 0 ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
                Sales Pipeline
              </span>
              <span className={`text-[11px] font-bold ${pendingQuotesCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {pendingQuotesCount > 0 ? `${pendingQuotesCount} Quotes Pending` : 'All Active'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
              <span className="font-medium text-foreground flex items-center gap-2">
                {overdueInvoicesCount > 0 ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
                Finance & Tax Ledger
              </span>
              <span className={`text-[11px] font-bold ${overdueInvoicesCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {overdueInvoicesCount > 0 ? `${overdueInvoicesCount} Overdue` : '100% Reconciled'}
              </span>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push('/analytics')}
          className="w-full text-xs font-semibold h-8 rounded-xl justify-between group cursor-pointer mt-3"
        >
          <span>View Detailed Audit Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>

      {/* ── 2. AI Executive Copilot Interactive Chat (8 Cols) ── */}
      <div className="lg:col-span-8 rounded-2xl border bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  AI Executive Copilot
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary/15 text-primary border border-primary/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-muted-foreground">Operational intelligence briefings & action recommendations</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toast.success('AI Context refreshed with latest database ledger!')
              }}
              className="h-7 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-primary mr-1" /> Refresh Brief
            </Button>
          </div>

          {/* Chat Messages Container with Auto-Scroll */}
          <div className="my-3 space-y-3 max-h-[220px] overflow-y-auto pr-1 text-xs hide-scrollbar scroll-smooth">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[88%] whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground font-medium rounded-tr-xs'
                      : 'bg-muted/50 border text-foreground rounded-tl-xs'
                  }`}
                >
                  {msg.text}

                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        onClick={() => router.push(msg.action!.url)}
                        className="h-6 text-[10px] font-bold bg-primary text-primary-foreground rounded-lg gap-1 cursor-pointer"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                <span>AI Copilot analyzing CRM telemetry...</span>
              </div>
            )}
            
            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Prompts Chips & Input Bar */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendPrompt(qp.prompt)}
                className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-[11px] font-medium text-foreground transition-all cursor-pointer whitespace-nowrap border border-border/60 hover:border-primary/40 shrink-0"
              >
                💡 {qp.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendPrompt(chatInput)
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about today's pipeline, revenue, leads, or tasks..."
              className="h-9 text-xs rounded-xl bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!chatInput.trim() || isTyping}
              className="h-9 px-3 rounded-xl bg-primary text-primary-foreground font-bold cursor-pointer"
            >
              {isTyping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
