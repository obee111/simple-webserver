var http = require("http");
var fs = require("fs");
// local config file (config.js)
var config = require("./config");

var contType = (ext) => {
	let type
	let lang
	// set the types based on approved file extensions
	// AYO JIT YOU NEED TO ADD DIFFERENT MEDIA TYPES
	switch(ext){
		case "html":
			type = "text"
			lang = "html"
			break
		case "css":
			type = "text"
			lang = "css"
			break
		case "js":
			type = "text"
			lang = "javascript"
			break
		case "json":
			type = "application"
			lang = "json"
			break
		default:
			type = "text"
			lang = "plain"
	}
	return `${type}/${lang}`
}
var getErrFile = (code, errFile) => {
	fs.readFile(config.errorFiles.directory + errFile, (err, data) => {
		if (err) {
			return `Error ${code}`
			console.log(`${code}.html wasn't sent`)
		}
		else {
			return data
		}
	})
}

var server = http.createServer((req, res) => {
	let urlVals = req.url.split("?");
	let link = urlVals[0];
	let vals = urlVals[1];
	console.log(`${req.method}  ${req.url}`)
	// console.log(`${link} and ${vals}`)
	switch (req.method){
		// if its a get request
		case "GET":
			// first determine if they want index, index for another dir, or a specific file 
			let file
			if (link == "/") {
				file = config.contentDir + config.indexFile
				fs.readFile(file, (err, data) => {
					if (err){
						// 410 is file gone. file not found doesnt seem appropriate for /
						res.writeHead(410, {"Content-Type": "text/html"})
						// let errRes = fs.readFileSync(config.errorFiles.directory + config.errorFiles.gone)
						// res.end(errRes)
						res.end(getErrFile(410, config.errorFiles.gone))
					}
					else {
						res.writeHead(200, {"Content-Type": "text/html"})
						res.end(data)
					}
				})
			}
			// if theres no file extension (no ".")
			else if (link.split(".").length === 1){
				// first take the content directory
				file = config.contentDir
				if (link[link.length-1] !== "/") {
					// if theres no / at the end add it in and add the index file name
					file += link + "/" + config.indexFile
				}
				else {
					// if theres a / just slap that sammy together
					file += link + config.indexFile
				}
				fs.readFile(file, (err, data) => {
					// if we cant find it we tell them 
					if (err){
						fs.readdir(config.contentDir + link + "/", (err, data) => {
							if (err || !config.viewDirs) { // I don't understand if this would work or why this doesn't
								res.writeHead(404, {"Content-Type": contType("html")})
								res.end(getErrFile(404, config.errorFiles.notFound))
								// console.log(err.message)
							}
							else {
								// Semi sure this works every time
								// Respond with 200 because this is (probably) intentional
								res.writeHead(200, {"Content-Type": contType("html")})
								// synchronously load header and footer files
								let header = fs.readFileSync(config.headerFile)
								let footer = fs.readFileSync(config.footerFile)
								// respond with header + list + footer
								res.write(header + `<h3>${link}</h3><ul>`);
								for (var i = 0; i < data.length; i++) {
									res.write(`<li><a href="${link + "/" + data[i]}">${data[i]}</a></li>`)
								}
								res.end("</ul>" + footer);
							}
						})
					}
					else {
						// when we find the index file for that dir we just fire it right at them. simple as
						res.writeHead(200, {"Content-Type": "text/html"})
						res.end(data)
					}
				})
			}
			else {
				// this is the weird one. If they want a file we need to get the right file and the headers
				fs.readFile(config.contentDir + link, (err, data) => {
					// if the file is MIA just tell them to get f***ed
					if (err) {
						res.writeHead(404, {"Content-Type": "text/html"})
						res.end(getErrFile(404, config.errorFiles.notFound))

					}
					// if we cant call them idiots we need to do some work
					else {
						// isolate the extension 
						let ext = link.split(".")
						ext = ext[ext.length-1]
						// placeholders for the two parts of content type header 
						res.writeHead(200, {"Content-Type": contType(ext)})
						res.end(data)
					}
				})
			}
			break
		// DO WHAT YOU WANT WITH POST REQUESTS 
		default:
			res.writeHead(403, {"Content-Type": "text/plain"})
			res.end(getErrFile(403, config.errorFiles.forbidden))
			break
	}
})

server.listen(config.port, config.host, ()=>{
	console.log(`Live at ${config.host}:${config.port}`);
})
