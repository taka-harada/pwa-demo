var saveButton = document.getElementById('save_button');
var deferredPrompt;

//　アプリインストールバナーが表示される直前で処理を中断
window.addEventListener('beforeinstallprompt', function(event) {
  console.log('インストールバナーの表示をキャンセルします');
  event.preventDefault();

  // プロンプトを変数にいれておく
  deferredPrompt = event;
  return false;
});


saveButton.addEventListener('click', function() {
  if (deferredPrompt !== undefined) {

    // インストールプロンプト表示
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      // キャンセルされた場合
      if (choiceResult.outcome == 'dismissed'){
        console.log('キャンセルされました');
      } else {
        console.log('インストールされました');
      }

      deferredPrompt = null;
      //saveButton.addAttribute('dismissed');
    });
  }
});

// ブラウザがPush通知をサポートしているか確認する
if (!('Notification' in window)) {
  alert('未対応のブラウザです');
} else {
  // 許可を求める
  Notification.requestPermission()
    .then((permission) => {
      if (permission == 'granted') {
        // 許可
        alert('すでに「許可」に設定されています');
      } else if (permission == 'denied') {
        // 拒否
        alert('すでに「拒否」に設定されています');
      } else if (permission == 'default') {
        // まだ通知の設定をしていない
        // 通知許可のポップアップを表示
        Notification.requestPermission();
      }
    });
}






// 利用するキャッシュ名を定義
const cacheName = 'my-site-cache-v1';
// キャッシュするリソースを配列に格納
const filesToCache = [
  // '/'というファイルはないが、「ドメイン名/」などでリクエストされる状況に対応するために `/` を含む
  '/',
  '/index.html'
];

// Install
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

// Activate
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
  //return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', function(e) {
  console.log('Service Worker fetching', e.request.url);

  e.respondWith(
    //リクエストされたファイルがキャッシュに含まれていれば、キャッシュから取り出す
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

// Push通知を受け取った際の処理
self.addEventListener('push', function(e) {
  console.log('Push message received', e);

  e.waitUntil(
    self.registration.showNotification('メッセージが届きました', {
      body: 'メッセージを送信しました',
      icon: './corp_logo.png',
      tag: 'push-notification-tag'
    })
  );
});
