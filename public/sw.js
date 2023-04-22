var cacheName = "snowjoy";
var filesToCache = [
  "/",
  "/contact.ejs",
  "/home.ejs",
  "/products.ejs",
  "/login.ejs",
  "/register.ejs",
  "/registrants.ejs",
  "/css/styles.css",
  "/js/main.js",
  "./app.js",
  "./server.js"
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", function (e) {
  console.log('[Service Worker] Install ')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[Service Worker] Caching all: app shell and content')
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
