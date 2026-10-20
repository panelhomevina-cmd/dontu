/* Service worker: nhận thông báo đẩy kể cả khi app đã đóng. */
importScripts('firebase-config.js');

/* Bấm thông báo: mở (hoặc chuyển tới) app đúng màn hình.
   Đăng ký TRƯỚC Firebase để chặn xử lý mặc định, tránh mở 2 cửa sổ. */
self.addEventListener('notificationclick', function (e) {
  const d = (e.notification && e.notification.data) || {};
  const fcm = d.FCM_MSG || {};
  const link = (fcm.data && fcm.data.link) || (fcm.fcmOptions && fcm.fcmOptions.link) || d.link || self.registration.scope;
  e.notification.close();
  e.stopImmediatePropagation();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (const c of list) {
      if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) {
        return c.focus().then(function (w) { return w && 'navigate' in w ? w.navigate(link) : w; }).catch(function () { return clients.openWindow(link); });
      }
    }
    return clients.openWindow(link);
  }));
});

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp(self.DONTU.FIREBASE);
firebase.messaging(); /* thông báo có phần "notification" được thư viện tự hiển thị */

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(clients.claim()); });
