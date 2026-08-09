/**
 * AIWCRM Voice AI Platform — Central Provider Service
 *
 * The equivalent of AIProviderService for voice calls.
 * AIWCRM owns all orchestration here. Providers are pure adapters.
 *
 * Flow:
 *  1. Load provider config from voice_ai_provider_configs
 *  2. Route to correct adapter (Retell / ElevenLabs)
 *  3. Check cost governance (budget, limits)
 *  4. Build voice system prompt from KB
 *  5. Place call via adapter
 *  6. Save to ai_calls table
 */

import { getAdminClient } from '@/lib/admin-supabase';
import { RetellAdapter }      from './adapters/retell.adapter';
import { ElevenLabsAdapter }  from './adapters/elevenlabs.adapter';
import { checkCallAllowed }   from './cost-governance';
import { buildVoiceSystemPrompt } from './system-prompt';
import type {
  VoiceProvider,
  VoiceProviderAdapter,
  VoiceProviderConfig,
  VoiceCallRequest,
  VoiceCallResult,
  VoiceOption,
} from './types';

// Registry of all available adapters
const ADAPTERS: Record<VoiceProvider, VoiceProviderAdapter> = {
  retell:     new RetellAdapter(),
  elevenlabs: new ElevenLabsAdapter(),
  // Future providers: just add an entry here
  bland: {
    provider: 'bland',
    createCall: async () => { throw new Error('Bland AI coming soon'); },
    endCall: async () => {},
    getTranscript: async () => [],
    listVoices: async () => [],
    healthCheck: async () => false,
    estimateCost: () => 0,
    verifyWebhookSignature: () => false,
    parseWebhookEvent: () => ({
      type: 'call_ended',
      providerCallId: '',
      rawPayload: {},
    }),
  },
  vapi: {
    provider: 'vapi',
    createCall: async () => { throw new Error('Vapi coming soon'); },
    endCall: async () => {},
    getTranscript: async () => [],
    listVoices: async () => [],
    healthCheck: async () => false,
    estimateCost: () => 0,
    verifyWebhookSignature: () => false,
    parseWebhookEvent: () => ({
      type: 'call_ended',
      providerCallId: '',
      rawPayload: {},
    }),
  },
};

const admin = () => getAdminClient() as any;

// ─── Config Loader ────────────────────────────────────────────────────────────

export async function getProviderConfig(
  accountId: string,
  provider?: VoiceProvider,
): Promise<VoiceProviderConfig | null> {
  const db = admin();

  let query = db
    .from('voice_ai_provider_configs')
    .select('*')
    .eq('account_id', accountId)
    .eq('is_active', true);

  if (provider) {
    query = query.eq('provider', provider);
  } else {
    query = query.eq('is_default', true);
  }

  const { data } = await query.maybeSingle();
  if (!data) return null;

  return {
    id:             data.id,
    accountId:      data.account_id,
    provider:       data.provider,
    apiKey:         data.api_key,
    agentId:        data.agent_id,
    phoneNumberId:  data.phone_number_id,
    voiceId:        data.voice_id,
    settingsJson:   data.settings_json ?? {},
    isDefault:      data.is_default,
    isActive:       data.is_active,
    monthlyBudget:  data.monthly_budget,
    dailyCallLimit: data.daily_call_limit,
    perUserLimit:   data.per_user_limit,
  };
}

export async function getAllProviderConfigs(
  accountId: string,
): Promise<VoiceProviderConfig[]> {
  const { data } = await admin()
    .from('voice_ai_provider_configs')
    .select('*')
    .eq('account_id', accountId)
    .order('is_default', { ascending: false });

  return (data ?? []).map((d: Record<string, unknown>) => ({
    id:             d.id,
    accountId:      d.account_id,
    provider:       d.provider,
    apiKey:         d.api_key,
    agentId:        d.agent_id,
    phoneNumberId:  d.phone_number_id,
    voiceId:        d.voice_id,
    settingsJson:   d.settings_json ?? {},
    isDefault:      d.is_default,
    isActive:       d.is_active,
    monthlyBudget:  d.monthly_budget,
    dailyCallLimit: d.daily_call_limit,
    perUserLimit:   d.per_user_limit,
  }));
}

// ─── Adapter Resolver ─────────────────────────────────────────────────────────

export function getAdapter(provider: VoiceProvider): VoiceProviderAdapter {
  const adapter = ADAPTERS[provider];
  if (!adapter) throw new Error(`No adapter registered for provider: ${provider}`);
  return adapter;
}

// ─── Place Call ───────────────────────────────────────────────────────────────

export async function placeVoiceCall(
  request: VoiceCallRequest,
  userId: string,
  providerOverride?: VoiceProvider,
): Promise<VoiceCallResult> {
  const { accountId } = request;

  // 1. Resolve provider config
  const config = await getProviderConfig(accountId, providerOverride);
  if (!config) {
    throw new Error(
      providerOverride
        ? `Provider ${providerOverride} is not configured.`
        : 'No default Voice AI provider configured. Go to Settings → AI Voice.',
    );
  }

  // 2. Cost governance check
  const govCheck = await checkCallAllowed(accountId, userId, config.provider as VoiceProvider);
  if (!govCheck.allowed) {
    throw new Error(govCheck.reason ?? 'Call not allowed by cost governance.');
  }

  // 3. Build voice-adapted system prompt from shared KB
  const systemPrompt =
    request.overrideSystemPrompt ?? (await buildVoiceSystemPrompt(accountId));

  // 4. Place call via adapter
  const adapter = getAdapter(config.provider as VoiceProvider);
  const result  = await adapter.createCall(config, request, systemPrompt);

  // 5. Save call record to ai_calls
  await admin()
    .from('ai_calls')
    .insert({
      account_id:            accountId,
      contact_id:            request.contactId,
      provider:              config.provider,
      provider_call_id:      result.providerCallId,
      direction:             'outbound',
      status:                'in_progress',
      estimated_cost_inr:    result.estimatedCostInr,
      initiated_by_user_id:  userId,
    });

  return result;
}

// ─── List Voices ──────────────────────────────────────────────────────────────

export async function listVoicesForProvider(
  accountId: string,
  provider: VoiceProvider,
): Promise<VoiceOption[]> {
  const config = await getProviderConfig(accountId, provider);
  if (!config) return [];
  return getAdapter(provider).listVoices(config);
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function checkProviderHealth(
  accountId: string,
  provider: VoiceProvider,
): Promise<boolean> {
  const config = await getProviderConfig(accountId, provider);
  if (!config) return false;
  return getAdapter(provider).healthCheck(config);
}

// ─── Cost Estimate ────────────────────────────────────────────────────────────

export function estimateCallCost(
  provider: VoiceProvider,
  durationSeconds: number,
): number {
  return getAdapter(provider).estimateCost(durationSeconds);
}
