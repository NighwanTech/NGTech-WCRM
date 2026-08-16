export type EnterpriseWorkspaceModuleId =
  | 'overview'
  | 'audience'
  | 'creative'
  | 'analytics'
  | 'automation'
  | 'copilot'
  | 'settings'

/**
 * Single source of truth helper for active workspace module matching
 */
export function getActiveWorkspaceModule(pathname: string): EnterpriseWorkspaceModuleId {
  if (!pathname) return 'overview'

  // Clean trailing slash & query params
  const cleanPath = pathname.split('?')[0].replace(/\/$/, '')

  // Audience Module
  if (cleanPath.startsWith('/meta-ads/audience')) {
    return 'audience'
  }

  // Creative Module
  if (cleanPath.startsWith('/meta-ads/creative')) {
    return 'creative'
  }

  // Analytics Module
  if (cleanPath.startsWith('/meta-ads/analytics')) {
    return 'analytics'
  }

  // Automation Module
  if (
    cleanPath.startsWith('/meta-ads/decision-ledger') ||
    cleanPath.startsWith('/meta-ads/approval') ||
    cleanPath.startsWith('/meta-ads/automation')
  ) {
    return 'automation'
  }

  // AI Copilot Module
  if (
    cleanPath.startsWith('/meta-ads/copilot') ||
    cleanPath.startsWith('/meta-ads/prompt-studio') ||
    cleanPath.startsWith('/meta-ads/knowledge-base') ||
    cleanPath.startsWith('/meta-ads/experiments')
  ) {
    return 'copilot'
  }

  // Settings Module
  if (cleanPath.startsWith('/meta-ads/settings')) {
    return 'settings'
  }

  // Overview Module (default for /meta-ads, /meta-ads/create, /meta-ads/campaign/*)
  return 'overview'
}
