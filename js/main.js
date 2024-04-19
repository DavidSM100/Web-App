const serviceWorkerPath = "./service-worker.js";
const cacheName = "web-app-cache-db";

let $ = (id) => document.getElementById(id);
let page = window.location;

handleUI();

$("newAppBtn").addEventListener("click", openNewUrl);
$("selectFileBtn").addEventListener("click", () => $("fileInput").click());
$("fileInput").addEventListener("change", installApp);

function handleUI() {
  const urlRegex = /^web-app-[0-9]+\..+/;
  let hostname = page.hostname;

  let isCreatedUrl = urlRegex.test(hostname);

  if (isCreatedUrl) {
    $("newAppDiv").hidden = true;
    document.title = "Select App";
  } else {
    $("selectAppDiv").hidden = true;
  }
}

function openNewUrl() {
  let appID = "web-app-" + Date.now();

  let hostname = page.hostname;
  let origin = page.origin;

  let newHostname = hostname.replace(hostname, appID + "." + hostname);
  let url = origin.replace(hostname, newHostname);

  window.open(url);
}

async function installApp() {
  let zip = this.files[0];
  await registerApp(zip, serviceWorkerPath, cacheName);
  page.reload();
}
