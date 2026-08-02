/**
 * Centralized Site Configuration & Domain Abstraction Helper
 * Supports seamless domain migration via process.env.NEXT_PUBLIC_SITE_URL.
 */

export const DEFAULT_SITE_URL = 'https://ngtechwcrm.nighwantech.com';

/**
 * Returns the fully qualified site URL for a given path.
 * Ensures no double slashes or missing protocol bugs.
 * @param path Optional relative path (e.g. '/features' or 'pricing')
 */
export function getSiteUrl(path = ''): string {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${baseUrl}${cleanPath}`;
}

export const SITE_CONFIG = {
  name: 'AI WCRM',
  legalName: 'Nighwan Tech Private Limited',
  tagline: 'Enterprise WhatsApp AI CRM & BYOK Multi-Model Platform',
  description: 'Enterprise-grade AI Customer Engagement Platform for WhatsApp. Features include BYOK multi-model AI routing with 0% token markup, multi-agent shared inbox, Retell Voice AI agents, visual Kanban sales pipelines, Meta official broadcast campaigns, and no-code workflow automation.',
  logo: '/logo.svg',
  defaultOgImage: '/og-image.png',
  contact: {
    phone: '+91-8985025794',
    email: 'support@nighwantech.com',
  },
};
