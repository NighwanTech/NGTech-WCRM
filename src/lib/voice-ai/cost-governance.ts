/**
 * AIWCRM Voice AI Platform — Cost Governance
 *
 * Mirrors the Multi-LLM cost governance pattern.
 * Checks budgets and limits BEFORE a call is placed.
 * Records actual cost AFTER a call completes.
 */

import { getAdminClient } from '@/lib/admin-supabase';
import type { VoiceProvider, CostCheckResult } from './types';

const admin = () => getAdminClient() as any;

/**
 * Check whether a call is allowed under the account's configured
 * budget and call limits for the given provider.
 */
export async function checkCallAllowed(
  accountId: string,
  userId: string,
  provider: VoiceProvider,
): Promise<CostCheckResult> {
  const db = admin();

  // Fetch the config for this provider (includes budget / limits)
  const { data: config } = await db
    .from('voice_ai_provider_configs')
    .select('monthly_budget, daily_call_limit, per_user_limit')
    .eq('account_id', accountId)
    .eq('provider', provider)
    .maybeSingle();

  if (!config) {
    return { allowed: false, reason: `Provider ${provider} is not configured for this account.` };
  }

  // --- Monthly budget check ---
  if (config.monthly_budget != null) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: costData } = await db
      .from('ai_calls')
      .select('actual_cost_inr')
      .eq('account_id', accountId)
      .eq('provider', provider)
      .gte('created_at', startOfMonth.toISOString());

    const spentThisMonth = (costData ?? []).reduce(
      (sum: number, r: { actual_cost_inr: number | null }) => sum + (r.actual_cost_inr ?? 0),
      0,
    );

    if (spentThisMonth >= config.monthly_budget) {
      return {
        allowed: false,
        reason:  `Monthly Voice AI budget of ₹${config.monthly_budget} has been reached.`,
        remaining: { monthlyBudgetInr: 0 },
      };
    }
  }

  // --- Daily call limit check (account-wide) ---
  if (config.daily_call_limit != null) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count: dailyCount } = await db
      .from('ai_calls')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('provider', provider)
      .gte('created_at', startOfDay.toISOString());

    if ((dailyCount ?? 0) >= config.daily_call_limit) {
      return {
        allowed: false,
        reason:  `Daily call limit of ${config.daily_call_limit} calls has been reached.`,
        remaining: { dailyCallsLeft: 0 },
      };
    }
  }

  // --- Per-user daily limit check ---
  if (config.per_user_limit != null) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count: userCount } = await db
      .from('ai_calls')
      .select('id', { count: 'exact', head: true })
      .eq('account_id', accountId)
      .eq('provider', provider)
      .eq('initiated_by_user_id', userId)
      .gte('created_at', startOfDay.toISOString());

    if ((userCount ?? 0) >= config.per_user_limit) {
      return {
        allowed: false,
        reason:  `Your personal daily call limit of ${config.per_user_limit} calls has been reached.`,
        remaining: { userCallsLeft: 0 },
      };
    }
  }

  return { allowed: true };
}

/**
 * Record the actual cost after a call completes.
 * Called from the webhook handler after duration is known.
 */
export async function recordCallCost(
  callId: string,
  actualCostInr: number,
): Promise<void> {
  await admin()
    .from('ai_calls')
    .update({ actual_cost_inr: actualCostInr })
    .eq('id', callId);
}
