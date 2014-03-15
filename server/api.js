var qs = require('querystring');

var config = require('./config.js');
var database = require('./database.js');

database.Connect();

module.exports = {
	counter: 0,
	registered_objects: [],
	methods: {"rpc.listMethods": this.List_Methods},
	Process_RPC: function (post, callback)
	{
		var self = this;
		
		for(key in post)
		{
			var post_object = JSON.parse(key);
			break;
		}
		
		console.log(JSON.stringify(post_object));
		
		method_name = post_object.method;
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
		
		
	},
	List_Methods: function(callback){
		
		var self = this;
		
		var return_object = {};
		
		return_object = JSON.parse('{"Data_Interface":["Data_Interface","Refresh_All_Data","Refresh_From_Session_Diff","Diff_Table","Get_Session_Data","Save_Session_Data"],"Home_Data_Interface":["Home_Data_Interface","Get_Categories_Schema","Get_Categories","Insert_Category","Update_Category","Delete_Category","Get_Settings","Update_Settings"],"Item_Data_Interface":["Item_Data_Interface","Insert_Item_Entry","Update_Item_Entry","Delete_Item_Entry","Insert_New_Item","Edit_Item","Delete_Item","Insert_Item_Target","Update_Item_Target","Delete_Item_Target","Get_Item_Log_Schema","Get_Item_Log","Get_Items_Schema","Get_Items","Get_Item_Targets_Schema","Get_Item_Targets","Insert_Recurring_Children","Update_Recurring_Children","Delete_Recurring_Children"],"Task_Data_Interface":["Task_Data_Interface","Insert_Task_Entry","Update_Task_Entry","Delete_Task_Entry","Insert_Task","Delete_Task","Update_Task","Get_Tasks_Schema","Get_Tasks","Get_Task_Log_Schema","Get_Task_Log","Get_Task_Targets_Schema","Get_Task_Targets","Insert_Task_Target","Update_Task_Target","Delete_Task_Target","Break_Recuring_Child","Insert_Recurring_Children","Update_Recurring_Children","Delete_Recurring_Children"],"Report_Data_Interface":["Report_Data_Interface","Save_Report","Update_Saved_Report","Delete_Saved_Report","Get_Saved_Reports"]}');
		
		callback(return_object);
	},
	Register_Object: function(object){
		
		var self = this;
		
		self.registered_objects.push(object);
		
	},
	Process_Request: function (request, response)
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
				
				self.methods = {"rpc.listMethods": self.List_Methods};
				
				self.Process_RPC(post, function(return_string)
				{
					self.response.writeHead(200, {"Content-Type": "text/plain"});
				  	self.response.write(return_string);
				  	self.response.end();
				});
				
	        });
	        
	    }
		
		
	},
};
