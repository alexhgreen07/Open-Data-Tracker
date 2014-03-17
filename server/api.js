var qs = require('querystring');

var database = require('./database.js');
var rpc = require('./rpc_server.js');
var auth = require('./auth.js');

var data_interface = require('./data_interface.js');

module.exports = {
	counter: 0,
	sessions: {},
	Parse_Post: function(request, callback){
		
		var body = '';
        request.on('data', function (data) {
            body += data;
        });
        
        request.on('end', function () {

            var post = qs.parse(body);
            // use POST
			
			callback(post);
        });
		
	},
	Parse_Cookies: function(request) {
		
		var list = {},
		    rc = request.headers.cookie;
		
		rc && rc.split(';').forEach(function( cookie ) {
		    var parts = cookie.split('=');
		    list[parts.shift().trim()] = unescape(parts.join('='));
		    });
		
	    return list;
	},
	Get_Current_Session: function(cookies){
		
		var self = this;
		
		var session_id = 0;
			
		if('node_session_id' in cookies)
		{
			session_id = cookies['node_session_id'];
		}
		else
		{
			//64-bit random number
			session_id = Math.round(Math.random() * 0xFFFFFFFF).toString(16);
			session_id += Math.round(Math.random() * 0xFFFFFFFF).toString(16);
		}
		
		if(!(session_id in self.sessions))
		{
			self.sessions[session_id] = {
				session_id: session_id,
				is_authorized: false};
		}
		
		return self.sessions[session_id];
		
	},
	Process: function (request, response)
	{
		var self = this;
		
		if (request.method == 'POST') {
			
			var cookies = self.Parse_Cookies(request);
			
			var current_session = self.Get_Current_Session(cookies);
			
	        self.Parse_Post(request, function(post){
	        	
				self.response = response;
				
				database.Connect();
				
				var rpc_server = new rpc.Server();
				
				rpc_server.Register_Object(auth, 'Authorize');
				
				if(current_session.is_authorized)
				{
					rpc_server.Register_Object(data_interface, 'Data_Interface');
				}

				rpc_server.Process(post, current_session, function(return_string)
				{
					self.response.writeHead(200, 
						{
							"Content-Type": "text/plain",
							"Set-Cookie": "node_session_id=" + current_session.session_id,
						});
					self.response.write(return_string);
				  	self.response.end();
				  	
				  	database.Close();
				});
	        });
	        
	    }
		
		
	},
};
