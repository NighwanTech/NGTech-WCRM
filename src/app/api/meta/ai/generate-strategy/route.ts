import { NextResponse } from 'next/server'
import { generateAIAdStrategy } from '@/lib/meta/ai-ad-engine'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { businessName, businessType, location, goal } = body

    if (!businessName || !businessType) {
      return NextResponse.json({ error: 'businessName and businessType are required' }, { status: 400 })
    }

    const strategy = await generateAIAdStrategy({
      businessName,
      businessType,
      location: location || 'India',
      goal: goal || 'whatsapp',
    })

    return NextResponse.json({ success: true, strategy })
  } catch (error: any) {
    console.error('AI strategy API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
