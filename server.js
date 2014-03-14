var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var qs = require('querystring');

var api = require('./server/api.js');

var port = process.argv[2] || 8888;


/***********HTTP****************/

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);
  
  if(uri == '/server/api.php')
  {

  		api.API(request,response);
  	
	  	return;
  }

  path.exists(filename, function(exists) {
  	
    if(!exists) {
    	
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      
      return;
    }

    if (fs.statSync(filename).isDirectory()){
    	
    	filename += '/index.html';
    	
    } 

    fs.readFile(filename, "binary", function(err, file) {
    	
      if(err) {  
      	      
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        
        return;
      }

      response.writeHead(200);
      
      response.write(file, "binary");
      response.end();
      
    });
    
  });
  
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
