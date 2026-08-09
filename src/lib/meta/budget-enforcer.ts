import { SupabaseClient } from '@supabase/supabase-js'

export interface BudgetEnforcementResult {
  allowed: boolean
  reason?: string
  adjustedBudgetCents?: number
}

/**
 * Validates if an AI or Human budget scaling action is within the tenant's safety limits.
 */
export async function enforceBudgetLimits(
  db: SupabaseClient,
  accountId: string,
  proposedBudgetCents: number
): Promise<BudgetEnforcementResult> {
  // 1. Fetch Tenant's AI Budget Governance Settings
  // In a real app, you would have a `budget_governance` table or column in `ai_assistant_settings`.
  // Mocking the limits here based on Phase 7 architecture.
  
  const MAX_DAILY_CAMPAIGN_BUDGET_CENTS = 500000 // ₹5000 max daily per campaign limit
  const MAX_TOTAL_ACCOUNT_SPEND_CENTS = 20000000 // ₹200,000 total account limit

  if (proposedBudgetCents > MAX_DAILY_CAMPAIGN_BUDGET_CENTS) {
    return {
      allowed: false,
      reason: `Proposed budget (₹${proposedBudgetCents / 100}) exceeds the AI safety limit of ₹${MAX_DAILY_CAMPAIGN_BUDGET_CENTS / 100} per campaign.`,
      adjustedBudgetCents: MAX_DAILY_CAMPAIGN_BUDGET_CENTS
    }
  }

  // 2. Fetch current total spend across all active campaigns
  const { data: activeCampaigns } = await db
    .from('meta_ad_campaigns')
    .select('daily_budget')
    .eq('account_id', accountId)
    .eq('status', 'ACTIVE')

  const currentTotalSpend = activeCampaigns?.reduce((acc, curr) => acc + (Number(curr.daily_budget) || 0), 0) || 0

  if (currentTotalSpend + proposedBudgetCents > MAX_TOTAL_ACCOUNT_SPEND_CENTS) {
    return {
      allowed: false,
      reason: `Account total budget limit reached. Cannot allocate ₹${proposedBudgetCents / 100}.`
    }
  }

  return { allowed: true }
}
