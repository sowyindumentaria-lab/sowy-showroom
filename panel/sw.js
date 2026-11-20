/* Sowy Panel — Copyright (c) 2026 Sowy (autor: Felipe Manrique). Todos los derechos reservados. Ver ../LICENSE */
const VERSION = 'sowy-panel-v13';
const CACHE = VERSION;
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', '../arte.js', '../marca/sowy.png', '../fuentes/BebasNeue.woff', '../marca/logo.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
// Red primero (siempre la última versión); la caché es solo respaldo sin conexión. Los pedidos a la API no se tocan.
self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api')) return;
  e.respondWith(fetch(req, {cache: 'no-cache'}).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return res; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
