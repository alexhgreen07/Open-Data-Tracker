var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs([
           'http', 
           'url',
           'path',
           'fs',
           'querystring',
           './server/api.js',
           './core/logger.js',
           ],
       function(
		   http,
		   url,
		   path,
		   fs,
		   qs,
		   api,
		   logger
		   ){
    
	var port = 8888;

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
				
				if(filename.indexOf("/server/") != -1)
				{
					//do not allow any access to server files
					response.writeHead(500, {"Content-Type":"text/plain"});
					response.write("Access denied.\n");
					response.end();
				}
				else
				{
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
			
			}

		});
	}

	http.createServer(function(request, response) {

		var uri = url.parse(request.url).pathname;
		var filename = path.join(process.cwd(), uri);

		if (uri == '/server/api.php') {
			
			var request_api = new api.API();
			request_api.Process(request, response);
			
		} else {
			
			Process_HTTP_Request(request, response, filename);
			
		}

	}).listen(parseInt(port, 10));

	console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
	
	//set the log level for the server
	logger.Set_Log_Level(logger.INFO);
	
});

