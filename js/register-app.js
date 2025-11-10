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
    const url = new URL(path, location.origin);
    const responseData = {
      body: blob,
      headers: { "Content-Type": lookupMimetype(path) },
    };
    await db.setItem(url.toString(), responseData);
    if (path === "/index.html") {
      url.pathname = "/";
      await db.setItem(url.toString(), responseData);
    }
  }

  if (extraAssets) {
    for (const { path, file } of extraAssets) {
      if (path && file) {
        const url = new URL(path, location.origin);
        await db.setItem(url.toString(), {
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
      const registration = await navigator.serviceWorker.register(
        serviceWorkerPath
      );
      if (registration.active) {
        return;
      }

      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (registration.active) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    } catch (err) {
      console.log(err);
      alert(`Error while registering the service worker:\n${err}`);
    }
  } else {
    alert("Error: Your browser does not support Service Workers");
  }
}
