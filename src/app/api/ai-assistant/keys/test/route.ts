import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIProviderService } from '@/lib/services/ai/provider.service';
import { generateText } from 'ai';

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
    const { provider, model, apiKey, baseUrl } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    // Resolve model
    const aiModel = AIProviderService.getModel(provider, model, {
      apiKey: apiKey?.trim(),
      baseUrl: baseUrl?.trim(),
    });

    // Test lightweight prompt
    const { text } = await generateText({
      model: aiModel as any,
      prompt: 'Hello! Reply with "OK" if connection is working.',
      maxTokens: 10,
    });

    return NextResponse.json({
      success: true,
      message: `Connection successful! Provider ${provider} responded.`,
      sampleResponse: text,
    });
  } catch (err: any) {
    console.error('API key test error:', err);
    let errMsg = err?.message || 'Failed to connect to AI Provider with given credentials.';
    
    if (errMsg.includes('Quota exceeded') || errMsg.includes('limit: 0')) {
      errMsg = 'Google AI Free Tier Quota Limit 0 for this model. Please select "Gemini 1.5 Flash (Recommended - Works on Free & Paid Keys)" in the Model dropdown.';
    } else if (errMsg.includes('is not found for API version') || errMsg.includes('v1beta')) {
      errMsg = 'Selected model name is not available on this API key. Please select "Gemini 1.5 Flash (Recommended)".';
    }

    return NextResponse.json(
      { error: errMsg },
      { status: 400 }
    );
  }
}
