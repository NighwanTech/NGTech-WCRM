import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { getAdminClient } from '@/lib/admin-supabase';
import { decryptRetellApiKey } from '@/lib/retell/credentials';

export async function POST(req: Request) {
  try {
    const ctx = await requireRole('agent');
    const supabase = await createClient();

    const { contactId } = await req.json();
    if (!contactId) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    // 1. Get User's Account ID
    const accountId = ctx.accountId;

    // 2. Get Retell Config
    // Database types have not yet been regenerated for the Retell tables.
    const admin = getAdminClient() as any;
    const { data: config } = await admin
      .from('retell_config')
      .select('api_key, agent_id, from_number')
      .eq('account_id', accountId)
      .single();

    if (!config?.api_key || !config?.agent_id || !config?.from_number) {
      return NextResponse.json({ error: 'Retell AI is not fully configured for this account. Please go to Settings.' }, { status: 400 });
    }

    // 3. Get Contact Phone Number
    const { data: contact } = await supabase
      .from('contacts')
      .select('phone, name')
      .eq('id', contactId)
      .eq('account_id', accountId)
      .single();

    if (!contact?.phone) {
      return NextResponse.json({ error: 'Contact does not have a phone number' }, { status: 400 });
    }

    // 4. Initiate Call with Retell API
    const retellRes = await fetch('https://api.retellai.com/v2/create-phone-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${decryptRetellApiKey(config.api_key)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_number: config.from_number,
        to_number: contact.phone,
        agent_id: config.agent_id,
        retell_llm_dynamic_variables: {
          customer_name: contact.name || 'Customer'
        }
      })
    });

    const retellData = await retellRes.json();

    if (!retellRes.ok) {
      console.error('Retell Error:', retellData);
      return NextResponse.json({ error: 'Failed to initiate call via Retell', details: retellData }, { status: 500 });
    }

    // 5. Save to database
    const { error: dbError } = await admin
      .from('ai_calls')
      .insert({
        account_id: accountId,
        contact_id: contactId,
        retell_call_id: retellData.call_id,
        direction: 'outbound',
        status: 'in_progress'
      });

    if (dbError) {
      console.error('Database Error saving AI call:', dbError);
    }

    return NextResponse.json({ success: true, call: retellData });

  } catch (error: unknown) {
    console.error('AI Call error:', error);
    return toErrorResponse(error);
  }
}
