const serviceWorkerPath = "./service-worker.js";
const cacheName = "web-app-cache-db";

let page = window.location;

handleUI();

let newAppBtn = document.getElementById("newAppBtn");
let selectFileBtn = document.getElementById("selectFileBtn");
let fileSelector = document.getElementById("fileInput");

newAppBtn.addEventListener("click", openNewUrl);
selectFileBtn.addEventListener("click", () => fileSelector.click());
fileSelector.addEventListener("change", async function () {
  let zip = this.files[0];
  await registerApp(zip, serviceWorkerPath, cacheName);
  page.reload();
});

function openNewUrl() {
  let date = Date.now();
  let appID = "web-app-" + date;

  let hostname = page.hostname;
  let origin = page.origin;

  let newHostname = hostname.replace(hostname, appID + "." + hostname);
  let url = origin.replace(hostname, newHostname);

  window.open(url);
}

function handleUI() {
  const urlRegex = /^web-app-[0-9]+\..+/;
  let hostname = page.hostname;

  let isCreatedUrl = urlRegex.test(hostname);

  if (isCreatedUrl) {
    document.getElementById("newAppDiv").hidden = true;
    document.title = "Select App";
  } else {
    document.getElementById("selectAppDiv").hidden = true;
  }
}
