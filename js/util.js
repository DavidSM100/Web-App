// Get location and hostname
var loc = window.location;
var hostname = loc.hostname;


// Hide elements of the UI according to the hostname
function hideUIElems() {
  if (hostname === 'localhost' || hostname.endsWith('web-app.localhost')) {
    playImg.style.display = "none";
    selectText.style.display = "none";
  } else {
    plusImg.style.display = "none";
    createText.style.display = "none";
  }
}

hideUIElems();

// Register Service Worker
async function registerServiceWorker () {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("service-worker.js");

      // Debugging
      /*
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
      */
      // Debugging

    } catch (error) {
      errorInfo.innerHTML = "error: " + error;
    }
  } else {
    errorInfo.innerHTML = "error: Your browser does not support Service Workers";
  }
}


//Check if one of the values of the array is exactly the same as the value specified
function ifArrayHas(val, arr) {
  return arr.some(v => v === val);
}


//Get name of the webXDC (if app has no manifest or doesn't has the name defined on it then the name will be the file name)
async function getName(files, list, name) {
  var appName = name;
  var ifManifest = ifArrayHas("manifest.toml", list);

  if (ifManifest === true) {
    var obj = files.file('manifest.toml');
    var data = await obj.async('string');
    var regex = /name\s*=\s*["']([^"']+)["']/;
    var match = data.match(regex);
    if (match) {
      appName = match[1];
    }
  }
  return appName;
}


//Get the app icon
function getIcon(files, list) {
  // Regex to check if name starts with "icon."
  var regex = /^icon\./;
  var iconName = "none";
  for (var i = 0; i < list.length; i++) {
    var fileName = list[i];
    if (fileName.match(regex)) {
      iconName = list[i];
    }
  }

  return iconName;
}


//Get a random number (1-1000000000)
function getRandom() {
  return Math.floor(Math.random() * 1000000000) + 1;
}


// Fetch url and put response in the cache
async function addToCache(url, cache) {
  const response = await fetch(url);
  await cache.put(url, response);
  return;
}


// Inject title and icon and others to the html string
function injectStuff(htmlString, name, iconName) {
  // Create new HTML document from the string
  var html = new DOMParser().parseFromString(htmlString,
    "text/html");

  // Add head if not exists
  if (!html.head) {
    var head = html.createElement('head');
    html.appendChild(head);
  }



  // Debugging
  /* uncomment to link eruda.js to every app
  var eruda = html.createElement('script');
  eruda.src = "eruda.js";
  html.head.insertBefore(eruda, html.head.firstChild);
  */
  // Debugging


  // Add title if not exists
  if (!html.title) {
    var title = html.createElement('title');
    title.innerHTML = name;
    html.head.appendChild(title);
  }

  // Add icon link
  if (iconName !== "none") {
    var iconLink = html.createElement('link');
    iconLink.rel = "icon";
    iconLink.href = iconName;

    html.head.insertBefore(iconLink, html.head.firstChild);
  }

  // Add meta "viewport"
  var viewport = html.createElement('meta');
  viewport.name = "viewport";
  viewport.content = "width=device-width, initial-scale=1.0";
  html.head.insertBefore(viewport, html.head.firstChild);

  // Convert back to string
  var newHtml = html.documentElement.innerHTML;

  return newHtml;
}

// Get the mime type of the file using the file name
function getMimeType(fileName) {
  var type = "none";
  const regex = /\.(.{1,8}?$)/
  switch (fileName.match(regex)[1].toLowerCase()) {
    case 'js':
      type = 'text/javascript';
      break;
    case 'html':
      type = 'text/html';
      break;
    case 'css':
      type = 'text/css';
      break;
    case 'svg':
      type = "image/svg+xml";
      break;
  }

  return type;
}


// Create the file with the file data and the name
function getFile(fileData, name) {
  var type = getMimeType(name);

  var options = {};
  if (type !== "none") {
    options.type = type;
  }

  const file = new File([fileData], name, options);

  return file;
}



// Create the file response
function getResponse(file) {
  const response = new Response(file);
  return response;
}