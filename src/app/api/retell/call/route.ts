/**
 * @deprecated — Use /api/voice-ai/call instead.
 * Kept for backward compatibility. Delegates to VoiceAIProviderService.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { placeVoiceCall } from '@/lib/voice-ai/provider-service';

export async function POST(req: Request) {
  try {
    const ctx      = await requireRole('agent');
    const supabase = await createClient();
    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const { data: contact } = await supabase
      .from('contacts')
      .select('phone, name')
      .eq('id', contactId)
      .eq('account_id', ctx.accountId)
      .single();

    if (!contact?.phone) {
      return NextResponse.json({ error: 'Contact does not have a phone number' }, { status: 400 });
    }

    const result = await placeVoiceCall(
      { toNumber: contact.phone, contactName: contact.name ?? undefined, contactId, accountId: ctx.accountId },
      ctx.userId,
      'retell', // explicit Retell for backward compat
    );

    return NextResponse.json({ success: true, call: { call_id: result.providerCallId } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
