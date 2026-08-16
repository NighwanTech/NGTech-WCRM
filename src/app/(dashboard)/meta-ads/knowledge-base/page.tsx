"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function KnowledgeBasePage() {
  const router = useRouter()

  useEffect(() => {
    // Knowledge Base RAG is consolidated into AI Copilot Floating Drawer
    router.replace("/meta-ads/copilot")
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Opening Enterprise Knowledge Sources in AI Copilot...</p>
    </div>
  )
}
