import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { placeVoiceCall, estimateCallCost } from '@/lib/voice-ai/provider-service';
import type { VoiceProvider } from '@/lib/voice-ai/types';

/** POST /api/voice-ai/call — initiate an AI voice call */
export async function POST(req: Request) {
  try {
    const ctx       = await requireRole('agent');
    const supabase  = await createClient();
    const body      = await req.json();

    const {
      contactId,
      provider: providerOverride,
    }: {
      contactId:  string;
      provider?:  VoiceProvider;
    } = body;

    if (!contactId) {
      return NextResponse.json({ error: 'contactId is required' }, { status: 400 });
    }

    // Get contact phone + name
    const { data: contact } = await supabase
      .from('contacts')
      .select('phone, name')
      .eq('id', contactId)
      .eq('account_id', ctx.accountId)
      .single();

    if (!contact?.phone) {
      return NextResponse.json(
        { error: 'Contact does not have a phone number' },
        { status: 400 },
      );
    }

    const result = await placeVoiceCall(
      {
        toNumber:    contact.phone,
        contactName: contact.name ?? undefined,
        contactId,
        accountId:   ctx.accountId,
      },
      ctx.userId,
      providerOverride,
    );

    return NextResponse.json({ success: true, call: result });
  } catch (error: unknown) {
    console.error('[VoiceAI] Call error:', error);
    return toErrorResponse(error);
  }
}
