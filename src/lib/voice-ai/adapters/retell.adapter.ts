/**
 * AIWCRM Voice AI Platform — Retell AI Adapter
 *
 * Migrated from /api/retell/ routes. Now implements the
 * provider-agnostic VoiceProviderAdapter interface so Retell
 * is interchangeable with ElevenLabs or any future provider.
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

const RETELL_API_BASE = 'https://api.retellai.com';

// Retell bills at ~$0.10/min; approximate INR at ₹8.50 per $ → ~₹0.85/min
const RETELL_COST_PER_MINUTE_INR = 0.85;

export class RetellAdapter implements VoiceProviderAdapter {
  readonly provider = 'retell' as const;

  /** Decrypt Retell API key (supports both legacy plaintext and encrypted) */
  private decryptKey(value: string): string {
    return value.split(':').length >= 2 ? decrypt(value) : value;
  }

  async createCall(
    config: VoiceProviderConfig,
    request: VoiceCallRequest,
    systemPrompt: string,
  ): Promise<VoiceCallResult> {
    const apiKey = this.decryptKey(config.apiKey);

    const body: Record<string, unknown> = {
      from_number: config.phoneNumberId,
      to_number:   request.toNumber,
      agent_id:    config.agentId,
      retell_llm_dynamic_variables: {
        customer_name: request.contactName || 'Customer',
        system_prompt: systemPrompt,
      },
    };

    const res = await fetch(`${RETELL_API_BASE}/v2/create-phone-call`, {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${apiKey}`,
        'Content-Type':   'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Retell createCall failed: ${JSON.stringify(data)}`);
    }

    return {
      providerCallId:   data.call_id,
      provider:         'retell',
      estimatedCostInr: this.estimateCost(120), // estimate 2 min default
    };
  }

  async endCall(config: VoiceProviderConfig, providerCallId: string): Promise<void> {
    const apiKey = this.decryptKey(config.apiKey);
    await fetch(`${RETELL_API_BASE}/v2/delete-call`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ call_id: providerCallId }),
    });
  }

  async getTranscript(
    config: VoiceProviderConfig,
    providerCallId: string,
  ): Promise<VoiceTranscript[]> {
    const apiKey = this.decryptKey(config.apiKey);
    const res = await fetch(`${RETELL_API_BASE}/v2/get-call/${providerCallId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const data = await res.json();

    if (!data?.transcript_object) return [];

    // Retell transcript format: [{ role, content, words: [{ word, start, end }] }]
    return (data.transcript_object as Array<{ role: string; content: string; words?: Array<{ start: number }> }>)
      .map((t) => ({
        speaker:   t.role === 'agent' ? 'ai' : 'human' as 'ai' | 'human',
        text:      t.content,
        timestamp: t.words?.[0]?.start ?? 0,
      }));
  }

  async listVoices(_config: VoiceProviderConfig): Promise<VoiceOption[]> {
    // Retell uses custom agents — voice is configured inside the Retell dashboard
    return [
      { id: 'retell-default', name: 'Retell Default Agent Voice', language: 'en', gender: 'neutral' },
    ];
  }

  async healthCheck(config: VoiceProviderConfig): Promise<boolean> {
    try {
      const apiKey = this.decryptKey(config.apiKey);
      const res = await fetch(`${RETELL_API_BASE}/list-agents`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  estimateCost(durationSeconds: number): number {
    return (durationSeconds / 60) * RETELL_COST_PER_MINUTE_INR;
  }

  verifyWebhookSignature(
    rawBody: string,
    signature: string | null,
    apiKey: string,
    now = Date.now(),
  ): boolean {
    if (!signature || !apiKey) return false;
    const match = /^v=(\d+),d=([a-f0-9]{64})$/i.exec(signature);
    if (!match) return false;

    const [, timestamp, digest] = match;
    if (Math.abs(now - Number(timestamp)) > 5 * 60 * 1000) return false;

    const expected = crypto
      .createHmac('sha256', apiKey)
      .update(rawBody + timestamp)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(digest, 'hex'),
      Buffer.from(expected, 'hex'),
    );
  }

  parseWebhookEvent(rawBody: string): VoiceWebhookEvent {
    const payload = JSON.parse(rawBody);
    const callData = payload?.call ?? {};
    const callId   = callData?.call_id ?? '';

    const transcriptRaw: Array<{ role: string; content: string; words?: Array<{ start: number }> }> =
      callData?.transcript_object ?? [];

    const transcript: VoiceTranscript[] = transcriptRaw.map((t) => ({
      speaker:   t.role === 'agent' ? 'ai' : 'human' as 'ai' | 'human',
      text:      t.content,
      timestamp: t.words?.[0]?.start ?? 0,
    }));

    const duration =
      callData.end_timestamp && callData.start_timestamp
        ? Math.floor((callData.end_timestamp - callData.start_timestamp) / 1000)
        : undefined;

    const sentimentMap: Record<string, 'positive' | 'neutral' | 'negative'> = {
      Positive: 'positive',
      Neutral:  'neutral',
      Negative: 'negative',
    };
    const rawSentiment = callData?.call_analysis?.user_sentiment ?? '';
    const sentiment = sentimentMap[rawSentiment] ?? 'neutral';

    let eventType: VoiceWebhookEvent['type'] = 'call_ended';
    if (payload.event === 'call_analyzed') eventType = 'call_analyzed';
    else if (payload.event === 'call_started') eventType = 'call_started';
    else if (payload.event === 'call_ended') eventType = 'call_ended';

    return {
      type:           eventType,
      providerCallId: callId,
      transcript,
      summary:        callData?.call_analysis?.call_summary,
      sentiment,
      durationSeconds: duration,
      recordingUrl:   callData?.recording_url,
      rawPayload:     payload,
    };
  }
}
