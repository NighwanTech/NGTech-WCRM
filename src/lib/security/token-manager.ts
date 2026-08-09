import { encrypt, decrypt, isEncrypted } from './crypto'

export interface MaskedTokenInfo {
  connected: boolean
  masked?: string
  expiresAt?: string
  keyVersion?: number
}

/**
 * Mask sensitive tokens for safe client responses.
 * Never returns full token to frontend.
 *
 * Example: `EAAG...1234` -> `EAAG••••1234`
 */
export function maskToken(token: string | null | undefined): string | undefined {
  if (!token) return undefined
  const raw = isEncrypted(token) ? decrypt(token) : token
  if (raw.length <= 8) return '••••' + raw.slice(-2)
  return raw.slice(0, 4) + '••••' + raw.slice(-4)
}

/**
 * Prepare token for DB storage by ensuring it is AES-256-GCM encrypted.
 */
export function prepareTokenForStorage(token: string | null | undefined): string | null {
  if (!token) return null
  if (isEncrypted(token)) return token
  return encrypt(token)
}

/**
 * Read and decrypt token safely for server-side external API execution only.
 */
export function getDecryptedToken(storedToken: string | null | undefined): string | null {
  if (!storedToken) return null
  if (!isEncrypted(storedToken)) return storedToken // Legacy fallback
  return decrypt(storedToken)
}

/**
 * Create a client-safe status object for tokens.
 */
export function getSafeTokenStatus(
  storedToken: string | null | undefined,
  expiresAt?: string | Date | null
): MaskedTokenInfo {
  if (!storedToken) {
    return { connected: false }
  }

  const decrypted = getDecryptedToken(storedToken)
  const isExpired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false

  return {
    connected: !isExpired && !!decrypted,
    masked: maskToken(decrypted),
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
  }
}
