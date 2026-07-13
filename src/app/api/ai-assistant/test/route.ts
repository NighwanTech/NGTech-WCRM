import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { AIProviderService } from '@/lib/services/ai/provider.service';
import { AIPromptService } from '@/lib/services/ai/prompt.service';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, config, history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format history string for the prompt
    const historyString = history
      .map((msg: any) => `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .single();

    const fullSystemPrompt = await AIPromptService.buildSystemPrompt(
      config || {}, 
      historyString,
      message,
      profile?.account_id
    );

    // DEBUG: Write the prompt and accountId to a file
    require('fs').writeFileSync(
      require('path').join(process.cwd(), 'debug_last_prompt.txt'),
      `AccountId: ${profile?.account_id}\n\n${fullSystemPrompt}`
    );

    const startTime = performance.now();
    let responseText = '';
    let usage = undefined;
    const provider = config?.provider || 'groq';
    const modelName = config?.model || (provider === 'gemini' ? 'gemini-1.5-pro' : 'llama-3.3-70b-versatile');

    try {
      const model = AIProviderService.getModel(provider, modelName);
      
      const { text, usage: aiUsage, toolCalls } = await generateText({
        model: model as any,
        system: fullSystemPrompt,
        prompt: message,
        maxTokens: config?.advanced_settings?.max_tokens || undefined,
        temperature: config?.advanced_settings?.temperature || undefined,
        topP: config?.advanced_settings?.top_p || undefined,
        frequencyPenalty: config?.advanced_settings?.frequency_penalty || undefined,
        presencePenalty: config?.advanced_settings?.presence_penalty || undefined,
      });

      const handoffMatch = text.match(/\[HANDOFF:\s*(.*?)\]/i);
      
      if (handoffMatch) {
        responseText = "[System: Bot paused and routed to human agent] Reason: " + handoffMatch[1].trim();
      } else {
        responseText = text;
      }
      
      usage = aiUsage;
    } catch (apiError: any) {
      console.error(`Error calling ${provider} API:`, apiError);
      return NextResponse.json({ error: `Provider Error: ${apiError.message || 'Unknown error'}` }, { status: 502 });
    }

    const endTime = performance.now()
    const responseTimeMs = Math.round(endTime - startTime)

    return NextResponse.json({ 
      text: responseText,
      usage,
      responseTimeMs
    })
  } catch (error) {
    console.error('Error in AI Assistant test API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// Force Next.js hot-reload 3
