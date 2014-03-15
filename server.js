var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var qs = require('querystring');

var api = require('./server/api.js');

var port = process.argv[2] || 8888;


/***********HTTP****************/

function Process_HTTP_Request(request, response, filename)

{
	path.exists(filename, function(exists) {

		if (!exists) {

			response.writeHead(404, {"Content-Type":"text/plain"});
			response.write("404 Not Found\n");
			response.end();

		}
		else
		{
			if (fs.statSync(filename).isDirectory()) {
	
				filename += '/index.html';
	
			}
	
			fs.readFile(filename, "binary", function(err, file) {
	
				if (err) {
	
					response.writeHead(500, {"Content-Type":"text/plain"});
					response.write(err + "\n");
	
				}
				else
				{
					response.writeHead(200);
					response.write(file, "binary");
					
				}
				
				response.end();
	
			});
		}

	});
}

http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd(), uri);

	if (uri == '/server/api.php') {
		
		api.Process_Request(request, response);
		
	} else {
		
		Process_HTTP_Request(request, response, filename);
		
	}

}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
