/* Service worker — met l'app en cache pour un usage hors-ligne.
   Change CACHE (v1 → v2…) à chaque mise à jour du contenu pour forcer
   le rafraîchissement. */

const CACHE = "arabe-v17";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./lessons.js",
  "./vocab.js",
  "./stories.js",
  "./quiz.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./apple-touch-icon.png",
  "./fonts/scheherazade-new-400.woff2",
  "./fonts/scheherazade-new-700.woff2",
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                            .map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
