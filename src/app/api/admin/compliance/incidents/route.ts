import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/compliance/incidents
 * Fetch Privacy & Security Incidents Register
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: incidents } = await supabase
        .from('compliance_incidents')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('reported_at', { ascending: false })

      return NextResponse.json({ incidents: incidents || [] })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
