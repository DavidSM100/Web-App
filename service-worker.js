// Get the response to the url request
async function getResponse(fileUrl) {
  // Getting path for the url of the request
  var url = new URL(fileUrl);
  var path = url.pathname.replace('/', "");
  
  // Open Cache database
  var cache = await caches.open("App-Cache-DataBase");
  // Getting cache item if there is a match
  var response = await cache.match(path);
  
  // If the response it is in the cache then return it, else get it from the network
  if (response) return response;
  const networkResponse = await fetch(fileUrl);
  return networkResponse;
}


// Fetch event, triggers everytime any kind of resource is fetched some how
self.addEventListener("fetch", (event) => {
  // Replacing the default respond with the cache response (in case the item it is in the cache)
  event.respondWith(getResponse(event.request.url));
});