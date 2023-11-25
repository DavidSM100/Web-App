// Get location and hostname where the app got opened
var loc = window.location;
var hostname = loc.hostname;

// Hide text of the UI according to the hostname(if it is the main app hide some of them, if it is a url hide others)
function hideTexts() {
if (hostname === 'localhost' || hostname.endsWith('web-app.localhost')) {
 urlInfo.style.display = "none";
  selectAppText.style.display = "none";
} else {
  createInstanceText.style.display = "none";
}
}

hideTexts();


//Check if one of the values of the array is exactly the same as the value specified.
function ifArrayHas(value, array) {
  var trueFalse = false;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      trueFalse = true;
      break;
    }
  }
  return trueFalse;
}


//Get name of the app (if app has no manifest or doesn't has the name defined on it then the name will be the file name)
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


// Fetch url and put response in the cache
async function addToCache(url) {
  var cache = await caches.open("App-Cache-DataBase");
  var response = await fetch(url);
  await cache.put(url, response);
  return;
}


// Inject title and icon to the app html
function injectStuff(htmlString, name, iconName) {
  // Create new HTML document from the string
  var html = new DOMParser().parseFromString(htmlString,
    "text/html");

// Add head if not exists
  if (!html.head) {
    var head = html.createElement('head');
    html.appendChild(head);
  }

// Add title if not exists
  if (!html.title) {
    var title = html.createElement('title');
    title.innerHTML = name;
    html.head.appendChild(title);
  }

// Add link to icon
  if (iconName !== "none") {
    var iconLink = html.createElement('link');
    iconLink.rel = "icon";
    iconLink.href = iconName;

    html.head.insertBefore(iconLink, html.head.firstChild);
  }

// Convert back to string
  var newHtml = html.documentElement.innerHTML;

  return newHtml;
}


// Create the file with the file data and the name
function getFile(fileData, name) {
  var type = "text/plain";
  if (name.endsWith('.html')) {
    type = "text/html";
  } else if (name.endsWith('.css')) {
    type = "text/css";
  } else if (name.endsWith('.js')) {
    type = "text/javascript";
  } else if (name.endsWith('.svg')) {
    type = "image/svg+xml";
  }

  const file = new File([fileData], name, {
    type: type
  });

  return file;
}


//Get a random number (1-1000000000)
function getRandom() {
  return Math.floor(Math.random() * 1000000000) + 1;
}


// Create the file response
function getResponse(file) {
  const response = new Response(file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return response;
}