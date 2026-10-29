// Service worker: deixa o site funcionar sem internet.
// Sempre que você trocar o index.html, aumente este número (v1 -> v2...) para os aparelhos pegarem a versão nova.
var VERSAO='v2';
var CACHE='jjk-rpg-'+VERSAO;
var ARQUIVOS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ARQUIVOS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET') return;
  var u=new URL(r.url);
  var fonte=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!fonte) return;
  e.respondWith(caches.match(r).then(function(hit){
    if(hit) return hit;
    return fetch(r).then(function(res){
      if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});}
      return res;
    }).catch(function(){return caches.match('./index.html');});
  }));
});
