export type EnterpriseWorkspaceModuleId =
  | 'overview'
  | 'analytics'
  | 'approvals'

/**
 * Enterprise Navigation — Single source of truth helper (3 Core Modules: Overview, Analytics, Approvals)
 */
export function getActiveWorkspaceModule(pathname: string): EnterpriseWorkspaceModuleId {
  if (!pathname) return 'overview'

  const cleanPath = pathname.split('?')[0].replace(/\/$/, '')

  // Analytics Module
  if (cleanPath.startsWith('/meta-ads/analytics')) {
    return 'analytics'
  }

  // Approvals Module (Decision Ledger, Approvals Queue, Audit History)
  if (
    cleanPath.startsWith('/meta-ads/decision-ledger') ||
    cleanPath.startsWith('/meta-ads/decisions') ||
    cleanPath.startsWith('/meta-ads/approval') ||
    cleanPath.startsWith('/meta-ads/automation') ||
    cleanPath.startsWith('/meta-ads/history')
  ) {
    return 'approvals'
  }

  // Overview Module (default for /meta-ads, /meta-ads/create, /meta-ads/campaign/*)
  return 'overview'
}
