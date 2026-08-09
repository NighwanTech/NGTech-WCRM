"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import {
  Loader2, Mic, Key, Phone, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Sparkles, Lock, Zap,
  DollarSign, FlaskConical, RefreshCw, Eye, EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VOICE_PROVIDER_LABELS, COMING_SOON_PROVIDERS, type VoiceProvider } from "@/lib/voice-ai/types"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProviderConfig {
  id?:              string;
  provider:         VoiceProvider;
  agent_id?:        string;
  phone_number_id?: string;
  voice_id?:        string;
  is_default:       boolean;
  is_active:        boolean;
  has_api_key:      boolean;
  monthly_budget?:  number;
  daily_call_limit?:number;
  per_user_limit?:  number;
}

interface ProviderFormState {
  api_key:         string;
  agent_id:        string;
  phone_number_id: string;
  voice_id:        string;
  showKey:         boolean;
  saving:          boolean;
  testing:         boolean;
  healthy?:        boolean;
  expanded:        boolean;
}

const DEFAULT_FORM: ProviderFormState = {
  api_key: "", agent_id: "", phone_number_id: "",
  voice_id: "", showKey: false, saving: false,
  testing: false, healthy: undefined, expanded: false,
};

const PROVIDER_DOCS: Record<VoiceProvider, { url: string; keyLabel: string; agentLabel: string }> = {
  retell:     { url: "https://retellai.com/dashboard", keyLabel: "Retell API Key",         agentLabel: "Agent ID" },
  elevenlabs: { url: "https://elevenlabs.io/app",      keyLabel: "ElevenLabs API Key",      agentLabel: "Agent ID (Conversational AI)" },
  bland:      { url: "https://app.bland.ai",           keyLabel: "Bland API Key",            agentLabel: "Pathway ID" },
  vapi:       { url: "https://vapi.ai",                keyLabel: "Vapi API Key",             agentLabel: "Assistant ID" },
};

const PROVIDER_ICONS: Record<VoiceProvider, string> = {
  retell:     "🎙️",
  elevenlabs: "✨",
  bland:      "⚡",
  vapi:       "🔊",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AiVoicePanel() {
  const [loading, setLoading]   = useState(true)
  const [configs, setConfigs]   = useState<ProviderConfig[]>([])
  const [forms, setForms]       = useState<Record<VoiceProvider, ProviderFormState>>({
    retell:     { ...DEFAULT_FORM },
    elevenlabs: { ...DEFAULT_FORM },
    bland:      { ...DEFAULT_FORM },
    vapi:       { ...DEFAULT_FORM },
  })

  // Global cost & limits (from the default provider config)
  const [limits, setLimits] = useState({
    monthly_budget:   "",
    daily_call_limit: "",
    per_user_limit:   "",
    savingLimits:     false,
  })

  const loadConfigs = useCallback(async () => {
    setLoading(true)
    const res  = await fetch("/api/voice-ai/config")
    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) { toast.error("Failed to load Voice AI configuration"); return }

    const loaded: ProviderConfig[] = data.configs ?? []
    setConfigs(loaded)

    // Pre-fill forms with existing data
    setForms((prev) => {
      const next = { ...prev }
      for (const c of loaded) {
        const p = c.provider as VoiceProvider
        next[p] = {
          ...next[p],
          agent_id:        c.agent_id        ?? "",
          phone_number_id: c.phone_number_id ?? "",
          voice_id:        c.voice_id        ?? "",
        }
      }
      return next
    })

    // Load limits from the default provider
    const defaultConfig = loaded.find((c) => c.is_default)
    if (defaultConfig) {
      setLimits({
        monthly_budget:   String(defaultConfig.monthly_budget   ?? ""),
        daily_call_limit: String(defaultConfig.daily_call_limit ?? ""),
        per_user_limit:   String(defaultConfig.per_user_limit   ?? ""),
        savingLimits:     false,
      })
    }
  }, [])

  useEffect(() => { loadConfigs() }, [loadConfigs])

  function updateForm(provider: VoiceProvider, patch: Partial<ProviderFormState>) {
    setForms((prev) => ({ ...prev, [provider]: { ...prev[provider], ...patch } }))
  }

  async function handleSave(provider: VoiceProvider) {
    updateForm(provider, { saving: true })
    const form = forms[provider]

    const res = await fetch("/api/voice-ai/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        ...(form.api_key         ? { api_key:         form.api_key         } : {}),
        agent_id:        form.agent_id        || undefined,
        phone_number_id: form.phone_number_id || undefined,
        voice_id:        form.voice_id        || undefined,
      }),
    })
    const data = await res.json().catch(() => ({}))
    updateForm(provider, { saving: false, healthy: data.healthy })

    if (!res.ok) { toast.error("Failed to save configuration"); return }
    toast.success(`${VOICE_PROVIDER_LABELS[provider]} configured successfully!`)
    loadConfigs()
  }

  async function handleSetDefault(provider: VoiceProvider) {
    const res = await fetch("/api/voice-ai/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, is_default: true }),
    })
    if (res.ok) { toast.success(`${VOICE_PROVIDER_LABELS[provider]} set as default provider`); loadConfigs() }
    else toast.error("Failed to update default provider")
  }

  async function handleTestConnection(provider: VoiceProvider) {
    updateForm(provider, { testing: true })
    const res  = await fetch(`/api/voice-ai/config?provider=${provider}`)
    const data = await res.json().catch(() => ({}))
    const healthy = data.configs?.[0]?.healthy ?? false
    updateForm(provider, { testing: false, healthy })
    toast[healthy ? "success" : "error"](
      healthy ? `${VOICE_PROVIDER_LABELS[provider]} connection verified!`
               : `${VOICE_PROVIDER_LABELS[provider]} connection failed. Check your API key.`
    )
  }

  const getConfig = (p: VoiceProvider) => configs.find((c) => c.provider === p)
  const isConfigured = (p: VoiceProvider) => Boolean(getConfig(p)?.has_api_key)

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Mic className="h-5 w-5 text-indigo-500" />
          Multi-Provider Voice AI Platform
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure AI voice calling providers. AIWCRM orchestrates all calls, CRM intelligence, and analytics — providers are interchangeable.
        </p>
      </div>

      <Tabs defaultValue="providers">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="providers"  className="flex items-center gap-1.5"><Mic className="h-4 w-4" /> Providers</TabsTrigger>
          <TabsTrigger value="limits"     className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Cost & Limits</TabsTrigger>
          <TabsTrigger value="playground" className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4" /> Playground</TabsTrigger>
        </TabsList>

        {/* ── Providers Tab ── */}
        <TabsContent value="providers" className="space-y-3 mt-4">
          {(["retell", "elevenlabs", "bland", "vapi"] as VoiceProvider[]).map((provider) => {
            const configured = isConfigured(provider)
            const config     = getConfig(provider)
            const form       = forms[provider]
            const isDefault  = config?.is_default ?? false
            const comingSoon = COMING_SOON_PROVIDERS.includes(provider)
            const docs       = PROVIDER_DOCS[provider]

            return (
              <Card key={provider} className={`transition-all ${comingSoon ? "opacity-60" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{PROVIDER_ICONS[provider]}</span>
                      <div>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          {VOICE_PROVIDER_LABELS[provider]}
                          {isDefault && (
                            <Badge variant="default" className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              Default ★
                            </Badge>
                          )}
                          {comingSoon && (
                            <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                              <Lock className="h-2.5 w-2.5" /> Coming Soon
                            </Badge>
                          )}
                        </CardTitle>
                        {!comingSoon && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {configured ? (
                              <><CheckCircle2 className="h-3 w-3 text-emerald-500" /><span className="text-[11px] text-emerald-500">Configured</span></>
                            ) : (
                              <><XCircle className="h-3 w-3 text-muted-foreground" /><span className="text-[11px] text-muted-foreground">Not configured</span></>
                            )}
                            {form.healthy === true  && <span className="text-[11px] text-emerald-400">· Connected ✓</span>}
                            {form.healthy === false && <span className="text-[11px] text-red-400">· Connection failed</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    {!comingSoon && (
                      <div className="flex items-center gap-2">
                        {configured && !isDefault && (
                          <Button variant="outline" size="sm" className="text-xs h-7"
                            onClick={() => handleSetDefault(provider)}>
                            Set Default
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"
                          onClick={() => updateForm(provider, { expanded: !form.expanded })}>
                          {form.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {!comingSoon && form.expanded && (
                  <CardContent className="space-y-4 pt-0">
                    <CardDescription className="text-xs">
                      Get your credentials from{" "}
                      <a href={docs.url} target="_blank" rel="noopener noreferrer"
                        className="text-emerald-500 underline">{docs.url}</a>
                    </CardDescription>

                    {/* API Key */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">{docs.keyLabel}</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={form.showKey ? "text" : "password"}
                          placeholder={configured ? "Saved — enter a new key to replace" : "Enter API key..."}
                          className="pl-9 pr-9 text-sm"
                          value={form.api_key}
                          onChange={(e) => updateForm(provider, { api_key: e.target.value })}
                        />
                        <button className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          type="button" onClick={() => updateForm(provider, { showKey: !form.showKey })}>
                          {form.showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Agent ID */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">{docs.agentLabel}</Label>
                      <Input
                        placeholder={provider === "retell" ? "agent_..." : "Conversational Agent ID"}
                        className="text-sm"
                        value={form.agent_id}
                        onChange={(e) => updateForm(provider, { agent_id: e.target.value })}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        {provider === "elevenlabs" ? "ElevenLabs Phone Number ID (Twilio)" : "From Phone Number"}
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={provider === "elevenlabs" ? "Phone number ID from ElevenLabs dashboard" : "+91..."}
                          className="pl-9 text-sm"
                          value={form.phone_number_id}
                          onChange={(e) => updateForm(provider, { phone_number_id: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => handleSave(provider)} disabled={form.saving}
                        className="flex-1 h-8 text-xs">
                        {form.saving ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Saving...</> : "Save Configuration"}
                      </Button>
                      {configured && (
                        <Button size="sm" variant="outline" onClick={() => handleTestConnection(provider)}
                          disabled={form.testing} className="h-8 text-xs gap-1.5">
                          {form.testing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                          Test
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </TabsContent>

        {/* ── Cost & Limits Tab ── */}
        <TabsContent value="limits" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-500" /> Cost Governance
              </CardTitle>
              <CardDescription className="text-xs">
                Set guardrails on Voice AI spending. Limits apply account-wide across all providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Monthly Budget (₹ INR)</Label>
                  <Input type="number" placeholder="e.g. 5000" className="text-sm"
                    value={limits.monthly_budget}
                    onChange={(e) => setLimits((p) => ({ ...p, monthly_budget: e.target.value }))} />
                  <p className="text-[10px] text-muted-foreground">Leave blank for unlimited</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Daily Call Limit (account)</Label>
                  <Input type="number" placeholder="e.g. 50" className="text-sm"
                    value={limits.daily_call_limit}
                    onChange={(e) => setLimits((p) => ({ ...p, daily_call_limit: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Per-User Daily Limit</Label>
                  <Input type="number" placeholder="e.g. 10" className="text-sm"
                    value={limits.per_user_limit}
                    onChange={(e) => setLimits((p) => ({ ...p, per_user_limit: e.target.value }))} />
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Provider Fallback Order</p>
                <p>If the default provider fails (health check fails), calls automatically fall back to the next configured provider.</p>
                <p className="text-emerald-500 font-mono text-[10px] mt-1">
                  Retell AI → ElevenLabs → (call blocked if none available)
                </p>
              </div>

              <Button size="sm" className="h-8 text-xs"
                disabled={limits.savingLimits}
                onClick={async () => {
                  setLimits((p) => ({ ...p, savingLimits: true }))
                  const defaultProv = configs.find((c) => c.is_default)?.provider
                  if (!defaultProv) { toast.error("Configure a default provider first"); setLimits((p) => ({ ...p, savingLimits: false })); return }
                  const res = await fetch("/api/voice-ai/config", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      provider: defaultProv,
                      monthly_budget:   limits.monthly_budget   ? Number(limits.monthly_budget)   : null,
                      daily_call_limit: limits.daily_call_limit ? Number(limits.daily_call_limit) : null,
                      per_user_limit:   limits.per_user_limit   ? Number(limits.per_user_limit)   : null,
                    }),
                  })
                  setLimits((p) => ({ ...p, savingLimits: false }))
                  if (res.ok) toast.success("Cost & limits saved!")
                  else toast.error("Failed to save limits")
                }}>
                {limits.savingLimits ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Saving...</> : "Save Limits"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Playground Tab ── */}
        <TabsContent value="playground" className="mt-4">
          <VoicePlayground configuredProviders={configs} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ─── Voice AI Playground ──────────────────────────────────────────────────────

function VoicePlayground({ configuredProviders }: { configuredProviders: ProviderConfig[] }) {
  const [provider, setProvider] = useState<VoiceProvider>("retell")
  const [durationSec, setDurationSec] = useState(120)
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const [loadingCost, setLoadingCost]     = useState(false)

  const RETELL_COST_PER_MIN  = 0.85
  const EL_COST_PER_MIN      = 0.42
  const latencyMap: Record<VoiceProvider, string> = {
    retell:     "~620ms",
    elevenlabs: "~310ms",
    bland:      "N/A",
    vapi:       "N/A",
  }

  async function estimateCost() {
    setLoadingCost(true)
    const res  = await fetch("/api/voice-ai/cost-estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, duration_seconds: durationSec }),
    })
    const data = await res.json().catch(() => ({}))
    setEstimatedCost(data.estimated_cost_inr ?? null)
    setLoadingCost(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-purple-500" /> Voice AI Playground
        </CardTitle>
        <CardDescription className="text-xs">
          Test voices, compare providers, and preview system prompts — without making real calls.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Provider & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Provider</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as VoiceProvider)}>
              <SelectTrigger className="text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["retell", "elevenlabs"] as VoiceProvider[]).map((p) => (
                  <SelectItem key={p} value={p} disabled={!configuredProviders.find((c) => c.provider === p)}>
                    {PROVIDER_ICONS[p]} {VOICE_PROVIDER_LABELS[p]}
                    {!configuredProviders.find((c) => c.provider === p) && " (not configured)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Test Duration (seconds)</Label>
            <Input type="number" value={durationSec} min={30} max={600}
              className="text-sm h-9"
              onChange={(e) => setDurationSec(Number(e.target.value))} />
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <div className="grid grid-cols-2 text-xs">
            <div className={`p-3 space-y-1 ${provider === "retell" ? "bg-emerald-500/10 border-r border-emerald-500/30" : "bg-card/50 border-r border-border/50"}`}>
              <p className="font-bold text-foreground flex items-center gap-1.5">
                🎙️ Retell AI {provider === "retell" && <span className="text-emerald-400 text-[10px]">← selected</span>}
              </p>
              <p className="text-muted-foreground">₹{RETELL_COST_PER_MIN}/min</p>
              <p className="text-muted-foreground">Latency: {latencyMap.retell}</p>
              <p className="text-muted-foreground">Hindi: Limited</p>
            </div>
            <div className={`p-3 space-y-1 ${provider === "elevenlabs" ? "bg-purple-500/10" : "bg-card/50"}`}>
              <p className="font-bold text-foreground flex items-center gap-1.5">
                ✨ ElevenLabs {provider === "elevenlabs" && <span className="text-purple-400 text-[10px]">← selected</span>}
              </p>
              <p className="text-muted-foreground">₹{EL_COST_PER_MIN}/min</p>
              <p className="text-muted-foreground">Latency: {latencyMap.elevenlabs}</p>
              <p className="text-emerald-400">Hindi: ✅ Native (Priya, Arjun)</p>
            </div>
          </div>
        </div>

        {/* Estimate button + result */}
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={estimateCost} disabled={loadingCost}>
            {loadingCost ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            Estimate Cost
          </Button>
          {estimatedCost !== null && (
            <span className="text-sm font-semibold text-emerald-400">
              ≈ ₹{estimatedCost.toFixed(2)} for {durationSec}s call
            </span>
          )}
        </div>

        {/* Prompt preview note */}
        <div className="rounded-lg bg-muted/40 border border-border/30 p-3 text-xs space-y-1">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> System Prompt Preview
          </p>
          <p className="text-muted-foreground">
            Voice AI automatically uses your configured Knowledge Base, AI Rules, Personality, and Business Hours from the AI Assistant settings — adapted for spoken conversation. No separate voice KB needed.
          </p>
          <p className="text-emerald-400 text-[10px] font-mono mt-1">
            KB + AI Rules + Personality + Business Hours → Voice-adapted → Injected into every call
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
