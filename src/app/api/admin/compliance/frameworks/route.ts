import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/compliance/frameworks
 * Fetch custom dynamic compliance frameworks (GDPR, SOC2, ISO27001, HIPAA, PCI, DPDP India)
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: frameworks } = await supabase
        .from('compliance_custom_frameworks')
        .select('*')
        .eq('account_id', ctx.accountId)

      const defaults = [
        { id: 'f1', framework_key: 'gdpr', name: 'GDPR (EU Data Protection)', region: 'Europe / EU', controls_count: 48, maturity_score: 5, status: 'active' },
        { id: 'f2', framework_key: 'soc2', name: 'SOC 2 Type II (AICPA Trust)', region: 'Global / US', controls_count: 40, maturity_score: 4, status: 'active' },
        { id: 'f3', framework_key: 'iso27001', name: 'ISO 27001:2022 (ISMS)', region: 'Global', controls_count: 93, maturity_score: 5, status: 'active' },
        { id: 'f4', framework_key: 'hipaa', name: 'HIPAA (Healthcare Security)', region: 'North America / US', controls_count: 30, maturity_score: 4, status: 'active' },
        { id: 'f5', framework_key: 'pci_dss', name: 'PCI-DSS v4.0 (Card Data)', region: 'Global', controls_count: 12, maturity_score: 5, status: 'active' },
        { id: 'f6', framework_key: 'dpdp_india', name: 'DPDP India 2023 (Digital Data)', region: 'India / APAC', controls_count: 24, maturity_score: 4, status: 'active' },
      ]

      return NextResponse.json({ frameworks: frameworks && frameworks.length > 0 ? frameworks : defaults })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/compliance/frameworks
 * Add or Toggle Custom Compliance Framework
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:manage' }, async (ctx) => {
    try {
      const body = await req.json()
      const { action = 'toggle', id, frameworkKey, name, region = 'Global', controlsCount = 25 } = body

      const supabase = await createClient()

      if (action === 'toggle' && id) {
        const { data: existing } = await supabase.from('compliance_custom_frameworks').select('status').eq('id', id).single()
        const newStatus = existing?.status === 'active' ? 'disabled' : 'active'

        await supabase.from('compliance_custom_frameworks').update({ status: newStatus }).eq('id', id).eq('account_id', ctx.accountId)
        return NextResponse.json({ success: true, status: newStatus })
      }

      if (!frameworkKey || !name) {
        return NextResponse.json({ error: 'frameworkKey and name are required' }, { status: 400 })
      }

      const { data: created, error } = await supabase
        .from('compliance_custom_frameworks')
        .insert({
          account_id: ctx.accountId,
          framework_key: frameworkKey,
          name,
          region,
          controls_count: Number(controlsCount),
          maturity_score: 4,
          status: 'active',
        })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, framework: created })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
