import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { getActiveMetaAdAccounts } from '@/lib/meta/db-adapter'
import { getCampaigns } from '@/lib/meta/graph-api'
import { decryptToken } from '@/lib/meta/token-manager'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * GET - Fetch Meta Ad Campaigns for a given ad account
 */
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const requestedAdAccountId = searchParams.get('adAccountId')

      const accounts = await getActiveMetaAdAccounts(ctx.accountId, ctx.userId)
      if (!accounts || accounts.length === 0) {
        return NextResponse.json({
          connected: false,
          campaigns: [],
          adAccounts: [],
          message: 'No active Meta Ad Account connected to this account.',
        })
      }

      let adAccount = accounts[0]
      if (requestedAdAccountId) {
        const found = accounts.find(a => a.ad_account_id === requestedAdAccountId)
        if (!found) {
          return NextResponse.json({ error: 'Access Denied: Requested Ad Account does not belong to this tenant' }, { status: 403 })
        }
        adAccount = found
      }

      // 2. Fetch live campaigns from Meta Graph API if access token is present
      const decryptedToken = decryptToken(adAccount.access_token)
      let campaigns: any[] = []
      const db = getAdminClient()

      try {
        campaigns = await getCampaigns(adAccount.ad_account_id, decryptedToken)

        // Sync into meta_campaign_cache in background
        for (const c of campaigns) {
          try {
            await db.from('meta_campaign_cache').upsert(
              {
                account_id: ctx.accountId,
                campaign_id: c.id,
                name: c.name,
                status: c.status,
                objective: c.objective || 'LEAD_GENERATION',
                daily_budget: parseFloat(c.daily_budget || '0'),
                spend: parseFloat(c.spend || '0'),
                impressions: parseInt(c.impressions || '0', 10),
                clicks: parseInt(c.clicks || '0', 10),
                last_synced_at: new Date().toISOString(),
              },
              { onConflict: 'account_id,campaign_id' }
            )
          } catch {
            // ignore cache insert errors
          }
        }
      } catch (graphErr: any) {
        console.warn('Failed to fetch live Graph API campaigns, falling back to database aggregate:', graphErr.message)
        const { data: normCamps } = await db
          .from('marketing_campaigns')
          .select('*')
          .eq('account_id', ctx.accountId)
          .is('deleted_at', null)
          .order('created_at', { ascending: false })

        campaigns = (normCamps || []).map((c) => ({
          id: c.meta_campaign_id || c.id,
          name: c.name,
          status: c.status,
          objective: 'OUTCOME_LEADS',
          daily_budget: '500.00',
          spend: '0.00',
          impressions: '0',
          clicks: '0',
        }))
      }

      return NextResponse.json({
        connected: true,
        adAccounts: accounts.map(a => ({
          id: a.id,
          ad_account_id: a.ad_account_id,
          account_name: a.account_name,
          status: a.status,
        })),
        selectedAccount: {
          id: adAccount.id,
          ad_account_id: adAccount.ad_account_id,
          account_name: adAccount.account_name,
          status: adAccount.status,
        },
        campaigns,
      })
    } catch (error: any) {
      console.error('Fetch campaigns error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
