const C='press-v2';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));return;}
 e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(f=>{if(e.request.method==='GET'&&u.origin===location.origin){c.put(e.request,f.clone())}return f}))));});
