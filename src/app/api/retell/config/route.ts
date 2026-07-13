import { NextResponse } from 'next/server'
import { requireRole, toErrorResponse } from '@/lib/auth/account'
import { getAdminClient } from '@/lib/admin-supabase'
import { encrypt } from '@/lib/whatsapp/encryption'

export async function GET() {
  try {
    const ctx = await requireRole('admin')
    // Database types have not yet been regenerated for the Retell tables.
    const admin = getAdminClient() as any
    const { data, error } = await admin
      .from('retell_config')
      .select('agent_id, from_number, api_key')
      .eq('account_id', ctx.accountId)
      .maybeSingle()
    if (error) throw error
    return NextResponse.json({
      config: data
        ? { agent_id: data.agent_id ?? '', from_number: data.from_number ?? '', has_api_key: Boolean(data.api_key) }
        : { agent_id: '', from_number: '', has_api_key: false },
    })
  } catch (err) {
    return toErrorResponse(err)
  }
}

export async function PUT(request: Request) {
  try {
    const ctx = await requireRole('admin')
    const body = await request.json().catch(() => null)
    if (!body || typeof body.agent_id !== 'string' || typeof body.from_number !== 'string') {
      return NextResponse.json({ error: 'agent_id and from_number are required' }, { status: 400 })
    }
    if (body.api_key !== undefined && (typeof body.api_key !== 'string' || !body.api_key.trim())) {
      return NextResponse.json({ error: 'api_key must be a non-empty string when provided' }, { status: 400 })
    }

    const update: Record<string, string> = {
      agent_id: body.agent_id.trim(),
      from_number: body.from_number.trim(),
    }
    if (body.api_key !== undefined) update.api_key = encrypt(body.api_key.trim())

    const admin = getAdminClient() as any
    const { data: existing, error: lookupError } = await admin
      .from('retell_config').select('id').eq('account_id', ctx.accountId).maybeSingle()
    if (lookupError) throw lookupError
    if (!existing && !update.api_key) {
      return NextResponse.json({ error: 'api_key is required when creating a configuration' }, { status: 400 })
    }
    const result = existing
      ? await admin.from('retell_config').update(update).eq('id', existing.id)
      : await admin.from('retell_config').insert({ account_id: ctx.accountId, ...update })
    if (result.error) throw result.error
    return NextResponse.json({ ok: true })
  } catch (err) {
    return toErrorResponse(err)
  }
}
