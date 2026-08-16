"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function OpsPage() {
  const router = useRouter()

  useEffect(() => {
    // Dev Ops telemetry consolidated into Sync Health Settings
    router.replace("/meta-ads/settings/sync-health")
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Opening Ops Telemetry in Sync Health Settings...</p>
    </div>
  )
}
