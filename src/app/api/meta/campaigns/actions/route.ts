import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { updateCampaignStatus, updateCampaignBudget } from '@/lib/meta/graph-api'
import { decryptToken } from '@/lib/meta/token-manager'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { campaignId, action, payload } = body

      if (!campaignId || !action) {
        return NextResponse.json({ error: 'campaignId and action are required' }, { status: 400 })
      }

      const db = supabaseAdmin()

      // Fetch active Meta Ad Account for token
      const { data: adAccount } = await db
        .from('meta_ad_accounts')
        .select('*')
        .eq('account_id', ctx.accountId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      if (!adAccount?.access_token) {
        return NextResponse.json({ error: 'No active Meta Ad Account found' }, { status: 400 })
      }

      const decryptedToken = decryptToken(adAccount.access_token)
      let result = null

      if (action === 'pause') {
        result = await updateCampaignStatus(campaignId, 'PAUSED', decryptedToken)
      } else if (action === 'resume') {
        result = await updateCampaignStatus(campaignId, 'ACTIVE', decryptedToken)
      } else if (action === 'update_budget') {
        if (!payload?.dailyBudgetCents) {
          return NextResponse.json({ error: 'dailyBudgetCents required for update_budget' }, { status: 400 })
        }
        result = await updateCampaignBudget(campaignId, payload.dailyBudgetCents, decryptedToken)
      } else {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
      }

      // Update cache in background
      await db
        .from('meta_campaign_cache')
        .update({
          status: action === 'pause' ? 'PAUSED' : action === 'resume' ? 'ACTIVE' : undefined,
          daily_budget: action === 'update_budget' ? payload.dailyBudgetCents / 100 : undefined,
        })
        .eq('account_id', ctx.accountId)
        .eq('campaign_id', campaignId)

      return NextResponse.json({ success: true, result })
    } catch (error: any) {
      console.error('Campaign action error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
