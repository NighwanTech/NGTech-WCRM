'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function CreativeStudioWrapper() {
  const router = useRouter()

  useEffect(() => {
    async function redirectOrCreate() {
      try {
        // SDK-compliant: Use API route instead of direct Supabase access
        const res = await fetch('/api/meta/campaigns/workspace')
        const data = await res.json()

        if (data.success && data.campaigns && data.campaigns.length > 0) {
          router.replace(`/meta-ads/campaign/${data.campaigns[0].id}?tab=creative`)
        } else {
          router.replace('/meta-ads/create')
        }
      } catch (err) {
        console.error("Creative Studio redirection error", err)
        router.replace('/meta-ads')
      }
    }

    redirectOrCreate()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Opening Creative Studio in Campaign Workspace...</p>
    </div>
  )
}

