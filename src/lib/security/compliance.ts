import { getAdminClient } from '@/lib/admin-supabase'
import { logAudit } from './audit'

/**
 * Exports complete tenant user data archive (GDPR Right to Data Portability).
 */
export async function exportUserData(accountId: string, userId: string): Promise<Record<string, any>> {
  const admin = getAdminClient()

  const { data: profile } = await admin.from('profiles').select('*').eq('user_id', userId).single()
  const { data: contacts } = await admin.from('contacts').select('*').eq('account_id', accountId)
  const { data: conversations } = await admin.from('conversations').select('*').eq('account_id', accountId)

  await logAudit({
    action: 'compliance.gdpr_export',
    accountId,
    userId,
    severity: 'high',
  })

  return {
    exportedAt: new Date().toISOString(),
    account_id: accountId,
    profile,
    contacts_count: contacts?.length || 0,
    contacts,
    conversations_count: conversations?.length || 0,
    conversations,
  }
}

/**
 * Anonymizes user data (GDPR Right to be Forgotten).
 */
export async function anonymizeUserData(accountId: string, userId: string): Promise<void> {
  const admin = getAdminClient()

  // Anonymize profile
  await admin
    .from('profiles')
    .update({
      full_name: 'Anonymized User',
      email: `anonymized_${Date.now()}@privacy.local`,
      avatar_url: null,
    })
    .eq('user_id', userId)

  await logAudit({
    action: 'compliance.gdpr_anonymize',
    accountId,
    userId,
    severity: 'critical',
  })
}
