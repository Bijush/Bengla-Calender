const CACHE_NAME = "bangla-calendar-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",

  // JS files
  "./js/02-constants.js",
  "./js/03-assam-data.js",
  "./js/05-date-utils.js",
  "./js/06-bangla-engine.js",
  "./js/07-sun-engine.js",
  "./js/11-tithi-data.js",
  "./js/08-ui-dropdowns.js",
  "./js/09-calendar-render.js",
  "./js/10-app-init.js",

  // external lib fallback (optional)
  "https://unpkg.com/suncalc@1.9.0/suncalc.js"
];

/* ================= INSTALL ================= */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ================= ACTIVATE ================= */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ================= FETCH ================= */
self.addEventListener("fetch", e => {

  // only GET requests
  if(e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;

      return fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, copy);
          });
          return res;
        })
        .catch(() => {
          // offline fallback (optional)
          if(e.request.destination === "document"){
            return caches.match("./index.html");
          }
        });
    })
  );
});