// EduConnect Service Worker v2.1
const CACHE = 'educonnect-v2';
const BASE  = '/escuela-app';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});

// Push Notifications
self.addEventListener('push', e => {
  let data = { title: 'EduConnect', body: 'Tienes una notificación nueva.', icon: BASE + '/icons/icon-192.png', tag: 'educonnect' };
  if (e.data) {
    try { Object.assign(data, e.data.json()); } catch { data.body = e.data.text(); }
  }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body, icon: data.icon, badge: data.icon,
      tag: data.tag, vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes('index.html') || c.url.includes('escuela-app'));
      if (existing) return existing.focus();
      return clients.openWindow(BASE + '/index.html');
    })
  );
});
