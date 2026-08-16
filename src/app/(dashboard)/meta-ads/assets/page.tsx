"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AssetLibraryPage() {
  const router = useRouter()

  useEffect(() => {
    // Assets library consolidated into Campaign Creative Studio
    router.replace("/meta-ads/create")
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Opening Asset Media Library in Campaign Studio...</p>
    </div>
  )
}
