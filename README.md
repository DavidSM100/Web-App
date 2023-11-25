# Web-App
This allows you to open web apps easily in your browser completely offline.

![Examples of apps](example-imgs/opened-apps.jpg)

## How to use ?
Just run it over http localhost and open in the browser.

You can run it using python like this:

`python -m http.server`

Then just go to your browser and write in the adress bar:

`http://localhost:8000`

It is also allowed to use the url like this:

`http://web-app.localhost:8000`

Also you can put anything before "web-app" in case you need it for some reason.


## Notes

This allows you to run [webXDCs](https://webxdc.org/) too!


Every app can have an icon (just need to have an img in the root directory named "icon." + ext) and also a name that can be set as the index.html title or in webxdc case in the app manifest.


This will be useful to recognize easily every app in the browser since there will be a random url for every app and also to recognize apps shorcuts on the home screen (on browsers and OS that supports it), as you can see in the screenshots below.

![Apps bookmakers](example-imgs/bookmarkers.jpg)


![Apps home screen shortcuts](example-imgs/screen-shortcuts.jpg)



