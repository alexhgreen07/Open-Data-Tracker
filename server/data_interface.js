var database = require('./database.js');

module.exports = {
	Refresh_All_Data: function(params, callback){
		
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
		
		callback(return_object);
		
	},
	Refresh_From_Session_Diff: function(params, callback){
		
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
	Diff_Table: function(params, callback)
	{
		//get the parameters
		old_table = params.old_table;
		new_table = params.new_table;
		primary_column = params.primary_column;
		
		callback({});
	},
	Get_Session_Data: function(params, callback){
		
		callback({});
		
	},
	Save_Session_Data: function(params, callback)
	{
		//get the parameters
		data = params.data;
		
		callback({});
	},
};