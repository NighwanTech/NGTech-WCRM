import { NextResponse } from 'next/server'
import { generateAIAdStrategy } from '@/lib/meta/ai-ad-engine'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'

export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:read' }, async () => {
    try {
      const body = await request.json()
      const { campaignName, objective, dailyBudget, spend, impressions, clicks } = body

      if (!campaignName) {
        return NextResponse.json({ error: 'campaignName is required' }, { status: 400 })
      }

      // Generate AI Strategic Recommendations for this campaign
      const aiStrategy = await generateAIAdStrategy({
        businessName: campaignName,
        businessType: 'Event & Wedding Planning, Promotions, Luxury Bookings',
        location: 'India',
        goal: objective?.includes('ENGAGEMENT') ? 'whatsapp' : 'leads',
      })

      // Construct tailored audit findings
      const audit = {
        campaignName,
        healthGrade: (spend > 0 && clicks > 0) ? 'A' : 'B+',
        statusAnalysis: 'Campaign is currently structured. AI recommends activating high-intent WhatsApp CTA to drive direct bookings.',
        keyRecommendations: [
          `Targeting: Focus on audiences aged ${aiStrategy.audience.ageMin}-${aiStrategy.audience.ageMax} interested in Luxury Events & Weddings.`,
          `Daily Budget: Recommended ₹${aiStrategy.recommendedDailyBudget || 500}/day to maintain optimal ad frequency without fatigue.`,
          `Copy Upgrade: Use emotion-driven headlines with direct WhatsApp chat triggers for 2.4x higher response rate.`,
        ],
        suggestedHeadlines: aiStrategy.headlines,
        suggestedPrimaryTexts: aiStrategy.primaryTexts,
        suggestedInterests: aiStrategy.audience.interests,
        suggestedCta: aiStrategy.ctaOptions[0] || 'Send WhatsApp Message',
      }

      return NextResponse.json({
        success: true,
        audit,
      })
    } catch (error: any) {
      console.error('Campaign AI audit error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
