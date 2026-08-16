"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Send, Loader2, Bot, ShieldCheck, Activity, Cpu, Play, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetaAdsHeader } from "@/components/meta-ads/meta-ads-header"
import { Badge } from "@/components/ui/badge"

export default function EnterpriseCopilotWorkspace() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; reasoningSteps?: string[]; toolResult?: any }>>([
    { role: 'assistant', content: 'Welcome to the Full Enterprise AI Copilot Workspace. I am ready to orchestrate campaign insights, run Monte Carlo simulations, or execute governance actions.' }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [telemetrySummary, setTelemetrySummary] = useState<any>(null)
  const [streamingReasoning, setStreamingReasoning] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // FIX 19: Load saved conversation history on mount
  useEffect(() => {
    fetch('/api/meta/v1/ai/copilot')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages)
        }
      })
      .catch(err => console.warn('Failed to load conversation history:', err))
  }, [])

  // Auto-scroll to bottom of conversation stream
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingReasoning, loading])

  // FIX 5: Real-time Streaming Handler
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim()
    if (!promptToSend || loading) return
    if (!customPrompt) setInput("")

    const newMessages = [...messages, { role: 'user' as const, content: promptToSend }]
    setMessages(newMessages)
    setLoading(true)
    setStreamingReasoning([])

    try {
      const res = await fetch("/api/meta/v1/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, stream: true })
      })

      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let assistantContent = ""
        let reasoningStepsCollected: string[] = []
        let toolExecutionResultCollected: any = null

        // Add initial placeholder for streaming assistant response
        setMessages(prev => [...prev, { role: 'assistant', content: '', reasoningSteps: [] }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunkText = decoder.decode(value)
          const lines = chunkText.split('\n\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6))

                if (parsed.type === 'reasoning' && parsed.reasoningStep) {
                  reasoningStepsCollected = [...reasoningStepsCollected, parsed.reasoningStep]
                  setStreamingReasoning([...reasoningStepsCollected])
                }

                if (parsed.type === 'token' && parsed.content) {
                  assistantContent += parsed.content
                }

                if (parsed.toolResult) {
                  toolExecutionResultCollected = parsed.toolResult
                  setTelemetrySummary(parsed.toolResult)
                }

                if (parsed.type === 'done' && parsed.fullResponse) {
                  if (!assistantContent) assistantContent = parsed.fullResponse.content
                  if (parsed.fullResponse.reasoningSteps) reasoningStepsCollected = parsed.fullResponse.reasoningSteps
                }

                // Update the last assistant message in real-time
                setMessages(prev => {
                  const updated = [...prev]
                  const lastIdx = updated.length - 1
                  if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
                    updated[lastIdx] = {
                      role: 'assistant',
                      content: assistantContent,
                      reasoningSteps: reasoningStepsCollected,
                      toolResult: toolExecutionResultCollected
                    }
                  }
                  return updated
                })
              } catch (e) {
                // Ignore chunk parse errors
              }
            }
          }
        }
      } else {
        // Fallback if non-streaming
        const data = await res.json()
        if (data.success && data.response) {
          setMessages([
            ...newMessages,
            {
              role: 'assistant',
              content: data.response.content,
              reasoningSteps: data.response.reasoningSteps,
              toolResult: data.response.toolExecutionResult
            }
          ])
          if (data.response.toolExecutionResult) {
            setTelemetrySummary(data.response.toolExecutionResult)
          }
        }
      }
    } catch (err) {
      console.error("Copilot workspace streaming error", err)
    } finally {
      setLoading(false)
      setStreamingReasoning([])
    }
  }

  return (
    <div className="w-full max-w-full space-y-6">
      <MetaAdsHeader
        title="AI Copilot"
        description="Multi-Agent Reasoning, Digital Twin Simulation & Governance Control Surface"
        icon={Sparkles}
        breadcrumbs={[{ label: "AI Copilot" }]}
        actions={
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold text-xs gap-1 py-1">
            <Sparkles className="w-3.5 h-3.5" /> Streaming SSE Active
          </Badge>
        }
      />

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Streaming Conversation & Rich Cards */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border bg-card shadow-sm min-h-[520px] flex flex-col justify-between">
            <CardHeader className="border-b bg-muted/20 py-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" /> Copilot Conversation Stream
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  History Persisted • {messages.length} messages
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[480px]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'bg-muted/30 border text-foreground'
                    }`}
                  >
                    {m.content || (loading && idx === messages.length - 1 ? "Thinking..." : "")}
                  </div>

                  {/* Rich Explanation & Simulation Cards */}
                  {m.toolResult && m.toolResult.result?.scenarios && (
                    <div className="mt-2 p-3 rounded-xl border bg-emerald-500/5 max-w-[85%] space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Digital Twin Simulation Scenarios</span>
                        <span className="text-[10px] font-mono text-muted-foreground">Monte Carlo 1,000 Runs</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        {m.toolResult.result.scenarios.map((sc: any, sIdx: number) => (
                          <div key={sIdx} className="p-2 rounded bg-card border text-center">
                            <div className="font-bold text-foreground">{sc.scenario}</div>
                            <div className="text-emerald-500 font-bold">{sc.roas}x ROAS</div>
                            <div className="text-[9px] text-muted-foreground">Risk: {sc.risk}/100</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reasoning Steps */}
                  {m.reasoningSteps && m.reasoningSteps.length > 0 && (
                    <div className="mt-1.5 p-2 rounded-lg bg-muted/10 border text-[10px] text-muted-foreground space-y-1 font-mono max-w-[85%]">
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
                <div className="flex flex-col gap-1 text-xs text-muted-foreground p-3 rounded-xl bg-muted/20 w-fit">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="font-bold text-foreground">Streaming Copilot Reasoning...</span>
                  </div>
                  {streamingReasoning.length > 0 && (
                    <div className="pl-6 space-y-0.5 font-mono text-[10px] text-muted-foreground">
                      {streamingReasoning.map((r, rIdx) => (
                        <div key={rIdx}>↳ {r}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Bar & Suggested Intent Shortcuts */}
            <div className="p-4 border-t bg-card space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendMessage("Ask AI: What are the highest performing channels and ads right now?")}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-full border bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-primary" /> Ask AI
                </button>
                <button
                  onClick={() => handleSendMessage("Run simulation for 15% budget scaling across active adsets")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-emerald-500" /> Run Simulation
                </button>
                <button
                  onClick={() => handleSendMessage("Find Problems: Audit fatigue, low CTR ads, and high CPL campaigns")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-500" /> Find Problems
                </button>
                <button
                  onClick={() => handleSendMessage("Show Revenue: Display WhatsApp lead conversion deals and CRM ROI")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <Activity className="w-3 h-3 text-blue-500" /> Show Revenue
                </button>
                <button
                  onClick={() => handleSendMessage("Approve Queue: Inspect and approve pending optimization recommendations")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-purple-500" /> Approve Queue
                </button>
                <button
                  onClick={() => handleSendMessage("Rollback: Inspect recent automated budget edits and rollback if needed")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-orange-500" /> Rollback
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Copilot strategy questions or execute campaign tools..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Context, Telemetry & Tool Execution Card */}
        <div className="space-y-4">
          <Card className="border bg-card shadow-sm">
            <CardHeader className="py-3 bg-muted/20 border-b">
              <CardTitle className="text-xs font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> System Context & Tool Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Active LLM Provider</span>
                <p className="font-bold text-foreground">Gemini 1.5 Pro (ILLMProvider Plugin)</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Boundary Engine</span>
                <p className="font-bold text-foreground">@aiwcrm/platform-sdk</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Safety & Governance</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">100% Deterministic Engine</p>
              </div>

              {telemetrySummary && (
                <div className="p-3 rounded-lg border bg-primary/5 space-y-1 font-mono text-[11px]">
                  <span className="text-[10px] font-bold text-primary">Last Tool Correlation ID</span>
                  <p className="text-foreground font-bold">{telemetrySummary.correlationId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
