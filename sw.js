const cache_version = 4;
const CACHE_NAME = 'static-v' + cache_version;

self.addEventListener('install', (event) => {
  // Force the new service worker to take over immediately
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/404.html',
        '/index.html',
      ]);
    })
  );
});

// CLEANUP: This deletes 'static-v2' when 'static-v3' activates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(async (response) => {
        if (response.status === 404) {
          // Look in the SPECIFIC current cache
          const cached404 = await caches.match('/404.html', { ignoreSearch: true });
          if (cached404) {
            let html = await cached404.text();
            // Inject the failed URL
            const injection = `<script>window.FAILED_URL = "${event.request.url}";<\/script>`;
            html = html.replace('<head>', '<head>' + injection);
            
            return new Response(html, { 
                headers: { 'Content-Type': 'text/html' },
                status: 404 // Keep the status 404!
            });
          }
        }
        return response;
      })
      .catch(async () => {
          // If offline, return the 404 page
          return await caches.match('/404.html', { ignoreSearch: true });
      })
  );
});
