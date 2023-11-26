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
    const numbers = list.length;
    const ifIndexHtml = ifArrayHas("index.html", list);

    if (ifIndexHtml === true) {

      const cache = await caches.open("App-Cache-DataBase");


      // Debugging
      /* uncomment to add the file eruda.js to every app
      await addToCache("eruda.js", cache);
      */
      // Debugging


      await addToCache("webxdc.js", cache);


      var number = 0;

      content.forEach(async function(path, fileObj) {
        if (fileObj.dir) {
          number += 1;

          if (number === numbers) {
            location.href = "index.html";
          }

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

          if (number === numbers) {
            location.href = "index.html";
          }

        }

      });

    }


  }

}