"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LegacyDecisionsPage() {
  const router = useRouter()

  useEffect(() => {
    // Legacy decisions are consolidated into the single History module
    router.replace("/meta-ads/decision-ledger")
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Opening Decision Audit Chain in History...</p>
    </div>
  )
}
