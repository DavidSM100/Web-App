# Web-App
Web-App allows you to open web apps easily in your browser completely offline.
You can also run [WebXDCs](https://webxdc.org/)!

![Examples of apps](example-imgs/opened-apps.jpg)

## How to use ?
Clone this project and run it over http localhost and open in the browser.

You can run http localhost using python like this:

`python -m http.server`


Then just go to your browser and write in the adress bar:

`http://localhost:8000`


It is also allowed to use the url like this:

`http://web-app.localhost:8000`

Also you can put anything before "web-app" in case you need it for some reason.


### Using the app
Once you open the url in the browser the main app should open, you will be able to use it to create new windows (with new random urls), on each new window you will be able to select a web app which will have to be inside a .zip file (or .xdc in case of WebXDCs) that you will select from your device files.
Once the selected web app is opened it will be accessible completely offline from that url even when you close the http server.
So you can open as many new windows as you want and select a web app for each one, once you finish opening new windows you can close the http server and all you opened will be accessible for ever from that url and offline.

## Notes
Every app can have an icon, just need to have an img in the root directory of the zip named "icon." + ext and also a name that can be set as the index.html title or in WebXDC case in the app manifest.


This will be useful to recognize easily every app in the browser since there will be a random url for every app and also to recognize apps shorcuts on the home screen (on browsers and OS that supports it), as you can see in the screenshots below.

![Apps bookmakers](example-imgs/bookmarkers.jpg)


![Apps home screen shortcuts](example-imgs/screen-shortcuts.jpg)


This app requires [ServiceWorkers](https://developer.mozilla.org/en/docs/Web/API/Service_Worker_API) to work in the navigator where you open the web apps.



