// Service worker : l'app fonctionne hors ligne, les photos d'exercices déjà vues restent en cache.
const VERSION = 'muscu-v5';
const IMAGES = 'muscu-images-v1';
const COQUILLE = [
  './', './index.html', './css/app.css', './manifest.webmanifest', './data/exercices.json',
  './js/main.js', './js/nav.js', './js/store.js', './js/xp.js', './js/exercices.js', './js/salles.js', './js/ui.js', './js/calories.js',
  './js/vues/accueil.js', './js/vues/calendrier.js', './js/vues/seance.js', './js/vues/bibliotheque.js',
  './js/vues/progres.js', './js/vues/salles.js', './js/vues/recompenses.js',
  './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION)
    .then((c) => c.addAll(COQUILLE.map((u) => new Request(u, { cache: 'no-cache' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== VERSION && k !== IMAGES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // Photos d'exercices : cache d'abord.
  if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.open(IMAGES).then(async (c) => {
      const deja = await c.match(e.request);
      if (deja) return deja;
      const r = await fetch(e.request);
      if (r.ok || r.type === 'opaque') c.put(e.request, r.clone());
      return r;
    }));
    return;
  }

  // Fichiers de l'app : réseau d'abord (pour recevoir les mises à jour), cache si hors ligne.
  // `no-cache` : toujours revérifier auprès du serveur, sinon le cache HTTP pourrait mélanger
  // des fichiers d'anciennes et de nouvelles versions après une mise à jour.
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' })
        .then((r) => {
          if (r.ok) caches.open(VERSION).then((c) => c.put(e.request, r.clone()));
          return r;
        })
        .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))),
    );
  }
  // Le reste (recherche de salles) passe directement par le réseau.
});
