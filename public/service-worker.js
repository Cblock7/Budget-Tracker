const CACHE_NAME = "BudgetDB";

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/db.js',
  '/manifest.json',
  '/styles.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'  
];

//installing service worker
self.addEventListener('install', function (sw) {
  sw.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
});

// activating the service worker
self.addEventListener('activate', function (sw) {
  sw.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(CACHE_NAME);
      });
          cacheKeeplist.push(CACHE_NAME);
          return Promise.all(keyList.map(function (key, i) {
              if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i] );
              return caches.delete(keyList[i]);
              }
          })
      );
  })
  )
});

// getting information from the cache 
self.addEventListener('fetch', function (sw) {
  console.log('fetch request : ' + sw.request.url)
  sw.respondWith(
    caches.match(sw.request).then(function (request) {
      if (request) { 
        console.log('responding with cache : ' + sw.request.url)
        return request
      } else {      
        console.log('file is not cached, fetching : ' + sw.request.url)
        return fetch(sw.request)
      }
    })
  )
});