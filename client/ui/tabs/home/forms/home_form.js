define([
        'core/datetimes',
        ],function(datetimes){
	
	/** This is the home form class which holds all UI objects for the homepage form.
	 * @constructor Home_Form
	 */
	function Home_Form(home_div_id) {
		
		var self = this;
		
		this.event_click_callback = function(table, row){};
		
		this.Refresh = function(data, home_report){
			
			running_tasks_div = this.running_tasks_div;
			upcoming_tasks_div = this.upcoming_tasks_div;
			recent_items_div = this.recent_items_div;
			
			running_tasks_div.innerHTML = '';
			upcoming_tasks_div.innerHTML = '';
			recent_items_div.innerHTML = '';
			
			running_tasks = home_report.running_tasks;
			upcoming_tasks = home_report.upcoming_tasks;
			recent_items = home_report.recent_items;
			
			//create the running tasks table
			running_tasks_table = document.createElement('table');
			running_tasks_table = running_tasks_div.appendChild(running_tasks_table);
			
			//create header row
			var header_row = document.createElement('tr');
			header_row = running_tasks_table.appendChild(header_row);
			
			//create header cells
			var header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Name"));
			
			header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Start Time"));
			
			for(var i = 0; i < running_tasks.length; i++)
			{
				var datetime = datetimes.Cast_Server_Datetime_to_Date(running_tasks[i].start_time);
				var now = new Date();
	   			scheduled_interval = datetimes.Get_String_From_Time_Interval(now, datetime);
	   			if(now > datetime)
	   			{
	   				scheduled_interval = scheduled_interval + " ago";
	   			}
	   			else
	   			{
	   				scheduled_interval = "in " + scheduled_interval;
	   			}
				
				running_tasks_row = document.createElement('tr');
				running_tasks_row.id = 'running_tasks_' + running_tasks[i].task_log_id;
				
				running_tasks_row.innerHTML += 
					'<td>' + running_tasks[i].name + '</td>' + 
					'<td>' + scheduled_interval + '</td>';
				
				running_tasks_row = running_tasks_table.appendChild(running_tasks_row);
				
				running_tasks_row.row = running_tasks[i];
				
				$(running_tasks_row).css('cursor','pointer');
				
				$(running_tasks_row).click(function(){
					
					self.event_click_callback('task_entries', this.row);
					
				});
				
			}
			
			running_tasks_div.appendChild(document.createElement('hr'));
			
			var row_ids = [];
			
			//create the upcoming task targets table
			upcoming_tasks_table = document.createElement('table');
			upcoming_tasks_table = upcoming_tasks_div.appendChild(upcoming_tasks_table);
			
			var header_row = document.createElement('tr');
			header_row = upcoming_tasks_table.appendChild(header_row);
			
			//create header cells
			var header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Name"));
			
			header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Time To Target"));
			
			header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Estimated Time"));
			
			for(var i = 0; i < upcoming_tasks.length; i++)
			{
				var datetime = datetimes.Cast_Server_Datetime_to_Date(upcoming_tasks[i].scheduled_time);
	   			var now = new Date();
	   			scheduled_interval = datetimes.Get_String_From_Time_Interval(now, datetime);
	   			if(now > datetime)
	   			{
	   				scheduled_interval = scheduled_interval + " ago";
	   			}
	   			else
	   			{
	   				scheduled_interval = "in " + scheduled_interval;
	   			}
	   			estimated_time_string = datetimes.Get_String_From_Time_Interval(0,Math.round(upcoming_tasks[i].estimated_time * 60 * 60 * 1000));
				
				upcoming_tasks_row = document.createElement('tr');
				upcoming_tasks_row.id = 'upcoming_tasks_' + upcoming_tasks[i].task_schedule_id;
				
				upcoming_tasks_row.innerHTML += 
					'<td>' + upcoming_tasks[i].name + '</td>' + 
					'<td>' + scheduled_interval + '</td>' + 
					'<td>' + estimated_time_string + '</td>';
					
				upcoming_tasks_row = upcoming_tasks_table.appendChild(upcoming_tasks_row);
				
				upcoming_tasks_row.row = upcoming_tasks[i];
				
				$(upcoming_tasks_row).css('cursor','pointer');
				
				$(upcoming_tasks_row).click(function(){
					
					self.event_click_callback('task_targets', this.row);
					
				});
			}
			
			upcoming_tasks_div.appendChild(document.createElement('hr'));
			
			
			//create the recent items table
			recent_items_table = document.createElement('table');
			recent_items_table = recent_items_div.appendChild(recent_items_table);
			
			var header_row = document.createElement('tr');
			header_row = recent_items_table.appendChild(header_row);
			
			//create header cells
			var header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Name"));
			
			header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Entry Time"));
			
			header_cell = document.createElement('th');
			header_cell = header_row.appendChild(header_cell);
			header_cell.appendChild(document.createTextNode("Value"));
			
			//recent_items_table.innerHTML += '<tr><th>Name</th><th>Entry Time</th><th>Value</th></tr>';
			
			for(var i = 0; i < recent_items.length; i++)
			{
				var datetime = datetimes.Cast_Server_Datetime_to_Date(recent_items[i].time);
	   			var now = new Date();
	   			scheduled_interval = datetimes.Get_String_From_Time_Interval(now, datetime);
				
				if(now > datetime)
	   			{
	   				scheduled_interval = scheduled_interval + " ago";
	   			}
	   			else
	   			{
	   				scheduled_interval = "in " + scheduled_interval;
	   			}
				
				recent_item_row = document.createElement('tr');
				recent_item_row.id = 'recent_items_' + recent_items[i].item_log_id;
				
				recent_item_row.innerHTML += '<tr>' + 
					'<td>' + recent_items[i].name + '</td>' + 
					'<td>' + scheduled_interval + '</td>' + 
					'<td>' + recent_items[i].value + '</td>' + 
					'</tr>';
				
				recent_item_row = recent_items_table.appendChild(recent_item_row);
				
				recent_item_row.row = recent_items[i];
				
				$(recent_item_row).css('cursor','pointer');
				
				$(recent_item_row).click(function(){
					
					self.event_click_callback('item_entries', this.row);
					
				});
			}
			
			recent_items_div.appendChild(document.createElement('hr'));
			
		};
		
		this.Refresh_From_Diff = function(diff){
			
			//TODO: implement
			
		};
		
		/** @method Summary_Data_Refresh_Click_Event
		 * @desc This is the summary data refresh button click event handler.
		 * @param {function} refresh_callback The callback to call after the refresh of data has completed.
		 * */
		this.Summary_Data_Refresh_Click_Event = function(data) {
			
			
			
		};
		
		/** @method Render
		 * @desc This function will render the home data form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in.
		 * */
		this.Render = function(div_tab) {
			
			div_tab.innerHTML = '';
			
			this.data_form = document.createElement("form");
			this.data_form.setAttribute('method', "post");
			this.data_form.setAttribute('id', "home_display_form");
			
			this.data_form = div_tab.appendChild(this.data_form);

			this.new_data_display_div = document.createElement("div");
			this.new_data_display_div = this.data_form.appendChild(this.new_data_display_div);
			
			this.new_data_display_div.appendChild(document.createTextNode("Running Tasks: "));
			this.new_data_display_div.appendChild(document.createElement('br'));
			this.running_tasks_div = document.createElement("div");
			this.running_tasks_div.id = 'new_data_display_div';
			this.running_tasks_div = this.new_data_display_div.appendChild(this.running_tasks_div);
			
			this.new_data_display_div.appendChild(document.createTextNode("Upcoming Tasks: "));
			this.new_data_display_div.appendChild(document.createElement('br'));
			this.upcoming_tasks_div = document.createElement("div");
			this.upcoming_tasks_div.id = 'upcoming_tasks_div';
			this.upcoming_tasks_div = this.new_data_display_div.appendChild(this.upcoming_tasks_div);
			
			
			this.new_data_display_div.appendChild(document.createTextNode("Recent Items: "));
			this.new_data_display_div.appendChild(document.createElement('br'));
			this.recent_items_div = document.createElement("div");
			this.recent_items_div.id = 'recent_items_div';
			this.recent_items_div = this.new_data_display_div.appendChild(this.recent_items_div);

		};
			
	}
	
	function Build_Home_Form()
	{
		var built_home_form = new Home_Form();
		
		return built_home_form;
	}
	
	return {
		Build_Home_Form: Build_Home_Form,
		Home_Form: Home_Form,
	};
});


