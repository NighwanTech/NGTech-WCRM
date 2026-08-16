"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ExperimentsPage() {
  const router = useRouter()

  useEffect(() => {
    // Experiments are consolidated into Digital Twin Simulation during Strategy Review
    router.replace("/meta-ads/review")
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Opening Digital Twin Experiments in Strategy Review...</p>
    </div>
  )
}
