

/** Represents the main api to the server.
 * @constructor Server_API
 */
function Server_API() {
	
	var self = this;
	
	this.rpc_queue = new JSON_RPC_Queue();
	
	this.rpc = null;
	
	this.is_busy_callback = function(is_busy){};
	this.data_changed_callback = function(){};
	
	this.Build_Method = function(method, source_object){
		
		var return_function = function(args,callback){
        	
        	self.is_busy_callback(true);
        	
        	self.rpc_queue.Queue_RPC(
				source_object[method],
				args,
				function(jsonRpcObj){
					
					
					callback(jsonRpcObj);
					
					self.is_busy_callback(false);
					
				});
        	
        };
        
        return return_function;
		
	};
	
	this.Add_Object_Methods = function(source_object, destination_object)
	{
		var self = this;
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
		
		var self = this;
		self.has_refreshed = false;
		
		self.rpc = new jsonrpcphp(url, function() {
			
			self.Add_Object_Methods(self.rpc, self);
			
			self.Refresh_Data(function(){
				
				callback();
				
			});
			
			
	
		});
		
	};
	
	this.Refresh_Data = function(callback) {
		
		var self = this;
		
		if(self.has_refreshed)
		{
			self.Refresh_Data_From_Diff(function(){
				
				
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
					
					//convert all data to the local timezone
					self.Convert_Data_To_Local_Timezone();
					
					//call the data changed callback since the data was refreshed.
					self.data_changed_callback();
					
					self.has_refreshed = true;
					
					callback();
					
			});
		}
		
	};
	
	this.Refresh_Data_From_Diff = function(callback)
	{
		
		var self = this;
		
		self.Data_Interface.Refresh_From_Session_Diff([],
			function(jsonRpcObj){
				
				new_patch = jsonRpcObj.result;
				
				self.Patch_Table(self.data["Categories"],new_patch.data["Categories"]);
				self.Patch_Table(self.data["items"],new_patch.data["items"]);
				self.Patch_Table(self.data["item_entries"],new_patch.data["item_entries"]);
				self.Patch_Table(self.data["item_targets"],new_patch.data["item_targets"]);
				self.Patch_Table(self.data["tasks"],new_patch.data["tasks"]);
				self.Patch_Table(self.data["task_entries"],new_patch.data["task_entries"]);
				self.Patch_Table(self.data["task_targets"],new_patch.data["task_targets"]);
				
				self.Patch_Table(self.settings["settings"],new_patch.settings["settings"]);
				self.Patch_Table(self.settings["setting_entries"],new_patch.settings["setting_entries"]);
				self.Patch_Table(self.reports,new_patch.reports);
				
				//convert all data to the local timezone
				//self.Convert_Data_To_Local_Timezone();
				
				//call the data changed callback since the data was refreshed.
				self.data_changed_callback();
				
				callback();
				
			});
		
	};
	
	this.Patch_Table = function(table, patch, primary_column)
	{
		
		for(var i = 0; i < patch.length; i++)
		{
			
			patch_row = patch[i];
			
			if(patch_row.operation == 'insert')
			{
				table.push(patch_row.row);
			}
			else if(patch_row.operation == 'update')
			{
				for(var key in table)
				{
					if(table[key][primary_column] === patch_row.row[primary_column])
					{
						table[key] = patch_row.row;
					}
				}
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
		
	};
	
	this.Convert_Data_To_Local_Timezone = function(){
		
		var self = this;
		
		for(var key in self.data)
		{
			for(i = 0; i < self.data[key].length; i++)
			{
				//iterate through the columns
				for(var column in self.data[key][i])
				{
					if(self.schema[key][column] == "date")
					{
						//convert UTC datetime to local timezone
						var utc_date = Cast_Server_Datetime_to_Date(self.data[key][i][column]);
						var local_date = Convert_UTC_Date_To_Local_Timezone(utc_date);
						
						//reset the date string in the column
						self.data[key][i][column] = Cast_Date_to_Server_Datetime(local_date);
					}
				}
				
			}
			
		}
		
	};
	
}