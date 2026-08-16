import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      proposals: [
        {
          id: 'prop-1',
          proposal_number: 'PROP-2026-001',
          title: 'Enterprise CRM & WhatsApp Automation Proposal',
          client_name: 'Germopick Healthcare',
          status: 'Review',
          version: '1.2',
          contract_value: 2124000,
          created_at: new Date().toISOString()
        }
      ]
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, clientName, deliverables, executiveSummary } = body

    const newProposal = {
      id: `prop-${Date.now()}`,
      proposal_number: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
      user_id: user.id,
      title: title || 'New Enterprise Proposal',
      client_name: clientName || 'Client Workspace',
      status: 'Draft',
      version: '1.0',
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ success: true, proposal: newProposal })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
