import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-config';

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
];

const competitors = [
  'interakt',
  'doubletick',
  'gupshup',
  'wati',
  'aisensy',
];

const features = [
  'shared-team-inbox',
  'chatbot-builder',
  'workflow-automation',
  'lead-management',
  'broadcast-campaigns',
  'security-compliance',
  'byok',
  'crm-pipeline',
  'voice-ai',
  'analytics',
  'api',
  'security',
];

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
];

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
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    ...staticRoutes,
    ...features.map((f) => `/features/${f}`),
    ...industries.map((i) => `/solutions/${i}`),
    ...cities.map((c) => `/whatsapp-crm/${c}`),
    ...competitors.map((comp) => `/vs/${comp}`),
  ].map((route) => ({
    url: getSiteUrl(route),
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority:
      route === '' || route === '/whatsapp-crm-near-me'
        ? 1.0
        : route.startsWith('/whatsapp-crm/')
        ? 0.9
        : route.startsWith('/vs/')
        ? 0.85
        : 0.8,
  }));

  return routes;
}
