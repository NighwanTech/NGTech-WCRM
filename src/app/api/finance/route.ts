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
      metrics: {
        totalInvoiced: 2124000,
        paymentsCollected: 1840000,
        outstandingCollections: 284000,
        overdueRisk: 0,
        cashFlowStatus: 'CASH FLOW HEALTHY',
        gstLiability: 324000
      },
      recentInvoices: [
        {
          id: 'inv-2026-991',
          invoice_number: 'INV-2026-991',
          client_name: 'Germopick Healthcare',
          amount: 2124000,
          status: 'Partial',
          created_at: new Date().toISOString()
        }
      ]
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
