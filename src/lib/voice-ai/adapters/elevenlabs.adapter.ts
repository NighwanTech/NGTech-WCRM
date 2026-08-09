/**
 * AIWCRM Voice AI Platform — ElevenLabs Adapter
 *
 * Implements the provider-agnostic VoiceProviderAdapter interface for
 * ElevenLabs Conversational AI. Outbound calling goes via Twilio (the
 * phone number must be linked in the ElevenLabs dashboard first).
 *
 * Built with mock fallback: when USE_MOCK_ELEVENLABS=true in env (or
 * when the API key starts with "mock_"), all calls return mock data so
 * the feature is fully testable without a live ElevenLabs account.
 */

import crypto from 'node:crypto';
import { decrypt } from '@/lib/whatsapp/encryption';
import type {
  VoiceProviderAdapter,
  VoiceProviderConfig,
  VoiceCallRequest,
  VoiceCallResult,
  VoiceTranscript,
  VoiceOption,
  VoiceWebhookEvent,
} from '../types';

const EL_API_BASE = 'https://api.elevenlabs.io/v1';

// ElevenLabs Creator plan: ~$0.05 per 1000 chars ≈ ~₹0.42/min at avg speaking rate
const EL_COST_PER_MINUTE_INR = 0.42;

// Notable voices for India — shown in Playground selector
export const ELEVENLABS_INDIA_VOICES: VoiceOption[] = [
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Aria (English)',          language: 'en',      gender: 'female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (English)',         language: 'en',      gender: 'female' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam (English)',          language: 'en',      gender: 'male'   },
  { id: 'priya-hindi-v1',        name: 'Priya (Hindi — Native)',  language: 'hi',      gender: 'female' },
  { id: 'arjun-hindi-v1',        name: 'Arjun (Hindi — Native)', language: 'hi',      gender: 'male'   },
  { id: 'multilingual-v2',       name: 'Riya (Hindi + English)', language: 'hi-en',   gender: 'female' },
];

export class ElevenLabsAdapter implements VoiceProviderAdapter {
  readonly provider = 'elevenlabs' as const;

  private decryptKey(value: string): string {
    return value.split(':').length >= 2 ? decrypt(value) : value;
  }

  private isMock(config: VoiceProviderConfig): boolean {
    return (
      process.env.USE_MOCK_ELEVENLABS === 'true' ||
      config.apiKey.startsWith('mock_')
    );
  }

  async createCall(
    config: VoiceProviderConfig,
    request: VoiceCallRequest,
    systemPrompt: string,
  ): Promise<VoiceCallResult> {
    if (this.isMock(config)) {
      return {
        providerCallId:   `mock_el_call_${Date.now()}`,
        provider:         'elevenlabs',
        estimatedCostInr: this.estimateCost(120),
      };
    }

    const apiKey = this.decryptKey(config.apiKey);

    // ElevenLabs outbound call via Twilio bridge
    const body = {
      agent_id:               config.agentId,
      agent_phone_number_id:  config.phoneNumberId,
      to_number:              request.toNumber,
      conversation_initiation_client_data: {
        dynamic_variables: {
          contact_name:  request.contactName ?? 'Customer',
          system_prompt: systemPrompt,
        },
      },
    };

    const res = await fetch(`${EL_API_BASE}/convai/twilio/outbound-call`, {
      method: 'POST',
      headers: {
        'xi-api-key':   apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`ElevenLabs createCall failed: ${JSON.stringify(data)}`);
    }

    return {
      providerCallId:   data.conversation_id ?? data.callSid,
      provider:         'elevenlabs',
      estimatedCostInr: this.estimateCost(120),
    };
  }

  async endCall(config: VoiceProviderConfig, providerCallId: string): Promise<void> {
    if (this.isMock(config)) return;

    const apiKey = this.decryptKey(config.apiKey);
    await fetch(`${EL_API_BASE}/convai/conversations/${providerCallId}/end`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey },
    });
  }

  async getTranscript(
    config: VoiceProviderConfig,
    providerCallId: string,
  ): Promise<VoiceTranscript[]> {
    if (this.isMock(config)) {
      return [
        { speaker: 'ai',    text: 'Hello! How can I help you today?',           timestamp: 0 },
        { speaker: 'human', text: 'Tell me about your pricing.',                  timestamp: 4000 },
        { speaker: 'ai',    text: 'We offer transparent plans starting at ₹999.', timestamp: 7000 },
      ];
    }

    const apiKey = this.decryptKey(config.apiKey);
    const res = await fetch(`${EL_API_BASE}/convai/conversations/${providerCallId}`, {
      headers: { 'xi-api-key': apiKey },
    });
    const data = await res.json();

    const turns: Array<{ role: string; message: string; time_in_call_secs: number }> =
      data?.transcript ?? [];

    return turns.map((t) => ({
      speaker:   t.role === 'agent' ? 'ai' : 'human' as 'ai' | 'human',
      text:      t.message,
      timestamp: t.time_in_call_secs * 1000,
    }));
  }

  async listVoices(config: VoiceProviderConfig): Promise<VoiceOption[]> {
    if (this.isMock(config)) return ELEVENLABS_INDIA_VOICES;

    try {
      const apiKey = this.decryptKey(config.apiKey);
      const res = await fetch(`${EL_API_BASE}/voices`, {
        headers: { 'xi-api-key': apiKey },
      });
      const data = await res.json();

      const voices: Array<{ voice_id: string; name: string; labels: Record<string, string>; preview_url: string }> =
        data?.voices ?? [];

      return voices.map((v) => ({
        id:       v.voice_id,
        name:     v.name,
        language: v.labels?.language ?? 'en',
        preview:  v.preview_url,
        gender:   (v.labels?.gender ?? 'neutral') as VoiceOption['gender'],
      }));
    } catch {
      return ELEVENLABS_INDIA_VOICES;
    }
  }

  async healthCheck(config: VoiceProviderConfig): Promise<boolean> {
    if (this.isMock(config)) return true;

    try {
      const apiKey = this.decryptKey(config.apiKey);
      const res = await fetch(`${EL_API_BASE}/user`, {
        headers: { 'xi-api-key': apiKey },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  estimateCost(durationSeconds: number): number {
    return (durationSeconds / 60) * EL_COST_PER_MINUTE_INR;
  }

  verifyWebhookSignature(
    rawBody: string,
    signature: string | null,
    secret: string,
  ): boolean {
    // ElevenLabs uses HMAC-SHA256 with the secret configured in the webhook settings
    if (!signature || !secret) return false;
    try {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
      const sigBuffer  = Buffer.from(signature.replace(/^sha256=/, ''), 'hex');
      const expBuffer  = Buffer.from(expected, 'hex');
      if (sigBuffer.length !== expBuffer.length) return false;
      return crypto.timingSafeEqual(sigBuffer, expBuffer);
    } catch {
      return false;
    }
  }

  parseWebhookEvent(rawBody: string): VoiceWebhookEvent {
    const payload = JSON.parse(rawBody);

    // ElevenLabs webhook payload structure
    const convId: string = payload?.conversation_id ?? payload?.data?.conversation_id ?? '';
    const eventType: string = payload?.type ?? payload?.event ?? '';

    const turns: Array<{ role: string; message: string; time_in_call_secs: number }> =
      payload?.data?.transcript ?? payload?.transcript ?? [];

    const transcript: VoiceTranscript[] = turns.map((t) => ({
      speaker:   t.role === 'agent' ? 'ai' : 'human' as 'ai' | 'human',
      text:      t.message,
      timestamp: t.time_in_call_secs * 1000,
    }));

    const durationSeconds: number | undefined =
      payload?.data?.metadata?.call_duration_secs ??
      payload?.data?.duration_seconds;

    const rawSentiment = payload?.data?.analysis?.user_sentiment ?? '';
    const sentimentMap: Record<string, 'positive' | 'neutral' | 'negative'> = {
      positive: 'positive',
      neutral:  'neutral',
      negative: 'negative',
    };
    const sentiment = sentimentMap[rawSentiment.toLowerCase()] ?? 'neutral';

    let type: VoiceWebhookEvent['type'] = 'call_ended';
    if (eventType.includes('started')) type = 'call_started';
    else if (eventType.includes('analysi') || eventType.includes('completed')) type = 'call_analyzed';
    else if (eventType.includes('fail')) type = 'call_failed';

    return {
      type,
      providerCallId: convId,
      transcript,
      summary:        payload?.data?.analysis?.summary,
      sentiment,
      durationSeconds,
      recordingUrl:   payload?.data?.recording_url,
      rawPayload:     payload,
    };
  }
}
