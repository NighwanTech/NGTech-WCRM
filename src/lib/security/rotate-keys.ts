import { encrypt, decrypt, isEncrypted } from './crypto'
import { getAdminClient } from '@/lib/admin-supabase'

/**
 * Secret Rotation Utility.
 * Re-encrypts stored ciphertext records to use the latest key version.
 */
export async function reencryptAccountSecrets(accountId: string): Promise<{ success: boolean; count: number }> {
  try {
    const admin = getAdminClient()
    let count = 0

    // Re-encrypt whatsapp_config
    const { data: configs } = await admin
      .from('whatsapp_config')
      .select('id, access_token, app_secret')
      .eq('account_id', accountId)

    if (configs) {
      for (const cfg of configs) {
        let updated = false
        const updates: Record<string, any> = {}

        if (cfg.access_token && isEncrypted(cfg.access_token)) {
          const raw = decrypt(cfg.access_token)
          updates.access_token = encrypt(raw) // Encrypts with current active key
          updated = true
        }

        if (cfg.app_secret && isEncrypted(cfg.app_secret)) {
          const raw = decrypt(cfg.app_secret)
          updates.app_secret = encrypt(raw)
          updated = true
        }

        if (updated) {
          updates.encryption_key_version = 1
          await admin.from('whatsapp_config').update(updates).eq('id', cfg.id)
          count++
        }
      }
    }

    return { success: true, count }
  } catch (err) {
    console.error('[rotate-keys] Key rotation failed:', err)
    return { success: false, count: 0 }
  }
}
