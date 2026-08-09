import { maskToken } from './token-manager'
import { decrypt, isEncrypted } from './crypto'

const FORBIDDEN_KEYS = new Set([
  'access_token',
  'refresh_token',
  'api_key',
  'secret',
  'key_hash',
  'token_hash',
  'password',
  'openai_api_key_encrypted',
  'gemini_api_key_encrypted',
  'claude_api_key_encrypted',
  'groq_api_key_encrypted',
  'deepseek_api_key_encrypted',
  'custom_api_key_encrypted',
])

/**
 * Deeply sanitizes any object or array before returning it as an API response.
 * Redacts or masks all secret keys, access tokens, and encrypted properties.
 */
export function sanitizeResponse<T>(data: T): T {
  if (data === null || data === undefined) return data

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeResponse(item)) as unknown as T
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      const lowerKey = key.toLowerCase()

      if (FORBIDDEN_KEYS.has(lowerKey) || lowerKey.endsWith('_encrypted') || lowerKey.endsWith('_secret')) {
        if (typeof value === 'string' && value) {
          sanitized[key + '_masked'] = maskToken(value)
        }
        // Exclude the raw sensitive key entirely from client payload
        continue
      }

      if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeResponse(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized as T
  }

  return data
}
