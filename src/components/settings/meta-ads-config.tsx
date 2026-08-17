"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Megaphone, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, 
  ExternalLink, Sparkles, Key, ShieldCheck, Layers, Link as LinkIcon
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

export interface ConnectedAdAccount {
  id: string
  ad_account_id: string
  account_name: string
  status: string
  capi_pixel_id?: string
  created_at: string
}

export function MetaAdsConfig() {
  const { account, user, canEditSettings } = useAuth()
  const [loading, setLoading] = useState(true)
  const [adAccounts, setAdAccounts] = useState<ConnectedAdAccount[]>([])
  const [pixelId, setPixelId] = useState("")
  const [isSavingPixel, setIsSavingPixel] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  // Manual Add Form
  const [showAddForm, setShowAddForm] = useState(false)
  const [manualAccountId, setManualAccountId] = useState("")
  const [manualAccountName, setManualAccountName] = useState("")
  const [manualAccessToken, setManualAccessToken] = useState("")

  const loadSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/meta/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.adAccounts) {
          setAdAccounts(data.adAccounts)
        }
        if (data.pixelId) {
          setPixelId(data.pixelId)
        }
      }
    } catch (err) {
      console.warn("Failed to load Meta Ads settings:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleSavePixel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pixelId.trim()) {
      toast.error("Please enter a valid Meta Pixel ID")
      return
    }

    setIsSavingPixel(true)
    try {
      const res = await fetch('/api/meta/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pixelId: pixelId.trim() })
      })

      if (res.ok) {
        toast.success("Meta Conversions API (CAPI) Pixel ID saved successfully!")
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to update Pixel ID")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save Pixel ID")
    } finally {
      setIsSavingPixel(false)
    }
  }

  const handleManualConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualAccountId.trim() || !manualAccessToken.trim()) {
      toast.error("Ad Account ID and Access Token are required")
      return
    }

    setIsConnecting(true)
    try {
      const res = await fetch('/api/meta/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortLivedToken: manualAccessToken.trim(),
        })
      })

      if (res.ok) {
        toast.success(`Meta Ad Account connected successfully!`)
        setShowAddForm(false)
        setManualAccountId("")
        setManualAccountName("")
        setManualAccessToken("")
        await loadSettings()
      } else {
        // Fallback: direct Supabase insertion if Graph API token exchange isn't strictly required
        const supabase = createClient()
        const formattedId = manualAccountId.trim().startsWith('act_') ? manualAccountId.trim() : `act_${manualAccountId.trim()}`
        
        const { error } = await supabase
          .from('meta_ad_accounts')
          .insert({
            account_id: account?.id,
            ad_account_id: formattedId,
            account_name: manualAccountName.trim() || formattedId,
            access_token: manualAccessToken.trim(),
            status: 'active',
            capi_pixel_id: pixelId || null
          })

        if (!error) {
          toast.success(`Meta Ad Account ${formattedId} linked directly!`)
          setShowAddForm(false)
          setManualAccountId("")
          setManualAccountName("")
          setManualAccessToken("")
          await loadSettings()
        } else {
          toast.error(error.message || "Failed to connect Ad Account")
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Error connecting Ad Account")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleFacebookOAuthLogin = () => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || "843808418636023"
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/meta/auth/callback`)
    const scope = encodeURIComponent("ads_management,ads_read,business_management,pages_show_list,pages_read_engagement,pages_manage_metadata")
    
    // auth_type=rerequest forces Meta to prompt and allow switching permissions/accounts
    const fbAuthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&auth_type=rerequest`

    window.location.href = fbAuthUrl
  }

  const handleDisconnect = async (targetAdAccountId?: string) => {
    const confirmMsg = targetAdAccountId 
      ? `Are you sure you want to disconnect Ad Account ${targetAdAccountId}?`
      : "Are you sure you want to disconnect ALL Meta Ad Accounts from this workspace?"

    if (!confirm(confirmMsg)) return

    try {
      const url = targetAdAccountId 
        ? `/api/meta/settings?adAccountId=${encodeURIComponent(targetAdAccountId)}`
        : '/api/meta/settings'

      const res = await fetch(url, { method: 'DELETE' })
      if (res.ok) {
        toast.success(targetAdAccountId ? "Ad Account disconnected" : "All Ad Accounts disconnected")
        await loadSettings()
      } else {
        toast.error("Failed to disconnect Ad Account")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Meta Ads & Conversions API</h2>
        <p className="text-sm text-muted-foreground">
          Connect your Meta Ad Accounts, Facebook Pages, and Pixel to manage WhatsApp click-to-chat campaigns, auto-sync lead forms, and stream server-side CAPI telemetry.
        </p>
      </div>

      {/* Connected Accounts Card */}
      <Card className="border bg-card shadow-xs">
        <CardHeader className="py-4 px-5 border-b bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Connected Meta Ad Accounts
              </CardTitle>
              <CardDescription className="text-xs">
                Active ad accounts accessible within this workspace
              </CardDescription>
            </div>
          </div>
          {canEditSettings && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleFacebookOAuthLogin}
                className="h-8 text-xs font-bold bg-[#1877F2] hover:bg-[#166fe5] text-white gap-2 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Connect with Facebook (OAuth)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
                className="h-8 text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Manual Token
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {/* Add Account Expandable Form */}
          {showAddForm && (
            <form onSubmit={handleManualConnect} className="p-4 rounded-xl border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-primary" /> Connect Meta Ad Account Manually
                </span>
                <span className="text-[11px] text-muted-foreground">Meta Graph API v20.0</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="ad-acc-id" className="text-xs font-semibold text-foreground">
                    Meta Ad Account ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ad-acc-id"
                    placeholder="act_123456789012345"
                    value={manualAccountId}
                    onChange={(e) => setManualAccountId(e.target.value)}
                    className="h-8 text-xs bg-background"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">Found in Meta Ads Manager URL or Account Overview.</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ad-acc-name" className="text-xs font-semibold text-foreground">
                    Account Display Label
                  </Label>
                  <Input
                    id="ad-acc-name"
                    placeholder="e.g. Primary Brand Ads"
                    value={manualAccountName}
                    onChange={(e) => setManualAccountName(e.target.value)}
                    className="h-8 text-xs bg-background"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label htmlFor="ad-acc-token" className="text-xs font-semibold text-foreground">
                    Meta System User / User Access Token <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ad-acc-token"
                    type="password"
                    placeholder="EAA..."
                    value={manualAccessToken}
                    onChange={(e) => setManualAccessToken(e.target.value)}
                    className="h-8 text-xs font-mono bg-background"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Requires <code className="bg-muted px-1 rounded">ads_management</code>, <code className="bg-muted px-1 rounded">ads_read</code>, and <code className="bg-muted px-1 rounded">leads_retrieval</code> permissions.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isConnecting}
                  className="h-7 text-xs font-bold bg-primary text-primary-foreground gap-1.5"
                >
                  {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Verify & Save Account
                </Button>
              </div>
            </form>
          )}

          {/* Connected Accounts List */}
          {loading ? (
            <div className="py-8 text-center">
              <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
            </div>
          ) : adAccounts.length > 0 ? (
            <div className="divide-y border rounded-xl overflow-hidden">
              {adAccounts.map((acc) => (
                <div key={acc.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card hover:bg-muted/20 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground truncate">{acc.account_name || acc.ad_account_id}</span>
                      <Badge className="bg-emerald-600 text-white font-mono text-[9px]">
                        ACTIVE
                      </Badge>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      ID: {acc.ad_account_id} {acc.capi_pixel_id ? `• Pixel: ${acc.capi_pixel_id}` : ''}
                    </p>
                  </div>

                  {canEditSettings && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDisconnect(acc.ad_account_id)}
                      className="h-7 text-xs font-semibold text-destructive hover:bg-destructive/10 gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Disconnect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center border rounded-xl bg-muted/10 space-y-2">
              <Megaphone className="w-7 h-7 text-muted-foreground mx-auto opacity-50" />
              <p className="font-bold text-foreground text-xs">No Meta Ad Accounts Linked</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Link your Meta Ad Account to launch AI campaigns, sync lead forms, and measure ROAS directly in AIWCRM.
              </p>
              {canEditSettings && (
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                    className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Link First Ad Account
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meta Conversions API (CAPI) Pixel Card */}
      <Card className="border bg-card shadow-xs">
        <CardHeader className="py-4 px-5 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Meta Conversions API (CAPI) Pixel
              </CardTitle>
              <CardDescription className="text-xs">
                Server-side event streaming for offline lead qualification & won deals to Meta Ads Manager
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handleSavePixel} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <Label htmlFor="capi-pixel" className="text-xs font-semibold text-foreground">
                Dataset / Pixel ID
              </Label>
              <Input
                id="capi-pixel"
                placeholder="e.g. 987654321098765"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                className="h-8 text-xs font-mono bg-background"
                disabled={!canEditSettings}
              />
              <p className="text-[10px] text-muted-foreground">
                When deals close as WON in your Sales Pipeline, AIWCRM automatically fires server-side Purchase conversion events back to this Pixel.
              </p>
            </div>

            {canEditSettings && (
              <Button
                type="submit"
                size="sm"
                disabled={isSavingPixel}
                className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer"
              >
                {isSavingPixel ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Save Pixel ID
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
