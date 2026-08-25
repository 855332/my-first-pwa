// 缓存名称，改版本号可以触发缓存更新（比如v1→v2）
const CACHE_NAME = 'my-pwa-cache-v1';
// 需要预缓存的核心文件：打开页面必须的HTML/CSS/JS/图标
const urlsToCache = [
  './',                // 根路径，对应index.html
  './index.html',
  './app.js',
  './icon-192.png',
  './icon-512.png'
];

// 1. 安装阶段：缓存指定文件
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');
  // waitUntil确保缓存完成前不会进入下一个阶段
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存文件成功');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('缓存文件失败：', error);
      })
  );
});

// 2. 请求拦截阶段：优先从缓存取资源，没有再请求网络
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存里有请求的资源，直接返回
        if (response) {
          return response;
        }
        // 缓存没有，走网络请求
        return fetch(event.request);
      })
  );
});

// 3. 激活阶段：清理旧版本缓存
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果缓存名不是当前版本，删除旧缓存
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存：', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});