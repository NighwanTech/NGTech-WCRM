import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/automations/admin-client';
import { engineSendTemplate } from '@/lib/automations/meta-send';

/**
 * Drain due `sequence_enrollments` rows.
 * Uses a safe Postgres row lock (FOR UPDATE SKIP LOCKED) via an RPC function
 * to prevent duplicate sends if multiple cron instances overlap.
 */
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: 'cron not configured' }, { status: 503 });
  }
  if (request.headers.get('authorization') !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = supabaseAdmin();

  // 1. Claim up to 50 due enrollments securely
  const { data: claims, error: claimError } = await admin.rpc(
    'claim_due_sequence_enrollments',
    { p_limit: 50 }
  );

  if (claimError) {
    console.error('[sequences/cron] RPC claim failed:', claimError);
    return NextResponse.json({ error: claimError.message }, { status: 500 });
  }

  if (!claims || claims.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  // 2. Process each claimed enrollment in parallel
  const results = await Promise.allSettled(
    claims.map(async (enrollment: any) => {
      try {
        // Fetch sequence info (for account_id, user_id)
        const { data: sequence, error: seqError } = await admin
          .from('sequences')
          .select('account_id, user_id')
          .eq('id', enrollment.sequence_id)
          .single();

        if (seqError || !sequence) throw new Error('Sequence not found');

        // Fetch current step
        const { data: currentStep, error: stepError } = await admin
          .from('sequence_steps')
          .select('*')
          .eq('sequence_id', enrollment.sequence_id)
          .eq('position', enrollment.current_step)
          .single();

        if (stepError || !currentStep) {
          // No current step found? Must be a data inconsistency. Fail it.
          throw new Error('Current step not found');
        }

        // Fetch conversation id
        const { data: conversation, error: convError } = await admin
          .from('conversations')
          .select('id')
          .eq('account_id', sequence.account_id)
          .eq('contact_id', enrollment.contact_id)
          .maybeSingle();

        if (convError || !conversation) {
          throw new Error('Conversation not found for contact');
        }

        // Execute step (Send Template)
        await engineSendTemplate({
          accountId: sequence.account_id,
          userId: sequence.user_id,
          conversationId: conversation.id,
          contactId: enrollment.contact_id,
          templateName: currentStep.template_name,
          language: currentStep.template_language,
          params: [], // MVP: strict 0-parameter templates for sequences, or dynamic params later
        });

        // Determine next step
        const nextPosition = currentStep.position + 1;
        const { data: nextStep } = await admin
          .from('sequence_steps')
          .select('delay_days, delay_hours, delay_minutes')
          .eq('sequence_id', enrollment.sequence_id)
          .eq('position', nextPosition)
          .maybeSingle();

        if (nextStep) {
          // Calculate next run time
          const now = new Date();
          now.setUTCDate(now.getUTCDate() + nextStep.delay_days);
          now.setUTCHours(now.getUTCHours() + nextStep.delay_hours);
          now.setUTCMinutes(now.getUTCMinutes() + nextStep.delay_minutes);

          await admin
            .from('sequence_enrollments')
            .update({
              status: 'active',
              current_step: nextPosition,
              next_run_at: now.toISOString(),
            })
            .eq('id', enrollment.id);
        } else {
          // End of sequence
          await admin
            .from('sequence_enrollments')
            .update({
              status: 'completed',
            })
            .eq('id', enrollment.id);
        }

      } catch (err: any) {
        console.error(`[sequences/cron] Failed enrollment ${enrollment.id}:`, err);
        await admin
          .from('sequence_enrollments')
          .update({
            status: 'failed',
            error_message: err.message || String(err),
          })
          .eq('id', enrollment.id);
      }
    })
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - successful;

  return NextResponse.json({ processed: results.length, successful, failed });
}
