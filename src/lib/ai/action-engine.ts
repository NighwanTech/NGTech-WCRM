/**
 * AIWCRM Enterprise Revenue OS — AI Action Engine
 * Generates, prioritizes, and executes Next Best Actions for Revenue OS.
 */

export interface NextBestActionItem {
  id: string
  actionType: 'SEND_WHATSAPP' | 'CREATE_QUOTE' | 'ASSIGN_SALES' | 'BOOK_MEETING' | 'ESCALATE_OWNER'
  title: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  requiresApproval: boolean
  payload: Record<string, any>
}

export class AIActionEngine {
  /**
   * Determine Next Best Actions for a Lead
   */
  public static evaluateActions(params: {
    leadScore: number
    buyingIntent: string
    estimatedRevenue: number
    contactName: string
  }): NextBestActionItem[] {
    const { leadScore, estimatedRevenue, contactName } = params
    const actions: NextBestActionItem[] = []

    if (leadScore >= 90) {
      actions.push({
        id: `act_${Date.now()}_1`,
        actionType: 'CREATE_QUOTE',
        title: 'Generate Formal Quotation',
        description: `High purchase intent lead (₹${estimatedRevenue.toLocaleString()}). Generate quote with 10% discount.`,
        priority: 'HIGH',
        requiresApproval: false,
        payload: { discountPct: 10, estimatedRevenue }
      })
      actions.push({
        id: `act_${Date.now()}_2`,
        actionType: 'ASSIGN_SALES',
        title: 'Assign to Senior Sales Rep',
        description: `Auto-route ${contactName} to Senior Enterprise Sales Team.`,
        priority: 'HIGH',
        requiresApproval: false,
        payload: { team: 'Enterprise Sales' }
      })
    } else {
      actions.push({
        id: `act_${Date.now()}_3`,
        actionType: 'SEND_WHATSAPP',
        title: 'Send Automated WhatsApp Catalog',
        description: `Send product brochure and active offers via WhatsApp AI.`,
        priority: 'MEDIUM',
        requiresApproval: false,
        payload: { template: 'product_catalog_intro' }
      })
    }

    return actions
  }
}
