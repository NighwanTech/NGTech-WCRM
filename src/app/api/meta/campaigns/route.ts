import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { getCampaigns } from '@/lib/meta/graph-api'
import { decryptToken } from '@/lib/meta/token-manager'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * GET - Fetch Meta Ad Campaigns for a given account
 */
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = supabaseAdmin()

      // 1. Fetch connected Meta Ad account
      const { data: adAccount, error: accErr } = await db
        .from('meta_ad_accounts')
        .select('*')
        .eq('account_id', ctx.accountId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (accErr || !adAccount) {
        return NextResponse.json({
          connected: false,
          campaigns: [],
          message: 'No active Meta Ad Account connected to this account.',
        })
      }

      // 2. Fetch live campaigns from Meta Graph API
      const decryptedToken = decryptToken(adAccount.access_token)
      let campaigns = []

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
          } catch (e) {
            // ignore cache insert errors
          }
        }
      } catch (graphErr: any) {
        console.warn('Failed to fetch live Graph API campaigns, falling back to cache:', graphErr.message)
        const { data: cached } = await db
          .from('meta_campaign_cache')
          .select('*')
          .eq('account_id', ctx.accountId)

        campaigns = cached || []
      }

      return NextResponse.json({
        connected: true,
        adAccount: {
          id: adAccount.ad_account_id,
          name: adAccount.account_name,
        },
        campaigns,
      })
    } catch (error: any) {
      console.error('Error fetching Meta campaigns:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
