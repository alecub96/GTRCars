/* eslint-disable no-restricted-globals */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyDemoPlaceholderKeyGTRCars2026',
  authDomain: 'gtrcars-app.firebaseapp.com',
  projectId: 'gtrcars-app',
  storageBucket: 'gtrcars-app.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef123456',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Nuevo Mensaje en GTR Cars';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Tienes una nueva notificación de tu superdeportivo.',
    icon: '/brand/app-icon.png',
    badge: '/brand/app-icon.png',
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/mensajes',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/mensajes';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/mensajes') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
