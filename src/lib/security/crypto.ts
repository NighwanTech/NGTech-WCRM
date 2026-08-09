import crypto from 'node:crypto'

/**
 * AES-256-GCM Encryption Engine with Key Versioning & Automatic Key Rotation Support.
 *
 * Format of encrypted ciphertext string:
 * `v{keyVersion}:{iv_hex}:{authTag_hex}:{ciphertext_hex}`
 *
 * Example: `v1:a1b2c3d4...:e5f6...:9012...`
 *
 * Rotation Strategy:
 * - Current key is defined by `ENCRYPTION_KEY` (or `ENCRYPTION_KEY_V1`).
 * - Historical keys can be specified as `ENCRYPTION_KEY_V2`, `ENCRYPTION_KEY_V3`, etc.
 * - `decrypt()` parses the `v{version}` prefix and uses the corresponding key version.
 * - `encrypt()` ALWAYS encrypts using the active primary key version (`CURRENT_KEY_VERSION`).
 */

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // Standard 96-bit IV for GCM
const CURRENT_KEY_VERSION = 1

function getKeyForVersion(version: number): Buffer {
  const envVarName = version === 1 ? 'ENCRYPTION_KEY' : `ENCRYPTION_KEY_V${version}`
  let keyHex = process.env[envVarName]

  // Fallback to ENCRYPTION_KEY_V1 if ENCRYPTION_KEY is missing for version 1
  if (!keyHex && version === 1) {
    keyHex = process.env.ENCRYPTION_KEY_V1
  }

  // Fallback for development if env is not configured (produces warning)
  if (!keyHex) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[security/crypto] Missing required environment variable ${envVarName}`)
    }
    // Fallback 32-byte key for local dev ONLY
    keyHex = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  }

  const keyBuffer = Buffer.from(keyHex, 'hex')
  if (keyBuffer.length !== 32) {
    throw new Error(`[security/crypto] ${envVarName} must be a 64-character hex string (32 bytes). Got ${keyBuffer.length} bytes.`)
  }

  return keyBuffer
}

/**
 * Encrypt a plaintext string using AES-256-GCM and tag with current key version.
 */
export function encrypt(plaintext: string, keyVersion: number = CURRENT_KEY_VERSION): string {
  if (!plaintext) return ''

  const key = getKeyForVersion(keyVersion)
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag().toString('hex')
  const ivHex = iv.toString('hex')

  return `v${keyVersion}:${ivHex}:${authTag}:${encrypted}`
}

/**
 * Decrypt a version-tagged AES-256-GCM ciphertext. Automatically detects key version.
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ''

  // If text is not encrypted (legacy or unencrypted fallback), return as is
  if (!ciphertext.startsWith('v') || !ciphertext.includes(':')) {
    return ciphertext
  }

  const parts = ciphertext.split(':')
  if (parts.length !== 4) {
    throw new Error('[security/crypto] Invalid ciphertext format. Expected v{N}:{iv}:{authTag}:{data}')
  }

  const [versionPrefix, ivHex, authTagHex, encryptedData] = parts
  const version = parseInt(versionPrefix.slice(1), 10)

  if (isNaN(version)) {
    throw new Error('[security/crypto] Invalid key version in ciphertext')
  }

  const key = getKeyForVersion(version)
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Helper to check if a string is encrypted with version prefix
 */
export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && /^v\d+:[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/i.test(value)
}

/**
 * Generates a cryptographically secure random hexadecimal token.
 */
export function generateSecureToken(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString('hex')
}
