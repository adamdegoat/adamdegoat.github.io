var CACHE = 'thesis-v35';
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
  if (e.request.method !== 'GET') return;
  // data files network-first so research stays fresh
  if (e.request.url.indexOf('/data/') > -1) {
    e.respondWith(fetch(e.request).then(function (r) {
      var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); return r;
    }).catch(function () { return caches.match(e.request); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
