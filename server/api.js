var qs = require('querystring');

var database = require('./database.js');
var rpc = require('./rpc_server.js');
var auth = require('./auth.js');

var data_interface = require('./data_interface.js');
var home_data_interface = require('./data_interface_lib/home_data_interface.js');
var item_data_interface = require('./data_interface_lib/item_data_interface.js');
var task_data_interface = require('./data_interface_lib/task_data_interface.js');

//allocate classes to register
var data_interface_obj = new data_interface.Data_Interface();

var sessions = {};

module.exports = {
	API: function(){
		var self = this;
		
		self.counter = 0;
		
		self.Parse_Post = function(request, callback){
			
			var body = '';
	        request.on('data', function (data) {
	            body += data;
	        });
	        
	        request.on('end', function () {
	
	            var post = qs.parse(body);
	            // use POST
				
				callback(post);
	        });
			
		};
		self.Parse_Cookies = function(request) {
			
			var list = {},
			    rc = request.headers.cookie;
			
			rc && rc.split(';').forEach(function( cookie ) {
			    var parts = cookie.split('=');
			    list[parts.shift().trim()] = unescape(parts.join('='));
			    });
			
		    return list;
		};
		self.Get_Current_Session = function(cookies){
			
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
			
			if(!(session_id in sessions))
			{
				sessions[session_id] = {
					session_id: session_id,
					is_authorized: false};
			}
			
			return sessions[session_id];
			
		};
		self.Process = function (request, response)
		{
			var self = this;
			
			if (request.method == 'POST') {
				
				var cookies = self.Parse_Cookies(request);
				
				var current_session = self.Get_Current_Session(cookies);
				
		        self.Parse_Post(request, function(post){
		        	
					self.response = response;
					
					request_connection = new database.Database();
					request_connection.Connect();
					
					current_session.database = request_connection;
					
					var rpc_server = new rpc.Server();
					
					rpc_server.Register_Object(auth, 'Authorize');
					
					if(current_session.is_authorized)
					{
						rpc_server.Register_Object(data_interface_obj, 'Data_Interface');
						rpc_server.Register_Object(home_data_interface, 'Home_Data_Interface');
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
					  	
					  	request_connection.Close();
					});
		        });
		        
		    }
			
			
		};
	},
};
