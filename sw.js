const CACHE='autodiag-v6-1-isolated';
const ASSETS=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('autodiag-')&&k!==CACHE).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(!u.pathname.includes('/autodiag/')) return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
      const c=r.clone(); caches.open(CACHE).then(x=>x.put('./index.html',c)); return r;
    }).catch(()=>caches.match('./index.html')));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
