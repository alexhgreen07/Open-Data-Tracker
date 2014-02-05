
function Event_Scheduler() {

	var self = this;
	
	this.Create_Event_From_Task_Target_Row = function(row)
	{
		var should_render_event = true;
		
		var name = row.name;
    	var start_string = row.scheduled_time;
    	
    	var start_timestamp = Cast_Server_Datetime_to_Date(start_string);
    	var end_timestamp = self.Generate_End_Date(start_timestamp, row.estimated_time);
    	
    	var end_string = Cast_Date_to_Server_Datetime(end_timestamp);
    	
    	var color = '#00FF00';
    	
    	if(row.status == 'Incomplete')
    	{
    		color = '#0000FF';
    	}
    	else if(row.status == 'Missed')
    	{
    		color = '#FF0000';
    	}
    	else if(row.status == 'Late')
    	{
    		color = '#FF3300';
    	}
    	
    	var new_event = {
    		title  : name,
            start  : start_string,
            end    : end_string,
            allDay : false,
            color: color,
            entry: {table: 'task_targets', row: row},
    	};
		
		return new_event;
	};
	
	this.Create_Event_From_Task_Entry_Row = function(row){
		
		var name = row.name;
    	var start_string = row.start_time;
    	
    	var start_timestamp = Cast_Server_Datetime_to_Date(start_string);
    	
    	var color = '#00FFFF';
    	if(row.status == 'Started')
    	{
    		var end_timestamp = new Date();
    		
    		if(end_timestamp - start_timestamp < (1000 * 60 * 30))
    		{
    			end_timestamp = new Date(+start_timestamp + (1000 * 60 * 30));
    		}
    		
    		color = '#9900FF';
    	}
    	else
    	{
    		var end_timestamp = self.Generate_End_Date(start_timestamp, row.hours);
    	}
    	
    	if(row.target_status == 'Complete')
    	{
    		color = '#00FF00';
    	}
    	
    	var end_string = Cast_Date_to_Server_Datetime(end_timestamp);
    	
    	var new_event = {
    		title  : name,
            start  : start_string,
            end    : end_string,
            allDay : false,
            color: color,
            entry: {table: 'task_entries', row: row},
    	};
    	
    	return new_event;
		
	};
	
	this.Generate_End_Date = function(start_timestamp, hours, minimum_time)
	{
		var adjusted_hours = hours;
		minimum_time = typeof minimum_time !== 'undefined' ? minimum_time : 0.5;
		//var minimum_time = 0.5;
		
		if(Math.abs(adjusted_hours) < minimum_time)
		{
			adjusted_hours = minimum_time;
		}
		
		var end_timestamp = new Date(+start_timestamp + (adjusted_hours * 1000 * 60 * 60));
		
		return end_timestamp;
	};
	
	
	self.Run_Scheduling_Algorithm = function(events)
	{
		self.new_events = events;
		
		var new_events = [];
		var started_targets = [];
		var incomplete_targets = [];
		
		//get all events and organize
		for(var i = 0; i < self.new_events.length; i++)
		{
			var new_event = {};
			
			current_entry = self.new_events[i].entry;
			
			if(current_entry.table === 'task_targets')
			{
				if(current_entry.row.status === 'Incomplete')
		    	{
		    		
		    		incomplete_targets.push(current_entry);
		    		
		    		
		    	}
		    	else if(current_entry.row.status !== 'Complete' || current_entry.row.hours == 0)
		    	{
		    		new_event = self.Create_Event_From_Task_Target_Row(current_entry.row);
		    		
		    		new_events.push(new_event);
		    	}
		    	
		    	
			}
			else if(current_entry.table === 'task_entries')
			{
				if(current_entry.row.status == 'Started')
				{
					var start_time = Cast_Server_Datetime_to_Date(current_entry.row.start_time);
					var now = new Date();
					
					var hours = (now - start_time) / 1000 / 60 / 60;
					
					started_targets[current_entry.row.task_target_id] = hours;
				}
				
				new_event = self.Create_Event_From_Task_Entry_Row(current_entry.row);
				
				new_events.push(new_event);
			}
			
			
		}
		
		var now = new Date();
		var shifted_targets = [];
		var late_targets = [];
		
		for(var i = 0; i < incomplete_targets.length; i++)
		{
			var new_entry = Copy_JSON_Data(incomplete_targets[i]);
			
			new_entry.row.estimated_time -= new_entry.row.hours;
			
			if(new_entry.row.task_schedule_id in started_targets)
			{
				//subtract started task hours
				new_entry.row.estimated_time -= started_targets[new_entry.row.task_schedule_id];
			}
			
			if(new_entry.row.estimated_time < 0)
			{
				new_entry.row.estimated_time = 0;
			}
			
			var scheduled_time = Cast_Server_Datetime_to_Date(new_entry.row.scheduled_time);
			var late_start_timestamp = self.Generate_End_Date(scheduled_time, new_entry.row.variance, 0);
			
			if(now > late_start_timestamp)
			{
				late_targets.push(new_entry);
			}
			else
			{
				shifted_targets.push(new_entry);
			}
			
		}
		
		//sort the shifted targets
		late_targets.sort(function(a,b){
			
			var a_timestamp = Cast_Server_Datetime_to_Date(a.row.scheduled_time);
		    var b_timestamp = Cast_Server_Datetime_to_Date(b.row.scheduled_time);
			
			var a_late_start_timestamp = self.Generate_End_Date(a_timestamp, a.row.variance, 0);
			var b_late_start_timestamp = self.Generate_End_Date(b_timestamp, b.row.variance, 0);
			
			return (a_late_start_timestamp - b_late_start_timestamp);
			
		});
		
		//sort the shifted targets
		shifted_targets.sort(function(a,b){
			
			var a_timestamp = Cast_Server_Datetime_to_Date(a.row.scheduled_time);
		    var b_timestamp = Cast_Server_Datetime_to_Date(b.row.scheduled_time);
			
			var a_early_start_timestamp = self.Generate_End_Date(a_timestamp, -a.row.variance, 0);
			var b_early_start_timestamp = self.Generate_End_Date(b_timestamp, -b.row.variance, 0);
			
			return (a_early_start_timestamp - b_early_start_timestamp);
			
		});
		
		var shifted_target_start_timestamp = now;
		
		//process and create events for late targets
		for(var i = 0; i < late_targets.length; i++)
		{
			var new_row = Copy_JSON_Data(late_targets[i].row);
			
			var scheduled_time = Cast_Server_Datetime_to_Date(new_row.scheduled_time);
			
			var early_start_timestamp = self.Generate_End_Date(scheduled_time, -new_row.variance, 0);
			
			var start_timestamp = early_start_timestamp;
			
			if(start_timestamp < shifted_target_start_timestamp)
			{
				start_timestamp = shifted_target_start_timestamp;
			}
			
			new_row.status = 'Late';
			
			var start_string = Cast_Date_to_Server_Datetime(start_timestamp);
			
			new_row.scheduled_time = start_string;
			
			new_event = self.Create_Event_From_Task_Target_Row(new_row);
			
			new_events.push(new_event);
			
			var end_timestamp = self.Generate_End_Date(start_timestamp, new_row.estimated_time, 0);
			shifted_target_start_timestamp = end_timestamp;
		}
		
		//process and create evnets for shifted targets
		for(var i = 0; i < shifted_targets.length; i++)
		{
			var new_row = Copy_JSON_Data(shifted_targets[i].row);
			
			var scheduled_time = Cast_Server_Datetime_to_Date(new_row.scheduled_time);
			
			var early_start_timestamp = self.Generate_End_Date(scheduled_time, -new_row.variance, 0);
			var late_start_timestamp = self.Generate_End_Date(scheduled_time, new_row.variance, 0);
			
			var start_timestamp = early_start_timestamp;
			
			if(start_timestamp < shifted_target_start_timestamp)
			{
				start_timestamp = shifted_target_start_timestamp;
			}
			
			if(start_timestamp > late_start_timestamp)
			{
				new_row.status = 'Late';
			}
			
			var start_string = Cast_Date_to_Server_Datetime(start_timestamp);
			
			new_row.scheduled_time = start_string;
			
			new_event = self.Create_Event_From_Task_Target_Row(new_row);
			
			new_events.push(new_event);
			
			var end_timestamp = self.Generate_End_Date(start_timestamp, new_row.estimated_time, 0);
			shifted_target_start_timestamp = end_timestamp;
			
		}
		
		self.new_events = new_events;
		
		return self.new_events;
	};

}