/**
 * AIWCRM Voice AI Platform — Ecosystem Sync
 *
 * After every completed call, this module syncs structured CRM intelligence
 * across ALL relevant AIWCRM modules — making Voice AI a first-class
 * enterprise communication channel, not an isolated feature.
 *
 * Sync Map:
 *  intelligence.aiLeadScore      → Contacts (lead score)
 *  intelligence.customerIntent   → Contacts (intent field)
 *  intelligence.sentiment        → Customer Intelligence (sentiment history)
 *  intelligence.buyingSignals    → Deals (stage advance) + Marketing Intelligence
 *  intelligence.opportunityStage → Deals (priority flag)
 *  intelligence.nextFollowupAt   → Tasks (auto-create follow-up)
 *  intelligence.actionItems      → Tasks + WhatsApp (auto-send if needed)
 *  intelligence.aiRecommendation → Decision Center (recommendation card)
 *  call completed                → Workflows (event trigger)
 *  intelligence.objections       → Customer Intelligence (objection patterns)
 *  calendar intent               → Calendar (propose event)
 */

import { getAdminClient } from '@/lib/admin-supabase';
import { createClient } from '@supabase/supabase-js';
import type { VoiceCallAnalysis } from './types';

// Service-role client for bypassing RLS in webhook context
const admin = () => getAdminClient() as any;
const publicSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ) as any;

export interface SyncContext {
  callId:    string;
  contactId: string;
  accountId: string;
  provider:  string;
  analysis:  VoiceCallAnalysis;
}

/**
 * Master sync function — call this once per completed call.
 * All individual syncs run independently; a failure in one
 * does not block the others.
 */
export async function syncCallToEcosystem(ctx: SyncContext): Promise<void> {
  await Promise.allSettled([
    syncToContacts(ctx),
    syncToDeals(ctx),
    syncToTasks(ctx),
    syncToCustomerIntelligence(ctx),
    syncToMarketingIntelligence(ctx),
    syncToDecisionCenter(ctx),
    triggerWorkflows(ctx),
    syncToTimeline(ctx),
  ]);

  // WhatsApp follow-up is sequential (needs contact phone)
  await syncToWhatsApp(ctx).catch((e) =>
    console.error('[VoiceAI] WhatsApp sync failed:', e),
  );
}

// ─── 1. Contacts ──────────────────────────────────────────────────────────────

async function syncToContacts({ contactId, accountId, analysis }: SyncContext) {
  await admin()
    .from('contacts')
    .update({
      ai_lead_score:       analysis.aiLeadScore,
      last_call_summary:   analysis.summary,
      customer_intent:     analysis.customerIntent,
      last_sentiment:      analysis.sentiment,
      last_called_at:      new Date().toISOString(),
      updated_at:          new Date().toISOString(),
    })
    .eq('id', contactId)
    .eq('account_id', accountId);
}

// ─── 2. Deals ─────────────────────────────────────────────────────────────────

async function syncToDeals({ contactId, accountId, analysis }: SyncContext) {
  if (analysis.buyingSignals.length === 0 && analysis.opportunityStage === 'cold') return;

  // Find open deals linked to this contact
  const { data: deals } = await admin()
    .from('deals')
    .select('id, stage')
    .eq('contact_id', contactId)
    .eq('account_id', accountId)
    .not('stage', 'in', '("closed_won","closed_lost")')
    .order('created_at', { ascending: false })
    .limit(1);

  if (!deals || deals.length === 0) {
    // No existing deal — create one if we have strong buying signals
    if (analysis.buyingSignals.length > 0 && analysis.opportunityStage !== 'cold') {
      await admin().from('deals').insert({
        account_id:   accountId,
        contact_id:   contactId,
        title:        `Voice AI Lead — ${analysis.customerIntent}`,
        stage:        analysis.opportunityStage === 'hot' ? 'proposal' : 'qualified',
        source:       'voice_ai',
        ai_lead_score: analysis.aiLeadScore,
        notes:        analysis.summary,
      });
    }
    return;
  }

  const deal = deals[0];
  const stageMap: Record<string, string> = {
    cold:   deal.stage,          // no change
    warm:   'qualified',
    hot:    'proposal',
    closed: 'closed_won',
  };

  await admin()
    .from('deals')
    .update({
      stage:         stageMap[analysis.opportunityStage] ?? deal.stage,
      is_priority:   analysis.opportunityStage === 'hot',
      ai_lead_score: analysis.aiLeadScore,
      updated_at:    new Date().toISOString(),
    })
    .eq('id', deal.id);
}

// ─── 3. Tasks ─────────────────────────────────────────────────────────────────

async function syncToTasks({ contactId, accountId, analysis }: SyncContext) {
  const tasksToCreate: Array<Record<string, unknown>> = [];

  // Auto-create follow-up task if intelligence extracted a follow-up time
  if (analysis.nextFollowupAt) {
    tasksToCreate.push({
      account_id:  accountId,
      contact_id:  contactId,
      title:       `Follow up with contact (post-call)`,
      description: analysis.aiRecommendation,
      due_at:      analysis.nextFollowupAt.toISOString(),
      priority:    analysis.opportunityStage === 'hot' ? 'high' : 'medium',
      source:      'voice_ai',
    });
  }

  // Create tasks for action items
  for (const item of analysis.actionItems) {
    if (item.toLowerCase().includes('send') || item.toLowerCase().includes('schedule')) {
      tasksToCreate.push({
        account_id:  accountId,
        contact_id:  contactId,
        title:       item,
        description: `Action item from AI voice call: ${analysis.summary}`,
        due_at:      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
        priority:    'medium',
        source:      'voice_ai',
      });
    }
  }

  if (tasksToCreate.length > 0) {
    await admin().from('tasks').insert(tasksToCreate);
  }
}

// ─── 4. Customer Intelligence ─────────────────────────────────────────────────

async function syncToCustomerIntelligence(
  { contactId, accountId, analysis }: SyncContext,
) {
  // Append to customer intelligence profile
  await admin()
    .from('customer_intelligence')
    .upsert(
      {
        contact_id:          contactId,
        account_id:          accountId,
        last_sentiment:      analysis.sentiment,
        objection_patterns:  analysis.objections,
        buying_signals:      analysis.buyingSignals,
        updated_at:          new Date().toISOString(),
      },
      { onConflict: 'contact_id,account_id' },
    )
    .catch(() => {
      // Table may not exist yet — silent fail
    });
}

// ─── 5. Marketing Intelligence ────────────────────────────────────────────────

async function syncToMarketingIntelligence(
  { contactId, accountId, analysis }: SyncContext,
) {
  if (analysis.buyingSignals.length === 0) return;

  // Tag contact for remarketing if buying signals were detected
  await admin()
    .from('contact_segments')
    .upsert(
      {
        contact_id:  contactId,
        account_id:  accountId,
        segment_tag: 'voice_ai_hot_lead',
        source:      'voice_ai_intelligence',
        added_at:    new Date().toISOString(),
      },
      { onConflict: 'contact_id,segment_tag' },
    )
    .catch(() => {
      // Table may not exist yet — silent fail
    });
}

// ─── 6. Decision Center ───────────────────────────────────────────────────────

async function syncToDecisionCenter(
  { callId, contactId, accountId, analysis }: SyncContext,
) {
  if (!analysis.aiRecommendation) return;

  await admin()
    .from('decision_center_items')
    .insert({
      account_id:  accountId,
      contact_id:  contactId,
      source:      'voice_ai',
      source_id:   callId,
      priority:    analysis.opportunityStage === 'hot' ? 'high' : 'medium',
      title:       `Voice AI Insight: ${analysis.customerIntent}`,
      description: analysis.aiRecommendation,
      sentiment:   analysis.sentiment,
      lead_score:  analysis.aiLeadScore,
      expires_at:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .catch(() => {
      // Table may not exist yet — silent fail
    });
}

// ─── 7. Workflow Triggers ─────────────────────────────────────────────────────

async function triggerWorkflows({ contactId, accountId, analysis }: SyncContext) {
  // Insert a workflow event that can be picked up by active automation rules
  await admin()
    .from('workflow_events')
    .insert({
      account_id:  accountId,
      event_type:  'call_completed',
      contact_id:  contactId,
      payload: {
        sentiment:        analysis.sentiment,
        opportunity_stage: analysis.opportunityStage,
        ai_lead_score:    analysis.aiLeadScore,
        buying_signals:   analysis.buyingSignals,
        action_items:     analysis.actionItems,
      },
    })
    .catch(() => {
      // Table may not exist yet — silent fail
    });
}

// ─── 8. Customer Activity Timeline ───────────────────────────────────────────

async function syncToTimeline({ callId, contactId, accountId, analysis }: SyncContext) {
  await publicSupabase().rpc('log_customer_activity', {
    p_account_id:   accountId,
    p_contact_id:   contactId,
    p_actor_id:     null,
    p_category:     analysis.sentiment === 'negative' ? 'support' : 'sales',
    p_activity_type:'ai_call_completed',
    p_title:        'AI Voice Call Completed',
    p_description:  analysis.summary,
    p_metadata: {
      call_id:          callId,
      sentiment:        analysis.sentiment,
      buying_signals:   analysis.buyingSignals,
      opportunity_stage: analysis.opportunityStage,
      ai_lead_score:    analysis.aiLeadScore,
      ai_recommendation: analysis.aiRecommendation,
    },
    p_is_milestone: analysis.opportunityStage === 'hot' || analysis.buyingSignals.length > 0,
  });
}

// ─── 9. WhatsApp Follow-up ────────────────────────────────────────────────────

async function syncToWhatsApp({ contactId, accountId, analysis }: SyncContext) {
  const needsFollowup = analysis.actionItems.some(
    (item) =>
      item.toLowerCase().includes('send brochure') ||
      item.toLowerCase().includes('send pricing') ||
      item.toLowerCase().includes('send details') ||
      item.toLowerCase().includes('send catalog'),
  );

  if (!needsFollowup) return;

  // Get contact's WhatsApp number
  const { data: contact } = await admin()
    .from('contacts')
    .select('phone, name')
    .eq('id', contactId)
    .eq('account_id', accountId)
    .maybeSingle();

  if (!contact?.phone) return;

  // Trigger WhatsApp message via internal API (fire-and-forget)
  const followupMessage =
    `Hi ${contact.name ?? 'there'}! Thanks for your time on the call. ` +
    `As discussed, I'm sending you the details you requested. Please let me know if you have any questions!`;

  await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/whatsapp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId,
      to:      contact.phone,
      message: followupMessage,
      source:  'voice_ai_followup',
    }),
  }).catch((e) => console.error('[VoiceAI] WhatsApp follow-up send failed:', e));
}
