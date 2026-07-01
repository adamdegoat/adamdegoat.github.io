// PropSight hub, service worker (offline shell + installable PWA)
const CACHE = 'propsight-v145';
const CORE = [
  'index.html', 'essentials/index.html', 'listings/index.html',
  'notes/index.html', 'notes/your-real-property-budget-three-numbers.html',
  'tools/afford.html', 'tools/value.html', 'tools/stamp-duty.html',
  'tools/schools.html', 'tools/sell.html', 'tools/eligibility.html', 'tools/grants.html', 'install.html',
  'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'img/hero.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const isHTML = r.mode === 'navigate' || (r.headers.get('accept') || '').includes('text/html');
  // same-origin images (hero, photos): network-first too, so a replaced image is never one load stale
  const isImg = u.origin === location.origin && (r.destination === 'image' || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(u.pathname));

  // pages + live data + shared scripts + images: always try the network first so updates are never stale; fall back to cache offline
  if (isHTML || isImg || u.pathname.includes('/caveat/data/') || /\/(nav|member|i18n)\.js$/.test(u.pathname)) {
    e.respondWith(
      fetch(r, { cache: 'no-store' }).then(resp => {
        if (u.origin === location.origin) { const cc = resp.clone(); caches.open(CACHE).then(c => c.put(r, cc)); }
        return resp;
      }).catch(() => caches.match(r).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // static assets (icons, fonts, etc.): cache-first
  e.respondWith(
    caches.match(r).then(hit => hit || fetch(r).then(resp => {
      if (u.origin === location.origin) { const cc = resp.clone(); caches.open(CACHE).then(c => c.put(r, cc)); }
      return resp;
    }).catch(() => undefined))
  );
});
