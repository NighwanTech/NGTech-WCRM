import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.META_APP_SECRET || 'fallback-secure-key-aiwcrm-32-chars!'
const ALGORITHM = 'aes-256-cbc'

/**
 * Encrypt a plain token string for secure database storage.
 */
export function encryptToken(text: string): string {
  if (!text) return text
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

/**
 * Decrypt an encrypted token string.
 */
export function decryptToken(text: string): string {
  if (!text) return text
  if (!text.includes(':')) return text // Return plain if unencrypted legacy

  try {
    const [ivHex, encryptedText] = text.split(':')
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt token:', error)
    return text
  }
}

/**
 * Exchanges a short-lived Meta user token for a 60-day long-lived access token.
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{
  accessToken: string
  expiresIn?: number
}> {
  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const apiVersion = process.env.META_API_VERSION || 'v20.0'

  if (!appId || !appSecret) {
    throw new Error('META_APP_ID and META_APP_SECRET environment variables are required.')
  }

  const url = `https://graph.facebook.com/${apiVersion}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`

  const response = await fetch(url)
  const data = await response.json()

  if (data.error) {
    throw new Error(`Meta token exchange failed: ${data.error.message}`)
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in, // in seconds (approx 60 days)
  }
}
