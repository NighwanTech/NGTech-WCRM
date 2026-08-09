import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function GET(request: Request) {
  // We can't use withZeroTrustGuard directly on a redirect callback that may not have standard auth headers,
  // but if it's hit from frontend, it might. Usually callbacks from Meta go to the frontend, which then calls the POST /api/meta/auth.
  // We'll provide this as a placeholder if they decide to do server-side OAuth flow.
  
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // could contain accountId
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL(`/settings/integrations?error=${error}`, request.url))
  }

  if (code && state) {
    // Exchange code for token...
    // In many SPAs, FB login happens via SDK on client, which then sends short-lived token to POST /api/meta/auth.
    return NextResponse.redirect(new URL(`/settings/integrations?success=true`, request.url))
  }

  return NextResponse.redirect(new URL('/settings/integrations', request.url))
}
