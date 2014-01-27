/** This is the home tab class which holds all UI objects for general data.
 * @constructor Home_Tab
 */
function Calendar_Tab() {

	var self = this;

	/** @method Refresh_Data
	 * @desc This function retrieves the home data from the server.
	 * @param {function} data The callback to call after the refresh of data has completed.
	 * */
	this.Refresh = function(data) {
		
		document.getElementById(self.calendar_div.id).innerHTML = '';
		
		self.new_events = [
	        {
	            title  : 'event1',
	            start  : '2014-01-01',
	        },
	        {
	            title  : 'event2',
	            start  : '2014-01-05',
	            end    : '2014-01-07',
	        },
	        {
	            title  : 'event3',
	            start  : '2014-01-09 12:30:00',
	            end    : '2014-01-09 01:30:00',
	            allDay : false, // will make the time show
	        }
	    ];
		
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
		});
		
	};
	
	this.Render_Calendar = function()
	{
		$('#' + self.calendar_div.id).fullCalendar('render');
	};
	
	this.Day_Click = function(date, allDay, jsEvent, view) {

		$('#' + self.calendar_div.id).fullCalendar('gotoDate',date);
				
		if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'month')
		{
			$('#' + self.calendar_div.id).fullCalendar('changeView', 'agendaWeek' );
		}
		else if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'agendaWeek')
		{
			$('#' + self.calendar_div.id).fullCalendar('changeView', 'agendaDay' );
		}
   };
   
   this.Event_Click = function(calEvent, jsEvent, view) {
   			
   		
   		alert('event click');
   		
		if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'month')
		{
			$('#' + self.calendar_div.id).fullCalendar('gotoDate',calEvent.start);
			$('#' + self.calendar_div.id).fullCalendar('changeView', 'agendaWeek' );
		}
		else if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'agendaWeek')
		{
			$('#' + self.calendar_div.id).fullCalendar('gotoDate',calEvent.start);
			$('#' + self.calendar_div.id).fullCalendar('changeView', 'agendaDay' );
		}
		else
		{
			//event selected!
			alert(calEvent.start);
		}
   		
   		return false;
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
			}
		});
		
   		$('#' + self.calendar_div.id).fullCalendar('render');
   		$('#' + self.calendar_div.id).fullCalendar('today');
		
	};
}

