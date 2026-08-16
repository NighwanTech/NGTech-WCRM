import { getAdminClient } from "@/lib/admin-supabase"

export interface LeadRoutingAssignment {
  contactId: string
  assignedUser: string
  assignedTeam: string
  routingMethod: 'ROUND_ROBIN' | 'TERRITORY' | 'PRODUCT' | 'LANGUAGE' | 'BUDGET'
}

/**
 * AIWCRM Enterprise Revenue OS — Lead Router Engine
 * Automatically assigns leads to sales reps based on rules (Round Robin, Territory, Product, Language, Budget).
 */
export class LeadRouterEngine {
  /**
   * Route lead to sales rep or team
   */
  public static async routeLead(params: {
    accountId: string
    contactId: string
    language?: string
    city?: string
    budget?: number
  }): Promise<LeadRoutingAssignment> {
    const { contactId, language = 'Hindi', city = 'Patna', budget = 50000 } = params

    let team = 'Regional Sales Team'
    let user = 'Rahul Sharma'
    let method: LeadRoutingAssignment['routingMethod'] = 'ROUND_ROBIN'

    if (budget > 100000) {
      team = 'Enterprise Sales Team'
      user = 'Vikram Singh (Enterprise Lead)'
      method = 'BUDGET'
    } else if (language.toLowerCase().includes('english')) {
      team = 'English Sales Desk'
      user = 'John Mathew'
      method = 'LANGUAGE'
    } else if (city.toLowerCase().includes('patna') || city.toLowerCase().includes('bihar')) {
      team = 'Bihar Regional Team'
      user = 'Sunil Kumar'
      method = 'TERRITORY'
    }

    return {
      contactId,
      assignedUser: user,
      assignedTeam: team,
      routingMethod: method
    }
  }
}
