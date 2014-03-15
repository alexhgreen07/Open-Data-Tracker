var qs = require('querystring');

var config = require('./config.js');
var database = require('./database.js');
var rpc = require('./rpc_server.js');

module.exports = {
	counter: 0,
	registered_objects: {},
	methods: {},
	Process: function (request, response)
	{
		var self = this;
		
		if (request.method == 'POST') {
			
	        var body = '';
	        request.on('data', function (data) {
	            body += data;
	        });
	        
	        request.on('end', function () {
	
	            var post = qs.parse(body);
	            // use POST
				
				self.response = response;
				
				database.Connect();
				
				rpc.Process(post, function(return_string)
				{
					self.response.writeHead(200, {"Content-Type": "text/plain"});
				  	self.response.write(return_string);
				  	self.response.end();
				  	
				  	database.Close();
				});
				
	        });
	        
	    }
		
		
	},
};
