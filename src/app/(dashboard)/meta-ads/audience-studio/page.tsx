'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AudienceStudioWrapper() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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
          const targetId = campaigns[0].id
          router.replace(`/meta-ads/campaign/${targetId}?tab=audience`)
        } else {
          // Create draft campaign if none exists
          const createRes = await fetch('/api/meta/campaigns/workspace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Draft Audience Campaign' })
          })
          if (!createRes.ok) {
            router.replace('/meta-ads')
            return
          }
          const createData = await createRes.json()
          if (createData.success && createData.campaignId) {
            router.replace(`/meta-ads/campaign/${createData.campaignId}?tab=audience`)
          } else {
            router.replace('/meta-ads')
          }
        }
      } catch (err) {
        console.error('Wrapper redirect error:', err)
        router.replace('/meta-ads')
      }
    }

    redirectOrCreate()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Opening Audience Intelligence in Campaign Workspace...</p>
    </div>
  )
}
