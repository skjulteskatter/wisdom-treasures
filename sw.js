const staticCacheName = 'site-static-v1';
const assets = [ 
    'https://fonts.gstatic.com/s/quando/v14/xMQVuFNaVa6YuW0ZAq-yGX8.woff2',
    'https://fonts.googleapis.com/css2?family=Quando&display=swap',
    '/',
    'login',
    'search',
];

self.addEventListener('install', async evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
})

self.addEventListener('fetch', async (evt) => {
    //console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
})

self.addEventListener('activate', evt =>{
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(x => x !== staticCacheName).map(x => caches.delete(x)));
        })
    )
})