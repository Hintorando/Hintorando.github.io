self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // if 404
        if (response.status === 404) {
          // redirect url with the url
          const errorUrl = `/404.html?url=${encodeURIComponent(event.request.url)}`;
          
          // get the 404 url
          return caches.match('/404.html', { ignoreSearch: true }).then(cachedResponse => {
             return cachedResponse || fetch(errorUrl); 
          });
        }
        return response;
      })
      .catch(() => {
        // eh dont care bout this
        return caches.match('/404.html', { ignoreSearch: true });
      })
  );
});
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-v1').then((cache) => {
      return cache.addAll([
        '/404.html',
        '/index.html',
      ]);
    })
  );
});
