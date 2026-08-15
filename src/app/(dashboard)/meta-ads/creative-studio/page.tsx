'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CreativeStudioWrapper() {
  const router = useRouter()

  useEffect(() => {
    async function redirectOrCreate() {
      try {
        const supabase = createClient()
        const { data: campaigns } = await supabase
          .from('marketing_campaigns')
          .select('id')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(1)

        if (campaigns && campaigns.length > 0) {
          router.replace(`/meta-ads/campaign/${campaigns[0].id}?tab=creative`)
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
