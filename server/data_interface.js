define([
        './data_interface_lib/home_data_interface.js',
        './data_interface_lib/item_data_interface.js',
        './data_interface_lib/task_data_interface.js',
        ],function(home_data_interface,item_data_interface,task_data_interface){
	
	function Diff_Table(old_table, new_table, primary_column)
	{
		var diff_table = [];
		
		old_count = 0;
		new_count = 0;
		
		while((old_count < old_table.length) || (new_count < new_table.length))
		{
			var old_row = old_table[old_count];
			var new_row = new_table[new_count];
			
			if((old_count >= old_table.length))
			{
				diff_table.push({'operation': 'insert','row': new_row});
				new_count++;
			}
			else if(new_count >= new_table.length)
			{
				diff_table.push({'operation': 'remove','row': old_row});
				old_count++;
			}
			else if(old_row[primary_column] < new_row[primary_column])
			{
				diff_table.push({'operation': 'remove','row': old_row});
				old_count++;
			}
			else if(old_row[primary_column] > new_row[primary_column])
			{
				
				diff_table.push({'operation': 'insert','row': new_row});
				new_count++;
			}
			else {
				
				//compare each column in each row
				for(var key in old_row)
				{
					if(JSON.stringify(old_row[key]) != JSON.stringify(new_row[key]))
					{
						diff_table.push({'operation': 'update','row': new_row});
						
						break;
					}
				}
				
				old_count++;
				new_count++;
			}
		}
		
		return diff_table;
	}
	
	function Data_Interface(){
		
		var self = this;
		
		this.Refresh_All_Data = function(params, session, callback){
		
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
			
			return_object.forms = {};
			
			var counter = 0;
			
			var counter_callback = function()
			{
				counter -= 1;
				if(counter == 0)
				{
					var params = {};
					
					params.data = return_object.data;
					
					if(!session.data)
					{
						session.data = return_object.data;
					}
					
					home_data_interface.Get_Homepage_Report(params, session, function(object){
						
						return_object.forms["home_report"] = object;
						
						callback(return_object);
						
					});
					
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
			
		};
		
		this.Refresh_From_Session_Diff = function(params, session, callback){
			
			var return_object = {};
			
			self.Refresh_All_Data(params, session, function(object){
				
				return_object.data = {};
				return_object.data["Categories"] = Diff_Table(session.data["Categories"], object.data["Categories"], 'Category ID');
				return_object.data["items"] = Diff_Table(session.data["items"], object.data["items"], 'item_id');
				return_object.data["item_entries"] = Diff_Table(session.data["item_entries"], object.data["item_entries"], 'item_log_id');
				return_object.data["item_targets"] = Diff_Table(session.data["item_targets"], object.data["item_targets"], 'item_target_id');
				return_object.data["tasks"] = Diff_Table(session.data["tasks"], object.data["tasks"], 'task_id');
				return_object.data["task_entries"] = Diff_Table(session.data["task_entries"], object.data["task_entries"], 'task_log_id');
				return_object.data["task_targets"] = Diff_Table(session.data["task_targets"], object.data["task_targets"], 'task_schedule_id');
				
				return_object.settings = {};
				return_object.settings["settings"] = [];
				return_object.settings["setting_entries"] = [];
				
				return_object.reports = [];
				
				session.data = object.data;
				
				callback(return_object);
				
			});
			
			
			
		};
					
		this.Get_Session_Data = function(params, session, callback){
			
			callback({});
			
		};
		
		this.Save_Session_Data = function(params, session, callback)
		{
			//get the parameters
			data = params.data;
			
			callback({});
		};
		
	}
	
	return {
		Data_Interface: Data_Interface,
	};
});
