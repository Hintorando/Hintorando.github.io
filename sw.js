self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(async (response) => {
        if (response.status === 404) {
          const cached404 = await caches.match('/404.html', { ignoreSearch: true });
          if (cached404) {
            // Get the text of the 404 page
            let html = await cached404.text();
            // Inject the failed URL into a global variable before returning
            const injection = `<script>window.FAILED_URL = "${event.request.url}";<\/script>`;
            html = html.replace('<head>', '<head>' + injection);
            
            return new Response(html, { headers: { 'Content-Type': 'text/html' } });
          }
        }
        return response;
      })
  );
});
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-v2').then((cache) => {
      return cache.addAll([
        '/404.html',
        '/index.html',
      ]);
    })
  );
});
