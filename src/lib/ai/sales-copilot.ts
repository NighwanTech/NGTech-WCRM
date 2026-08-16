/**
 * AIWCRM Enterprise Revenue OS — AI Sales Copilot Engine
 * Provides real-time AI assistance for human sales reps (Suggested Replies, Quote Generation, Win Probability, Negotiation Tips).
 */

export interface SalesCopilotSuggestion {
  suggestedReply: string
  recommendedDiscount: number
  predictedWinProbability: number
  negotiationTips: string[]
  recommendedNextStep: string
}

export class AISalesCopilot {
  /**
   * Generate Sales Assistance Suggestions for a Contact
   */
  public static generateAssistance(params: {
    customerName: string
    leadScore: number
    lastMessage?: string
    productInterest?: string
  }): SalesCopilotSuggestion {
    const { customerName, leadScore, lastMessage = '', productInterest = 'Services' } = params

    const isHighValue = leadScore >= 88

    return {
      suggestedReply: `Hello ${customerName} 👋 Thank you for contacting us regarding ${productInterest}. We have verified pricing and active discounts available today. May I schedule a 5-minute call or send our complete catalog on WhatsApp?`,
      recommendedDiscount: isHighValue ? 10 : 5,
      predictedWinProbability: Math.round(leadScore * 0.92),
      negotiationTips: [
        `Highlight instant WhatsApp support and verified local service delivery in Patna/Bihar.`,
        `Offer 10% instant discount code if site visit or consultation is booked today.`
      ],
      recommendedNextStep: `Generate formal PDF quotation & assign to ${isHighValue ? 'Senior Enterprise Sales' : 'Regional Sales Team'}`
    }
  }
}
