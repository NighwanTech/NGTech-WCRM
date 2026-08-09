import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

/**
 * GET - Fetch lead form mappings for the account
 */
export async function GET(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async (ctx) => {
    try {
      const db = supabaseAdmin()
      const { data, error } = await db
        .from('meta_lead_form_mappings')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return NextResponse.json({ success: true, mappings: data || [] })
    } catch (error: any) {
      console.error('Fetch lead forms error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
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

      if (!formId || !fieldMapping) {
        return NextResponse.json({ error: 'formId and fieldMapping are required' }, { status: 400 })
      }

      const db = supabaseAdmin()
      const { data, error } = await db
        .from('meta_lead_form_mappings')
        .upsert(
          {
            account_id: ctx.accountId,
            form_id: formId,
            form_name: formName || `Form ${formId}`,
            field_mapping: fieldMapping,
            target_pipeline_id: targetPipelineId || null,
            target_stage_id: targetStageId || null,
            status: status || 'ACTIVE',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'account_id,form_id' }
        )
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, mapping: data })
    } catch (error: any) {
      console.error('Upsert lead form error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
