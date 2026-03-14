const CACHE_NAME = 'offline-cache-v2';
const OFFLINE_URL = './mode/offline.html';

// List all essential assets you want available offline
const OFFLINE_ASSETS = [
    OFFLINE_URL,
    './mode/css/style.css',
    './mode/images/worldskills-2024-p.jpg',
    './mode/images/fda-p.jpg',
    './mode/images/lyon-kayak-p-0.jpg',
    './mode/images/semaine-bleue-2024-p.jpg',
    './mode/images/village-des-metiers-p.jpg',
    './mode/images/journees_portes_ouvertes_entreprises_2023_p.jpg',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(OFFLINE_ASSETS);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            // For navigation requests (page loads), show offline.html
            if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_URL);
            }
            // For other requests (CSS, images), try cache
            return caches.match(event.request);
        })
    );
});
