var qs = require('querystring');

var config = require('./config.js');

module.exports = {
	counter: 0,
	registered_objects: {},
	methods: {},
	Process: function (post, callback)
	{
		var self = this;
		
		for(key in post)
		{
			var post_object = JSON.parse(key);
			break;
		}
		
		console.log(JSON.stringify(post_object));
		
		method_name = post_object.method;
		
		if(method_name == 'rpc.listMethods')
		{
			self.counter += 1;
			
			self.List_Methods(function(object){
					
					return_object = {};
					return_object.jsonrpc = "2.0";
					return_object.id = self.counter;
					return_object.error = null;
					return_object.result = object;
					
					var return_string = JSON.stringify(return_object);
					
					callback(return_string);
					
				});
		}
		else
		{
			rpc_method = self.methods[method_name];
		
			console.log(method_name + ":" + typeof(rpc_method));
			
			self.counter += 1;
			
			if(typeof(rpc_method) === "function")
			{
				rpc_method(function(object){
					
					return_object = {};
					return_object.jsonrpc = "2.0";
					return_object.id = self.counter;
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
		
	},
	List_Methods: function(callback){
		
		var self = this;
		
		callback(self.registered_objects);
	},
	Function_Name: function (method) {
		
		var name = method.toString();
		
		name = name.substr('function '.length);
		name = name.substr(0, name.indexOf('('));
		
		return name;
	},
	Register_Method: function(method, parent_string){
		
		var self = this;
		
		var name = self.Function_Name(method);
		
		self.methods[name] = method;
		
		parent_string += "." + name;
		
		return parent_string;
	},
	Register_Object: function(object, name){
		
		var self = this;
		
		self.registered_objects[name] = [];
		
		console.log('Registering ' + name + ': ' + JSON.stringify(object));
		
		for(var key in object)
		{
			
			console.log(key + ': ' + JSON.stringify(object[key]));
			
			if(typeof(object[key]) === 'function')
			{
				self.registered_objects[name].push(name);
				self.Register_Method(object[key], name);
			}
			else if(typeof(object[key]) === 'object')
			{
				//self.registered_objects[name][key] = {};
				//self.Register_Object(object[key],name + "." + key);
			}
			
		}
	},
	
};
