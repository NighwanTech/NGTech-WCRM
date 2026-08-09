import { NextResponse } from 'next/server'
import { exchangeCodeForAccessToken, exchangeForLongLivedToken, encryptToken } from '@/lib/meta/token-manager'
import { getAdAccounts } from '@/lib/meta/graph-api'
import { saveMetaAdAccount } from '@/lib/meta/db-adapter'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * POST - Exchange OAuth authorization code OR short-lived token from Facebook Login,
 * fetch all Meta Ad Accounts from Graph API, and persist to database.
 */
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { code, redirectUri, shortLivedToken } = body

      if (!code && !shortLivedToken) {
        return NextResponse.json({ error: 'OAuth code or shortLivedToken is required' }, { status: 400 })
      }

      let accessToken = ''
      let expiresIn: number | undefined

      if (code) {
        // Exchange authorization code for access token
        const effectiveRedirectUri = redirectUri || `${new URL(request.url).origin}/api/meta/auth/callback`
        const tokenRes = await exchangeCodeForAccessToken(code, effectiveRedirectUri)
        accessToken = tokenRes.accessToken
        expiresIn = tokenRes.expiresIn
      } else if (shortLivedToken) {
        // Exchange short-lived token for 60-day token
        const tokenRes = await exchangeForLongLivedToken(shortLivedToken)
        accessToken = tokenRes.accessToken
        expiresIn = tokenRes.expiresIn
      }

      if (!accessToken) {
        return NextResponse.json({ error: 'Failed to obtain access token from Meta' }, { status: 400 })
      }

      // Fetch user's Meta Ad Accounts from Graph API
      let adAccounts: any[] = []
      try {
        adAccounts = await getAdAccounts(accessToken)
      } catch (err: any) {
        console.warn('Could not fetch ad accounts directly:', err.message)
      }

      const encryptedToken = encryptToken(accessToken)
      const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null

      // Save each ad account found from Graph API
      if (adAccounts && adAccounts.length > 0) {
        for (const adAcc of adAccounts) {
          const formattedId = adAcc.id || adAcc.account_id || 'act_default'
          const name = adAcc.name || 'Meta Ad Account'

          await saveMetaAdAccount({
            accountId: ctx.accountId,
            userId: ctx.userId,
            adAccountId: formattedId,
            accountName: name,
            encryptedAccessToken: encryptedToken,
            tokenExpiresAt: expiresAt,
          })
        }
      } else {
        // Save generic connected Meta account record so status is active
        await saveMetaAdAccount({
          accountId: ctx.accountId,
          userId: ctx.userId,
          adAccountId: 'act_primary',
          accountName: 'Connected Meta Account',
          encryptedAccessToken: encryptedToken,
          tokenExpiresAt: expiresAt,
        })
      }

      return NextResponse.json({
        success: true,
        adAccounts: adAccounts || [],
        primaryAccount: adAccounts?.[0] || { name: 'Connected Meta Account', id: 'act_primary' },
      })
    } catch (error: any) {
      console.error('Meta OAuth exchange error:', error)
      return NextResponse.json({ error: error.message || 'OAuth exchange failed' }, { status: 500 })
    }
  })
}
