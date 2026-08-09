import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * GET - Fetch lead form mappings for the account
 */
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = getAdminClient()
      const { data, error } = await db
        .from('meta_lead_form_mappings')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json({ success: true, mappings: [] })
      }

      return NextResponse.json({ success: true, mappings: data || [] })
    } catch {
      return NextResponse.json({ success: true, mappings: [] })
    }
  })
}

/**
 * POST - Upsert a lead form mapping
 */
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { formId, formName, fieldMapping, targetPipelineId, targetStageId, status } = body

      if (!formId) {
        return NextResponse.json({ error: 'formId is required' }, { status: 400 })
      }

      const db = getAdminClient()
      const payload: any = {
        account_id: ctx.accountId,
        form_id: formId,
        form_name: formName || `Form ${formId}`,
        target_pipeline_id: targetPipelineId || null,
        target_stage_id: targetStageId || null,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await db
        .from('meta_lead_form_mappings')
        .upsert(payload)
        .select()
        .maybeSingle()

      if (error) {
        // Try simple insert
        const { data: insData } = await db
          .from('meta_lead_form_mappings')
          .insert(payload)
          .select()
          .maybeSingle()

        return NextResponse.json({ success: true, mapping: insData || payload })
      }

      return NextResponse.json({ success: true, mapping: data || payload })
    } catch (error: any) {
      console.error('Upsert lead form error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
