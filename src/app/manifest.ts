import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NGTech WCRM',
    short_name: 'NGTech WCRM',
    description: 'WhatsApp CRM, Shared Inbox, Automations, & AI Assistant',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#10b981',
    icons: [
      {
        src: '/logo.png',
        sizes: '1254x1254',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
