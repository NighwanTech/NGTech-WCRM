import { NextResponse } from 'next/server'

const DEFAULT_ALLOWED_ORIGINS = [
  'https://aiwcrm.com',
  'https://www.aiwcrm.com',
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[]

/**
 * Enterprise Dynamic CORS Origin Validator.
 */
export function getCorsHeaders(requestOrigin: string | null, customAllowedOrigins: string[] = []): Record<string, string> {
  const allowed = [...DEFAULT_ALLOWED_ORIGINS, ...customAllowedOrigins]

  const isAllowed = requestOrigin && allowed.some((o) => o === requestOrigin || requestOrigin.endsWith('.aiwcrm.com'))
  const allowOriginValue = isAllowed ? requestOrigin! : DEFAULT_ALLOWED_ORIGINS[0] || '*'

  return {
    'Access-Control-Allow-Origin': allowOriginValue,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-API-Key',
    'Access-Control-Max-Age': '86400',
  }
}

export function handleCorsPreflight(request: Request, customOrigins: string[] = []): NextResponse {
  const origin = request.headers.get('origin')
  const headers = getCorsHeaders(origin, customOrigins)
  return new NextResponse(null, { status: 204, headers })
}
