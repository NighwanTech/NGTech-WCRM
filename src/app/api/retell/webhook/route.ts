import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { decryptRetellApiKey } from '@/lib/retell/credentials';
import { verifyRetellWebhookSignature } from '@/lib/retell/webhook-signature';

// This is a public webhook, so we use the Service Role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    const callId = payload?.call?.call_id;
    if (typeof callId !== 'string') {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Lookup is deliberately performed before verification only to find the
    // tenant key; no state is changed until the signature validates.
    const { data: existingCall } = await supabase
      .from('ai_calls').select('account_id').eq('retell_call_id', callId).maybeSingle();
    if (!existingCall) return NextResponse.json({ received: true });
    const { data: config } = await supabase
      .from('retell_config').select('api_key').eq('account_id', existingCall.account_id).maybeSingle();
    if (!config?.api_key || !verifyRetellWebhookSignature(
      rawBody,
      req.headers.get('x-retell-signature'),
      decryptRetellApiKey(config.api_key),
    )) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Retell sends various events, we care most about call_analyzed which contains the transcript and summary
    if (payload.event === 'call_analyzed') {
      const callData = payload.call;
      const callId = callData.call_id;
      
      const duration = callData.end_timestamp && callData.start_timestamp 
        ? Math.floor((callData.end_timestamp - callData.start_timestamp) / 1000)
        : null;

      // 1. Update the AI Call record
      const { data: aiCall, error: updateError } = await supabase
        .from('ai_calls')
        .update({
          status: 'completed',
          duration_seconds: duration,
          transcript: callData.transcript,
          summary: callData.call_analysis?.call_summary,
          recording_url: callData.recording_url,
          updated_at: new Date().toISOString()
        })
        .eq('retell_call_id', callId)
        .select('*')
        .single();

      if (updateError || !aiCall) {
        console.error('Failed to update AI call record:', updateError);
        return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
      }

      // 2. Log to Customer Timeline
      // We use the existing RPC function to ensure it shows up cleanly in the UI
      const { error: rpcError } = await supabase.rpc('log_customer_activity', {
        p_account_id: aiCall.account_id,
        p_contact_id: aiCall.contact_id,
        p_actor_id: null, // System event
        p_category: 'support', // or 'sales' depending on use case
        p_activity_type: 'ai_call_completed',
        p_title: 'AI Phone Call Completed',
        p_description: callData.call_analysis?.call_summary || 'An AI voice call was completed with this contact.',
        p_metadata: {
          retell_call_id: callId,
          duration: duration,
          recording_url: callData.recording_url,
          sentiment: callData.call_analysis?.user_sentiment
        },
        p_is_milestone: true
      });

      if (rpcError) {
        console.error('Failed to log timeline activity:', rpcError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
