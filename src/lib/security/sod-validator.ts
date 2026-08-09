import { Permission } from './permissions'

export interface SoDConflictResult {
  hasConflict: boolean
  conflictingPermission?: Permission
  riskLevel?: 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description?: string
}

export interface SoDPairing {
  permA: Permission
  permB: Permission
  riskLevel: 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
}

export const ENTERPRISE_SOD_PAIRINGS: SoDPairing[] = [
  {
    permA: 'billing:manage',
    permB: 'audit:read',
    riskLevel: 'CRITICAL',
    description: 'Financial Billing Management cannot be combined with Audit Trail Administration (Financial Audit Conflict).',
  },
  {
    permA: 'api_keys:manage',
    permB: 'rbac:manage',
    riskLevel: 'HIGH',
    description: 'API Key Management cannot be combined with Role & PBAC Administration (Privilege Escalation Risk).',
  },
  {
    permA: 'contacts:delete_any',
    permB: 'compliance:read',
    riskLevel: 'HIGH',
    description: 'Hard Data Deletion permissions cannot be combined with Compliance Audit Exporting (Data Destruction Conflict).',
  },
]

/**
 * Validates real-time Separation of Duties (SoD) conflicts before permission assignment.
 */
export function validateSoDConflict(
  existingPermissions: Permission[] | Set<string>,
  targetPermission: Permission
): SoDConflictResult {
  const currentSet = new Set(Array.from(existingPermissions))

  for (const pairing of ENTERPRISE_SOD_PAIRINGS) {
    if (pairing.permA === targetPermission && currentSet.has(pairing.permB)) {
      return {
        hasConflict: true,
        conflictingPermission: pairing.permB,
        riskLevel: pairing.riskLevel,
        description: pairing.description,
      }
    }
    if (pairing.permB === targetPermission && currentSet.has(pairing.permA)) {
      return {
        hasConflict: true,
        conflictingPermission: pairing.permA,
        riskLevel: pairing.riskLevel,
        description: pairing.description,
      }
    }
  }

  return { hasConflict: false }
}
