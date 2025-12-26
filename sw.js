const CACHE_NAME = "bangla-calendar-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./js/02-constants.js",
  "./js/03-assam-data.js",
  "./js/05-date-utils.js",
  "./js/06-bangla-engine.js",
  "./js/07-sun-engine.js",
  "./js/08-ui-dropdowns.js",
  "./js/09-calendar-render.js",
  "./js/10-app-init.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});