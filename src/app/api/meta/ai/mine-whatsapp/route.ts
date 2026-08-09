import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { AIPromptService } from '@/lib/services/ai/prompt.service'
import { LocalPreprocessor, RawMessage } from '@/lib/intelligence/local-preprocessor'

const WHATSAPP_INTELLIGENCE_PROMPT = `You are an Enterprise Customer Voice Analyst. 
I am going to provide you with an anonymized batch of recent customer messages received on our WhatsApp channel.

Your job is to identify recurring trends, themes, objections, feature requests, or competitor mentions.
Ignore one-off, random statements. Focus ONLY on trends that appear multiple times or are of high business value.

For each trend you identify, categorize it as one of:
'INTENT', 'OBJECTION', 'COMPETITOR', 'FAQ', 'COMPLAINT', 'FEATURE_REQUEST', 'MARKET_TREND', 'OTHER'

Also estimate:
- A confidence_score (0-100) on how strongly this trend is represented.
- The business_impact ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').
- A summary of the trend (e.g., "Multiple users are asking for a money-back guarantee").
- The approximate number of conversations reflecting this trend.
- A proposed actionable recommendation for the Marketing or Ads team based on this trend.

Format your response exactly as a JSON array of objects with the following keys:
[{
  "category": "OBJECTION",
  "confidence_score": 85,
  "business_impact": "HIGH",
  "summary": "String describing the trend",
  "sample_messages_count": 12,
  "actionable_recommendation": "String proposing a new ad or optimization"
}]

If no trends are found, return an empty array [].
`

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // 1. Fetch AI Settings to get the Lookback Window
    const { data: settings } = await supabase
      .from('ai_assistant_settings')
      .select('whatsapp_lookback_days')
      .single()
    
    const lookbackDays = settings?.whatsapp_lookback_days || 7

    // 2. Fetch raw customer messages from the DB
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('id, content_text, sender_type, created_at')
      .eq('sender_type', 'customer')
      .gte('created_at', new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1000)

    if (msgError) {
      console.error("Error fetching messages:", msgError)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ message: "No customer messages found in the lookback window.", insights: [] })
    }

    // 3. Local Preprocessing (PII Redaction & Noise Removal)
    const rawMessages: RawMessage[] = messages.map(m => ({
      id: m.id,
      text: m.content_text,
      sender_type: m.sender_type,
      created_at: m.created_at
    }))

    const batch = LocalPreprocessor.processMessages(rawMessages)

    if (batch.messageCount === 0) {
      return NextResponse.json({ message: "No valid messages found after noise removal.", insights: [] })
    }

    // 4. Send the anonymized batch to Gemini
    const userPrompt = `Here is the anonymized message batch:\n\n${batch.anonymizedText}`
    const insightsJson = await AIPromptService.generateJson(WHATSAPP_INTELLIGENCE_PROMPT, userPrompt)
    
    let insights: any[] = []
    try {
      insights = JSON.parse(insightsJson)
    } catch (e) {
      console.error("Failed to parse LLM response:", insightsJson)
      return NextResponse.json({ error: "Invalid response from AI" }, { status: 500 })
    }

    if (!Array.isArray(insights) || insights.length === 0) {
      return NextResponse.json({ message: "AI found no significant trends.", insights: [] })
    }

    // 5. Store Insights into customer_voice_insights
    const inserts = insights.map(insight => ({
      category: insight.category,
      summary: insight.summary,
      confidence_score: insight.confidence_score,
      business_impact: insight.business_impact,
      conversation_count: insight.conversation_count,
    }))

    const { error: insertError } = await supabase
      .from('customer_voice_insights')
      .insert(inserts)

    if (insertError) {
      console.error("Error inserting insights:", insertError)
    }

    // 6. Automatically push HIGH/CRITICAL impact insights to the Meta Ads Decision Center
    const recommendations = insights.filter(i => ['HIGH', 'CRITICAL'].includes(i.business_impact))
    for (const rec of recommendations) {
      await supabase.from('meta_optimization_rules').insert({
        rule_name: `WhatsApp Insight: ${rec.category}`,
        condition_metric: 'customer_voice',
        condition_operator: 'trend_detected',
        condition_value: rec.conversation_count,
        action_type: 'generate_creative',
        action_payload: { prompt: rec.actionable_recommendation },
        is_active: false // Requires manual approval in Decision Center
      })
    }

    return NextResponse.json({
      message: `Successfully processed ${batch.messageCount} messages and found ${insights.length} insights.`,
      insights
    })
  } catch (error: any) {
    console.error("WhatsApp Mining Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
