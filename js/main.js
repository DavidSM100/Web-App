const $ = (id) => document.getElementById(id);
const isCreatedUrl = location.hostname.startsWith("webapp-");

load();
async function load() {
  if (isCreatedUrl) {
    const params = new URLSearchParams(location.hash.substring(1));
    const zipUrl = params.get("url");
    if (zipUrl) {
      $("info").textContent = "Downloading file...";
      $("info").hidden = false;
      try {
        const file = await (await fetch(zipUrl)).blob();
        $("info").textContent = "Installing zip...";
        const type = (zipUrl.endsWith(".xdc") && "xdc") || null;
        await installApp(file, type);
        location.hash = "";
        location.reload();
      } catch (err) {
        console.log(err);
        alert(err);
      }
    } else {
      $("file-import").hidden = false;
      $("file-input").addEventListener("change", async (e) => {
        const file = e.currentTarget.files[0];
        if (!file) return;
        try {
          $("file-import").hidden = true;
          $("info").textContent = "Installing zip...";
          $("info").hidden = false;
          const type = (file.name.endsWith(".xdc") && "xdc") || null;
          await installApp(file, type);
          location.reload();
        } catch (err) {
          console.log(err);
          alert(err);
        }
      });
    }
  } else {
    $("newAppDiv").hidden = false;
    $("newAppBtn").addEventListener("click", openNewUrl);
  }
}

function openNewUrl() {
  const appID = "webapp-" + Date.now();
  const newHostname = appID + "." + location.hostname;
  const url = location.origin.replace(location.hostname, newHostname);
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = url;
  document.body.append(link);
  link.click();
  link.remove();
}

/**
 *
 * @param {string} url
 * @param {string | null} type
 * @param {any[] | null} extraAssets
 */
async function installApp(file, type, extraAssets) {
  extraAssets = extraAssets || [];
  if (type === "xdc") {
    const webxdcJs = await (await fetch("/webxdc.js")).blob();
    extraAssets.push({ path: "/webxdc.js", file: webxdcJs });
  }
  await saveApp(file, extraAssets);
  await registerServiceWorker();
}
