import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { getTenantAIModel, getModelForAccount } from '@/lib/meta/ai-ad-engine'
import { z } from 'zod'
import { generateText } from 'ai'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const { prompt, objective } = await request.json()
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

      const systemPrompt = `You are an expert Meta Ads copywriter.
The objective of this campaign is: ${objective}.
Use the following CRM historical ROI feedback from the Knowledge Base to guide your tone. 
Knowledge Base: ${kbContext}`

      const { text, usage } = await generateText({
        model: aiModel,
        prompt: `${systemPrompt}\n\nGenerate a high-converting primary text ad copy for Meta Ads based on this prompt: "${prompt}". Return ONLY the copy text directly.`
      })
      const object = { copy: text.trim() }
      
      // Cost Logging
      const usageData = usage as any
      const totalTokens = (usageData?.promptTokens || 0) + (usageData?.completionTokens || 0)
      
      await db.from('ai_agent_operations').insert({
        account_id: ctx.accountId,
        agent_name: 'campaign_builder_wizard',
        action_type: 'RECOMMEND',
        ai_rationale: 'Generated ad copy based on user prompt and KB.',
        estimated_token_usage: totalTokens,
        estimated_cost_cents: Math.round(totalTokens * 0.0002),
        status: 'AUTO_EXECUTED'
      })

      return NextResponse.json({ success: true, copy: object.copy })
    } catch (error: any) {
      console.error('Generate copy error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
