import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { AIProviderService } from '@/lib/services/ai/provider.service';
import { AIPromptService } from '@/lib/services/ai/prompt.service';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    let {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user) {
      const { data: { session } } = await supabase.auth.getSession();
      user = session?.user || null;
    }

    if (!user) {
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
    try {
      if (process.env.NODE_ENV === 'development') {
        require('fs').writeFileSync(
          require('path').join(process.cwd(), 'debug_last_prompt.txt'),
          `AccountId: ${profile?.account_id}\n\n${fullSystemPrompt}`
        );
      }
    } catch (e) {
      console.warn('Failed to write debug prompt file:', e);
    }

    const startTime = performance.now();
    let responseText = '';
    let usage = undefined;
    const provider = config?.provider || 'gemini';
    const targetModel = config?.model === 'custom-model' ? config?.custom_model_name : config?.model;
    const modelName = targetModel || (provider === 'gemini' ? 'gemini-2.0-flash' : 'llama-3.3-70b-versatile');

    let apiKey = config?.use_custom_keys ? config?.custom_api_key : undefined;

    // Decrypt if it's masked (starts with bullet point)
    if (apiKey && apiKey.includes('•')) {
      const { data: dbSettings } = await supabase
        .from('ai_assistant_settings')
        .select('custom_api_key_encrypted')
        .eq('account_id', profile?.account_id)
        .maybeSingle();

      if (dbSettings?.custom_api_key_encrypted) {
        const { decrypt } = await import('@/lib/whatsapp/encryption');
        apiKey = decrypt(dbSettings.custom_api_key_encrypted);
      }
    }

    try {
      let model = AIProviderService.getModel(provider, modelName, {
        apiKey: apiKey?.trim(),
        baseUrl: config?.custom_api_base_url,
      });
      
      let aiResult;
      try {
        aiResult = await generateText({
          model: model as any,
          system: fullSystemPrompt,
          prompt: message,
          maxTokens: config?.advanced_settings?.max_tokens || undefined,
          temperature: config?.advanced_settings?.temperature || undefined,
          topP: config?.advanced_settings?.top_p || undefined,
          frequencyPenalty: config?.advanced_settings?.frequency_penalty || undefined,
          presencePenalty: config?.advanced_settings?.presence_penalty || undefined,
        });
      } catch (err: any) {
        const errMsg = err?.message || '';
        if (provider === 'gemini' && (errMsg.includes('limit: 0') || errMsg.includes('Quota exceeded') || errMsg.includes('quota'))) {
          console.log('[AI test] Gemini 2.0 quota limit hit. Retrying with Gemini 1.5 Flash latest...');
          model = AIProviderService.getModel(provider, 'gemini-1.5-flash', {
            apiKey: apiKey?.trim(),
            baseUrl: config?.custom_api_base_url,
          });
          aiResult = await generateText({
            model: model as any,
            system: fullSystemPrompt,
            prompt: message,
            maxTokens: config?.advanced_settings?.max_tokens || undefined,
            temperature: config?.advanced_settings?.temperature || undefined,
            topP: config?.advanced_settings?.top_p || undefined,
            frequencyPenalty: config?.advanced_settings?.frequency_penalty || undefined,
            presencePenalty: config?.advanced_settings?.presence_penalty || undefined,
          });
        } else {
          throw err;
        }
      }

      const { text, usage: aiUsage } = aiResult;
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
      responseTimeMs,
      provider,
      model: modelName
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
