const CACHE_NAME = 'berent-static-cache-v1'; // Version ändern, wenn Dateien aktualisiert werden!
const FILES_TO_CACHE = [
  // HTML-Seiten
  'index.html',
  'termin.html',
  'vortraege.html',
  'impressum.html',
  'profil.html',
  // Fallback-Seite (optional, falls eine Seite offline nicht im Cache ist)
  // 'offline.html',
  // CSS
  'output.css',
  // Wichtige Bilder/Logos
  'images/logo.png',
  'images/logo-kompakt-farbe.png',
  'images/hintergrund.png',
  'images/hintergrund-footer.jpg',
  'images/kunden-hintergrund.jpg', // Falls verwendet und benötigt
  'customer-logos/logo-mcr.png',
  'customer-logos/h-pcn.png',
  'customer-logos/logo-future-hair.png',
  'customer-logos/benseler-logo.jpeg',
  // Icons (aus Manifest)
  'images/icon-192x192.png',
  'images/icon-512x512.png',
  // PDFs (falls sie offline verfügbar sein sollen)
  'material/Sieben-Weshalb-fur-den-Einsatz-Kunstlicher-Intelligenz-am-Gymnasium.pdf',
  'material/KI-fur-Lehrkrafte-Weniger-Tool-Wahn-mehr-Zeitgewinn.pdf',
  // Hier alle weiteren wichtigen Assets auflisten (z.B. JS-Dateien, falls welche existieren)
];

// Install-Event: Cache öffnen und Dateien hinzufügen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting(); // Direkt aktivieren
});

// Activate-Event: Alte Caches löschen (optional aber empfohlen)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) { // Nur alte Caches dieser App löschen
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim(); // Kontrolle über offene Clients übernehmen
});

// Fetch-Event: Anfragen abfangen und aus Cache oder Netzwerk bedienen
self.addEventListener('fetch', (event) => {
  // Nur GET-Anfragen behandeln
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request) // Zuerst im Cache suchen
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Nicht im Cache - versuche Netzwerk
        return fetch(event.request)
                 // Optional: Netzwerkantwort cachen? Vorsicht bei dynamischen Inhalten!
                 // Hier nicht implementiert für statische Seite
                 ;
      })
      // Optional: Fallback auf Offline-Seite, falls Netzwerk fehlschlägt
      // .catch(() => {
      //   return caches.match('offline.html');
      // })
  );
}); 