/*
 * Worker de nettoyage : Maxence OS n'utilise plus de service worker.
 * Ce fichier permet aux navigateurs ayant conservé une ancienne inscription
 * de la supprimer proprement, sans cache ni interception des requêtes.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(self.registration.unregister());
});
