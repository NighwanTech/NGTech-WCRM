/**
 * AIWCRM Enterprise Revenue OS — Enterprise RBAC Permission Manager
 * Manages 9 Roles and 7 Granular Permission Scopes.
 */

export type EnterpriseRole =
  | 'ORG_ADMIN'
  | 'MARKETING_DIRECTOR'
  | 'SALES_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'SUPPORT'
  | 'FINANCE'
  | 'READ_ONLY'
  | 'AGENCY'
  | 'CLIENT'

export type EnterprisePermission =
  | 'CAN_PUBLISH'
  | 'CAN_RUN_AI'
  | 'CAN_APPROVE'
  | 'CAN_EXPORT'
  | 'CAN_DELETE'
  | 'CAN_TRAIN_AI'
  | 'CAN_CHANGE_PROVIDER'

export class EnterpriseRBACManager {
  private static rolePermissions: Record<EnterpriseRole, EnterprisePermission[]> = {
    ORG_ADMIN: ['CAN_PUBLISH', 'CAN_RUN_AI', 'CAN_APPROVE', 'CAN_EXPORT', 'CAN_DELETE', 'CAN_TRAIN_AI', 'CAN_CHANGE_PROVIDER'],
    MARKETING_DIRECTOR: ['CAN_PUBLISH', 'CAN_RUN_AI', 'CAN_APPROVE', 'CAN_EXPORT', 'CAN_TRAIN_AI'],
    SALES_MANAGER: ['CAN_RUN_AI', 'CAN_APPROVE', 'CAN_EXPORT'],
    SALES_EXECUTIVE: ['CAN_RUN_AI', 'CAN_EXPORT'],
    SUPPORT: ['CAN_RUN_AI'],
    FINANCE: ['CAN_EXPORT'],
    READ_ONLY: [],
    AGENCY: ['CAN_PUBLISH', 'CAN_RUN_AI', 'CAN_EXPORT'],
    CLIENT: ['CAN_APPROVE', 'CAN_EXPORT']
  }

  public static hasPermission(role: EnterpriseRole, permission: EnterprisePermission): boolean {
    const permissions = this.rolePermissions[role] || []
    return permissions.includes(permission)
  }
}
