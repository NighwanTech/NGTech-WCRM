"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Loader2, Mic, Key, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

export function AiVoicePanel() {
  const { account } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    api_key: "",
    agent_id: "",
    from_number: "",
    has_api_key: false,
  })

  useEffect(() => {
    if (account?.id) {
      loadConfig()
    }
  }, [account?.id])

  async function loadConfig() {
    setLoading(true)
    const response = await fetch('/api/retell/config')
    const { config: data, error } = await response.json().catch(() => ({}))
    
    setLoading(false)
    if (!response.ok || error) {
      toast.error('Failed to load voice configuration')
      return
    }
    if (data) {
      setConfig({
        api_key: "",
        agent_id: data.agent_id || "",
        from_number: data.from_number || "",
        has_api_key: Boolean(data.has_api_key),
      })
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!account?.id) return

    setSaving(true)
    const response = await fetch('/api/retell/config', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: config.agent_id,
        from_number: config.from_number,
        ...(config.api_key ? { api_key: config.api_key } : {}),
      }),
    })
    const { error } = await response.json().catch(() => ({}))

    setSaving(false)
    if (!response.ok || error) {
      toast.error('Failed to save configuration')
      return
    }

    toast.success('AI Voice settings saved successfully')
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Mic className="h-5 w-5 text-indigo-500" />
          AI Voice Calling (Retell AI)
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure your Retell AI API keys to enable outbound AI phone calls directly from the CRM.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSave}>
          <CardHeader>
            <CardTitle className="text-base">Retell API Credentials</CardTitle>
            <CardDescription>
              You can find these in your Retell AI dashboard. Your API key will be used to bill your Retell account directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="api_key"
                  type="password"
                  placeholder={config.has_api_key ? "Saved — enter a new key to replace it" : "key_..."}
                  className="pl-9"
                  value={config.api_key}
                  onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                  required={!config.has_api_key}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agent_id">Default Agent ID</Label>
              <Input
                id="agent_id"
                placeholder="agent_..."
                value={config.agent_id}
                onChange={(e) => setConfig({ ...config, agent_id: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                The ID of the AI Agent you created in Retell that will answer the phone.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from_number">From Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="from_number"
                  placeholder="+1234567890"
                  className="pl-9"
                  value={config.from_number}
                  onChange={(e) => setConfig({ ...config, from_number: e.target.value })}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                The Twilio/Retell phone number you purchased, in E.164 format (e.g. +1234567890).
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border px-6 py-4">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
