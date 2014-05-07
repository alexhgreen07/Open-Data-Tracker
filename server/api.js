define([
        'querystring',
        './database.js',
        './database_updater.js',
        './rpc_server.js',
        './auth.js',
        './data_interface.js',
        './data_interface_lib/home_data_interface.js',
        './data_interface_lib/item_data_interface.js',
        './data_interface_lib/task_data_interface.js',
        ],function(qs,database,database_updater,rpc,auth,data_interface,home_data_interface,item_data_interface,task_data_interface){

	function API(sessions,request_connection,rpc_server, data_interface_obj){
		var self = this;
		
		self.sessions = sessions;
		self.request_connection = request_connection;
		self.data_interface_obj = data_interface_obj;

		self.rpc_server = rpc_server;
		
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
			
			var list = {};
			var rc = request.headers.cookie;
			
			rc && rc.split(';').forEach(function( cookie ) {
			    var parts = cookie.split('=');
			    list[parts.shift().trim()] = unescape(parts.join('='));
			    });
			
		    return list;
		};
		self.Encode_Cookies = function(cookies){
			
			var encoded_cookies = [];
			var expiry = "Thu, 18 Dec 2020 12:00:00 GMT";
			
			for(var key in cookies)
			{
				var cookie_string = '';
				cookie_string += key + '=' + cookies[key] + ';';
				cookie_string += 'expires=' + expiry + ';';
				cookie_string += 'path=/';
				
				encoded_cookies.push(cookie_string);
			}
			
			return encoded_cookies;
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
				
				var bits32 = 0xFFFFFFFF;
				
				session_id = '';
				
				//256-bit random number
				for(var i = 0; i < 8; i++)
				{
					session_id += Math.round(Math.random() * bits32).toString(16);
				}
				
			}
			
			if(!(session_id in self.sessions))
			{
				self.sessions[session_id] = {
					session_id: session_id,
					is_authorized: false};
			}
			
			return self.sessions[session_id];
			
		};
		self.Process = function (request, response)
		{
			var self = this;
			
			if (request.method == 'POST') {
				
		        self.Parse_Post(request, function(post){
		        	
					self.response = response;
					
					self.cookies = self.Parse_Cookies(request);
					
					var current_session = self.Get_Current_Session(self.cookies);
					
					
					self.request_connection.Connect();
					
					current_session.database = self.request_connection;
					
					//ensure database is installed
					database_updater.Update_Database({},current_session,function(){
						
						self.rpc_server.Register_Object(auth, 'Authorize');
						
						auth.Is_Authorized_Session({},current_session,function(object){
							
							if(object)
							{
								self.rpc_server.Register_Object(self.data_interface_obj, 'Data_Interface');
								self.rpc_server.Register_Object(home_data_interface, 'Home_Data_Interface');
								self.rpc_server.Register_Object(item_data_interface, 'Item_Data_Interface');
								self.rpc_server.Register_Object(task_data_interface, 'Task_Data_Interface');
							}
			
							self.rpc_server.Process(post, current_session, function(return_string)
							{
								
								self.cookies['node_session_id'] = current_session.session_id;
								
								//check session authorization
								auth.Is_Authorized_Session({},current_session,function(object){
									
									//send authorization status to client
									self.cookies['is_authorized'] = object;
									
									var encoded_cookies = self.Encode_Cookies(self.cookies);
								
									self.response.writeHead(200, 
										{
											"Content-Type": "text/plain",
											"Set-Cookie": encoded_cookies,
										});
									self.response.write(return_string);
								  	self.response.end();
								  	
								  	self.request_connection.Close();
									
								});
								
							});
							
						});
						
					});
					
		        });
		        
		    }
			
			
		};
	}
	
	function Build_API(sessions)
	{
		var request_connection = new database.Database();
		var rpc_server = new rpc.Server();
		var data_interface_obj = new data_interface.Data_Interface();
		
		var built_api = new API(sessions, request_connection, rpc_server, data_interface_obj);
		
		return built_api;
	}
	
	return {
		Build_API: Build_API,
		API: API,
	};
});

