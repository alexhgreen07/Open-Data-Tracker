define([
        'jsonrpc',
        './json_rpc_queue',
        'core/datetimes',
        ],function(jsonrpc, json_rpc_queue, datetimes){
	
	/** Represents the main api to the server.
	 * @constructor Server_API
	 */
	function Server_API(rpc_queue) {
		
		var self = this;
		
		//this.rpc_queue = new json_rpc_queue.JSON_RPC_Queue();
		this.rpc_queue = rpc_queue;
		
		this.rpc = null;
		
		this.is_busy_callback = function(is_busy){};
		this.data_refresh_callback = function(){};
		this.data_diff_callback = function(){};
		
		this.Build_Method = function(method, source_object){
			
			var return_function = function(args,callback){
	        	
	        	self.is_busy_callback(true);
	        	
	        	self.rpc_queue.Queue_RPC(
					source_object[method],
					args,
					function(jsonRpcObj){
						
						//try
						{
							callback(jsonRpcObj);
						}
						//catch(err)
						{
							//alert(err.message);
						}
						
						self.is_busy_callback(false);
						
					});
	        	
	        };
	        
	        return return_function;
			
		};
		
		this.Add_Object_Methods = function(source_object, destination_object)
		{
			//iterate through all the members of the object
		    for(var member in source_object) {
		    	
		    	//if the member is a function, add the function
	        	if(typeof(source_object[member]) == "function"){
	        		
	        		
	        		destination_object[member] = self.Build_Method(member, source_object);
		            
	            }
	            else if(typeof(source_object[member]) == "object")
	            {
	            	
	            	destination_object[member] = {};
	            	self.Add_Object_Methods(source_object[member], destination_object[member]);
	            	
	            }
	        
		    }
		    
		};
		
		this.Connect = function(url, callback){
			
			self.has_refreshed = false;
			
			self.rpc = new jsonrpc.jsonrpcphp(url, function() {
				
				self.Add_Object_Methods(self.rpc, self);
				
				callback();
		
			});
			
		};
		
		this.Refresh_Data = function(callback) {
			
			if(self.has_refreshed)
			{
				self.Refresh_Data_From_Diff(function(diff){
					
					//call the data changed callback since the data was refreshed.
					self.data_diff_callback(diff);
					
					callback();
				});
			}
			else
			{
				self.Data_Interface.Refresh_All_Data([],
					function(jsonRpcObj){
						
						self.data = jsonRpcObj.result.data;
						self.schema = jsonRpcObj.result.schema;
						self.reports = jsonRpcObj.result.reports;
						self.settings = jsonRpcObj.result.settings;
						
						self.forms = {};
						self.forms.home_report = jsonRpcObj.result.home_report;
						
						//try
						{
							//convert all data to the local timezone
							self.Convert_Data_To_Local_Timezone();
						}
						//catch(err)
						{
							//alert(err.message);
						}
						
						//try
						{
							//call the data changed callback since the data was refreshed.
							self.data_refresh_callback();
						}
						//catch(err)
						{
							//alert(err.message);
						}
						
						self.has_refreshed = true;
						
						callback();
						
				});
			}
			
		};
		
		this.Refresh_Data_From_Diff = function(callback)
		{
			
			self.Data_Interface.Refresh_From_Session_Diff([],
				function(jsonRpcObj){
					
					new_patch = jsonRpcObj.result;
					
					self.Patch_Table(
						self.data["Categories"],
						self.schema["Categories"],
						new_patch.data["Categories"],
						'Category ID');
					self.Patch_Table(
						self.data["items"],
						self.schema["items"],
						new_patch.data["items"],
						'item_id');
					self.Patch_Table(
						self.data["item_entries"],
						self.schema["item_entries"],
						new_patch.data["item_entries"],
						'item_log_id');
					self.Patch_Table(
						self.data["item_targets"],
						self.schema["item_targets"],
						new_patch.data["item_targets"],
						'item_target_id');
					self.Patch_Table(
						self.data["tasks"],
						self.schema["tasks"],
						new_patch.data["tasks"],
						'task_id');
					self.Patch_Table(
						self.data["task_entries"],
						self.schema["task_entries"],
						new_patch.data["task_entries"],
						'task_log_id');
					self.Patch_Table(
						self.data["task_targets"],
						self.schema["task_targets"],
						new_patch.data["task_targets"],
						'task_schedule_id');
					
					self.Patch_Table(
						self.settings["settings"],
						new_patch.settings["settings"],
						'Setting ID');
					self.Patch_Table(
						self.settings["setting_entries"],
						new_patch.settings["setting_entries"],
						'Setting Entry ID');
					self.Patch_Table(
						self.reports,
						new_patch.reports,
						'report_id');
					
					callback(new_patch);
					
				});
			
		};
		
		this.Patch_Table = function(table, schema, patch, primary_column)
		{
			var diff_table = [];
			
			for(var i = 0; i < patch.length; i++)
			{
				
				patch_row = patch[i];
				
				if(patch_row.operation == 'insert')
				{
					
					table.push(patch_row.row);
					diff_table.push(patch_row.row);
				}
				else if(patch_row.operation == 'update')
				{
					for(var key in table)
					{
						if(table[key][primary_column] === patch_row.row[primary_column])
						{
							table[key] = patch_row.row;
							break;
						}
					}
					
					diff_table.push(patch_row.row);
				}
				else if(patch_row.operation == 'remove')
				{
					for(var key in table)
					{
						if(table[key][primary_column] === patch_row.row[primary_column])
						{
							table.splice(key, 1);
						}
					}
				}
			}
			
			this.Convert_Table_To_Local_Timezone(diff_table,schema);
			
		};
		
		this.Convert_Data_To_Local_Timezone = function(){
			
			for(var key in self.data)
			{
				self.Convert_Table_To_Local_Timezone(self.data[key],self.schema[key]);
				
			}
			
		};
		
		this.Convert_Table_To_Local_Timezone = function(table, schema)
		{
			for(i = 0; i < table.length; i++)
			{
				//iterate through the columns
				for(var column in table[i])
				{
					if(schema[column] == "date")
					{
						//convert UTC datetime to local timezone
						var local_date = datetimes.Cast_Server_Datetime_to_Date(table[i][column]);
						
						//reset the date string in the column
						table[i][column] = local_date;
					}
				}
				
			}
		};
		
	}
	
	function Build_Server_API(){
		
		var rpc_queue = new json_rpc_queue.JSON_RPC_Queue();
		
		var built_server_api = new Server_API(rpc_queue);
		
		return built_server_api;
	}
	
	return {
		Build_Server_API: Build_Server_API,
		Server_API: Server_API,
	};
});

