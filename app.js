if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 关键：用相对路径，不要用 '/sw.js'
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('✅ Service Worker注册成功，作用域：', registration.scope);
      })
      .catch(error => {
        console.log('❌ Service Worker注册失败：', error);
      });
  });
}