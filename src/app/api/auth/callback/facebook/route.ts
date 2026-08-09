import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireActiveAccount } from '@/lib/security/account-guard'
import { exchangeCodeForAccessToken, encryptToken } from '@/lib/meta/token-manager'
import { getAdAccounts } from '@/lib/meta/graph-api'
import { saveMetaAdAccount } from '@/lib/meta/db-adapter'

function getBaseUrl(request: Request): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  if (host && !host.includes('localhost')) {
    return `${proto}://${host}`
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }
  return new URL(request.url).origin
}

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request)
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorReason = searchParams.get('error_reason')
  const errorDescription = searchParams.get('error_description')

  if (error || errorReason) {
    const errorMsg = errorDescription || errorReason || error || 'OAuth cancelled'
    return NextResponse.redirect(`${baseUrl}/meta-ads/settings?error=${encodeURIComponent(errorMsg)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/meta-ads/settings`)
  }

  try {
    const supabase = await createClient()
    const { data: userRes } = await supabase.auth.getUser()

    if (!userRes?.user) {
      return NextResponse.redirect(`${baseUrl}/meta-ads/settings?code=${encodeURIComponent(code)}`)
    }

    const userId = userRes.user.id
    const accountId = await requireActiveAccount(userId)

    const redirectUri = `${baseUrl}/api/auth/callback/facebook`
    const { accessToken, expiresIn } = await exchangeCodeForAccessToken(code, redirectUri)

    if (!accessToken) {
      throw new Error('Failed to obtain access token from Meta')
    }

    let adAccounts: any[] = []
    try {
      adAccounts = await getAdAccounts(accessToken)
    } catch (e: any) {
      console.warn('Could not fetch ad accounts directly from Graph API:', e.message)
    }

    const encryptedToken = encryptToken(accessToken)
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null

    if (adAccounts && adAccounts.length > 0) {
      for (const adAcc of adAccounts) {
        const formattedId = adAcc.id || adAcc.account_id || 'act_default'
        const name = adAcc.name || 'Meta Ad Account'

        await saveMetaAdAccount({
          accountId,
          userId,
          adAccountId: formattedId,
          accountName: name,
          encryptedAccessToken: encryptedToken,
          tokenExpiresAt: expiresAt,
        })
      }
    } else {
      await saveMetaAdAccount({
        accountId,
        userId,
        adAccountId: 'act_primary',
        accountName: 'Connected Meta Account',
        encryptedAccessToken: encryptedToken,
        tokenExpiresAt: expiresAt,
      })
    }

    return NextResponse.redirect(`${baseUrl}/meta-ads/settings?success=true`)
  } catch (err: any) {
    console.error('Facebook OAuth fallback callback error:', err)
    return NextResponse.redirect(`${baseUrl}/meta-ads/settings?error=${encodeURIComponent(err.message || 'Authentication failed')}`)
  }
}
