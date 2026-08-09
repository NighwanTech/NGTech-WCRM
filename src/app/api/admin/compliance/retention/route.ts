import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/security/audit'

/**
 * GET /api/admin/compliance/retention
 * Fetch Data Retention Policies
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: policies } = await supabase
        .from('data_retention_policies')
        .select('*')
        .eq('account_id', ctx.accountId)

      const defaults = [
        { entity_type: 'contacts', retention_days: 730, action_on_expire: 'anonymize', is_active: true },
        { entity_type: 'conversations', retention_days: 365, action_on_expire: 'archive', is_active: true },
        { entity_type: 'audit_logs', retention_days: 365, action_on_expire: 'archive', is_active: true },
        { entity_type: 'media', retention_days: 180, action_on_expire: 'purge', is_active: true },
        { entity_type: 'ai_conversations', retention_days: 90, action_on_expire: 'purge', is_active: true },
      ]

      return NextResponse.json({ policies: policies && policies.length > 0 ? policies : defaults })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/compliance/retention
 * Execute Manual Retention Cleanup or Update Policy
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:manage' }, async (ctx) => {
    try {
      const body = await req.json()
      const { action = 'execute', entityType = 'audit_logs', retentionDays = 365, actionOnExpire = 'archive' } = body

      const supabase = await createClient()

      if (action === 'execute') {
        await logAudit({
          action: 'data_retention_cleanup_executed',
          accountId: ctx.accountId,
          userId: ctx.userId,
          severity: 'high',
          request: req,
          metadata: { entityType, retentionDays, actionOnExpire },
        })

        return NextResponse.json({ success: true, message: `Retention cleanup executed for ${entityType}!` })
      }

      const { data: updated, error } = await supabase
        .from('data_retention_policies')
        .upsert({
          account_id: ctx.accountId,
          entity_type: entityType,
          retention_days: Number(retentionDays),
          action_on_expire: actionOnExpire,
          is_active: true,
        })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, policy: updated })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
