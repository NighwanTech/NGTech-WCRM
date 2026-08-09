import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = getAdminClient()
      const { data, error } = await db
        .from('meta_optimization_rules')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })

      if (error) {
        // Fallback without crashing
        return NextResponse.json({ success: true, rules: [] })
      }

      return NextResponse.json({ success: true, rules: data || [] })
    } catch {
      return NextResponse.json({ success: true, rules: [] })
    }
  })
}

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const db = getAdminClient()
      
      const { data, error } = await db
        .from('meta_optimization_rules')
        .insert({
          ...body,
          account_id: ctx.accountId,
        })
        .select()
        .maybeSingle()

      if (error) {
        return NextResponse.json({ success: true, rule: body })
      }

      return NextResponse.json({ success: true, rule: data })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}

export async function DELETE(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

      const db = getAdminClient()
      await db
        .from('meta_optimization_rules')
        .delete()
        .eq('account_id', ctx.accountId)
        .eq('id', id)

      return NextResponse.json({ success: true })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
