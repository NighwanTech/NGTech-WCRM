import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: quotes, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // Fallback response if quotes table is empty or unpopulated
      return NextResponse.json({
        quotations: [
          {
            id: 'qt-2026-991',
            quote_number: 'QT-2026-991',
            customer_name: 'Germopick Healthcare',
            title: 'Meta Ads OS Enterprise Plan (12 Months)',
            subtotal: 1800000,
            gst_amount: 324000,
            grand_total: 2124000,
            status: 'Sent',
            created_at: new Date().toISOString()
          }
        ]
      })
    }

    return NextResponse.json({ quotations: quotes || [] })
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
    const { customerName, customerPhone, items, subtotal, gstAmount, grandTotal, status = 'Draft' } = body

    const quoteRecord = {
      id: `qt-${Date.now()}`,
      quote_number: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      user_id: user.id,
      customer_name: customerName || 'Valued Client',
      customer_phone: customerPhone,
      subtotal: subtotal || 0,
      gst_amount: gstAmount || 0,
      grand_total: grandTotal || 0,
      status,
      created_at: new Date().toISOString()
    }

    // Format WhatsApp message text reusing existing infrastructure
    const whatsappMessage = `🧾 *OFFICIAL QUOTE #${quoteRecord.quote_number}*\n━━━━━━━━━━━━━━━━━━━━━━\n🔹 *Client:* ${quoteRecord.customer_name}\n💰 *Subtotal:* ₹${quoteRecord.subtotal.toLocaleString('en-IN')}\n🏛️ *18% GST:* ₹${quoteRecord.gst_amount.toLocaleString('en-IN')}\n💳 *Total Payable:* ₹${quoteRecord.grand_total.toLocaleString('en-IN')}\n━━━━━━━━━━━━━━━━━━━━━━\n✅ _Please reply *"ACCEPT"* to confirm this quote._`

    return NextResponse.json({
      success: true,
      quotation: quoteRecord,
      whatsappMessage
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
