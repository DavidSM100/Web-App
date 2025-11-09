importScripts("/js/localforage.min.js");

const dbName = "__webapp-assets-db";
const db = localforage.createInstance({ name: dbName });

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(getResponse(event.request));
});

/**
 *
 * @param {Request} request
 */
async function getResponse(request) {
  const url = new URL(request.url);
  url.hash = "";
  const asset = await db.getItem(url.toString());
  if (asset) {
    return new Response(asset.body, { headers: asset.headers });
  } else {
    const networkResponse = await fetch(url);
    return networkResponse;
  }
}
