// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // if it is 404, send them to 404.html
        if (response.status === 404) {
          return caches.match('/404.html?url='+event.request.url) || new Response('Status 404: Page not found');
        }
        return response;
      })
  );
});
