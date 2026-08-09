"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, ShieldCheck, Save } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { RulesManager } from "@/components/meta-ads/rules-manager"

export default function MetaAdsSettingsPage() {
  const { account, user } = useAuth()
  const workspaceId = account?.id

  const [pixelId, setPixelId] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/meta/settings")
        const data = await res.json()
        if (data.success && data.pixelId) {
          setPixelId(data.pixelId)
        }
      } catch (err) {
        console.error("Failed to fetch meta settings", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleFacebookOAuthLogin = () => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || "843808418636023"
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/meta/auth/callback`)
    const scope = encodeURIComponent("ads_management,ads_read,business_management,pages_show_list,pages_read_engagement")

    const fbAuthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`

    window.location.href = fbAuthUrl
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/meta/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixelId })
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error("Failed to save meta settings", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/meta-ads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meta Ads Connection Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your Facebook OAuth authorization, Ad Accounts, and Meta Conversions API (CAPI).
          </p>
        </div>
      </div>

      {/* Account Connection */}
      <Card className="border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Meta Business Account Authorization
          </CardTitle>
          <CardDescription>
            Connect your Facebook account to grant AIWCRM access to your Ad Accounts and Lead Ads webhooks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/40 border flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">Facebook Business OAuth</p>
              <p className="text-xs text-muted-foreground">App ID: 843808418636023</p>
            </div>
            <Button onClick={handleFacebookOAuthLogin} className="bg-[#1877F2] hover:bg-[#166FE5] text-white gap-2">
              Connect with Facebook
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CAPI Settings */}
      <Card className="border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Meta Conversions API (CAPI) Pixel Setup</CardTitle>
          <CardDescription>
            Send offline CRM deal updates (Closed Won, Qualified Lead) back to Meta for Ad algorithm optimization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pixelId">Meta Pixel / Dataset ID</Label>
            <Input
              id="pixelId"
              placeholder="e.g. 987654321012345"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
            <Button onClick={handleSaveSettings} disabled={saving} className="ml-auto gap-2">
              <Save className="w-4 h-4" /> Save CAPI Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Rules Manager */}
      <RulesManager />
    </div>
  )
}
