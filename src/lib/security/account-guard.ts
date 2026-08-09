import { getAdminClient } from '@/lib/admin-supabase'
import { NextResponse } from 'next/server'

export class AccountSuspendedError extends Error {
  constructor(message: string = 'Workspace is suspended or inactive') {
    super(message)
    this.name = 'AccountSuspendedError'
  }
}

/**
 * Checks whether an account is active.
 * Throws AccountSuspendedError or returns an error Response if suspended/cancelled.
 */
export async function requireActiveAccount(userId: string): Promise<string> {
  const admin = getAdminClient()

  const { data: profile, error } = await admin
    .from('profiles')
    .select('account_id, accounts(status, plan)')
    .eq('user_id', userId)
    .single()

  if (error || !profile?.account_id) {
    throw new AccountSuspendedError('User profile or workspace account not found')
  }

  const accountStatus = (profile.accounts as any)?.status || 'active'

  if (accountStatus === 'suspended') {
    throw new AccountSuspendedError('Your account has been suspended by an administrator.')
  }

  if (accountStatus === 'cancelled') {
    throw new AccountSuspendedError('Your account subscription has been cancelled.')
  }

  return profile.account_id
}

/**
 * Returns a standardized 403 Response for suspended accounts.
 */
export function accountSuspendedResponse(message: string): NextResponse {
  return NextResponse.json(
    {
      error: 'Account Suspended',
      message,
      code: 'ACCOUNT_SUSPENDED',
    },
    { status: 403 }
  )
}
