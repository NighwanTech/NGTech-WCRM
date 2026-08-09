import { NextResponse } from 'next/server'
import { getActiveMetaAdAccounts, updateMetaPixelId, disconnectMetaAdAccounts } from '@/lib/meta/db-adapter'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const accounts = await getActiveMetaAdAccounts(ctx.accountId, ctx.userId)
      const primary = accounts?.[0] || null

      return NextResponse.json({ 
        success: true, 
        pixelId: primary?.capi_pixel_id || '',
        isConnected: Boolean(accounts && accounts.length > 0),
        accountName: primary?.account_name || primary?.ad_account_id || null,
        adAccounts: accounts || [],
      })
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

      const updated = await updateMetaPixelId(ctx.accountId, pixelId)

      if (!updated) {
        return NextResponse.json({ error: 'No active Meta Ad Account found to attach Pixel ID to.' }, { status: 400 })
      }

      return NextResponse.json({ success: true })
    } catch (error: any) {
      console.error('Update meta settings error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}

export async function DELETE(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      await disconnectMetaAdAccounts(ctx.accountId, ctx.userId)
      return NextResponse.json({ success: true, message: 'Meta Ad Account successfully disconnected' })
    } catch (error: any) {
      console.error('Disconnect meta error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}

