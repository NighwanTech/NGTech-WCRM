import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user: any = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (e) {
    // If Supabase fetch times out or fails, fall back to checking if auth cookie is present
    const authCookie = request.cookies.getAll().find(c => c.name.includes('-auth-token'))
    if (authCookie) {
      user = { id: 'session_present' }
    }
  }

  const withCookies = <T extends NextResponse>(response: T): T => {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie)
    })
    return response
  }

  // Auth pages - redirect to dashboard if already logged in
  if (user && (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password'
  )) {
    const url = request.nextUrl.clone()
    const inviteToken = request.nextUrl.searchParams.get('invite')
    if (
      inviteToken &&
      (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')
    ) {
      url.pathname = `/join/${encodeURIComponent(inviteToken)}`
      url.search = ''
    } else {
      url.pathname = '/dashboard'
      url.search = ''
    }
    return withCookies(NextResponse.redirect(url))
  }

  // Protected pages - redirect to login if not authenticated
  const protectedPaths = ['/dashboard', '/inbox', '/contacts', '/pipelines', '/broadcasts', '/automations', '/settings']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return withCookies(NextResponse.redirect(url))
  }

  // Suspended Account Check (only when user is logged in on protected pages)
  if (user && isProtectedPath) {
    try {
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } },
      )
      const { data: profile } = await adminClient
        .from('profiles')
        .select('account_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (profile?.account_id) {
        const { data: account } = await adminClient
          .from('accounts')
          .select('status')
          .eq('id', profile.account_id)
          .maybeSingle()

        if (account?.status === 'suspended') {
          const url = request.nextUrl.clone()
          url.pathname = '/suspended'
          return withCookies(NextResponse.redirect(url))
        }
      }
    } catch (e) {
      console.error('[middleware] suspension check failed:', e)
    }
  }

  // /admin routes — must be authenticated AND is_platform_admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return withCookies(NextResponse.redirect(url))
    }

    try {
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } },
      )
      const { data: profile } = await adminClient
        .from('profiles')
        .select('is_platform_admin')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!profile?.is_platform_admin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin-forbidden'
        return withCookies(NextResponse.redirect(url))
      }
    } catch {
      return withCookies(
        NextResponse.json({ error: 'Admin check failed' }, { status: 500 })
      )
    }
  }

  // API routes that need auth (not webhooks)
  if (!user && request.nextUrl.pathname.startsWith('/api/whatsapp/') &&
      !request.nextUrl.pathname.includes('/webhook')) {
    return withCookies(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    )
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
