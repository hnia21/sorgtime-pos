const CACHE = 'sorgtime-pos-v37';
const ASSETS = [
  './', './index.html', './styles.css', './app.js', './supabase-client.js', './vendor/supabase.js', './icon.svg', './manifest.webmanifest',
  './assets/sorgtime-logo.png', './assets/fonts/tuku-hand.otf',
  './assets/menu/soft.png', './assets/menu/strong.png', './assets/menu/montblanc.png',
  './assets/menu/bluecloud.png', './assets/menu/matcha.png', './assets/menu/chocolate.png',
  './assets/products/vest.png', './assets/products/sorgmeal.png', './assets/products/tumbler.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

const isShellRequest = request => {
  if (request.mode === 'navigate') return true;
  const path = new URL(request.url).pathname;
  return /\/(index\.html|app\.js|supabase-client\.js|styles\.css|sw\.js)$/.test(path);
};

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Jangan pernah cache request lintas origin (Supabase API/Auth). Respons
  // pos_state yang ter-cache membuat aplikasi membaca snapshot lama terus.
  if (url.origin !== self.location.origin) return;

  if (isShellRequest(event.request)) {
    // Network-first agar versi aplikasi terbaru selalu dimuat; fallback ke
    // cache hanya ketika offline.
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
