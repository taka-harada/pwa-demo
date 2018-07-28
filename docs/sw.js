// 利用するキャッシュ名を定義
const CACHE_NAME = 'my-site-cache-v1';
// キャッシュするリソースを配列に格納
const urlsToCache = [
  '/',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

self.addEventListener('fetch', function(event) {
});
