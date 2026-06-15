const CACHE = 'nosdois-v42';
const ASSETS = ['./', './index.html', './manifest.json'];

// Firebase Messaging (só ativo se Firebase estiver configurado)
try {
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
  // O SW precisa inicializar o app pra receber push em background (app fechado).
  // Config client é pública por design (igual ao FIREBASE_CONFIG do index.html).
  firebase.initializeApp({
    apiKey: 'AIzaSyDMNb9lkioByuixLczYv1nLL5B9m_0IFg8',
    authDomain: 'nos-dois-financas.firebaseapp.com',
    projectId: 'nos-dois-financas',
    storageBucket: 'nos-dois-financas.firebasestorage.app',
    messagingSenderId: '211174485968',
    appId: '1:211174485968:web:8572d6384292eac6cb53d5',
  });
} catch(e) {}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const req = e.request;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // HTML = network-first: sempre tenta a versão mais nova; cai no cache só se estiver offline.
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Outros arquivos = cache-first, atualizando em segundo plano.
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200 && req.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});

// Permite ativar o SW novo imediatamente quando a página pedir
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

// Firebase push notifications background handler
if (typeof firebase !== 'undefined' && firebase.messaging) {
  try {
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(payload => {
      const { title, body, icon } = payload.notification || {};
      self.registration.showNotification(title || 'Nós Dois 💰', {
        body: body || 'Nova atualização',
        icon: icon || './icon.svg',
        badge: './icon.svg',
        vibrate: [200, 100, 200],
        data: payload.data,
      });
    });
  } catch(e) {}
}
