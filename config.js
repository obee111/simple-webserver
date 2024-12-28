var config = {
	// index file refers to what the main page of each directory should be named
	indexFile: "index.html", 
	// basically where all the junk is hiding
	contentDir: "./content/", 
	// Character encoding
	charset: "utf8",
	// Port the server runs on
	port: 8080,
	// hostname (?)
	host: "localhost",
	// Does a lack of an index file in directory return a list of it's contents contents
	viewDirs: true,
	// below files determine head/foot of directory files
	headerFile: "headfile.html",
	footerFile: "footfile.html",

	// Where your error files are and what each one is named
	errorFiles: {
		directory:"error-files/",
		// The filenames below need to be in the above directory to be called correctly 
		// Error 410 File Gone
		gone: "410.html",
		// Error 404 File Not Found
		notFound: "404.html",
		// Error 403 Forbidden
		forbidden: "403.html"
	}
}

module.exports = config;