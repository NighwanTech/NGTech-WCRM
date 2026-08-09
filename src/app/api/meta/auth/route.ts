import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { exchangeForLongLivedToken, encryptToken } from '@/lib/meta/token-manager'
import { getAdAccounts } from '@/lib/meta/graph-api'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * POST - Exchange short-lived token from Facebook Login for a long-lived access token and save to account
 */
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { shortLivedToken } = body

      if (!shortLivedToken) {
        return NextResponse.json({ error: 'shortLivedToken is required' }, { status: 400 })
      }

      // 1. Exchange for 60-day token
      const { accessToken, expiresIn } = await exchangeForLongLivedToken(shortLivedToken)

      // 2. Fetch user's Meta Ad Accounts
      const adAccounts = await getAdAccounts(accessToken)

      if (!adAccounts || adAccounts.length === 0) {
        return NextResponse.json({ error: 'No Meta Ad Accounts found for this user account.' }, { status: 404 })
      }

      const primaryAdAccount = adAccounts[0]
      const encryptedToken = encryptToken(accessToken)
      const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null

      const db = supabaseAdmin()

      // 3. Save or update meta_ad_accounts in database
      const { data, error } = await db
        .from('meta_ad_accounts')
        .upsert(
          {
            account_id: ctx.accountId,
            ad_account_id: primaryAdAccount.id,
            account_name: primaryAdAccount.name,
            access_token: encryptedToken,
            token_expires_at: expiresAt,
            user_id: ctx.userId,
            status: 'active',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'account_id,ad_account_id' }
        )
        .select()
        .single()

      if (error) {
        console.error('Failed to save Meta Ad Account:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        adAccount: primaryAdAccount,
        allAdAccounts: adAccounts,
      })
    } catch (error: any) {
      console.error('Meta OAuth auth error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
