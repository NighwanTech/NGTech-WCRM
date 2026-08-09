import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getTenantAIModel, getModelForAccount } from '@/lib/meta/ai-ad-engine'
import { z } from 'zod'
import { generateObject } from 'ai'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { prompt } = await request.json()
      const db = supabaseAdmin()
      
      const aiConfig = await getTenantAIModel(ctx.accountId)
      const aiModel = getModelForAccount(aiConfig)
      
      const { data: kbData } = await db
        .from('marketing_intelligence_kb')
        .select('summary')
        .eq('account_id', ctx.accountId)
        .order('created_at', { ascending: false })
        .limit(3)
        
      const kbContext = kbData ? kbData.map(k => k.summary).join('\\n') : 'No historical intelligence available.'

      const systemPrompt = `You are an expert Meta Ads audience strategist.
Use the following CRM historical ROI feedback from the Knowledge Base to guide your audience suggestions. 
Knowledge Base: ${kbContext}`

      const { object, usage } = await generateObject({
        model: aiModel,
        system: systemPrompt,
        prompt: `Based on this target description, generate 3-5 specific Meta Ads interest targeting keywords: "${prompt}"`,
        schema: z.object({
          audiences: z.array(z.string()).describe("List of exact match Facebook/Meta interest targeting keywords")
        })
      })
      
      // Cost Logging
      const usageData = usage as any
      const totalTokens = (usageData?.promptTokens || 0) + (usageData?.completionTokens || 0)
      
      await db.from('ai_agent_operations').insert({
        account_id: ctx.accountId,
        agent_name: 'campaign_builder_wizard',
        action_type: 'RECOMMEND',
        ai_rationale: 'Generated audiences based on user prompt and KB.',
        estimated_token_usage: totalTokens,
        estimated_cost_cents: Math.round(totalTokens * 0.0002),
        status: 'AUTO_EXECUTED'
      })

      return NextResponse.json({ success: true, audiences: object.audiences })
    } catch (error: any) {
      console.error('Generate audience error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
