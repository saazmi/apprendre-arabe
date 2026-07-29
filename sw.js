/* Service worker — met l'app en cache pour un usage hors-ligne.
   Change CACHE à chaque déploiement pour forcer le rafraîchissement.
   Stratégie :
   - Navigation (HTML) : network-first → sinon cache. Empêche les tablettes
     de rester bloquées sur un vieux index.html qui référence d'anciens JS.
   - Autres assets : cache-first (rapide, hors-ligne). */

const CACHE = "arabe-v46";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./lessons.js",
  "./vocab.js",
  "./stories.js",
  "./hifdh-meta.js",
  "./cloud.js",
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
    }).then(function () { return self.clients.claim(); })
  );
});

function isNavigation(req) {
  if (req.mode === "navigate") return true;
  const accept = req.headers.get("accept") || "";
  return req.method === "GET" && accept.indexOf("text/html") !== -1;
}

self.addEventListener("fetch", function (e) {
  const req = e.request;
  if (req.method !== "GET") return;

  if (isNavigation(req)) {
    // Network-first for HTML navigations. Refreshes the entry point on every
    // online visit so updated <script> tags reach the page.
    e.respondWith(
      fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
      })
    );
    return;
  }

  // Cache-first for other assets.
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return hit; });
    })
  );
});
