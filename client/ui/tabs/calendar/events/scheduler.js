
function Event_Scheduler() {

	var self = this;
	
	self.config = {
		switch_efficiency : 0.9};
	
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
	
	self.Create_Free_Block_Table = function(events)
	{
		self.scheduled_events = [];
		
		//first entry has duration of 100 years
		self.free_block_table = [
			{
				start_time: new Date(),
				duration: 636000,
			}
			];
		
		//sort the events targets by late end time
		events.sort(function(a,b){
			
			var a_timestamp = Cast_Server_Datetime_to_Date(a.entry.row.scheduled_time);
		    var b_timestamp = Cast_Server_Datetime_to_Date(b.entry.row.scheduled_time);
			
			time_block_a = 
				Number(a.entry.row.variance) 
				+ Number(a.entry.row.estimated_time)
				;
			time_block_b = 
				Number(b.entry.row.variance) 
				+ Number(b.entry.row.estimated_time)
				;
			
			var a_late_end_timestamp = self.Generate_End_Date(a_timestamp, time_block_a, 0);
			var b_late_end_timestamp = self.Generate_End_Date(b_timestamp, time_block_b, 0);
			
			return (+a_late_end_timestamp - +b_late_end_timestamp);
			
		});
		
		for(key in events)
		{
			event_row =  events[key];
			
			self.Insert_Event_Into_Free_Blocks(event_row);
		}
		
		return self.scheduled_events;
	};
	
	self.Insert_Event_Into_Free_Blocks = function(event_row)
	{
		
		var row = event_row.entry.row;
		
		var start_timestamp = Cast_Server_Datetime_to_Date(row.scheduled_time);
    	
		var early_start_timestamp = self.Generate_End_Date(start_timestamp, -row.variance, 0);
		var early_end_timestamp = self.Generate_End_Date(early_start_timestamp, row.estimated_time, 0);
		var late_start_timestamp = self.Generate_End_Date(start_timestamp, row.variance, 0);
		var late_end_timestamp = self.Generate_End_Date(late_start_timestamp, row.estimated_time, 0);
		
		var block_found = false;
		
		//find the first available valid block
		for(key in self.free_block_table)
		{
			
			//alert('attempting to schedule event at key ' + key);
			
			block = self.free_block_table[key];
			block_end_time = self.Generate_End_Date(block.start_time,block.duration,0);
			
			
			if(block.duration > row.estimated_time)
			{
				
				if(block_end_time > early_end_timestamp)
				{
					if(block.start_time <= early_start_timestamp)
					{
						
						event_row.start = early_start_timestamp;
						
						real_end_date = self.Generate_End_Date(event_row.start, row.estimated_time, 0);
						adjusted_end_date = self.Generate_End_Date(event_row.start, row.estimated_time / self.config.switch_efficiency, 0);
						event_row.end = self.Generate_End_Date(event_row.start, row.estimated_time);
						
						if(real_end_date > late_end_timestamp)
				    	{
				    		event_row.color = '#FF3300';
				    	}
						
						
						self.scheduled_events.push(event_row);
						
						//the free block must be split
						block.duration = (event_row.start - block.start_time) / 1000 / 60 / 60;
						var new_block_duration = (block_end_time - adjusted_end_date)  / 1000 / 60 / 60;
							
						//create new split block
						var new_block = {
							start_time: adjusted_end_date,
							duration: new_block_duration,
						};
						
						//insert new split block
						self.free_block_table.splice(key + 1, 0, new_block);
						
						block_found = true;
						break;
					}
					else 
					{
						//alert(block.start_time + ' <= ' + early_start_timestamp);
						
						//schedule event
						event_row.start = block.start_time;
						real_end_date = self.Generate_End_Date(event_row.start, row.estimated_time, 0);
						adjusted_end_date = self.Generate_End_Date(event_row.start, row.estimated_time / self.config.switch_efficiency, 0);
						event_row.end = self.Generate_End_Date(event_row.start, row.estimated_time);
						
						if(real_end_date > late_end_timestamp)
				    	{
				    		event_row.color = '#FF3300';
				    	}
						
						self.scheduled_events.push(event_row);
						
						block.duration -= row.estimated_time;
						block.start_time = adjusted_end_date;
						
						block_found = true;
						break;
						
						
					}
				}
				
				
				
			}
			
		}
		
		if(!block_found)
		{
			alert('error!');
		}
		
		
	};
	
	self.Update_Event_In_Free_Blocks = function(event)
	{
		self.Remove_Event_From_Free_Blocks(event);
		self.Insert_Event_Into_Free_Blocks(event);
	};
	
	self.Remove_Event_From_Free_Blocks = function(event)
	{
		
	};
	
	self.Shift_Event_Overlaps = function(event)
	{
		
	};
	
	self.Schedule_Incomplete_Task_Targets = function(incomplete_targets, started_targets)
	{
		var new_events = [];
		
		var now = new Date();
		var shifted_targets = [];
		var late_targets = [];
		
		for(var i = 0; i < incomplete_targets.length; i++)
		{
			var new_event = Copy_JSON_Data(incomplete_targets[i]);
			
			new_event.entry.row.estimated_time -= new_event.entry.row.hours;
			
			if(new_event.entry.row.task_schedule_id in started_targets)
			{
				//subtract started task hours
				new_event.entry.row.estimated_time -= started_targets[new_event.entry.row.task_schedule_id];
			}
			
			if(new_event.entry.row.estimated_time < 0)
			{
				new_event.entry.row.estimated_time = 0;
			}
			
			shifted_targets.push(new_event);
		
		}
		
		//sort the shifted targets
		shifted_targets.sort(function(a,b){
			
			var a_timestamp = Cast_Server_Datetime_to_Date(a.entry.row.scheduled_time);
		    var b_timestamp = Cast_Server_Datetime_to_Date(b.entry.row.scheduled_time);
			
			var a_early_start_timestamp = self.Generate_End_Date(a_timestamp, -a.entry.row.variance, 0);
			var b_early_start_timestamp = self.Generate_End_Date(b_timestamp, -b.entry.row.variance, 0);
			
			return (a_early_start_timestamp - b_early_start_timestamp);
			
		});
		
		new_events = self.Create_Free_Block_Table(shifted_targets);
		
		return new_events;
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
		    		new_event = self.Create_Event_From_Task_Target_Row(current_entry.row);
		    		incomplete_targets.push(new_event);
		    		
		    		
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
		
		scheduled_incomplete_targets = self.Schedule_Incomplete_Task_Targets(incomplete_targets, started_targets);
		
		new_events = new_events.concat(scheduled_incomplete_targets);
		
		self.new_events = new_events;
		
		return self.new_events;
	};
	
	self.Update_Scheduler_From_Diff = function(diff){
		
		
		
		return self.new_events;
	};

}