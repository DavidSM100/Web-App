const cacheName = "web-app-cache-db";

self.addEventListener("fetch", (event) => {
  let url = event.request.url;
  event.respondWith(getResponse(url));
});

async function getResponse(url) {
  let cache = await caches.open(cacheName);

  let path = new URL(url).pathname;
  if (path == "/") path = "/index.html";

  let filePath = path.replace("/", "");
  let response = await cache.match(filePath);

  if (response) return response;
  else {
    let networkResponse = await fetch(url);
    return networkResponse;
  }
}
