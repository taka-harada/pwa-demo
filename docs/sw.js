// 利用するキャッシュ名を定義
const CACHE_NAME = 'my-site-cache-v1';
// キャッシュするリソースを配列に格納
const urlsToCache = [
  '/',
  '/style.css',
];

self.addEventListener('install', function(event) {
  //インストール処理
　event.waitUntill(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        //キャッシュがあったのでそのレスポンスを返す
        if(response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
