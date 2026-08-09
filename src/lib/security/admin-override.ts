import { getAdminClient } from '@/lib/admin-supabase'
import { logAudit } from './audit'
import { NextResponse } from 'next/server'

/**
 * Executes a platform super-admin operation safely with auditing.
 * Verifies `profiles.is_platform_admin = true` before allowing execution.
 */
export async function withPlatformAdminOverride(
  userId: string,
  targetAccountId: string,
  action: string,
  request: Request,
  operation: (adminClient: ReturnType<typeof getAdminClient>) => Promise<NextResponse | Response>
): Promise<NextResponse | Response> {
  const admin = getAdminClient()

  // 1. Verify Platform Admin status
  const { data: profile } = await admin
    .from('profiles')
    .select('is_platform_admin, email')
    .eq('user_id', userId)
    .single()

  if (!profile?.is_platform_admin) {
    await logAudit({
      action: 'unauthorized_admin_override_attempt',
      userId,
      accountId: targetAccountId,
      severity: 'critical',
      request,
    })

    return NextResponse.json(
      { error: 'Forbidden: Platform Super-Admin privilege required' },
      { status: 403 }
    )
  }

  // 2. Audit the override action with CRITICAL severity
  await logAudit({
    action: `platform_admin_override.${action}`,
    userId,
    accountId: targetAccountId,
    severity: 'critical',
    request,
    metadata: { adminEmail: profile.email, targetAccountId },
  })

  // 3. Perform operation using service-role client
  return operation(admin)
}
