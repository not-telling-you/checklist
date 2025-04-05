const CACHE_NAME = 'JobQCPortal-v1.0.2504012312-dynamic.37';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const urlsToCache = [
  '/',
  'sw.js',
  '/checklist2/',
  '/checklist2/sw.js',
  '/checklist2/static/js/bundle.js',
  '/checklist2/manifest.json',
  '/checklist2/static/js/node_modules_web-vitals_dist_web-vitals_js.chunk.js',
  '/checklist2/favicon.ico'
];

// initial asset cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('caching urls', urlsToCache);
        return cache.addAll(urlsToCache.map(url => new Request(url, { mode: 'no-cors' })));
      })
    );
});

// bad code to turn off listening when offline
self.addEventListener('message', event => {
  if (event.data.type === 'ONLINE') {
    console.log("setting up fetch listener")
    self.addEventListener('fetch', fetchEventListener);
  } else if (event.data.type === 'OFFLINE') {
    console.log("removing fetch listener")
    self.removeEventListener('fetch', fetchEventListener);
  }
});

// testing to see if i can cache all get requests
const fetchEventListener = event => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        if (navigator.onLine) {
          return fetch(event.request).then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              const clonedResponse = networkResponse.clone();
              // looks like you have to add a header and do cleanup manually so this might be too much
              const headers = new Headers(clonedResponse.headers);
              headers.append('sw-cache-timestamp', Date.now().toString());
              const responseWithTimestamp = new Response(clonedResponse.body, {
                status: clonedResponse.status,
                statusText: clonedResponse.statusText,
                headers: headers
              });
              cache.put(event.request, responseWithTimestamp);
              return networkResponse;
            });
          });
        }
      })
    );
  }
};
if (navigator.onLine) {
  self.addEventListener('fetch', fetchEventListener);
}

//TODO: just expire cache when online and loading page?
// AI generated slop
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            return cache.match(key).then(response => {
              if (response) {
                const timestamp = response.headers.get('sw-cache-timestamp');
                if (timestamp && (Date.now() - parseInt(timestamp, 10)) > CACHE_EXPIRATION) {
                  return cache.delete(key);
                }
              }
            });
          })
        );
      });
    })
  );
});
