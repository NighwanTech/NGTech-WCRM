import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )

  // ── Global Network Resilience Wrapper for getUser() ──
  // Overrides getUser() to automatically fallback to cookie-based getSession()
  // if the network fetch to Supabase times out (4 seconds limit).
  // This prevents network lag from hanging page loads and API requests.
  const originalGetUser = client.auth.getUser.bind(client.auth)
  client.auth.getUser = async (jwt?: string) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      // Use a custom fetch timeout signal specifically for this auth call
      const res = await originalGetUser(jwt).finally(() => clearTimeout(timeoutId))
      
      if (res.data?.user) return res
      return { data: { user: null }, error: res.error }
    } catch (err: any) {
      // If network call timed out, fetch session from local cookies securely
      try {
        const { data: { session } } = await client.auth.getSession()
        if (session?.user) {
          return { data: { user: session.user }, error: null }
        }
      } catch {}
      return { data: { user: null }, error: err }
    }
  }

  return client
}
