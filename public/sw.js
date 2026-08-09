const CACHE_NAME = 'ngtech-wcrm-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Do not intercept Next.js RSC requests or API routes
  const url = new URL(event.request.url);
  if (url.searchParams.has('_rsc') || url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => response)
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached || new Response('Network Error', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});
