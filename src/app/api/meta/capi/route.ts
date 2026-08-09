import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { sendCAPIEvent } from '@/lib/meta/capi'
import { decryptToken } from '@/lib/meta/token-manager'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * POST - Dispatch Offline Conversion Event to Meta Conversions API
 */
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { pixelId, eventName, email, phone, firstName, lastName, value, currency } = body

      if (!eventName) {
        return NextResponse.json({ error: 'eventName is required' }, { status: 400 })
      }

      const db = supabaseAdmin()

      // Fetch active Meta access token for account
      const { data: adAccount } = await db
        .from('meta_ad_accounts')
        .select('access_token')
        .eq('account_id', ctx.accountId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      if (!adAccount?.access_token) {
        return NextResponse.json({ error: 'No active Meta access token found' }, { status: 400 })
      }

      const decryptedToken = decryptToken(adAccount.access_token)

      const result = await sendCAPIEvent({
        pixelId: pixelId || process.env.META_CAPI_PIXEL_ID || '',
        accessToken: decryptedToken,
        eventName: eventName || 'Lead',
        userData: {
          email,
          phone,
          firstName,
          lastName,
        },
        customData: {
          value: value ? Number(value) : undefined,
          currency: currency || 'INR',
        },
      })

      return NextResponse.json(result)
    } catch (error: any) {
      console.error('CAPI route error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
