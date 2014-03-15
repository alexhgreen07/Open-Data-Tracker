var qs = require('querystring');

var config = require('./config.js');
var database = require('./database.js');

database.Connect();

module.exports = {
	counter: 0,
	registered_objects: {},
	methods: {},
	Process_RPC: function (post, callback)
	{
		var self = this;
		self.counter += 1;
		
		for(key in post)
		{
			var post_object = JSON.parse(key);
			break;
		}
		
		console.log(JSON.stringify(post_object));
		
		database.Select(
			"task_log " +
			"JOIN tasks ON tasks.task_id = task_log.task_id "+
			"LEFT JOIN task_targets ON task_targets.task_schedule_id = task_log.task_target_id",
			{
				"name" : "IFNULL(tasks.name,'')",
				"task_log_id" : "task_log.task_log_id",
				"task_id" : "IFNULL(tasks.task_id,0)",
				"start_time" : "task_log.start_time",
				"hours" : "task_log.hours",
				"status" : "task_log.status",
				"note" : "task_log.note",
				"task_target_id" : "task_log.task_target_id",
				"target_status" : "IFNULL(task_targets.status,'')"
			}, 
			'1', 
			'', 
			function(table){
				
				var return_string = '';
		
				if(post_object.method == 'rpc.listMethods')
				{
					return_string = '{"jsonrpc":"2.0","id":'+self.counter+',"result":{"Data_Interface":["Data_Interface","Refresh_All_Data","Refresh_From_Session_Diff","Diff_Table","Get_Session_Data","Save_Session_Data"],"Home_Data_Interface":["Home_Data_Interface","Get_Categories_Schema","Get_Categories","Insert_Category","Update_Category","Delete_Category","Get_Settings","Update_Settings"],"Item_Data_Interface":["Item_Data_Interface","Insert_Item_Entry","Update_Item_Entry","Delete_Item_Entry","Insert_New_Item","Edit_Item","Delete_Item","Insert_Item_Target","Update_Item_Target","Delete_Item_Target","Get_Item_Log_Schema","Get_Item_Log","Get_Items_Schema","Get_Items","Get_Item_Targets_Schema","Get_Item_Targets","Insert_Recurring_Children","Update_Recurring_Children","Delete_Recurring_Children"],"Task_Data_Interface":["Task_Data_Interface","Insert_Task_Entry","Update_Task_Entry","Delete_Task_Entry","Insert_Task","Delete_Task","Update_Task","Get_Tasks_Schema","Get_Tasks","Get_Task_Log_Schema","Get_Task_Log","Get_Task_Targets_Schema","Get_Task_Targets","Insert_Task_Target","Update_Task_Target","Delete_Task_Target","Break_Recuring_Child","Insert_Recurring_Children","Update_Recurring_Children","Delete_Recurring_Children"],"Report_Data_Interface":["Report_Data_Interface","Save_Report","Update_Saved_Report","Delete_Saved_Report","Get_Saved_Reports"]},"error":null}';
				}
				else if(post_object.method == 'Data_Interface.Refresh_All_Data')
				{
					return_string = '{"jsonrpc":"2.0","id":'+self.counter+',"result":{"success":"false","data":{"Categories":[],"items":[],"item_entries":"","item_targets":[],"tasks":"","task_entries":"","task_targets":""},"schema":{"Categories":{"Category ID":"int","Name":"string","Description":"string","Parent Category ID":"int","Category Path":"string"},"items":{"item_name":"string","item_description":"string","item_unit":"string","date_created":"date","item_id":"int","category_id":"int"},"item_entries":{"item_log_id":"int","item_id":"int","time":"date","value":"float","name":"string","unit":"string","note":"string","item_target_id":"int"},"item_targets":{"item_target_id":"int","start_time":"date","type":"string","value":"float","item_id":"int","name":"string","period_type":"string","period":"float","recurring":"bool","recurring_child_id":"int","recurrance_end_time":"date","allowed_variance":"float","recurrance_period":"float","status":"string"},"tasks":{"task_id":"int","name":"string","description":"string","date_created":"date","note":"string","category_id":"int","status":"string"},"task_entries":{"task_log_id":"int","name":"string","start_time":"date","hours":"float","note":"note","status":"string","task_id":"int","task_target_id":"int","target_status":"string"},"task_targets":{"task_schedule_id":"int","name":"string","scheduled_time":"date","recurring":"bool","recurrance_type":"string","recurrance_period":"int","variance":"float","estimated_time":"float","recurrance_end_time":"date","recurrance_child_id":"int","status":"string","task_id":"int","hours":"float"}},"settings":{"success":"false","settings":[{"Setting ID":"1","Name":"First Name","Type":"string"},{"Setting ID":"2","Name":"Last Name","Type":"string"},{"Setting ID":"3","Name":"Email","Type":"string"},{"Setting ID":"4","Name":"Text Size","Type":"int"},{"Setting ID":"5","Name":"Remember Me Time","Type":"int"}],"setting_entries":[]},"reports":""},"error":null}';
				}
				else
				{
					return_string = '{"jsonrpc":"2.0","id":'+self.counter+',"result":{"success":"true","data":{"Categories":[],"items":[],"item_entries":[],"item_targets":[],"tasks":[],"task_entries":[],"task_targets":[]},"settings":{"settings":[],"setting_entries":[]},"reports":[]},"error":null}';
				}
				
				callback(return_string);
			
			}
		);
		
	},
	List_Methods: function(){
		
		
		
	},
	Register_Object: function(object){
		
		
		
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
