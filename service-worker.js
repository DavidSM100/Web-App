importScripts("/js/localforage.min.js");

const dbName = "__webapp-assets-db";
const db = localforage.createInstance({ name: dbName });

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  event.respondWith(getResponse(url));
});

async function getResponse(url) {
  let path = new URL(url).pathname;
  if (path === "/") path = "/index.html";

  const asset = await db.getItem(path);

  if (asset) {
    return new Response(asset);
  } else {
    const networkResponse = await fetch(url);
    return networkResponse;
  }
}
