import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  try {
    let email: string;
    
    // Support both FormData (from standard HTML form submit) and JSON
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      email = formData.get('email') as string;
    } else {
      const body = await req.json();
      email = body.email;
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1. Find the Platform Admin User
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('user_id, account_id')
      .eq('is_platform_admin', true)
      .limit(1)
      .maybeSingle()
      
    if (adminError || !adminProfile) {
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 })
    }

    // Generate a dummy phone number for newsletter subs since phone is usually required
    // or just leave it null if contacts table allows null phone. Wait, contact phone might be unique per account.
    // So we'll try to insert phone as email, or just null. Let's use null. If it fails, we handle it.
    
    // We will save newsletter subscribers into leads with lead_source = 'Newsletter'
    const { error } = await supabase
      .from('leads')
      .insert({
        email: email,
        name: email.split('@')[0],
        lead_source: 'Newsletter',
        status: 'new'
      })

    if (error) {
      // If duplicate (23505), just return success anyway so we don't leak info or break flow
      if (error.code === '23505') {
        return NextResponse.redirect(new URL('/?newsletter=success', req.url))
      }
      console.error("Newsletter error:", error)
      return NextResponse.redirect(new URL('/?newsletter=error', req.url))
    }

    return NextResponse.redirect(new URL('/?newsletter=success', req.url))
    
  } catch (err: any) {
    console.error("API Error in Newsletter Capture:", err)
    return NextResponse.redirect(new URL('/?newsletter=error', req.url))
  }
}
