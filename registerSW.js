// Don't edit! This is just for registering the service worker
// For more info: https://vite-pwa-org.netlify.app/guide/register-service-worker.html

import { log } from './src/services/logger'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(() => log && console.log('ServiceWorker registered successfully 📦'))
        .catch((e) => log && console.error('ServiceWorker not registered ❌', e));
    })
}