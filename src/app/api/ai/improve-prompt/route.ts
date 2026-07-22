import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'

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
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt is required' },
        { status: 400 }
      )
    }

    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: 'You are an expert AI prompt engineer. Your task is to take a given system prompt and improve it for clarity, robustness, and effectiveness. Return ONLY the improved prompt, without any conversational filler, markdown formatting blocks (like ```), or explanations. Make it professional and direct.',
      prompt: `Improve the following system prompt:\n\n${prompt}`
    })

    return NextResponse.json({ 
      success: true, 
      improvedPrompt: text.trim()
    })
  } catch (error: any) {
    console.error('Error in AI improve-prompt POST:', error)
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    )
  }
}
