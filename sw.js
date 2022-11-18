const staticCacheName = 'site-static-v1';
const assets = [];

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