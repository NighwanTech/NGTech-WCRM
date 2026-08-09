import { NextResponse } from 'next/server'
import { getActiveMetaAdAccounts } from '@/lib/meta/db-adapter'
import { getCampaignFullDetails } from '@/lib/meta/graph-api'
import { decryptToken } from '@/lib/meta/token-manager'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const campaignId = searchParams.get('campaignId')
      const adAccountId = searchParams.get('adAccountId')

      if (!campaignId) {
        return NextResponse.json({ error: 'campaignId is required' }, { status: 400 })
      }

      const accounts = await getActiveMetaAdAccounts(ctx.accountId, ctx.userId)
      const adAccount = adAccountId
        ? (accounts.find((a) => a.ad_account_id === adAccountId) || accounts?.[0] || null)
        : (accounts?.[0] || null)

      if (!adAccount?.access_token) {
        return NextResponse.json({ error: 'No active Meta account' }, { status: 400 })
      }

      const decryptedToken = decryptToken(adAccount.access_token)
      const details = await getCampaignFullDetails(campaignId, decryptedToken)

      return NextResponse.json({
        success: true,
        details: details || null,
      })
    } catch (error: any) {
      console.error('Fetch campaign details error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
