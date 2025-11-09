const dbName = "__webapp-assets-db";
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
  const db = localforage.createInstance({ name: dbName });
  for (const fileObj of Object.values(zipData.files)) {
    if (fileObj.dir) continue;
    const path = "/" + fileObj.name;
    const blob = await fileObj.async("blob");
    await db.setItem(path, {
      body: blob,
      headers: { "Content-Type": lookupMimetype(path) },
    });
  }

  if (extraAssets) {
    for (const { path, file } of extraAssets) {
      if (path && file) {
        await db.setItem(path, {
          body: file,
          headers: { "Content-Type": lookupMimetype(path) },
        });
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
