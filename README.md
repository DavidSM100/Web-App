# web-app-runner

This project allows you to run web apps inside zip files easily in your browser completely offline.

## How to use

Clone this project and run it over http localhost and open in the browser.

You can run http localhost using python like this:

`python -m http.server`

Then just go to your browser and write in the adress bar:

`http://localhost:8000`

Once you open the url in the browser you will be able to use it to create new tabs (with new generated urls), on each new tab you will be able to import a zip file from your device files containing web assets, only `index.html` is mandatory since it acts as the entry point. Once imported the zip files will be saved and the page will reload with the web app running.

### How does it work

Once you import the zip file the assets inside it will be saved in the browser storage ([`indexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)) and a [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) will be installed that will be handling the requests and responding with those assets, even offline.
And since each created URL has a different origin then they will be isolated from each other, this is specially important so storages won't mix.
