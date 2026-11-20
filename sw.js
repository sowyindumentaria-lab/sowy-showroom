/* Sowy — Copyright (c) 2026 Sowy (autor: Felipe Manrique). Todos los derechos reservados. Ver LICENSE. */
const VERSION = 'sowy-v12';
const CACHE = VERSION;
const SHELL = ['./', './index.html', './arte.js', './marca/logo.png', './marca/sowy.png', './fuentes/BebasNeue.woff', './manifest.webmanifest', './privacidad.html', './favicon.png', './icon-192.png', './icon-512.png', './maskable-192.png', './maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Red primero (siempre la última versión y el catálogo al día); la caché es el respaldo sin conexión.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (new URL(req.url).pathname.startsWith('/panel/') || new URL(req.url).pathname.startsWith('/api')) return;   // el panel tiene su propio SW
  e.respondWith(
    fetch(req, {cache: 'no-cache'})
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
