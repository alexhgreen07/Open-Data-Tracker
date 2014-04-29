define([
        'jquery.ui',
        'core/logger',
        './events/scheduler',
        '../../../../core/logger.js',
        ],
        function($,logger,scheduler,logger){
	return {
		/** This is the home tab class which holds all UI objects for general data.
		 * @constructor Home_Tab
		 */
		Calendar_Tab: function() {

			var self = this;
			
			self.day_view_type = 'agendaDay';
			self.week_view_type = 'agendaWeek';
			
			self.scheduler = new scheduler.Event_Scheduler();
			
			self.event_click_callback = function(table, row){};
			
			/** @method Refresh_Data
			 * @desc This function retrieves the home data from the server.
			 * @param {function} data The callback to call after the refresh of data has completed.
			 * */
			this.Refresh = function(data) {
				
				self.data = data;
			
				document.getElementById(self.calendar_div.id).innerHTML = '';
				
				var previous_name = $('#' + self.calendar_div.id).fullCalendar('getView').name;
				var previous_date = $('#' + self.calendar_div.id).fullCalendar('getDate');
				
				var times = [];
				var start = new Date();
				
				self.new_events = self.scheduler.Generate_Event_Schedule(data);
				
				var end = new Date();
				times.push('Generate_Event_Schedule: ' + (end - start) / 1000);
				var start = new Date();
				
				$('#' + self.calendar_div.id).fullCalendar({
					header: {
						left: 'month,' + self.week_view_type + ',' + self.day_view_type,
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
				
				var end = new Date();
				times.push('fullCalendar: ' + (end - start) / 1000);
				logger.Info('Diff refresh: ' + JSON.stringify(times));
				
				$('#' + self.calendar_div.id).fullCalendar('changeView', previous_name);
				$('#' + self.calendar_div.id).fullCalendar('gotoDate',previous_date);
				
			};
			
			this.Refresh_From_Diff = function(diff, data){
				
				self.data = data;
				
				self.event_diff = self.scheduler.Generate_Event_Schedule_Diff(diff, data);
				
				var events_to_insert = [];
				var events_to_remove = [];
				
				for(var key in self.event_diff)
				{
					
					var diff_row = self.event_diff[key];
					
					if(diff_row.operation == 'insert')
					{
						events_to_insert.push(diff_row.event_row);
					}
					else if(diff_row.operation == 'update')
					{
						$('#' + self.calendar_div.id).fullCalendar('updateEvent',diff_row.event_row);
					}
					else if(diff_row.operation == 'remove')
					{
						events_to_remove.push(diff_row.event_row);
					}
					
				}
				
				//remove all required events
				$('#' + self.calendar_div.id).fullCalendar('removeEvents',function(calEvent){
					
					var return_value = false;
					
					for(var key in events_to_remove)
					{
						var event_to_remove = events_to_remove[key];
						
						//check for match
						if(calEvent == event_to_remove)
						{
							//event found, remove from array and return true
							
							events_to_remove.splice(key,1);
							
							return_value = true;
							
							break;
						}
					}
					
			        return return_value;
			        
			    });
				
				$('#' + self.calendar_div.id).fullCalendar('addEventSource',events_to_insert);
				
				
			};
			
			this.isTouchDevice = function()
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
				if(self.isTouchDevice())
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
			
			this.Calendar_View_Type_Radio_Change = function()
			{
				
				if(document.getElementById(self.radio_button_agenda.id).checked)
				{
					self.day_view_type = 'agendaDay';
					self.week_view_type = 'agendaWeek';
				}
				else
				{
					self.day_view_type = 'basicDay';
					self.week_view_type = 'basicWeek';
				}
				
				$('#' + self.calendar_div.id).fullCalendar('changeView', self.day_view_type );
				self.Refresh(self.data);
				
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
				
				self.calendar_options_form = document.createElement("form");
				self.calendar_options_form.id = home_div_id + "_calendar_options_form";
				
				self.calendar_options_form.innerHTML += "Settings:<br><br>";
				
				self.radio_button_agenda = document.createElement('input');
				self.radio_button_agenda.id = home_div_id + '_radio_button_agenda';
				self.radio_button_agenda.type = 'radio';
				self.radio_button_agenda.value = 'agenda';
				self.radio_button_agenda.className = 'radio_input';
				self.radio_button_agenda.name = 'calendar_view';
				self.calendar_options_form.appendChild(self.radio_button_agenda);
				self.calendar_options_form.innerHTML += "Agenda View";
				
				self.radio_button_basic = document.createElement('input');
				self.radio_button_basic.id = home_div_id + '_radio_button_basic';
				self.radio_button_basic.type = 'radio';
				self.radio_button_basic.value = 'basic';
				self.radio_button_basic.className = 'radio_input';
				self.radio_button_basic.name = 'calendar_view';
				self.calendar_options_form.appendChild(self.radio_button_basic);
				self.calendar_options_form.innerHTML += "Basic View";
				
				self.calendar_options_form.innerHTML += "<br><hr>";
				
				document.getElementById(accordian_div).appendChild(self.calendar_options_form);
				
				self.calendar_div = document.createElement("div");
				self.calendar_div.id = home_div_id + '_calendar_div';
				document.getElementById(accordian_div).appendChild(self.calendar_div);
				
				$('#' + self.calendar_div.id).fullCalendar({
					header: {
						left: 'month,' + self.week_view_type + ',' + self.day_view_type,
						center: 'today',
						right: 'prev,next'
					},
					eventAfterAllRender: self.Calendar_Render_Complete
				});
				
		   		$('#' + self.calendar_div.id).fullCalendar('render');
		   		$('#' + self.calendar_div.id).fullCalendar('today');
		   		$('#' + self.calendar_div.id).fullCalendar('changeView', self.day_view_type );
				
				document.getElementById(self.radio_button_agenda.id).checked = true;
				
				$('#' + self.radio_button_agenda.id).change(function(){
					
					self.Calendar_View_Type_Radio_Change();
					
				});
				
				$('#' + self.radio_button_basic.id).change(function(){
					
					self.Calendar_View_Type_Radio_Change();
					
				});
				
				
			};
		}
	};
});




