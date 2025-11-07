const cacheName = "web-app-cache-db";
const serviceWorkerPath = "/service-worker.js";

/**
 *
 * @param {File} zip
 * @param {any[]} extraAssets
 */
async function saveApp(zip, extraAssets) {
  const zipData = await JSZip().loadAsync(zip);
  if (!zipData.files["index.html"]) {
    throw new Error("No 'index.html' found.");
  }
  const cache = await caches.open(cacheName);
  for (const fileObj of Object.values(zipData.files)) {
    if (fileObj.dir) continue;
    const path = "/" + fileObj.name;
    const blob = await fileObj.async("blob");
    const mimetype = getMimeType(fileObj.name);
    const response = new Response(blob, {
      headers: { "Content-Type": mimetype },
    });
    await cache.put(path, response);
  }

  if (extraAssets) {
    for (const { path, file } of extraAssets) {
      if (path && file) {
        await cache.put(path, new Response(file));
      }
    }
  }
}

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register(serviceWorkerPath);
    } catch (err) {
      alert(`Error while registering the service worker:\n${err}`);
    }
  } else {
    alert("Error: Your browser does not support Service Workers");
  }
}

/**
 *
 * @param {string} fileName
 */
function getMimeType(fileName) {
  if (fileName.endsWith(".js")) {
    return "text/javascript";
  } else if (fileName.endsWith(".html")) {
    return "text/html";
  } else if (fileName.endsWith(".css")) {
    return "text/css";
  } else if (fileName.endsWith(".svg")) {
    return "image/svg+xml";
  } else if (fileName.endsWith(".wasm")) {
    return "application/wasm";
  }
}
