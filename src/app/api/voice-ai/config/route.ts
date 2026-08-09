import { NextResponse } from 'next/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { getAdminClient } from '@/lib/admin-supabase';
import { encrypt } from '@/lib/whatsapp/encryption';
import { checkProviderHealth } from '@/lib/voice-ai/provider-service';
import type { VoiceProvider } from '@/lib/voice-ai/types';

const admin = () => getAdminClient() as any;

/** GET /api/voice-ai/config — list all provider configs for the account */
export async function GET() {
  try {
    const ctx = await requireRole('admin');

    const { data } = await admin()
      .from('voice_ai_provider_configs')
      .select('id, provider, agent_id, phone_number_id, voice_id, is_default, is_active, monthly_budget, daily_call_limit, per_user_limit, settings_json, updated_at')
      .eq('account_id', ctx.accountId)
      .order('is_default', { ascending: false });

    // Never expose raw api_key — only indicate if one is saved
    const configs = (data ?? []).map((row: Record<string, unknown>) => ({
      ...row,
      has_api_key: true,
    }));

    return NextResponse.json({ configs });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** POST /api/voice-ai/config — save or update a provider config */
export async function POST(req: Request) {
  try {
    const ctx = await requireRole('admin');
    const body = await req.json();

    const {
      provider,
      api_key,
      agent_id,
      phone_number_id,
      voice_id,
      is_default,
      is_active,
      monthly_budget,
      daily_call_limit,
      per_user_limit,
      settings_json,
    } = body;

    if (!provider) {
      return NextResponse.json({ error: 'provider is required' }, { status: 400 });
    }

    const db = admin();

    // Check if a config already exists for this provider
    const { data: existing } = await db
      .from('voice_ai_provider_configs')
      .select('id, api_key')
      .eq('account_id', ctx.accountId)
      .eq('provider', provider)
      .maybeSingle();

    // If setting this as default, clear other defaults first
    if (is_default) {
      await db
        .from('voice_ai_provider_configs')
        .update({ is_default: false })
        .eq('account_id', ctx.accountId)
        .neq('provider', provider);
    }

    // Encrypt new API key only if one was provided; otherwise keep existing
    let encryptedKey = existing?.api_key;
    if (api_key && api_key.trim()) {
      encryptedKey = encrypt(api_key.trim());
    }
    if (!encryptedKey) {
      return NextResponse.json({ error: 'api_key is required for new providers' }, { status: 400 });
    }

    const record = {
      account_id:      ctx.accountId,
      provider,
      api_key:         encryptedKey,
      agent_id:        agent_id       ?? existing?.agent_id,
      phone_number_id: phone_number_id ?? existing?.phone_number_id,
      voice_id:        voice_id       ?? existing?.voice_id,
      is_default:      is_default     ?? false,
      is_active:       is_active      ?? true,
      monthly_budget:  monthly_budget  ?? null,
      daily_call_limit: daily_call_limit ?? null,
      per_user_limit:  per_user_limit  ?? null,
      settings_json:   settings_json  ?? {},
      updated_at:      new Date().toISOString(),
    };

    if (existing) {
      await db
        .from('voice_ai_provider_configs')
        .update(record)
        .eq('id', existing.id);
    } else {
      await db
        .from('voice_ai_provider_configs')
        .insert(record);
    }

    // Run a health check immediately and return the result
    const mockConfig = {
      id: '', accountId: ctx.accountId, provider: provider as VoiceProvider,
      apiKey: api_key ?? 'existing', agentId: agent_id, phoneNumberId: phone_number_id,
      settingsJson: {}, isDefault: false, isActive: true,
    } as any;

    let healthy = false;
    try {
      healthy = await checkProviderHealth(ctx.accountId, provider as VoiceProvider);
    } catch { /* ignore health check failure on first save */ }

    return NextResponse.json({ success: true, healthy });
  } catch (error) {
    return toErrorResponse(error);
  }
}
