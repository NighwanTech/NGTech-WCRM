import { getAdminClient } from '@/lib/admin-supabase'
import { NextResponse } from 'next/server'

export class QuotaExceededError extends Error {
  public resource: string
  public current: number
  public limit: number

  constructor(resource: string, current: number, limit: number) {
    super(`Quota exceeded for ${resource}. Usage: ${current}/${limit}. Upgrade plan to increase limit.`)
    this.name = 'QuotaExceededError'
    this.resource = resource
    this.current = current
    this.limit = limit
  }
}

/**
 * Enforces hard quota limits per account before resource creation.
 */
export async function enforceQuota(
  accountId: string,
  resource: 'contacts' | 'messages'
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const admin = getAdminClient()

  // Fetch account plan limits
  const { data: account, error: accErr } = await admin
    .from('accounts')
    .select('max_contacts, max_messages_pm, plan')
    .eq('id', accountId)
    .single()

  if (accErr || !account) {
    throw new Error(`[quota-guard] Account ${accountId} not found`)
  }

  // -1 indicates unlimited quota (Enterprise Tier)
  const limit = resource === 'contacts' ? account.max_contacts : account.max_messages_pm
  if (limit === -1) {
    return { allowed: true, current: 0, limit: -1 }
  }

  // Get current calendar month key YYYY-MM-01
  const currentMonthKey = new Date().toISOString().slice(0, 7) + '-01'

  const { data: usage } = await admin
    .from('account_usage')
    .select('contacts_count, messages_sent')
    .eq('account_id', accountId)
    .eq('month', currentMonthKey)
    .maybeSingle()

  const current = resource === 'contacts' ? (usage?.contacts_count || 0) : (usage?.messages_sent || 0)

  if (current >= limit) {
    throw new QuotaExceededError(resource, current, limit)
  }

  return { allowed: true, current, limit }
}

/**
 * Returns a standardized 402 Payment Required response when quota is breached.
 */
export function quotaExceededResponse(err: QuotaExceededError): NextResponse {
  return NextResponse.json(
    {
      error: 'Quota Exceeded',
      message: err.message,
      resource: err.resource,
      current: err.current,
      limit: err.limit,
      upgrade_url: '/settings/billing',
    },
    { status: 402 }
  )
}
