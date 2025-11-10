# web-app-runner

This project allows you to run web apps inside zip files in your browser, once a web app is saved it will work offline.

## How to set it up locally

Clone this project and run it over `http` on `localhost` and open in the browser.

You can do it using python like this:

`python -m http.server`

Then just go to your browser and write in the adress bar:

`http://localhost:8000`

## How set it up online

- For all dynamic subdomains set a DNS record type `A` with host `*.yourdomain.com` pointing to your server IP address.
- For the main page set a DNS record type `A` with host `yourdomain.com` pointing to your server IP address.
- Clone this repo on your server and run a `https` static web server using the files from this repo, common choices for this are [nginx](https://nginx.org/) or [Apache](https://httpd.apache.org/).
- Since this needs `https` you will need a certificate issued to `*.yourdomain.com` and `yourdomain.com`, you can get free certificates from [Let's encrypt](https://letsencrypt.org/).

### Notes

- Replace `yourdomain.com` with your real domain name.
- You can also use a subdomain instead of the main domain, example: `*.yoursubdomain.yourdomain.com` and `yoursubdomain.yourdomain.com`.

## How to use

Once you open the url in the browser you will be able to use it to create new tabs (with new generated urls), on each new tab you will be able to import a zip file from your device files containing web assets, only `index.html` is mandatory since it acts as the entry point. Once imported the zip files will be saved and the page will reload with the web app running.

Others pages can also generate urls for an instance of this and put a url param in the hash(#) of the url and when this page loads it will download the url (which should be a zip file) and use it as input.

Let's say you know an instance of this is running on `https://example.com`, you would generate a url like `https://webapp-unique-id-for-webapp.example.com/#url=https%3A%2F%2Fthe-webapp-zip-download-link.zip`. It needs to start with `webapp-` since it is how it knows this url is for running a new instance of a web app instead of the main page.

### How does it work

Once you import the zip file the assets inside it will be saved in the browser storage ([`indexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)) and a [`ServiceWorker`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker) will be installed that will be handling the requests and responding with those assets, even offline.
And since each created URL has a different origin then they will be isolated from each other, this is specially important since this isolates the storage to each URL.
