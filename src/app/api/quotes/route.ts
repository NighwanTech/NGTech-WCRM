import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contact_id, conversation_id, description, amount, currency = 'USD', valid_until } = body

    if (!contact_id || !description || amount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Insert Quote into Database
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        user_id: user.id,
        contact_id,
        description,
        amount,
        currency,
        valid_until,
        status: 'pending'
      })
      .select()
      .single()

    if (quoteError) throw quoteError

    // 2. Generate WhatsApp formatted message
    const formattedDate = valid_until 
      ? new Date(valid_until).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) 
      : 'No Expiry'
      
    const amountFormatted = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(amount)

    const messageText = `🧾 *OFFICIAL QUOTE* 🧾\n━━━━━━━━━━━━━━━━━━━━━━\n🔹 *Service:* ${description}\n💰 *Total Amount:* ${amountFormatted}\n⏳ *Valid Until:* ${formattedDate}\n━━━━━━━━━━━━━━━━━━━━━━\n✅ _Please reply with *"ACCEPT"* to proceed with this quote._`

    // 3. Send WhatsApp Message (internal call to our send endpoint)
    // Note: In a real app we'd construct a full fetch to our own absolute URL, or import the send logic directly.
    // For simplicity, we just return the formatted message and let the client hit the `/api/whatsapp/send` endpoint.

    return NextResponse.json({ success: true, quote, messageText })
  } catch (error: any) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
