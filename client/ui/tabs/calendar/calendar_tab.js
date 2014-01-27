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
		
		$('#' + self.calendar_div.id).fullCalendar('render');
		
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
				left: 'title',
				center: 'month',
				right: 'prev,next'
			}, 
			dayClick: function(date, allDay, jsEvent, view) {
				
				string = '';
				
		        if (allDay) {
		            string += 'Clicked on the entire day: ' + date;
		        }else{
		            string += 'Clicked on the slot: ' + date;
		        }
		
		        string += 'Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY;
		
		        string += 'Current view: ' + view.name;
				
				if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'month')
				{
					$('#' + self.calendar_div.id).fullCalendar('changeView', 'basicWeek' );
				}
				else if($('#' + self.calendar_div.id).fullCalendar('getView').name == 'basicWeek')
				{
					$('#' + self.calendar_div.id).fullCalendar('changeView', 'basicDay' );
				}
				
				
				
		    }
   		});
   		
   		$('#' + self.calendar_div.id).fullCalendar('render');
   		$('#' + self.calendar_div.id).fullCalendar('today');
		
	};
}

