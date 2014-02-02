function isTouchDevice()
{
	var ua = navigator.userAgent;
	var isTouchDevice = (
		ua.match(/iPad/i) ||
		ua.match(/iPhone/i) ||
		ua.match(/iPod/i) ||
		ua.match(/Android/i)
	);
	 
	return isTouchDevice;
}

/** This is the home tab class which holds all UI objects for general data.
 * @constructor Home_Tab
 */
function Calendar_Tab() {

	var self = this;
	
	self.day_view_type = 'agendaDay';
	self.week_view_type = 'agendaWeek';
	
	self.event_click_callback = function(table, row){};
	
	/** @method Refresh_Data
	 * @desc This function retrieves the home data from the server.
	 * @param {function} data The callback to call after the refresh of data has completed.
	 * */
	this.Refresh = function(data) {
		
		//if(JSON.stringify(self.data) !== JSON.stringify(data))
		{
		
			self.data = data;
		
			document.getElementById(self.calendar_div.id).innerHTML = '';
			
			self.new_events = [];
		    
		    for(var i = 0; i < data.task_targets.length; i++)
		    {
		    	var new_event = self.Create_Event_From_Task_Target_Row(data.task_targets[i]);
		    	
		    	self.new_events.push(new_event);
		    }
		    
		    for(var i = 0; i < data.task_entries.length; i++)
		    {
		    	
		    	var new_event = self.Create_Event_From_Task_Entry_Row(data.task_entries[i]);
		    	
		    	self.new_events.push(new_event);
		    }
			
			var previous_name = $('#' + self.calendar_div.id).fullCalendar('getView').name;
			var previous_date = $('#' + self.calendar_div.id).fullCalendar('getDate');
			
			self.Run_Scheduling_Algorithm();
			
			$('#' + self.calendar_div.id).fullCalendar({
				header: {
					left: 'month,agendaWeek,agendaDay',
					center: 'today',
					right: 'prev,next'
				}, 
				editable: false,
				selectable: false,
				droppable: false,
				events: self.new_events,
				eventClick: self.Event_Click,
				dayClick: self.Day_Click,
				eventAfterAllRender: self.Calendar_Render_Complete,
			});
			
			$('#' + self.calendar_div.id).fullCalendar('changeView', previous_name);
			$('#' + self.calendar_div.id).fullCalendar('gotoDate',previous_date);
			
		}
		//else
		{
			//self.Update_Started_Tasks();
		}
		
		
	};
	
	this.Update_Started_Tasks = function()
	{
		for(var i = 0; i < self.new_events.length; i++)
		{
			if(self.new_events[i].entry.table == 'task_entries' && 
				self.new_events[i].entry.row.status == 'Started')
			{
				var start_string = self.new_events[i].entry.row.start_time;
	    	
		    	var start_timestamp = Cast_Server_Datetime_to_Date(start_string);
		    	
		    	var end_timestamp = new Date();
	    		
	    		if(end_timestamp - start_timestamp < (1000 * 60 * 30))
	    		{
	    			end_timestamp = new Date(+start_timestamp + (1000 * 60 * 30));
	    		}
	    		
		    	var end_string = Cast_Date_to_Server_Datetime(end_timestamp);
		    	
		    	self.new_events[i].start = start_string;
		    	self.new_events[i].end = end_string;
		    	
		    	$('#' + self.calendar_div.id).fullCalendar('updateEvent',self.new_events[i]);
			}
		}
	};
	
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
	
	this.Run_Scheduling_Algorithm = function()
	{
		var new_events = [];
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
	
	this.Render_Calendar = function()
	{
		$('#' + self.calendar_div.id).fullCalendar('render');
	};
	
	this.Day_Click = function(date, allDay, jsEvent, view) {

		$('#' + self.calendar_div.id).fullCalendar('gotoDate',date);
			
		if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'month')
		{
			$('#' + self.calendar_div.id).fullCalendar('changeView', self.week_view_type);
		}
		else if($('#' + self.calendar_div.id).fullCalendar('getView').name == self.week_view_type)
		{
			$('#' + self.calendar_div.id).fullCalendar('changeView', self.day_view_type );
		}

   };

   this.Event_Click = function(calEvent, jsEvent, view) {
   		
   		self.Event_Drill_Down(calEvent, jsEvent, view);
   };
   
   this.Event_Drill_Down = function(calEvent, jsEvent, view)
   {
	   	if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'month')
		{
			$('#' + self.calendar_div.id).fullCalendar('gotoDate',calEvent.start);
			$('#' + self.calendar_div.id).fullCalendar('changeView', self.week_view_type );
		}
		else if($('#' + self.calendar_div.id).fullCalendar('getView').name == self.week_view_type)
		{
			$('#' + self.calendar_div.id).fullCalendar('gotoDate',calEvent.start);
			$('#' + self.calendar_div.id).fullCalendar('changeView', self.day_view_type );
		}
		else
		{
			//event selected!
			self.event_click_callback(calEvent.entry.table,calEvent.entry.row);
		}
   		
   		return false;
   };
	
	this.Calendar_Render_Complete = function(view)
	{
		if(isTouchDevice())
		{
			// Since the draggable events are lazy(bind)loaded, we need to
			// trigger them all so they're all ready for us to drag/drop
			// on the iPad. w00t!
			$('.fc-event').each(function(){
				var e = jQuery.Event("mouseover", {
				target: this.firstChild,
				_dummyCalledOnStartup: true
			});
			$(this).trigger(e);
			});
		}
	};
	
	/** @method Render
	 * @desc This function will render the tab in the div that it was initialized with.
	 * */
	this.Render = function(home_div_id) {
		
		var tabs_array = new Array();
		var new_tab = new Array();
		new_tab.push("Calendar");
		var accordian_div = home_div_id + '_accordian_div';
		new_tab.push('<div id="'+accordian_div+'"></div>');
		tabs_array.push(new_tab);
		
		var calendar_accordian = new Accordian(home_div_id, tabs_array);
		calendar_accordian.Render();
		
		self.calendar_div = document.createElement("div");
		self.calendar_div.id = home_div_id + '_calendar_div';
		document.getElementById(accordian_div).appendChild(self.calendar_div);
		
		
		$('#' + self.calendar_div.id).fullCalendar({
			header: {
				left: 'month,agendaWeek,agendaDay',
				center: 'today',
				right: 'prev,next'
			},
			eventAfterAllRender: self.Calendar_Render_Complete
		});
		
   		$('#' + self.calendar_div.id).fullCalendar('render');
   		$('#' + self.calendar_div.id).fullCalendar('today');
   		$('#' + self.calendar_div.id).fullCalendar('changeView', self.day_view_type );
		
	};
}

