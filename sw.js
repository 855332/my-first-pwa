const CACHE = "zqys-v1";
const ASSETS = [
  "./index.html", "./style.css", "./app.js", "./portraits.js",
  "./manifest.json", "./icon-192.png", "./icon-512.png"
];

// 所有立绘平铺在根目录，故路径为 ./文件名.png
const PORTRAIT_FILES = [
  "susu_lengong.png","susu_pingmin.png","susu_pin.png","susu_fei.png","susu_guifei.png","susu_huangguifei.png",
  "haiyan_lengong.png","haiyan_pingmin.png","haiyan_pin.png","haiyan_fei.png","haiyan_guifei.png","haiyan_huangguifei.png",
  "dazhuang_lengong.png","dazhuang_pingmin.png","dazhuang_pin.png","dazhuang_fei.png","dazhuang_guifei.png","dazhuang_huangguifei.png"
].map(function(f){ return "./"+f; });

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS.concat(PORTRAIT_FILES)); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  e.respondWith(
    caches.match(e.request).then(function(res){
      if (res) return res;
      return fetch(e.request).then(function(r){
        const clone = r.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return r;
      }).catch(function(){ return caches.match("./index.html"); });
    })
  );
});
