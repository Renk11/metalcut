const V='mc-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;
 const u=new URL(req.url);
 if(u.origin===location.origin){
  e.respondWith((async()=>{
   const c=await caches.open(V);
   const net=fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r});
   const timeout=new Promise((_,rej)=>setTimeout(()=>rej(new Error('t')),4000));
   try{return await Promise.race([net,timeout])}
   catch(err){const m=await c.match(req,{ignoreSearch:true})||await c.match('index.html')||await c.match('./');if(m)return m;return net}
  })());
  return}
 if(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/')){
  e.respondWith((async()=>{const c=await caches.open(V);const m=await c.match(req);if(m)return m;const r=await fetch(req);if(r&&r.ok)c.put(req,r.clone());return r})())}
});
