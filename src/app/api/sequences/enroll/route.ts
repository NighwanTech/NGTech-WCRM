import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/admin-supabase'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user account_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle()

    const accountId = profile?.account_id
    if (!accountId) {
      return NextResponse.json({ error: 'Profile not linked to an account.' }, { status: 403 })
    }

    const { sequenceId, contactIds } = await request.json()

    if (!sequenceId || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json({ error: 'Sequence ID and target contact IDs are required.' }, { status: 400 })
    }

    const admin = getAdminClient()

    // 1. Strict Tenant Verification: Verify sequence belongs to this user's account_id
    const { data: targetSequence, error: seqErr } = await (admin as any)
      .from('sequences')
      .select('id')
      .eq('id', sequenceId)
      .eq('account_id', accountId)
      .maybeSingle()

    if (seqErr || !targetSequence) {
      return NextResponse.json({ error: 'Unauthorized: Sequence not found in your workspace.' }, { status: 403 })
    }

    // 2. Strict Tenant Verification: Verify target contacts belong to this user's account_id
    const { data: validContacts, error: contactCheckErr } = await (admin as any)
      .from('contacts')
      .select('id')
      .eq('account_id', accountId)
      .in('id', contactIds)

    if (contactCheckErr || !validContacts || validContacts.length === 0) {
      return NextResponse.json({ error: 'Unauthorized: None of the target contacts belong to your workspace.' }, { status: 403 })
    }

    const verifiedContactIds = validContacts.map((c: any) => c.id)

    // 3. Prepare enrollments for verified contacts ONLY
    const enrollments = verifiedContactIds.map((cId: string) => ({
      sequence_id: sequenceId,
      contact_id: cId,
      status: 'active',
      current_step: 1,
      next_run_at: new Date().toISOString(),
    }))

    // 4. Upsert enrollments using Admin Client
    const { data, error } = await (admin as any)
      .from('sequence_enrollments')
      .upsert(enrollments, { onConflict: 'sequence_id,contact_id' })
      .select('*, contact:contacts(name, phone)')

    if (error) {
      console.error('[Sequence Enrollment Error]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: verifiedContactIds.length, data })
  } catch (err: any) {
    console.error('[Sequence Enrollment Exception]', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
