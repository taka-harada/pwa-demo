// 利用するキャッシュ名を定義
const cacheName = 'my-site-cache-v1';
// キャッシュするリソースを配列に格納
const filesToCache = [
  // '/'というファイルはないが、「ドメイン名/」などでリクエストされる状況に対応するために `/` を含む
  '/',
  '/index.html'
];

self.addEventListener('install', function(e) {
  console.log('ServiceWorker Installing');

  //以下のアプリ基本ファイルのキャッシュ処理が完了するまで、Service Workerイベントの完了を待つ
  e.waitUntil(
    // cacheNameにfilesToCacheに含まれるファイルを追加する
    caches.open(cacheName).then(function(cache) {
      console.log('ServiceWorker caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('ServiceWorker Activating');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        // キャッシュのキーが最新のキャッシュネームと一致しない場合削除する
        if (key !== cacheName) {
          console.log('Service Worker removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('Service Worker fetching', event.request.url);

  event.respondWith(
    //リクエストされたファイルがキャッシュに含まれていれば、キャッシュから取り出す
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
