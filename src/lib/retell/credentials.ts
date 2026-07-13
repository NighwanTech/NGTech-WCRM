import { decrypt } from '@/lib/whatsapp/encryption'

/**
 * Existing installations stored Retell keys as plaintext. Keep them working
 * while the settings API rewrites them as authenticated ciphertext.
 */
export function decryptRetellApiKey(value: string): string {
  return value.split(':').length >= 2 ? decrypt(value) : value
}
