var http = require("http");
var fs = require("fs");
// some config variables. 
var config = {
	indexFile: "index.html", // index file refers to what the main page of each dir should be named
	contentDir: "./content/", // basically where all the junk is hiding
	charset: "utf8",
	port: 8080,
	host: "localhost"
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
						res.end("<html><body><h1>File gone :/</h1></body></html>")
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
						res.writeHead(404, {"Content-Type": "text/html"})
						res.end(`<html><body><h1>uh uuuuuh: ${file}</h1></body></html>`)
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
						res.end("<center>404</center>")
					}
					// if we cant call them idiots we need to do some work
					else {
						// isolate the extension 
						let ext = link.split(".")
						ext = ext[ext.length-1]
						// placeholders for the two parts of content type header
						let type
						let lang
						// set the types based on approved file extensions
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
						res.writeHead(200, {"Content-Type": `${type}/${lang}`})
						res.end(data)
					}
				})
			}
			break
		// if it isnt a get request I'm not dealing with it right now. I'm busy 
		case "POST":
			let body='';
			req.on('data', (data => {
				body += data;
				console.log(`data: ${data}`)
			}))
			req.on('end', ()=>{
				res.writeHead(200, {"Content-Type":"text/plain"})
				res.end(body)
			})
			console.log(body)
			break
		default:
			res.writeHead(403, {"Content-Type": "text/plain"})
			res.end("Forbidden")
			break

	}
})

server.listen(config.port, config.host, ()=>{
	console.log("she goin");
})
