# simple-webserver
A simple webserver to get me back in the groove

So far it can handle get requests for html, css, js, and json.

Setup
```
git clone https://github.com/obee111/simple-webserver.git
npm start
```

Intent is to have a webserver that can do any static website you throw at it

## Tasks

- Run as daemon / create CLI tool
- Image / Video support
- Learn how webservers actually work so I can run this like nginx
- Make config super easy to use

## File structure

Everything except for what is listed below is there just for an example

```
.
	/README.md
	/package.json (npm shenanigans)
	/config.js (settings)
	/server.js (where the magic happens)
	/content/
		(directory where content is served from, configurable in config.js)
	/error-files/
		(directory for error responses, configurable in config.js)

```
