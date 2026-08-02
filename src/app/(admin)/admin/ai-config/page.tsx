'use client'

import React, { useEffect, useState } from 'react'
import {
  Cpu,
  Key,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Check,
  RefreshCw,
  Sliders,
  History,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react'

interface AIProviderConfig {
  id: string
  provider: 'groq' | 'openai' | 'claude' | 'gemini' | 'deepseek'
  apiKey: string
  isActive: boolean
  isFallback: boolean
  usageQuotaMonthly: number
  tokensUsedThisMonth: number
  lastUpdated: string
}

interface AIFeatureRouting {
  copilotModel: string
  chatbotModel: string
  crawlerModel: string
  fallbackChain: string[]
}

interface AIAuditLog {
  id: string
  timestamp: string
  action: string
  actor: string
  details: string
}

export default function AdminAIConfigPage() {
  const [configs, setConfigs] = useState<AIProviderConfig[]>([])
  const [routing, setRouting] = useState<AIFeatureRouting | null>(null)
  const [logs, setLogs] = useState<AIAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [savingProvider, setSavingProvider] = useState<string | null>(null)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/ai-config')
      const data = await res.json()
      if (data.success) {
        setConfigs(data.configs)
        setRouting(data.routing)
        setLogs(data.logs)
      }
    } catch (err) {
      console.error('Failed to fetch AI Config:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdateProvider = async (provider: string, updates: Partial<AIProviderConfig>) => {
    setSavingProvider(provider)
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_provider',
          provider,
          updates,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessToast(`Successfully updated ${provider.toUpperCase()} provider settings!`)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingProvider(null)
      setTimeout(() => setSuccessToast(null), 3000)
    }
  }

  const handleUpdateRouting = async (newRouting: Partial<AIFeatureRouting>) => {
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_routing',
          routing: newRouting,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessToast('Feature Model Routing updated successfully!')
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => setSuccessToast(null), 3000)
    }
  }

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-semibold text-muted-foreground">Loading AI Governance Settings…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-5 py-3 shadow-2xl font-semibold text-xs animate-bounce">
          <Check className="h-4 w-4" /> {successToast}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl border border-border/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Super Admin Governance
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Centralized AI Governance</h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Manage global AI keys, model assignments per feature, rate-limits, and multi-provider failover chains. Client-side access to API keys is strictly restricted.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-bold transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Sync Governance
        </button>
      </div>

      {/* Grid: Provider Key Vault */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <Key className="h-5 w-5 text-emerald-500" /> Global AI Provider Vault
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {configs.map((cfg) => {
            const isShowing = showKeys[cfg.provider] || false
            return (
              <div
                key={cfg.provider}
                className="flex flex-col justify-between p-5 rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-sm space-y-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-xs uppercase text-emerald-500">
                        {cfg.provider.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">{cfg.provider}</h3>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Updated {new Date(cfg.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cfg.isActive}
                        onChange={(e) => handleUpdateProvider(cfg.provider, { isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* API Key Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Secret API Key</label>
                    <div className="relative flex items-center">
                      <input
                        type={isShowing ? 'text' : 'password'}
                        value={cfg.apiKey}
                        onChange={(e) =>
                          setConfigs((prev) =>
                            prev.map((c) => (c.provider === cfg.provider ? { ...c, apiKey: e.target.value } : c))
                          )
                        }
                        placeholder={`Enter ${cfg.provider.toUpperCase()} API Key`}
                        className="w-full h-9 rounded-xl border border-border bg-background/80 px-3 pr-8 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(cfg.provider)}
                        className="absolute right-2 text-muted-foreground hover:text-foreground"
                      >
                        {isShowing ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Monthly Quota & Usage Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Tokens Used This Month</span>
                      <span className="font-mono text-foreground">
                        {cfg.tokensUsedThisMonth.toLocaleString()} / {cfg.usageQuotaMonthly.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (cfg.tokensUsedThisMonth / cfg.usageQuotaMonthly) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateProvider(cfg.provider, { apiKey: cfg.apiKey })}
                  disabled={savingProvider === cfg.provider}
                  className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {savingProvider === cfg.provider ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" /> Save Provider Settings
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Feature Model Routing Section */}
      {routing && (
        <div className="p-6 rounded-3xl border border-border bg-card/80 backdrop-blur-xl space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Sliders className="h-5 w-5 text-blue-500" /> Feature Model Assignments & Fallback Rules
              </h2>
              <p className="text-xs text-muted-foreground">
                Assign specific LLMs to platform capabilities and set automated fallback order.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Copilot Model */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">In-Dashboard Copilot Model</label>
              <select
                value={routing.copilotModel}
                onChange={(e) => handleUpdateRouting({ copilotModel: e.target.value })}
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:border-emerald-500 focus:outline-none"
              >
                <option value="groq/llama-3.1-8b-instant">Groq · Llama 3.1 8B (Fastest & Low Cost)</option>
                <option value="openai/gpt-4o-mini">OpenAI · GPT-4o Mini (High Quality)</option>
                <option value="gemini/gemini-1.5-flash">Google · Gemini 1.5 Flash (Large Context)</option>
              </select>
            </div>

            {/* Chatbot Model */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Marketing Chatbot Model</label>
              <select
                value={routing.chatbotModel}
                onChange={(e) => handleUpdateRouting({ chatbotModel: e.target.value })}
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:border-emerald-500 focus:outline-none"
              >
                <option value="gemini/gemini-1.5-flash">Google · Gemini 1.5 Flash</option>
                <option value="groq/llama-3.1-8b-instant">Groq · Llama 3.1 8B</option>
                <option value="openai/gpt-4o">OpenAI · GPT-4o</option>
              </select>
            </div>

            {/* Crawler Model */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Auto-Crawler Synthesizer</label>
              <select
                value={routing.crawlerModel}
                onChange={(e) => handleUpdateRouting({ crawlerModel: e.target.value })}
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:border-emerald-500 focus:outline-none"
              >
                <option value="openai/gpt-4o-mini">OpenAI · GPT-4o Mini</option>
                <option value="groq/llama-3.1-8b-instant">Groq · Llama 3.1 8B</option>
                <option value="gemini/gemini-1.5-flash">Google · Gemini 1.5 Flash</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="p-6 rounded-3xl border border-border bg-card/80 backdrop-blur-xl space-y-4 shadow-sm">
        <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <History className="h-5 w-5 text-purple-500" /> AI Governance Audit Log
        </h2>

        <div className="divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/40 bg-background/50">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-muted/40 transition-colors">
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">{log.details}</span>
                <p className="text-[10px] text-muted-foreground font-mono">
                  By {log.actor} · Action: {log.action}
                </p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
