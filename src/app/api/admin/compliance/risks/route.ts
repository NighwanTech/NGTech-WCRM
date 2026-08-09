import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'
import { calculateRiskRegisterMatrix } from '@/lib/security/compliance-risk-engine'

/**
 * GET /api/admin/compliance/risks
 * Fetch Enterprise Risk Register & Matrix
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const matrix = await calculateRiskRegisterMatrix(ctx.accountId)
      return NextResponse.json(matrix)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

/**
 * POST /api/admin/compliance/risks
 * Add or Update Risk Register Entry
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:manage' }, async (ctx) => {
    try {
      const body = await req.json()
      const { riskTitle, category = 'General', likelihood = 3, impact = 3, mitigationPlan, owner = 'Compliance Officer' } = body

      if (!riskTitle) {
        return NextResponse.json({ error: 'riskTitle is required' }, { status: 400 })
      }

      const l = Number(likelihood)
      const i = Number(impact)
      const riskScore = l * i

      const supabase = await createClient()
      const { data: created, error } = await supabase
        .from('compliance_risk_register')
        .insert({
          account_id: ctx.accountId,
          risk_title: riskTitle,
          category,
          likelihood: l,
          impact: i,
          risk_score: riskScore,
          mitigation_plan: mitigationPlan || 'Standard monitoring',
          owner,
          status: 'open',
        })
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, risk: created })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
