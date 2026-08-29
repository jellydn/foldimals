const CACHE = 'foldimals-v2'
const APP_SHELL = ['', 'index.html', 'manifest.webmanifest', 'foldimals-icon.svg']
  .map((path) => new URL(path, self.registration.scope).toString())
const FALLBACK = new URL('index.html', self.registration.scope).toString()

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone()
      caches.open(CACHE).then((cache) => cache.put(event.request, copy))
      return response
    }).catch(() => caches.match(FALLBACK))),
  )
})
