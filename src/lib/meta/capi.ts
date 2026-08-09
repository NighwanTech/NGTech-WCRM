import crypto from 'crypto'

const META_API_VERSION = process.env.META_API_VERSION || 'v20.0'

export interface CAPIEventOptions {
  pixelId: string
  accessToken: string
  eventName: 'Lead' | 'QualifiedLead' | 'Purchase' | 'Schedule' | 'Contact'
  eventSourceUrl?: string
  userData: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    clientIpAddress?: string
    clientUserAgent?: string
  }
  customData?: {
    currency?: string
    value?: number
    content_name?: string
    status?: string
  }
}

/**
 * SHA-256 hash helper for CAPI user parameters
 */
function hashSHA256(value: string | undefined): string | undefined {
  if (!value) return undefined
  const normalized = value.trim().toLowerCase()
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

/**
 * Send an offline conversion event to Meta Conversions API (CAPI)
 */
export async function sendCAPIEvent(options: CAPIEventOptions): Promise<{ success: boolean; data?: any }> {
  const { pixelId, accessToken, eventName, userData, customData, eventSourceUrl } = options

  if (!pixelId || !accessToken) {
    console.warn('CAPI skipped: Pixel ID or Access Token missing.')
    return { success: false }
  }

  const url = `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${accessToken}`

  // Normalize phone number (strip spaces/symbols)
  const normalizedPhone = userData.phone ? userData.phone.replace(/\D/g, '') : undefined

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'system_generated',
        event_source_url: eventSourceUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://aiwcrm.com',
        user_data: {
          em: userData.email ? [hashSHA256(userData.email)] : undefined,
          ph: normalizedPhone ? [hashSHA256(normalizedPhone)] : undefined,
          fn: userData.firstName ? [hashSHA256(userData.firstName)] : undefined,
          ln: userData.lastName ? [hashSHA256(userData.lastName)] : undefined,
          client_ip_address: userData.clientIpAddress,
          client_user_agent: userData.clientUserAgent,
        },
        custom_data: customData,
      },
    ],
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const responseData = await res.json()

    if (responseData.error) {
      console.error('CAPI Error:', responseData.error)
      return { success: false, data: responseData.error }
    }

    return { success: true, data: responseData }
  } catch (err) {
    console.error('CAPI Exception:', err)
    return { success: false }
  }
}
