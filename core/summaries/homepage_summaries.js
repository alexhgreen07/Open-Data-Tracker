define([],function(){
	
	return {
		Get_Homepage_Report: function(params, session, callback){
			
			var data = params.data;
			
			running_tasks = [];
			upcoming_tasks = [];
			recent_items = [];
			
			//load the running tasks array
			for (var i = 0; i < data.task_entries.length; i++) {
				
				if(data.task_entries[i].status == "Started")
				{
					running_tasks.push(data.task_entries[i]);
				}
				
			}
			
			//load the recent items array
			for (var i = 0; i < data.item_entries.length; i++) {
				
				recent_items.push(data.item_entries[i]);
				
			}
			
			
			//load the task targets array
			for (var i = 0; i < data.task_targets.length; i++) {
				
				if(data.task_targets[i].status == "Incomplete")
				{
					upcoming_tasks.push(data.task_targets[i]);
				}
				
			}
			
			//execute sort according to 'scheduled_time'
			upcoming_tasks.sort(function(a,b){

				datetime_a = a.scheduled_time;
				datetime_b = b.scheduled_time;
				
				if ( datetime_b < datetime_a )
				  return -1;
				if ( datetime_b > datetime_a )
				  return 1;
				return 0;
				
			});
			
			//execute sort according to 'time'
			recent_items.sort(function(a,b){
				
				datetime_a = a.time;
				datetime_b = b.time;
				
				if ( datetime_b > datetime_a )
				  return -1;
				if ( datetime_b < datetime_a )
				  return 1;
				return 0;
				
			});
			
			while(upcoming_tasks.length > 5){
				
				upcoming_tasks.shift();
			}
			
			//execute sort according to 'scheduled_time'
			upcoming_tasks.sort(function(a,b){

				datetime_a = a.scheduled_time;
				datetime_b = b.scheduled_time;
				
				if ( datetime_b > datetime_a )
				  return -1;
				if ( datetime_b < datetime_a )
				  return 1;
				return 0;
				
			});
			
			while(recent_items.length > 5){
				
				recent_items.shift();
				
			}
			
			//execute sort according to 'time'
			recent_items.sort(function(a,b){
				
				datetime_a = a.time;
				datetime_b = b.time;
				
				if ( datetime_b < datetime_a )
				  return -1;
				if ( datetime_b > datetime_a )
				  return 1;
				return 0;
				
			});
			
			var return_object = {
				running_tasks: running_tasks,
				upcoming_tasks: upcoming_tasks,
				recent_items: recent_items,
			};
			
			callback(return_object);
			
		},
	};
	
});