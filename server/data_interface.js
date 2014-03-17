var database = require('./database.js');

var home_data_interface = require('./data_interface_lib/home_data_interface.js');
var item_data_interface = require('./data_interface_lib/item_data_interface.js');
var task_data_interface = require('./data_interface_lib/task_data_interface.js');

module.exports = {
	Refresh_All_Data: function(params, session, callback){
		
		var return_object = {};
		
		return_object.data = {};
		return_object.data["Categories"] = [];
		return_object.data["items"] = [];
		return_object.data["item_entries"] = [];
		return_object.data["item_targets"] = [];
		return_object.data["tasks"] = [];
		return_object.data["task_entries"] = [];
		return_object.data["task_targets"] = [];
		
		return_object.schema = {};
		return_object.schema["Categories"] = [];
		return_object.schema["items"] = [];
		return_object.schema["item_entries"] = [];
		return_object.schema["item_targets"] = [];
		return_object.schema["tasks"] = [];
		return_object.schema["task_entries"] = [];
		return_object.schema["task_targets"] = [];
		
		return_object.settings = {};
		return_object.settings["settings"] = [];
		return_object.settings["setting_entries"] = [];
		
		return_object.reports = [];
		
		var counter = 0;
		
		var counter_callback = function()
		{
			counter -= 1;
			if(counter == 0)
			{
				callback(return_object);
			}
		};
		
		var queries = [];
		
		queries.push({
			method: home_data_interface.Get_Categories,
			callback: function(object){
				
				return_object.data["Categories"] = object;
				counter_callback();
				
			}});
			
		queries.push({
			method: item_data_interface.Get_Item_Log,
			callback: function(object){
				
				return_object.data["item_entries"] = object;
				counter_callback();
				
			}});
			
		queries.push({
			method: item_data_interface.Get_Items,
			callback: function(object){
				
				return_object.data["items"] = object;
				counter_callback();
				
			}});
			
		queries.push({
			method: item_data_interface.Get_Item_Targets,
			callback: function(object){
				
				return_object.data["item_targets"] = object;
				counter_callback();
				
			}});
		
		queries.push({
			method: task_data_interface.Get_Tasks,
			callback: function(object){
				
				return_object.data["tasks"] = object;
				counter_callback();
				
			}});
		
		queries.push({
			method: task_data_interface.Get_Task_Log,
			callback: function(object){
				
				return_object.data["task_entries"] = object;
				counter_callback();
				
			}});
		
		queries.push({
			method: task_data_interface.Get_Task_Targets,
			callback: function(object){
				
				return_object.data["task_targets"] = object;
				counter_callback();
				
			}});
		
		queries.push({
			method: home_data_interface.Get_Categories_Schema,
			callback: function(object){
				
				return_object.schema["Categories"] = object;
				counter_callback();
				
			}});
			
		queries.push({
			method: item_data_interface.Get_Item_Log_Schema,
			callback: function(object){
				
				return_object.schema["item_entries"] = object;
				counter_callback();
				
			}});
			
		queries.push({
			method: item_data_interface.Get_Items_Schema,
			callback: function(object){
				
				return_object.schema["items"] = object;
				counter_callback();
				
			}});
			
		queries.push({
			method: item_data_interface.Get_Item_Targets_Schema,
			callback: function(object){
				
				return_object.schema["item_targets"] = object;
				counter_callback();
				
			}});
		
		queries.push({
			method: task_data_interface.Get_Tasks_Schema,
			callback: function(object){
				
				return_object.schema["tasks"] = object;
				counter_callback();
				
			}});
		
		queries.push({
			method: task_data_interface.Get_Task_Log_Schema,
			callback: function(object){
				
				return_object.schema["task_entries"] = object;
				counter_callback();
				
			}});
		
		queries.push({
			method: task_data_interface.Get_Task_Targets_Schema,
			callback: function(object){
				
				return_object.schema["task_targets"] = object;
				counter_callback();
				
			}});
		
		counter = queries.length;
		
		for(var key in queries)
		{
			queries[key].method({}, session,queries[key].callback);
		}
		
	},
	Refresh_From_Session_Diff: function(params, session, callback){
		
		var return_object = {};
		
		return_object.data = {};
		return_object.data["Categories"] = [];
		return_object.data["items"] = [];
		return_object.data["item_entries"] = [];
		return_object.data["item_targets"] = [];
		return_object.data["tasks"] = [];
		return_object.data["task_entries"] = [];
		return_object.data["task_targets"] = [];
		
		return_object.settings = {};
		return_object.settings["settings"] = [];
		return_object.settings["setting_entries"] = [];
		
		return_object.reports = [];
		
		callback(return_object);
		
	},
	Diff_Table: function(params, session, callback)
	{
		//get the parameters
		old_table = params.old_table;
		new_table = params.new_table;
		primary_column = params.primary_column;
		
		callback({});
	},
	Get_Session_Data: function(params, session, callback){
		
		callback({});
		
	},
	Save_Session_Data: function(params, session, callback)
	{
		//get the parameters
		data = params.data;
		
		callback({});
	},
};