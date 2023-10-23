import { swVersion } from './package.json'
const staticCacheName = `site-static-${swVersion}`;
const assets = [];

self.addEventListener('install', async evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
})

self.addEventListener('fetch', async (evt) => {
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