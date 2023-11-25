// Registration const for serviceWorker
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("service-worker.js");
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

registerServiceWorker();


// Create new link or select app according to hostname
async function openApp() {
  if (hostname === 'localhost' || hostname.endsWith('web-app.localhost')) {
    
    var randomNumber = getRandom();
    var orig = window.origin;
    var url = orig.replace(hostname, randomNumber + ".localhost") + "/index.html";
    window.open(url);


  } else {
    fileInput.click();
  }
}


async function getApp() {
  const selectedFile = fileInput.files[0];
  const fileName = selectedFile.name;

  if (fileName.endsWith('.zip') || fileName.endsWith('.xdc')) {
    const zip = JSZip();
    const content = await zip.loadAsync(selectedFile);
    const list = Object.keys(content.files);
    const ifIndexHtml = ifArrayHas("index.html", list);

    if (ifIndexHtml === true) {
      await addToCache("webxdc.js");
      const cache = await caches.open("App-Cache-DataBase");


      var number = 0;

      content.forEach(async function(path, fileObj) {
        if (fileObj.dir) {
          number += 1;
        } else {
          var fileData;
          if (path === "index.html") {

            const htmlString = await fileObj.async("string");
            const name = await getName(content, list, fileName);
            const iconName = getIcon(content, list);

            fileData = injectStuff(htmlString, name, iconName);

          } else {

            fileData = await fileObj.async("blob");

          }

          const file = getFile(fileData, path);

          const response = getResponse(file);
          await cache.put(path, response);
          number += 1;

        }

        if (number === list.length) {
          location.href = "index.html";
        }
      });

    }


  }

}