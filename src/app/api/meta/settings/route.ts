import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = supabaseAdmin()
      const { data } = await db
        .from('meta_ad_accounts')
        .select('capi_pixel_id')
        .eq('account_id', ctx.accountId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      return NextResponse.json({ success: true, pixelId: data?.capi_pixel_id || '' })
    } catch (error: any) {
      console.error('Fetch meta settings error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { pixelId } = body

      const db = supabaseAdmin()
      const { data: adAccount } = await db
        .from('meta_ad_accounts')
        .select('id')
        .eq('account_id', ctx.accountId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()

      if (!adAccount) {
        return NextResponse.json({ error: 'No active Meta Ad Account found to attach Pixel ID to.' }, { status: 400 })
      }

      const { error } = await db
        .from('meta_ad_accounts')
        .update({ capi_pixel_id: pixelId })
        .eq('id', adAccount.id)

      if (error) throw error

      return NextResponse.json({ success: true })
    } catch (error: any) {
      console.error('Update meta settings error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
