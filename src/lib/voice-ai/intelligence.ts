/**
 * AIWCRM Voice AI Platform — Post-Call CRM Intelligence Extractor
 *
 * After every call, the transcript is sent through the account's
 * configured BYOK LLM (via the existing AIProviderService) to extract
 * 10 structured CRM intelligence fields.
 *
 * Falls back gracefully to sensible defaults if the LLM call fails,
 * so the call record is never lost.
 */

import { getAdminClient } from '@/lib/admin-supabase';
import type { VoiceTranscript, VoiceCallAnalysis } from './types';

interface LLMProviderConfig {
  provider: string;
  api_key:  string;
  model?:   string;
}

/**
 * Build the structured extraction prompt.
 * Returns a JSON string matching VoiceCallAnalysis shape.
 */
function buildExtractionPrompt(transcript: VoiceTranscript[]): string {
  const formattedTranscript = transcript
    .map((t) => `${t.speaker === 'ai' ? 'AI' : 'Customer'}: ${t.text}`)
    .join('\n');

  return `You are a CRM intelligence engine. Analyze the following phone call transcript and extract structured data.

TRANSCRIPT:
${formattedTranscript}

Respond ONLY with a valid JSON object (no markdown, no explanation) matching this exact schema:
{
  "summary": "2-3 sentence summary of the call",
  "customerIntent": "What the customer wanted or asked about",
  "sentiment": "positive" | "neutral" | "negative",
  "buyingSignals": ["array of specific buying signals detected, empty array if none"],
  "objections": ["array of objections or concerns raised, empty array if none"],
  "nextFollowupAt": "ISO 8601 datetime if a specific follow-up was mentioned, null otherwise",
  "actionItems": ["array of action items e.g. 'send brochure', 'schedule demo', empty array if none"],
  "aiLeadScore": <integer 0-100 based on intent, urgency, and buying signals>,
  "opportunityStage": "cold" | "warm" | "hot" | "closed",
  "aiRecommendation": "1-2 sentence recommendation for the sales team's next action"
}`;
}

/**
 * Make an LLM call using the account's configured BYOK provider.
 * Supports OpenAI-compatible APIs (OpenAI, Groq, DeepSeek).
 * Falls back to Gemini if the provider is 'gemini'.
 */
async function callLLM(
  config: LLMProviderConfig,
  prompt: string,
): Promise<string> {
  const apiKey = config.api_key;
  const model  = config.model ?? 'gpt-4o-mini';

  // Gemini path
  if (config.provider === 'gemini') {
    const geminiModel = config.model ?? 'gemini-2.0-flash';
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
        }),
      },
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  }

  // OpenAI-compatible path (OpenAI, Groq, DeepSeek)
  const baseUrlMap: Record<string, string> = {
    openai:   'https://api.openai.com/v1',
    groq:     'https://api.groq.com/openai/v1',
    deepseek: 'https://api.deepseek.com/v1',
  };
  const baseUrl = baseUrlMap[config.provider] ?? 'https://api.openai.com/v1';

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens:  1024,
      response_format: { type: 'json_object' },
    }),
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '{}';
}

/**
 * Default fallback when LLM extraction fails.
 */
function defaultAnalysis(transcript: VoiceTranscript[]): VoiceCallAnalysis {
  const allText = transcript.map((t) => t.text).join(' ');
  const hasPositiveWords = /interest|great|yes|sure|sounds good|amazing/i.test(allText);
  const hasNegativeWords = /no|not|cancel|refund|issue|problem|angry/i.test(allText);

  return {
    summary:          'Call transcript was recorded. Manual review recommended.',
    customerIntent:   'Unable to determine automatically.',
    sentiment:        hasNegativeWords ? 'negative' : hasPositiveWords ? 'positive' : 'neutral',
    buyingSignals:    [],
    objections:       [],
    actionItems:      [],
    aiLeadScore:      50,
    opportunityStage: 'warm',
    aiRecommendation: 'Review call transcript and determine next steps manually.',
  };
}

/**
 * Main entry point: extract structured CRM intelligence from a call transcript.
 * Uses the account's default BYOK LLM via the centralized AI config.
 */
export async function extractCallIntelligence(
  transcript: VoiceTranscript[],
  accountId: string,
): Promise<VoiceCallAnalysis> {
  if (transcript.length === 0) return defaultAnalysis(transcript);

  try {
    const db = getAdminClient() as any;

    // Load the account's default AI provider config (same as WhatsApp AI uses)
    const { data: aiConfig } = await db
      .from('ai_provider_configs')
      .select('provider, api_key, model')
      .eq('account_id', accountId)
      .eq('is_default', true)
      .maybeSingle();

    if (!aiConfig?.api_key) {
      console.warn('[VoiceAI] No BYOK LLM configured for intelligence extraction, using fallback.');
      return defaultAnalysis(transcript);
    }

    const prompt = buildExtractionPrompt(transcript);
    const rawJson = await callLLM(aiConfig, prompt);

    // Strip any accidental markdown code fences
    const cleaned = rawJson.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary:          parsed.summary          ?? 'No summary available.',
      customerIntent:   parsed.customerIntent   ?? 'Unknown',
      sentiment:        parsed.sentiment        ?? 'neutral',
      buyingSignals:    Array.isArray(parsed.buyingSignals) ? parsed.buyingSignals : [],
      objections:       Array.isArray(parsed.objections)   ? parsed.objections   : [],
      nextFollowupAt:   parsed.nextFollowupAt   ? new Date(parsed.nextFollowupAt) : undefined,
      actionItems:      Array.isArray(parsed.actionItems)  ? parsed.actionItems  : [],
      aiLeadScore:      Number(parsed.aiLeadScore)         || 50,
      opportunityStage: parsed.opportunityStage ?? 'warm',
      aiRecommendation: parsed.aiRecommendation ?? 'Review call and plan next steps.',
    };
  } catch (error) {
    console.error('[VoiceAI] Intelligence extraction failed:', error);
    return defaultAnalysis(transcript);
  }
}
