import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getTenantAIModel, getModelForAccount } from '@/lib/meta/ai-ad-engine'
import { generateObject } from 'ai'
import { z } from 'zod'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const db = supabaseAdmin()
      const { activeCampaigns } = await request.json()

      // Fetch Knowledge Base for context
      const { data: kbData } = await db
        .from('marketing_intelligence_kb')
        .select('summary')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })
        .limit(5)
        
      const kbContext = kbData ? kbData.map(k => k.summary).join('\\n') : 'No historical intelligence available.'

      // Prompt for Predictive Analytics
      const aiConfig = await getTenantAIModel(ctx.accountId)
      const aiModel = getModelForAccount(aiConfig)

      const systemPrompt = `You are an Enterprise Meta Ads Intelligence Engine.
Based on the following active campaigns telemetry and CRM Knowledge Base, generate predictive insights.

CRM KNOWLEDGE BASE:
${kbContext}

ACTIVE CAMPAIGNS TELEMETRY:
${JSON.stringify(activeCampaigns, null, 2)}`

      const { object, usage } = await generateObject({
        model: aiModel,
        system: systemPrompt,
        prompt: `Analyze the active campaigns against historical CRM data and provide lead scoring, fatigue warnings, and executive insights.`,
        schema: z.object({
          predictedROI: z.number().describe('Predicted ROI percentage for next 30 days'),
          estimatedCPA: z.number().describe('Estimated blended CPA across all campaigns'),
          customerLTVForecast: z.number().describe('Forecasted Customer Lifetime Value in INR'),
          creativeFatigueStatus: z.enum(['Low Risk', 'Medium Risk', 'High Risk']),
          fatigueWarningDetail: z.string().describe('Details on which ads are fatiguing'),
          leadScoring: z.array(z.object({
            campaignName: z.string(),
            score: z.number().min(0).max(100).describe('Predicted lead quality score 0-100'),
            trend: z.string().describe('e.g. "+5%", "-2%"'),
            estimatedCPL: z.number()
          })),
          insights: z.array(z.object({
            title: z.string(),
            description: z.string(),
            type: z.enum(['opportunity', 'warning', 'suggestion'])
          }))
        })
      })

      // Cost Logging
      const usageData = usage as any
      const totalTokens = (usageData?.promptTokens || 0) + (usageData?.completionTokens || 0)
      
      await db.from('ai_agent_operations').insert({
        account_id: ctx.accountId,
        agent_name: 'predictive_analytics_engine',
        action_type: 'RECOMMEND',
        ai_rationale: 'Generated predictive dashboard data based on active telemetry and KB',
        estimated_token_usage: totalTokens,
        estimated_cost_cents: Math.round(totalTokens * 0.0002),
        status: 'AUTO_EXECUTED'
      })

      return NextResponse.json({ success: true, data: object })
    } catch (error: any) {
      console.error('Predictive Analytics Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
