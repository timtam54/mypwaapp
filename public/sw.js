console.log("Service Worker Loaded 1.2..");
self.addEventListener("push", function (event) {
 // console.log("push.");
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/logo512.png',
      badge: "/logo192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "5",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("https://localhost:3000")); //https://kind-water-0022d1500.5.azurestaticapps.net This should be the url to your website
});