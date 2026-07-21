/* Corretor de Bingos: service worker (offline-first) */
const CACHE = "bingos-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  // ícones / imagens
  "./res/bingo_logo.png",
  "./res/bingo_icon_192.png",
  "./res/bingo_icon_512.png",
  "./res/bingo_maskable_192.png",
  "./res/bingo_maskable_512.png",
  "./res/apple-touch-icon.png",
  // css
  "./res/assets/css/rmf.css",
  "./res/fonts/fa/css/all.min.css",
  "./res/fonts/fonts.css",
  // js
  "./res/assets/js/m3-appbar-scroll.js",
  "./res/assets/js/qrcode-generator.js",
  "./res/assets/js/jsqr.js",
  // fontes inter
  "./res/fonts/inter/inter-v20-latin-regular.woff2",
  "./res/fonts/inter/inter-v20-latin-500.woff2",
  "./res/fonts/inter/inter-v20-latin-600.woff2",
  "./res/fonts/inter/inter-v20-latin-700.woff2",
  // fontes roboto mono
  "./res/fonts/roboto/roboto-mono-v23-latin-regular.woff2",
  "./res/fonts/roboto/roboto-mono-v23-latin-500.woff2",
  // fontes font awesome
  "./res/fonts/fa/webfonts/fa-brands-400.woff2",
  "./res/fonts/fa/webfonts/fa-regular-400.woff2",
  "./res/fonts/fa/webfonts/fa-solid-900.woff2",
  "./res/fonts/fa/webfonts/fa-v4compatibility.woff2",
  "./res/fonts/fa/webfonts/fa-rmf.woff2?v=2",
  "./res/fonts/fa/webfonts/fa-sei.woff2",
  "./res/fonts/fa/webfonts/fa-sparkles.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll é atômico: se 1 falhar, nada é cacheado. Usamos put individual
      // para tolerar algum asset opcional ausente sem quebrar o offline.
      .then(c => Promise.all(ASSETS.map(url =>
        fetch(new Request(url, { cache: "reload" }))
          .then(res => res.ok ? c.put(url, res) : null)
          .catch(() => null)
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // network-first para o HTML (pega atualizações), cache-first para o resto
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => hit))
  );
});
