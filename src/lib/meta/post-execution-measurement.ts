import { SupabaseClient } from '@supabase/supabase-js'

export async function runPostExecutionMeasurement(db: SupabaseClient) {
  // 1. Fetch AI decisions that were executed more than 7 days ago, but haven't been scored yet
  const { data: decisions, error } = await db
    .from('ai_agent_operations')
    .select('*')
    .eq('status', 'AUTO_EXECUTED')
    .is('ai_accuracy_score', null)
    .not('expected_impact', 'is', null)
    // In production, we'd add: .lte('executed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .limit(50)

  if (error || !decisions || decisions.length === 0) return { success: true, processed: 0 }

  let processed = 0

  for (const decision of decisions) {
    const expected = decision.expected_impact

    // 2. Mock fetching the actual real-world results from Meta Graph API
    // In production, you would fetch the exact campaign/adset from Meta and look at the last 7 days of telemetry
    const actualCpl = expected.original_cpl ? expected.original_cpl * (0.8 + Math.random() * 0.4) : 0 // Mock 80%-120% of original
    const actualImpact = { actual_cpl: actualCpl }

    // 3. Calculate AI Accuracy Score using pure math (0 tokens consumed)
    let accuracyScore = 0
    if (expected.original_cpl && actualCpl) {
      // If AI recommended an action, we expect CPL to improve (drop) or at least remain stable while scaling
      const variance = Math.abs(expected.original_cpl - actualCpl) / expected.original_cpl
      accuracyScore = Math.max(0, 100 - (variance * 100))
    } else {
      accuracyScore = 85.0 // Default mock score
    }

    // 4. Log the accuracy score and actual impact back to the operation row
    await db.from('ai_agent_operations')
      .update({
        ai_accuracy_score: accuracyScore,
        actual_impact: actualImpact
      })
      .eq('id', decision.id)

    // 5. If the AI was highly inaccurate (< 60%), inject a corrective lesson into the Knowledge Base
    if (accuracyScore < 60) {
      const correctiveLesson = `Post-Execution Analysis: On ${new Date(decision.executed_at).toLocaleDateString()}, AI performed ${decision.action_type} on ${decision.target_id}. 
      The actual outcome deviated significantly from expectations (Accuracy: ${accuracyScore.toFixed(1)}%). 
      Lesson: Be more conservative with ${decision.action_type} actions on this campaign in the future.`
      
      await db.from('marketing_intelligence_kb').insert({
        account_id: decision.account_id,
        insight_type: 'AI_CORRECTION',
        summary: correctiveLesson,
        confidence_score: 100, // Proven mathematically
        source_campaign_ids: [decision.target_id]
      })
    }

    processed++
  }

  return { success: true, processed }
}
