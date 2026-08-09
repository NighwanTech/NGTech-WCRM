import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const db = supabaseAdmin()
      const { decisionId, feedbackType, feedbackNotes } = await request.json()

      // 1. Fetch the AI Decision
      const { data: decision, error: fetchError } = await db
        .from('ai_agent_operations')
        .select('*')
        .eq('id', decisionId)
        .eq('account_id', ctx.accountId)
        .single()

      if (fetchError || !decision) {
        return NextResponse.json({ error: 'Decision not found' }, { status: 404 })
      }

      // 2. Update the Decision Status based on feedback
      // If HELPFUL, it could be an approval. If NOT_HELPFUL, it could be a rejection.
      // But feedback can also be just qualitative on a past execution.
      // For now, we just log it.
      
      // 3. Inject Human Feedback directly into the Knowledge Base
      const kbSummary = `Human Manager Feedback on AI Decision (${decision.action_type} for ${decision.target_id}): 
      Feedback Type: ${feedbackType}. 
      Human Notes: "${feedbackNotes}". 
      AI's Original Rationale was: "${decision.ai_rationale}".`

      await db.from('marketing_intelligence_kb').insert({
        account_id: ctx.accountId,
        insight_type: 'HUMAN_FEEDBACK',
        summary: kbSummary,
        confidence_score: 100, // Human feedback is ground truth
        source_campaign_ids: [decision.target_id]
      })

      // 4. Mark decision as reviewed
      await db.from('ai_agent_operations')
        .update({ status: feedbackType === 'HELPFUL' ? 'APPROVED' : 'REJECTED' })
        .eq('id', decisionId)

      return NextResponse.json({ success: true, message: 'Feedback incorporated into AI Knowledge Base.' })
    } catch (error: any) {
      console.error('AI Feedback Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
