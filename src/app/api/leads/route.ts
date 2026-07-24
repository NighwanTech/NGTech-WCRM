import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  // Lazy-init inside handler — env vars aren't available at build time on Vercel
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  try {
    const body = await req.json()
    
    // 1. Find the Platform Admin User (NGTech internal account)
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('user_id, account_id')
      .eq('is_platform_admin', true)
      .limit(1)
      .maybeSingle()
      
    if (adminError || !adminProfile) {
      console.error("Platform Admin not found:", adminError)
      // Do not crash, fallback to inserting without user_id/account_id if possible, or use a system fallback.
      // But actually, we MUST have an account_id for contacts.
      // Let's return 500 if we truly can't find it.
      return NextResponse.json({ error: 'System configuration error: Platform Admin missing' }, { status: 500 })
    }

    const adminUserId = adminProfile.user_id
    const adminAccountId = adminProfile.account_id

    const name = body.name || body.fullName || null
    const email = body.email || null
    const phone = body.phone || body.mobileNumber || null
    const company = body.company || body.companyName || null
    const volume = body.volume || body.messageVolume || null
    const teamSize = body.teamSize || null

    if (phone) {
      if (/[a-zA-Z]/.test(phone)) {
        return NextResponse.json({ error: 'Phone number cannot contain letters.' }, { status: 400 })
      }
      const digitsOnly = phone.replace(/\D/g, '')
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return NextResponse.json({ error: 'Phone number must have between 7 and 15 digits.' }, { status: 400 })
      }
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // 2. Insert Lead into CRM Contacts table
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: adminUserId, // Assign to NGTech Admin
        account_id: adminAccountId,
        name: name,
        email: email,
        phone: phone,
        company: company,
        industry: body.industry || null,
        team_size: teamSize,
        monthly_message_volume: volume,
        
        // UTMs & Tracking
        lead_source: body.leadSource || 'Website',
        landing_page_url: body.landingPageUrl || null,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
        utm_term: body.utm_term || null,
        utm_content: body.utm_content || null,
        
        // Let's add a default tag or note if we can't do it here easily, 
        // we'll just rely on the contact record.
      })
      .select()
      .single()

    if (error) {
      console.error("Failed to insert lead:", error)
      return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 })
    }

    // (Optional) Trigger an email to the sales team here using Resend/SendGrid
    
    return NextResponse.json({ success: true, lead: data }, { status: 201 })
    
  } catch (err: any) {
    console.error("API Error in Lead Capture:", err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
