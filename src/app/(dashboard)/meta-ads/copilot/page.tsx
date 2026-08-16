"use client"

import { useState } from "react"
import { Sparkles, Send, Loader2, Bot, ShieldCheck, Activity, Cpu, Play, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EnterpriseCopilotWorkspace() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; reasoningSteps?: string[]; toolResult?: any }>>([
    { role: 'assistant', content: 'Welcome to the Full Enterprise AI Copilot Workspace. I am ready to orchestrate campaign insights, run Monte Carlo simulations, or execute governance actions.' }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [telemetrySummary, setTelemetrySummary] = useState<any>(null)

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim()
    if (!promptToSend || loading) return
    if (!customPrompt) setInput("")

    const newMessages = [...messages, { role: 'user' as const, content: promptToSend }]
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
            reasoningSteps: data.response.reasoningSteps,
            toolResult: data.response.toolExecutionResult
          }
        ])
        if (data.response.toolExecutionResult) {
          setTelemetrySummary(data.response.toolExecutionResult)
        }
      }
    } catch (err) {
      console.error("Copilot workspace error", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Enterprise AI Copilot Workspace
          </h1>
          <p className="text-xs text-muted-foreground">
            Multi-Agent Reasoning, Digital Twin Simulation & Governance Control Surface
          </p>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Streaming Conversation & Rich Cards */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border bg-card shadow-sm min-h-[500px] flex flex-col justify-between">
            <CardHeader className="border-b bg-muted/20 py-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> Copilot Conversation Stream
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[450px]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'bg-muted/30 border text-foreground'
                    }`}
                  >
                    {m.content}
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
                  {m.reasoningSteps && (
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-muted/20 w-fit">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>Assembling Context, Knowledge & Reasoning...</span>
                </div>
              )}
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
                  onClick={() => handleSendMessage("Generate Report: Summarize last 30 days ROAS, CAC, and conversions")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-cyan-500" /> Generate Report
                </button>
                <button
                  onClick={() => handleSendMessage("Approve Queue: Inspect and approve pending optimization recommendations")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-purple-500" /> Approve Queue
                </button>
                <button
                  onClick={() => handleSendMessage("Knowledge Search: Query playbooks, brand guidelines, and Meta policy rules")}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full border bg-muted/30 hover:bg-muted text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <Cpu className="w-3 h-3 text-rose-500" /> Knowledge Search
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
