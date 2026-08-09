"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  Loader2, 
  Megaphone, 
  Rocket, 
  Building2, 
  ExternalLink,
  AlertCircle,
  RefreshCw,
  LineChart,
  Trash2,
  Check,
  Star
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { RulesManager } from "@/components/meta-ads/rules-manager"
import { toast } from "sonner"

interface AdAccountItem {
  id: string
  ad_account_id: string
  account_name: string
  capi_pixel_id?: string
  status: string
  created_at: string
}

export default function MetaAdsSettingsPage() {
  const { account } = useAuth()
  const workspaceId = account?.id

  const [pixelId, setPixelId] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [accountName, setAccountName] = useState<string | null>(null)
  const [adAccounts, setAdAccounts] = useState<AdAccountItem[]>([])
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>("")
  
  // Exchange state
  const [isExchanging, setIsExchanging] = useState(false)
  const [exchangeError, setExchangeError] = useState<string | null>(null)
  const [exchangeSuccess, setExchangeSuccess] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [detachingId, setDetachingId] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/meta/settings")
      const data = await res.json()
      if (data.success) {
        if (data.pixelId) setPixelId(data.pixelId)
        setIsConnected(Boolean(data.isConnected))
        setAccountName(data.accountName || null)
        const accountsList = data.adAccounts || []
        setAdAccounts(accountsList)

        // Read stored active account or fallback to first
        const stored = typeof window !== "undefined" ? localStorage.getItem("meta_active_ad_account_id") : null
        if (stored && accountsList.some((a: any) => a.ad_account_id === stored)) {
          setSelectedAdAccountId(stored)
        } else if (accountsList.length > 0) {
          setSelectedAdAccountId(accountsList[0].ad_account_id)
        }
      }
    } catch (err) {
      console.error("Failed to fetch meta settings", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSwitchAccount = (adAcc: AdAccountItem) => {
    setSelectedAdAccountId(adAcc.ad_account_id)
    if (typeof window !== "undefined") {
      localStorage.setItem("meta_active_ad_account_id", adAcc.ad_account_id)
    }
    toast.success(`Active Account switched to: ${adAcc.account_name || adAcc.ad_account_id}`)
  }

  // Handle OAuth code exchange automatically when returning from Facebook
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    const error = params.get("error")

    if (error) {
      setExchangeError(`Meta OAuth returned error: ${decodeURIComponent(error)}`)
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    if (params.has("success")) {
      setExchangeSuccess(true)
      fetchSettings()
      // Retry once after 1.5 seconds to account for database replication
      setTimeout(() => fetchSettings(), 1500)
      setTimeout(() => setExchangeSuccess(false), 8000)
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (code) {
      setIsExchanging(true)
      setExchangeError(null)

      const redirectUri = `${window.location.origin}/api/meta/auth/callback`

      fetch("/api/meta/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirectUri }),
      })
        .then(async (res) => {
          const data = await res.json()
          if (!res.ok || data.error) {
            throw new Error(data.error || "Failed to exchange Meta authorization code")
          }
          setExchangeSuccess(true)
          setIsConnected(true)
          if (data.adAccounts && data.adAccounts.length > 0) {
            setAdAccounts(data.adAccounts)
            setAccountName(data.adAccounts[0].name || data.adAccounts[0].account_name || "Meta Ad Account")
          } else if (data.primaryAccount) {
            setAccountName(data.primaryAccount.name || "Meta Ad Account")
          }
          await fetchSettings()
          setTimeout(() => fetchSettings(), 1500)
          setTimeout(() => setExchangeSuccess(false), 8000)
        })
        .catch((err: any) => {
          console.error("OAuth code exchange failed:", err)
          setExchangeError(err.message || "Failed to connect Meta account.")
        })
        .finally(() => {
          setIsExchanging(false)
          // Clean the code param from address bar so refresh does not re-exchange
          window.history.replaceState({}, document.title, window.location.pathname)
        })
    }
  }, [fetchSettings])

  const handleDisconnectMetaAccount = async () => {
    if (!confirm("Are you sure you want to disconnect and detach ALL Meta Ad Accounts?")) {
      return
    }
    setDisconnecting(true)
    try {
      const res = await fetch("/api/meta/settings", { method: "DELETE" })
      if (res.ok) {
        setIsConnected(false)
        setAdAccounts([])
        setAccountName(null)
        setPixelId("")
      }
    } catch (e) {
      console.error("Failed to disconnect", e)
    } finally {
      setDisconnecting(false)
    }
  }

  const handleDetachSingleAccount = async (adAccountId: string) => {
    if (!confirm(`Are you sure you want to detach this Ad Account (${adAccountId})?`)) return
    setDetachingId(adAccountId)
    try {
      const res = await fetch(`/api/meta/settings?adAccountId=${encodeURIComponent(adAccountId)}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        setAdAccounts((prev) => prev.filter((a) => a.ad_account_id !== adAccountId))
      }
    } catch (err) {
      console.error("Failed to detach account", err)
    } finally {
      setDetachingId(null)
    }
  }

  const handleFacebookOAuthLogin = () => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || "843808418636023"
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/meta/auth/callback`)
    const scope = encodeURIComponent("ads_management,ads_read,business_management,pages_show_list,pages_read_engagement")
    
    // auth_type=rerequest forces Meta to prompt and allow switching permissions/accounts
    const fbAuthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&auth_type=rerequest`

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
      {/* Header */}
      <div className="flex items-center justify-between">
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

        <Link href="/meta-ads/create">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-sm">
            <Rocket className="w-4 h-4" /> Create Ad with AI
          </Button>
        </Link>
      </div>

      {/* OAuth Exchange Progress Notification */}
      {isExchanging && (
        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-200 flex items-center gap-3 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Finalizing Meta Business Connection...</p>
            <p className="text-xs text-muted-foreground">Exchanging authorization code and fetching your Ad Accounts from Graph API.</p>
          </div>
        </div>
      )}

      {/* Exchange Success Notification */}
      {exchangeSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Meta Account Successfully Connected!</p>
              <p className="text-xs text-muted-foreground">Your Ad Accounts are synced and ready to launch campaigns.</p>
            </div>
          </div>
          <Link href="/meta-ads">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold">
              <Megaphone className="w-3.5 h-3.5" /> View Campaigns
            </Button>
          </Link>
        </div>
      )}

      {/* Exchange Error Notification */}
      {exchangeError && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Connection Issue</p>
              <p className="text-xs">{exchangeError}</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setExchangeError(null)}>Dismiss</Button>
        </div>
      )}

      {/* Section 1: Facebook Business OAuth */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Meta Business Account Authorization</CardTitle>
            </div>
            {isConnected ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">
                ● Connected & Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Not Connected
              </Badge>
            )}
          </div>
          <CardDescription>
            Connect your Facebook account to grant AIWCRM access to your Ad Accounts and Click-to-WhatsApp Ads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(() => {
            const activeAccount = adAccounts.find(a => a.ad_account_id === selectedAdAccountId) || adAccounts[0]
            return (
              <div className="p-4 rounded-xl bg-muted/40 border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <p className="font-bold text-sm text-foreground">
                      {isConnected 
                        ? (activeAccount?.account_name ? `Active Workspace Account: ${activeAccount.account_name}` : (accountName || "Meta Business Ad Account"))
                        : "Facebook Business OAuth"}
                    </p>
                    {isConnected && activeAccount?.ad_account_id && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono text-emerald-700 bg-emerald-500/10 border-emerald-500/30">
                        {activeAccount.ad_account_id}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isConnected 
                      ? "60-Day Auto-Renewing Token Active • Graph API v20.0" 
                      : "Meta App ID: 843808418636023 (Verified Tech Provider)"}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleFacebookOAuthLogin} 
                    className={isConnected 
                      ? "bg-muted hover:bg-muted/80 text-foreground border gap-2 text-xs" 
                      : "bg-[#1877F2] hover:bg-[#166FE5] text-white gap-2 font-semibold shadow-sm"}
                    title="Connect a different Facebook account or refresh permissions with Meta"
                  >
                    {isConnected ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" /> Re-Authorize Facebook OAuth
                      </>
                    ) : (
                      <>Connect with Facebook</>
                    )}
                  </Button>
                </div>
              </div>
            )
          })()}

          {/* List of Connected Ad Accounts */}
          {adAccounts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Connected Ad Accounts ({adAccounts.length}) — Switch or Manage Internally
                </Label>
              </div>

              <div className="space-y-2">
                {adAccounts.map((adAcc) => {
                  const isCurrentActive = adAcc.ad_account_id === selectedAdAccountId
                  return (
                    <div 
                      key={adAcc.id} 
                      className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isCurrentActive ? "border-emerald-500/60 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500/30" : "bg-background"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{adAcc.account_name || "Ad Account"}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                            {adAcc.ad_account_id}
                          </Badge>
                          {isCurrentActive && (
                            <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0 gap-1 font-semibold shadow-xs">
                              <Check className="w-3 h-3" /> Active Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Status: <span className="text-emerald-600 font-medium capitalize">{adAcc.status}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {!isCurrentActive ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleSwitchAccount(adAcc)}
                            className="text-xs gap-1 font-semibold border-primary/30 text-primary hover:bg-primary/5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Switch to this Account
                          </Button>
                        ) : (
                          <Link href={`/meta-ads?adAccountId=${encodeURIComponent(adAcc.ad_account_id)}`}>
                            <Button size="sm" variant="outline" className="text-xs gap-1 font-semibold border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10">
                              <LineChart className="w-3.5 h-3.5" /> View Dashboard
                            </Button>
                          </Link>
                        )}
                        <Link href={`/meta-ads/create?adAccountId=${encodeURIComponent(adAcc.ad_account_id)}`}>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1 font-semibold">
                            <Rocket className="w-3.5 h-3.5" /> Run Ads
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDetachSingleAccount(adAcc.ad_account_id)}
                          disabled={detachingId === adAcc.ad_account_id}
                          className="text-destructive hover:bg-destructive/10 text-xs px-2.5 border border-destructive/20 gap-1 font-medium"
                          title="Detach only this ad account"
                        >
                          {detachingId === adAcc.ad_account_id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-3.5 h-3.5" /> Detach
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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

      {/* Danger Zone: Disconnect Meta Integration */}
      {isConnected && (
        <Card className="border border-destructive/30 bg-destructive/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Danger Zone: Disconnect All Accounts
            </CardTitle>
            <CardDescription className="text-xs">
              Revoke Meta Graph API authorization and detach all connected ad accounts from this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex justify-end">
            <Button
              onClick={handleDisconnectMetaAccount}
              disabled={disconnecting}
              variant="destructive"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-sm"
            >
              {disconnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Disconnect All Meta Accounts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
