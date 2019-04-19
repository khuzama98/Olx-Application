const cacheName = 'AppOlx98Cache';
const staticAssets = [
    './',
    './styles/custom.css',
    './styles/style.css',
    './styles/bootstrap4/bootstrap.min.css',
    './styles/main_styles.css',
    './styles/responsive.css',
    './index.html',
    './images/banner_background.jpg',
    './images/24_OLX-512.png',
    './images/loader.gif',
    './js/auth.js',
    './js/chat.js',
    './pages/detail.html',
    // './pages/postad.html',
    './pages/searchresult.html',
    './pages/profile.html',
    './pages/chat.html',
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
          console.log('[ServiceWorker] Caching app shell');
          return cache.addAll(staticAssets)
          .then(() => {
            console.info('All files are cached');
            return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
          })
          .catch((error) =>  {
            console.error('Failed to cache', error);
          })
        })
      );
})

self.addEventListener('activate', e =>{
    console.log('sw activate');
    e.waitUntil(
        caches.keys().then(keyList =>{
            return Promise.all(keyList.map(key =>{
                if(key !== cacheName){
                    console.log('sw is removing old cache',key);
                    return caches.delete(key);
                }
            }))
        })
    )
})

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req))
    } else {
        event.respondWith(networkFirst(req))
    }
})

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res
    } catch (error) {
        return await cache.match(req)
    }
}