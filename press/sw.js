const C='press-v22';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!==C).map(x=>caches.delete(x))))).then(()=>self.clients.claim())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // pages + same-origin images: network-first so updated heros/posts are never one load stale; cache is the offline fallback
 const isImg=u.origin===location.origin&&(r.destination==='image'||/\.(jpe?g|png|webp|avif|gif|svg)$/i.test(u.pathname));
 if(r.mode==='navigate'||isImg){
  e.respondWith(fetch(r).then(f=>{if(u.origin===location.origin){const cc=f.clone();caches.open(C).then(c=>c.put(r,cc))}return f}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));
  return;}
 // everything else (fonts, etc.): cache-first
 e.respondWith(caches.open(C).then(c=>c.match(r).then(h=>h||fetch(r).then(f=>{if(u.origin===location.origin){c.put(r,f.clone())}return f}))));});
