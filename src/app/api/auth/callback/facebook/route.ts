import { NextResponse } from 'next/server'

function getBaseUrl(request: Request): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  if (host && !host.includes('localhost')) {
    return `${proto}://${host}`
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }
  return new URL(request.url).origin
}

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request)
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${baseUrl}/meta-ads/settings?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    return NextResponse.redirect(`${baseUrl}/meta-ads/settings?code=${encodeURIComponent(code)}&success=true`)
  }

  return NextResponse.redirect(`${baseUrl}/meta-ads/settings`)
}
