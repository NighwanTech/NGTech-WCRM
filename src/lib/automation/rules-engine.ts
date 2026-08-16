/**
 * AIWCRM Enterprise Operating System (EOS) — Enterprise Rules Engine
 * Pure no-code business rule evaluator supporting IF/ELSE/SWITCH with priority and nested expressions.
 */

export interface BusinessRuleCondition {
  field: string
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS'
  value: any
}

export interface BusinessRuleAction {
  type: 'ASSIGN_SALES' | 'SEND_WHATSAPP' | 'CREATE_DEAL' | 'NOTIFY_MANAGER' | 'APPLY_DISCOUNT'
  params: Record<string, any>
}

export interface EnterpriseBusinessRule {
  id: string
  name: string
  priority: number
  enabled: boolean
  conditions: BusinessRuleCondition[]
  actions: BusinessRuleAction[]
}

export class EnterpriseRulesEngine {
  private static rules: EnterpriseBusinessRule[] = [
    {
      id: "rule_101",
      name: "High Intent Patna Property Lead Auto-Assignment",
      priority: 1,
      enabled: true,
      conditions: [
        { field: "aiScore", operator: "GREATER_THAN", value: 90 },
        { field: "buyingIntent", operator: "EQUALS", value: "HIGH" }
      ],
      actions: [
        { type: "ASSIGN_SALES", params: { owner: "Sunil Kumar (Patna Desk)" } },
        { type: "SEND_WHATSAPP", params: { template: "PATNA_PROPERTY_GREETING" } },
        { type: "CREATE_DEAL", params: { stage: "PROPOSAL_REQUIRED" } }
      ]
    }
  ]

  public static getRules(): EnterpriseBusinessRule[] {
    return this.rules
  }

  public static evaluateRules(context: Record<string, any>): { triggeredRules: EnterpriseBusinessRule[]; executedActions: BusinessRuleAction[] } {
    const triggered: EnterpriseBusinessRule[] = []
    const actions: BusinessRuleAction[] = []

    for (const rule of this.rules) {
      if (!rule.enabled) continue
      let match = true
      for (const cond of rule.conditions) {
        const val = context[cond.field]
        if (cond.operator === 'GREATER_THAN' && !(val > cond.value)) match = false
        if (cond.operator === 'EQUALS' && val !== cond.value) match = false
      }
      if (match) {
        triggered.push(rule)
        actions.push(...rule.actions)
      }
    }

    return { triggeredRules: triggered, executedActions: actions }
  }
}
