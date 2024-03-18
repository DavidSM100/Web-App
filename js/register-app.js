async function registerApp(zip, serviceWorkerPath, cacheName) {
  let zipData = await getZipData(zip);
  let filesObj = zipData.files;
  let filesList = Object.keys(filesObj);

  if (filesList.includes("index.html")) {
    await registerServiceWorker(serviceWorkerPath);

    let filesData = Object.values(filesObj);
    await saveApp(filesData, cacheName);
  }
}

async function saveApp(filesData, cacheName) {
  let getResponses = filesData.map(async (fileData) => {
    if (!fileData.dir) {
      let path = fileData.name;
      let blob = await fileData.async("blob");
      let file = getFile(blob, path);

      let response = getResponse(file);
      return { path: path, data: response };
    }
  });
  let responses = await Promise.all(getResponses);

  let cache = await caches.open(cacheName);
  let putInCache = responses.map(async (response) => {
    if (response) {
      let path = response.path;
      let data = response.data;

      await cache.put(path, data);
    }
  });
  await Promise.all(putInCache);
}

async function getZipData(zip) {
  try {
    let data = await JSZip().loadAsync(zip);
    return data;
  } catch (err) {
    alert(`Error while processing the zip: \n${err}`);
  }
}

async function registerServiceWorker(filePath) {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register(filePath);
    } catch (err) {
      alert(`Error while registering the service worker:\n${err}`);
    }
  } else {
    alert("Error: Your browser does not support Service Workers");
  }
}

function getMimeType(fileName) {
  let type;
  const regex = /\.(.{1,8}?$)/;
  switch (fileName.match(regex)[1].toLowerCase()) {
    case "js":
      type = "text/javascript";
      break;
    case "html":
      type = "text/html";
      break;
    case "css":
      type = "text/css";
      break;
    case "svg":
      type = "image/svg+xml";
      break;
  }

  return type;
}

function getFile(data, name) {
  let type = getMimeType(name);
  let options = {};

  if (type) {
    options.type = type;
  }

  let file = new File([data], name, options);
  return file;
}

function getResponse(file) {
  let response = new Response(file);
  return response;
}
