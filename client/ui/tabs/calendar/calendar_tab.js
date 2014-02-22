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
	
	self.scheduler = new Event_Scheduler();
	
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
		    	var new_event = self.scheduler.Create_Event_From_Task_Target_Row(data.task_targets[i]);
		    	
		    	self.new_events.push(new_event);
		    }
		    
		    for(var i = 0; i < data.task_entries.length; i++)
		    {
		    	
		    	var new_event = self.scheduler.Create_Event_From_Task_Entry_Row(data.task_entries[i]);
		    	
		    	self.new_events.push(new_event);
		    }
			
			var previous_name = $('#' + self.calendar_div.id).fullCalendar('getView').name;
			var previous_date = $('#' + self.calendar_div.id).fullCalendar('getDate');
			
			self.new_events = self.scheduler.Run_Scheduling_Algorithm(self.new_events);
			
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

