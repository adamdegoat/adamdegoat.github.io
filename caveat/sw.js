/* Caveat service worker, offline shell + fresh data.
   Same-origin only (cross-origin fonts/Leaflet/OneMap handled by the browser).
   Data files: network-first (stay fresh) with cache fallback for offline.
   Everything else: cache-first, populated on demand. */
const CACHE = 'caveat-v18';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // let browser handle cross-origin

  // Navigations (the HTML shell) and data: network-first so updates + fresh data
  // always come through; fall back to cache offline.
  if (e.request.mode === 'navigate' || url.pathname.includes('/data/')) {
    e.respondWith(fetch(e.request)
      .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
  } else {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)
      .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })));
  }
});
