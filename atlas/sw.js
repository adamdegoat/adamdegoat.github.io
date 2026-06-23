var CACHE = 'atlas-v1';
var ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  // network-first for the page so content is never stale; cache-first for icons/assets
  if (e.request.mode === 'navigate' || u.pathname.endsWith('index.html') || u.pathname.endsWith('/atlas/')) {
    e.respondWith(fetch(e.request).then(function (resp) {
      var cc = resp.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cc); }); return resp;
    }).catch(function () { return caches.match(e.request).then(function (h) { return h || caches.match('./index.html'); }); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (h) {
    return h || fetch(e.request).then(function (resp) { var cc = resp.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cc); }); return resp; });
  }));
});
