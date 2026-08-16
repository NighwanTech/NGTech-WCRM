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
      collections: [
        {
          id: 'inv-1',
          invoiceNumber: 'INV-2026-881',
          clientName: 'Germopick Healthcare',
          clientPhone: '+91 9876543210',
          amount: 284000,
          dueDate: '2026-08-25',
          agingBucket: '0-30 days',
          status: 'Sent',
          lastReminderSent: '2 days ago'
        },
        {
          id: 'inv-2',
          invoiceNumber: 'INV-2026-754',
          clientName: 'TechSolutions Pvt Ltd',
          clientPhone: '+91 9123456789',
          amount: 150000,
          dueDate: '2026-08-01',
          agingBucket: '31-60 days',
          status: 'Overdue',
          lastReminderSent: 'Yesterday'
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
    const { collectionId, reminderType = 'whatsapp' } = body

    return NextResponse.json({
      success: true,
      message: `Payment reminder sent via ${reminderType.toUpperCase()} for collection record ${collectionId}.`
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
