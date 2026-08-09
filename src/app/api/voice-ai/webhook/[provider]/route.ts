import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAdminClient } from '@/lib/admin-supabase';
import { getAdapter, getProviderConfig } from '@/lib/voice-ai/provider-service';
import { extractCallIntelligence }       from '@/lib/voice-ai/intelligence';
import { syncCallToEcosystem }           from '@/lib/voice-ai/ecosystem-sync';
import { recordCallCost }                from '@/lib/voice-ai/cost-governance';
import type { VoiceProvider }            from '@/lib/voice-ai/types';

// Service-role client for public webhook endpoint (no user session)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
) as any;

const admin = () => getAdminClient() as any;

/**
 * POST /api/voice-ai/webhook/[provider]
 *
 * Receives webhook events from any voice provider.
 * The [provider] dynamic segment tells us which adapter to use for
 * signature verification and payload parsing.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerParam } = await params;
  const provider = providerParam as VoiceProvider;

  try {
    const rawBody  = await req.text();
    const adapter  = getAdapter(provider);
    const event    = adapter.parseWebhookEvent(rawBody);

    if (!event.providerCallId) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Find the call record to get accountId (needed for signature verification)
    const { data: callRecord } = await supabase
      .from('ai_calls')
      .select('id, account_id, contact_id')
      .eq('provider_call_id', event.providerCallId)
      .maybeSingle();

    // Also check legacy retell_call_id column for backward compat
    const resolvedCall = callRecord ?? (
      await supabase
        .from('ai_calls')
        .select('id, account_id, contact_id')
        .eq('retell_call_id', event.providerCallId)
        .maybeSingle()
    ).data;

    if (!resolvedCall) {
      // Not our call — return 200 to stop retries
      return NextResponse.json({ received: true });
    }

    // Verify webhook signature
    const config = await getProviderConfig(resolvedCall.account_id, provider);
    if (config) {
      const signatureHeader =
        req.headers.get('x-retell-signature') ??
        req.headers.get('x-elevenlabs-signature') ??
        req.headers.get('x-webhook-signature') ??
        '';

      const valid = adapter.verifyWebhookSignature(rawBody, signatureHeader, config.apiKey);
      if (!valid) {
        console.warn(`[VoiceAI] Invalid webhook signature from ${provider}`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Handle events
    if (event.type === 'call_started') {
      await admin()
        .from('ai_calls')
        .update({ status: 'in_progress', updated_at: new Date().toISOString() })
        .eq('id', resolvedCall.id);
    }

    if (event.type === 'call_ended' || event.type === 'call_analyzed') {
      // 1. Update basic call record
      await admin()
        .from('ai_calls')
        .update({
          status:           'completed',
          duration_seconds: event.durationSeconds,
          recording_url:    event.recordingUrl,
          transcript:       event.transcript?.map((t) => `${t.speaker}: ${t.text}`).join('\n'),
          summary:          event.summary,
          updated_at:       new Date().toISOString(),
        })
        .eq('id', resolvedCall.id);

      // 2. Extract structured CRM intelligence (uses account's BYOK LLM)
      const transcript  = event.transcript ?? [];
      const analysis    = await extractCallIntelligence(transcript, resolvedCall.account_id);

      // 3. Save intelligence back to the call record
      await admin()
        .from('ai_calls')
        .update({
          call_summary:      analysis.summary,
          customer_intent:   analysis.customerIntent,
          sentiment:         analysis.sentiment,
          buying_signals:    analysis.buyingSignals,
          objections:        analysis.objections,
          next_followup_at:  analysis.nextFollowupAt?.toISOString() ?? null,
          action_items:      analysis.actionItems,
          ai_lead_score:     analysis.aiLeadScore,
          opportunity_stage: analysis.opportunityStage,
          ai_recommendation: analysis.aiRecommendation,
        })
        .eq('id', resolvedCall.id);

      // 4. Record actual cost
      if (event.durationSeconds && config) {
        const cost = getAdapter(provider).estimateCost(event.durationSeconds);
        await recordCallCost(resolvedCall.id, cost);
      }

      // 5. Sync to entire AIWCRM ecosystem
      await syncCallToEcosystem({
        callId:    resolvedCall.id,
        contactId: resolvedCall.contact_id,
        accountId: resolvedCall.account_id,
        provider,
        analysis,
      });
    }

    if (event.type === 'call_failed') {
      await admin()
        .from('ai_calls')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', resolvedCall.id);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`[VoiceAI] Webhook error (${provider}):`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
