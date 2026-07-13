import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTextMessage } from '@/lib/whatsapp/meta-api';
import { decrypt } from '@/lib/whatsapp/encryption';
import { sanitizePhoneForMeta, isValidE164 } from '@/lib/whatsapp/phone-utils';
import { getAdminClient } from '@/lib/admin-supabase';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle();

    const accountId = profile?.account_id;
    if (!accountId) {
      return NextResponse.json({ error: 'No account linked' }, { status: 403 });
    }

    const body = await request.json();
    const { order_id, status } = body;

    if (!order_id || !status) {
      return NextResponse.json(
        { error: 'order_id and status are required' },
        { status: 400 }
      );
    }

    // 1. Update the order status
    const { data: order, error: updateError } = await supabase
      .from('whatsapp_orders')
      .update({ status })
      .eq('id', order_id)
      .eq('account_id', accountId)
      .select('*, contact:contacts(phone)')
      .single();

    if (updateError || !order) {
      console.error('Failed to update order status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }

    // 2. Try to notify the customer via WhatsApp (Best Effort)
    try {
      const { data: config } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('account_id', accountId)
        .single();

      if (config && config.access_token && config.phone_number_id && order.contact?.phone) {
        const accessToken = decrypt(config.access_token);
        const sanitizedPhone = sanitizePhoneForMeta(order.contact.phone);

        if (isValidE164(sanitizedPhone)) {
          let text = `Your order (${order.id.split('-')[0]}) status has been updated to: *${status.toUpperCase()}*.`;
          if (status === 'completed') {
            text = `Good news! Your order (${order.id.split('-')[0]}) has been completed and shipped!`;
          }

          // Try sending standard text. This may fail if outside 24h window.
          const result = await sendTextMessage({
            phoneNumberId: config.phone_number_id,
            accessToken,
            to: sanitizedPhone,
            text,
          });

          // Log it in messages table so agent can see it
          const adminClient = getAdminClient();
          await adminClient.from('messages').insert({
            conversation_id: order.conversation_id,
            sender_type: 'agent',
            content_type: 'text',
            content_text: text,
            status: 'sent',
            message_id: result.messageId,
          });
        }
      }
    } catch (notifyErr) {
      console.warn('Failed to send automated WhatsApp order update:', notifyErr);
      // We do not fail the request if the notification fails (e.g. 24h window closed)
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error('Order status API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
