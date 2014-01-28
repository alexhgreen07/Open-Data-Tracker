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
	
	//self.day_view_type = 'agendaDay';
	//self.week_view_type = 'agendaWeek';
	self.day_view_type = 'basicDay';
	self.week_view_type = 'basicWeek';

	/** @method Refresh_Data
	 * @desc This function retrieves the home data from the server.
	 * @param {function} data The callback to call after the refresh of data has completed.
	 * */
	this.Refresh = function(data) {
		
		if(JSON.stringify(self.data) !== JSON.stringify(data))
		{
		
			self.data = data;
		
			document.getElementById(self.calendar_div.id).innerHTML = '';
			
			self.new_events = [];
		    
		    for(var i = 0; i < data.task_targets.length; i++)
		    {
		    	var name = data.task_targets[i].name;
		    	var start_string = data.task_targets[i].scheduled_time;
		    	
		    	var start_timestamp = Cast_Server_Datetime_to_Date(start_string);
		    	var end_timestamp = new Date(+start_timestamp + (data.task_targets[i].estimated_time * 1000 * 60 * 60));
		    	
		    	var end_string = Cast_Date_to_Server_Datetime(end_timestamp);
		    	
		    	var new_event = {
		    		title  : name,
		            start  : start_string,
		            end    : end_string,
		            allDay : false,
		            color: '#0000FF',
		    	};
		    	
		    	self.new_events.push(new_event);
		    }
		    
		    for(var i = 0; i < data.task_entries.length; i++)
		    {
		    	var name = data.task_entries[i].name;
		    	var start_string = data.task_entries[i].start_time;
		    	
		    	var start_timestamp = Cast_Server_Datetime_to_Date(start_string);
		    	var end_timestamp = new Date(+start_timestamp + (data.task_entries[i].hours * 1000 * 60 * 60));
		    	
		    	var end_string = Cast_Date_to_Server_Datetime(end_timestamp);
		    	
		    	var new_event = {
		    		title  : name,
		            start  : start_string,
		            end    : end_string,
		            allDay : false,
		            color: '#FF0000',
		    	};
		    	
		    	self.new_events.push(new_event);
		    }
			
			$('#' + self.calendar_div.id).fullCalendar({
				header: {
					left: 'month',
					center: 'title',
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
			alert(calEvent.start);
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
		
		self.calendar_div = document.createElement("div");
		self.calendar_div.id = home_div_id + '_calendar_div';
		document.getElementById(home_div_id).appendChild(self.calendar_div);
		
		$('#' + self.calendar_div.id).fullCalendar({
			header: {
				left: 'month',
				center: 'title',
				right: 'prev,next'
			},
			eventAfterAllRender: self.Calendar_Render_Complete
		});
		
   		$('#' + self.calendar_div.id).fullCalendar('render');
   		$('#' + self.calendar_div.id).fullCalendar('today');
		
	};
}

