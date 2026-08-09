import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = supabaseAdmin()
      const { data, error } = await db
        .from('meta_optimization_rules')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return NextResponse.json({ success: true, rules: data || [] })
    } catch (error: any) {
      console.error('Fetch rules error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      
      const db = supabaseAdmin()
      const { data, error } = await db
        .from('meta_optimization_rules')
        .insert({
          ...body,
          account_id: ctx.accountId,
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, rule: data })
    } catch (error: any) {
      console.error('Create rule error:', error)
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

      const db = supabaseAdmin()
      const { error } = await db
        .from('meta_optimization_rules')
        .delete()
        .eq('account_id', ctx.accountId)
        .eq('id', id)

      if (error) throw error

      return NextResponse.json({ success: true })
    } catch (error: any) {
      console.error('Delete rule error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
