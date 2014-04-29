define([
        'querystring',
        './config.js',
        '../core/logger.js',
        ],function(
		qs,
		config,
		logger
		){
	return {
		Server: function()
		{
			var self = this;
			
			self.counter = 0;
			self.registered_objects = {};
			self.methods = {};
			
			self.Process = function (post, session, callback)
			{
				var self = this;
				
				for(key in post)
				{
					var post_object = JSON.parse(key);
					break;
				}
				
				logger.Info(JSON.stringify(post_object));
				
				method_name = post_object.method;
				
				if(method_name == 'rpc.listMethods')
				{
					
					self.List_Methods({}, session, function(object){
							
							return_object = {};
							return_object.jsonrpc = "2.0";
							return_object.id = post_object.id;
							return_object.error = null;
							return_object.result = object;
							
							var return_string = JSON.stringify(return_object);
							
							callback(return_string);
							
						});
				}
				else
				{
					rpc_method = self.methods[method_name];
				
					self.counter += 1;
					
					if(typeof(rpc_method) === "function")
					{
						params = post_object.params;
						
						rpc_method(params, session, function(object){
							
							return_object = {};
							return_object.jsonrpc = "2.0";
							return_object.id = post_object.id;
							return_object.error = null;
							return_object.result = object;
							
							var return_string = JSON.stringify(return_object);
							
							callback(return_string);
							
						});
						
					}
					else
					{
						return_object = {};
						return_object.jsonrpc = "2.0";
						return_object.id = self.counter;
						return_object.error = {};
						return_object.error.code = 1;
						return_object.error.message = "Function does not exist.";
						return_object.error.data = {fullMessage : "Function does not exist."};
						return_object.result = null;
						
						var return_string = JSON.stringify(return_object);
						
						callback(return_string);
					}
				}
				
			};
			self.List_Methods = function(params, session, callback){
				
				var self = this;
				
				callback(self.registered_objects);
			};
			self.Register_Method = function(method, name){
				
				var self = this;
				
				self.methods[name] = method;
				
				return name;
			};
			self.Register_Object = function(object, name){
				
				var self = this;
				
				self.registered_objects[name] = [];
				
				for(var key in object)
				{
					
					if(typeof(object[key]) === 'function')
					{
						
						self.registered_objects[name].push(key);
						self.Register_Method(object[key], name + "." + key);
					}
					else if(typeof(object[key]) === 'object')
					{
						self.registered_objects[name].push(key);
						self.Register_Object(object[key],name + "." + key);
					}
					
				}
			};
		},
		
	};
});

