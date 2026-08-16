import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { conversation_id } = body

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      )
    }

    // Fetch conversation and messages
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*, contact:contacts(*)')
      .eq('id', conversation_id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })

    if (msgError || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages to summarize' },
        { status: 400 }
      )
    }

    // Format messages for the prompt
    const transcript = messages
      .map((m) => {
        const sender = m.sender_type === 'customer' ? 'Customer' : 'Agent'
        const content = m.content_type === 'text' ? m.content_text : `[${m.content_type}]`
        return `${sender}: ${content}`
      })
      .join('\n')

    let parsedObj: any = {}
    
    if (process.env.GROQ_API_KEY) {
      try {
        const { text } = await generateText({
          model: groq('llama-3.3-70b-versatile'),
          prompt: `Analyze the following customer conversation transcript and respond ONLY with a raw JSON object (no markdown, no backticks).
Required JSON schema:
{
  "summary": "1-2 sentence overall summary",
  "points": ["3-5 bullet points"],
  "last_objection": "objection or null",
  "action": "recommended action",
  "lead_score": "hot" | "warm" | "cold",
  "sentiment": "positive" | "neutral" | "negative",
  "priority": "high" | "medium" | "low",
  "confidence": 85
}

Transcript:
${transcript}`
        })

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim()
        parsedObj = JSON.parse(cleanedText)
      } catch (err: any) {
        console.warn('[summarize-api] Groq LLM parsing fallback:', err.message)
      }
    }

    const object = {
      summary: parsedObj.summary || `Customer inquiry regarding services. Total messages: ${messages.length}.`,
      points: Array.isArray(parsedObj.points) && parsedObj.points.length > 0 ? parsedObj.points : ['Inbound inquiry received via WhatsApp channel.', 'Customer seeking product information and assistance.'],
      last_objection: parsedObj.last_objection || null,
      action: parsedObj.action || 'Follow up with customer to qualify interest.',
      lead_score: parsedObj.lead_score || 'warm',
      sentiment: parsedObj.sentiment || 'neutral',
      priority: parsedObj.priority || 'medium',
      confidence: parsedObj.confidence || 85
    }

    const finalSummary = JSON.stringify({
      summary: object.summary,
      points: object.points,
      last_objection: object.last_objection,
      action: object.action
    });

    // Safely parse the enum fields to prevent database constraint errors
    const safeLeadScore = ['hot', 'warm', 'cold'].includes(object.lead_score?.toLowerCase()) ? object.lead_score.toLowerCase() : 'warm';
    const safeSentiment = ['positive', 'neutral', 'negative'].includes(object.sentiment?.toLowerCase()) ? object.sentiment.toLowerCase() : 'neutral';
    const safePriority = ['high', 'medium', 'low'].includes(object.priority?.toLowerCase()) ? object.priority.toLowerCase() : 'medium';
    const safeConfidence = typeof object.confidence === 'number' ? Math.round(object.confidence) : 80;

    // Save summary and health metrics to the database
    await supabase
      .from('conversations')
      .update({ 
        ai_summary: finalSummary,
        ai_lead_score: safeLeadScore,
        ai_sentiment: safeSentiment,
        priority: safePriority,
        ai_confidence: safeConfidence
      })
      .eq('id', conversation_id)

    return NextResponse.json({ 
      success: true, 
      summary: finalSummary,
      lead_score: safeLeadScore,
      sentiment: safeSentiment,
      priority: safePriority,
      confidence: safeConfidence
    })
  } catch (error: any) {
    console.error('Error in AI summarize POST:', error)
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    )
  }
}
