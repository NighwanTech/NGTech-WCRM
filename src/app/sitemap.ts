import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ngtechwcrm.nighwantech.com'

const staticRoutes = [
  '',
  '/features',
  '/pricing',
  '/free-trial',
  '/book-demo',
  '/about',
  '/contact',
  '/blog',
  '/solutions',
  '/whatsapp-crm-near-me',
]

const features = [
  'shared-team-inbox',
  'chatbot-builder',
  'workflow-automation',
  'lead-management',
  'broadcast-campaigns',
  'security-compliance',
]

const industries = [
  'real-estate',
  'ecommerce',
  'education',
  'healthcare',
  'finance',
  'b2b',
  'manufacturing',
  'hospitality',
  'travel',
  'ngo',
  'government',
  'service-business',
]

const cities = [
  'delhi',
  'mumbai',
  'bangalore',
  'hyderabad',
  'pune',
  'ahmedabad',
  'jaipur',
  'chandigarh',
  'chennai',
  'kolkata',
  'surat',
  'lucknow',
  'patna',
  'ranchi',
  'gaya',
  'muzaffarpur',
  'bhagalpur',
  'dhanbad',
  'jamshedpur',
  'indore',
  'bhopal',
  'nagpur',
  'varanasi',
  'dehradun',
  'raipur',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    ...staticRoutes,
    ...features.map(f => `/features/${f}`),
    ...industries.map(i => `/solutions/${i}`),
    ...cities.map(c => `/whatsapp-crm/${c}`),
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' || route === '/whatsapp-crm-near-me' ? 1 : route.startsWith('/whatsapp-crm/') ? 0.9 : 0.8,
  }))

  return routes
}
