// Nombre del caché (usa versión distinta cuando actualices archivos)
const CACHE_NAME = 'expo-cache-v1';

// 🗂️ Archivos esenciales para modo offline (ajustados a /Expo/)
const ASSETS_TO_CACHE = [
  '/Expo/',
  '/Expo/index.html',
  '/Expo/tailwind/output.css',
  '/Expo/cbs/general.css',
  '/Expo/cbs/estilo.css',
  '/Expo/jquery/jquery.min.3.7.1.js',
  '/Expo/jquery/jquery-ui.min.1.13.2.js',
  '/Expo/jquery/jquery.easing.min.1.4.1.js',
  '/Expo/cbs/general.js',
  '/Expo/cbs/favicon-192.png',
  '/Expo/img/caratula/video-tesis-caratula-fallback.jpg',
  '/Expo/site.webmanifest'
];

// ✅ Instalación: cachear archivos base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ✅ Activación: limpiar versiones viejas del caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ✅ Estrategia de fetch: red primero, luego caché
self.addEventListener('fetch', event => {
  const request = event.request;

  // Ignorar fuentes externas (Google Fonts, YouTube, Analytics, etc.)
  if (
    request.url.includes('fonts.googleapis.com') ||
    request.url.includes('fonts.gstatic.com') ||
    request.url.includes('youtube.com') ||
    request.url.includes('google-analytics.com') ||
    request.url.includes('gtag/js')
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Actualiza dinámicamente el caché (opcional)
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request).then(res => res || caches.match('/Expo/index.html')))
  );
});
