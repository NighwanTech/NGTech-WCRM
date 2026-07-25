import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIProviderService } from '@/lib/services/ai/provider.service';
import { generateText } from 'ai';

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
    let { provider, model, apiKey, baseUrl } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    // Decrypt if it's masked (starts with bullet point)
    if (apiKey && apiKey.includes('•')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.account_id) {
        const { data: dbSettings } = await supabase
          .from('ai_assistant_settings')
          .select('custom_api_key_encrypted')
          .eq('account_id', profile.account_id)
          .maybeSingle();

        if (dbSettings?.custom_api_key_encrypted) {
          const { decrypt } = await import('@/lib/whatsapp/encryption');
          apiKey = decrypt(dbSettings.custom_api_key_encrypted);
        }
      }
    }

    let aiModel = AIProviderService.getModel(provider, model, {
      apiKey: apiKey?.trim(),
      baseUrl: baseUrl?.trim(),
    });

    let text = '';
    try {
      const res = await generateText({
        model: aiModel as any,
        prompt: 'Hello! Reply with "OK" if connection is working.',
        maxTokens: 100,
      });
      text = res.text;
    } catch (err: any) {
      const errMsg = err?.message || '';
      if (provider === 'gemini' && (errMsg.includes('limit: 0') || errMsg.includes('Quota exceeded') || errMsg.includes('quota'))) {
        console.log('[AI keys test] Gemini 2.0 quota limit hit. Retrying with Gemini 1.5 Flash latest...');
        aiModel = AIProviderService.getModel(provider, 'gemini-1.5-flash-latest', {
          apiKey: apiKey?.trim(),
          baseUrl: baseUrl?.trim(),
        });
        const res = await generateText({
          model: aiModel as any,
          prompt: 'Hello! Reply with "OK" if connection is working.',
          maxTokens: 100,
        });
        text = res.text;
      } else {
        throw err;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Connection successful! Provider ${provider} responded.`,
      sampleResponse: text,
    });
  } catch (err: any) {
    console.error('API key test error:', err);
    let errMsg = err?.message || 'Failed to connect to AI Provider with given credentials.';
    
    if (errMsg.includes('Quota exceeded') || errMsg.includes('limit: 0')) {
      errMsg = `Google AI Quota Limit Exceeded: ${err?.message || errMsg}. (Note: If using a Free tier key, select Gemini 1.5 Flash. If using a Paid billing-enabled key, please verify your Google Cloud Platform billing status/card payment is active).`;
    } else if (errMsg.includes('is not found for API version') || errMsg.includes('v1beta')) {
      errMsg = `Selected model was not found: ${err?.message || errMsg}. Please verify your selected model identifier is supported on your API key.`;
    }

    return NextResponse.json(
      { error: errMsg },
      { status: 400 }
    );
  }
}
