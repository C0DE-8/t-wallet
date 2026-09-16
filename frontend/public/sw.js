const CACHE_NAME = 'trust-pwa-v1'
const APP_SHELL = [
  '/site.webmanifest',
  '/icons/trust-icon-180.png',
  '/icons/trust-icon-192.png',
  '/icons/trust-icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        const pageResponse = await fetch('/')
        const pageMarkup = await pageResponse.clone().text()
        const builtAssets = [...pageMarkup.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
          .map((match) => match[1])

        await cache.put('/', pageResponse)
        await cache.addAll([...APP_SHELL, ...builtAssets])
      })
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('trust-pwa-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const requestUrl = new URL(request.url)
  if (requestUrl.origin !== self.location.origin || requestUrl.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response.ok) {
            return caches.match('/').then((cachedPage) => cachedPage || response)
          }

          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
          return response
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  const cacheableDestinations = ['style', 'script', 'image', 'font', 'manifest', 'video']
  if (!cacheableDestinations.includes(request.destination)) return

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse

      return fetch(request).then((response) => {
        if (!response.ok) return response

        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        return response
      })
    }),
  )
})
