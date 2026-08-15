export interface SystemToolContract<TPayload = any, TResult = any> {
  id: string
  name: string
  description: string
  version: string
  category: 'Campaign' | 'Analytics' | 'Simulation' | 'Approval' | 'Rollback' | 'CRM' | 'WhatsApp' | 'Provider' | 'Health' | 'Knowledge' | 'Administration'
  permissions: string[]
  requiresApproval: boolean
  supportsRollback: boolean
  supportsSimulation: boolean
  idempotent: boolean
  validate(payload: TPayload): Promise<{ valid: boolean; error?: string }>
  simulate?(payload: TPayload): Promise<any>
  execute(context: { accountId: string; userId: string; payload: TPayload }): Promise<TResult>
}
