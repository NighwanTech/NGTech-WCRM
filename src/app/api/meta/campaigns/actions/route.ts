import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { updateCampaignStatus, updateCampaignBudget } from '@/lib/meta/graph-api'
import { decryptToken } from '@/lib/meta/token-manager'
import { getActiveMetaAdAccounts } from '@/lib/meta/db-adapter'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { campaignId, action, payload, adAccountId } = body

      if (!campaignId || !action) {
        return NextResponse.json({ error: 'campaignId and action are required' }, { status: 400 })
      }

      const db = getAdminClient()

      // Fetch active Meta Ad Account for token
      const accounts = await getActiveMetaAdAccounts(ctx.accountId, ctx.userId)
      const adAccount = adAccountId 
        ? (accounts.find(a => a.ad_account_id === adAccountId) || accounts?.[0] || null)
        : (accounts?.[0] || null)

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
        const budgetCents = payload?.dailyBudgetCents || (payload?.dailyBudget ? payload.dailyBudget * 100 : 50000)
        result = await updateCampaignBudget(campaignId, budgetCents, decryptedToken)
      } else if (action === 'update_name') {
        if (payload?.name) {
          const url = `https://graph.facebook.com/v20.0/${campaignId}`
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: payload.name, access_token: decryptedToken }),
          })
          result = await res.json()
        }
      } else {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
      }

      if (result?.error) {
        const errorMsg = result.error.error_user_msg || result.error.message || JSON.stringify(result.error)
        return NextResponse.json({ error: `Meta Error: ${errorMsg}` }, { status: 400 })
      }

      // Update cache in background
      try {
        await db
          .from('meta_campaign_cache')
          .update({
            status: action === 'pause' ? 'PAUSED' : action === 'resume' ? 'ACTIVE' : undefined,
            daily_budget: action === 'update_budget' ? (payload?.dailyBudget || payload?.dailyBudgetCents / 100) : undefined,
            name: action === 'update_name' ? payload?.name : undefined,
          })
          .eq('account_id', ctx.accountId)
          .eq('campaign_id', campaignId)
      } catch {}

      return NextResponse.json({ success: true, result })
    } catch (error: any) {
      console.error('Campaign action error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
