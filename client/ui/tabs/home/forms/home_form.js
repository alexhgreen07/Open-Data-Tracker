/** This is the home form class which holds all UI objects for the homepage form.
 * @constructor Home_Form
 */
function Home_Form(home_div_id) {
	
	var self = this;
	
	this.event_click_callback = function(table, row){};
	
	this.Refresh = function(data){
		
		running_tasks_div = document.getElementById(this.running_tasks_div.id);
		upcoming_tasks_div = document.getElementById(this.upcoming_tasks_div.id);
		recent_items_div = document.getElementById(this.recent_items_div.id);
		
		running_tasks_div.innerHTML = '';
		upcoming_tasks_div.innerHTML = '';
		recent_items_div.innerHTML = '';
		
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

			datetime_a = Cast_Server_Datetime_to_Date(a.scheduled_time);
			datetime_b = Cast_Server_Datetime_to_Date(b.scheduled_time);
			
			if ( datetime_b < datetime_a )
			  return -1;
			if ( datetime_b > datetime_a )
			  return 1;
			return 0;
			
		});
		
		//execute sort according to 'time'
		recent_items.sort(function(a,b){
			
			datetime_a = Cast_Server_Datetime_to_Date(a.time);
			datetime_b = Cast_Server_Datetime_to_Date(b.time);
			
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

			datetime_a = Cast_Server_Datetime_to_Date(a.scheduled_time);
			datetime_b = Cast_Server_Datetime_to_Date(b.scheduled_time);
			
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
			
			datetime_a = Cast_Server_Datetime_to_Date(a.time);
			datetime_b = Cast_Server_Datetime_to_Date(b.time);
			
			if ( datetime_b < datetime_a )
			  return -1;
			if ( datetime_b > datetime_a )
			  return 1;
			return 0;
			
		});
		
		//create the running tasks table
		running_tasks_table = document.createElement('table');
		
		running_tasks_table.innerHTML += '<tr><th>Name</th><th>Start Time</th></tr>';
		
		var row_ids = [];
		
		for(var i = 0; i < running_tasks.length; i++)
		{
			var datetime = Cast_Server_Datetime_to_Date(running_tasks[i].start_time);
   			var now = new Date();
   			scheduled_interval = Get_String_From_Time_Interval(now, datetime);
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
			
			running_tasks_table.appendChild(running_tasks_row);
			
			row_ids.push(running_tasks_row.id);
		}
		
		running_tasks_div.appendChild(running_tasks_table);
		running_tasks_div.innerHTML += '<hr>';
		
		//assign events
		for(var i = 0; i < row_ids.length; i++)
		{
			document.getElementById(row_ids[i]).row = running_tasks[i];
			
			$('#' + row_ids[i]).css('cursor','pointer');
			
			$('#' + row_ids[i]).click(function(){
				
				self.event_click_callback('task_entries', this.row);
				
			});
		}
		
		var row_ids = [];
		
		//create the upcoming task targets table
		upcoming_tasks_table = document.createElement('table');
		
		upcoming_tasks_table.innerHTML += '<tr><th>Name</th><th>Time To Target</th><th>Estimated Time</th></tr>';
		
		for(var i = 0; i < upcoming_tasks.length; i++)
		{
			var datetime = Cast_Server_Datetime_to_Date(upcoming_tasks[i].scheduled_time);
   			var now = new Date();
   			scheduled_interval = Get_String_From_Time_Interval(now, datetime);
   			if(now > datetime)
   			{
   				scheduled_interval = scheduled_interval + " ago";
   			}
   			else
   			{
   				scheduled_interval = "in " + scheduled_interval;
   			}
   			estimated_time_string = Get_String_From_Time_Interval(0,Math.round(upcoming_tasks[i].estimated_time * 60 * 60 * 1000));
			
			upcoming_tasks_row = document.createElement('tr');
			upcoming_tasks_row.id = 'upcoming_tasks_' + upcoming_tasks[i].task_schedule_id;
			
			upcoming_tasks_row.innerHTML += 
				'<td>' + upcoming_tasks[i].name + '</td>' + 
				'<td>' + scheduled_interval + '</td>' + 
				'<td>' + estimated_time_string + '</td>';
				
			upcoming_tasks_table.appendChild(upcoming_tasks_row);
			
			row_ids.push(upcoming_tasks_row.id);
		}
		
		upcoming_tasks_div.appendChild(upcoming_tasks_table);
		upcoming_tasks_div.innerHTML += '<hr>';
		
		//assign events
		for(var i = 0; i < row_ids.length; i++)
		{
			document.getElementById(row_ids[i]).row = upcoming_tasks[i];
			
			$('#' + row_ids[i]).css('cursor','pointer');
			
			$('#' + row_ids[i]).click(function(){
				
				self.event_click_callback('task_targets', this.row);
				
			});
		}
		
		var row_ids = [];
		
		//create the recent items table
		recent_items_table = document.createElement('table');
		
		recent_items_table.innerHTML += '<tr><th>Name</th><th>Entry Time</th><th>Value</th></tr>';
		
		for(var i = 0; i < recent_items.length; i++)
		{
			var datetime = Cast_Server_Datetime_to_Date(recent_items[i].time);
   			var now = new Date();
   			scheduled_interval = Get_String_From_Time_Interval(now, datetime);
			
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
			
			recent_items_table.appendChild(recent_item_row);
			
			row_ids.push(recent_item_row.id);
		}
		
		recent_items_div.appendChild(recent_items_table);
		recent_items_div.innerHTML += '<hr>';
		
		//assign events
		for(var i = 0; i < row_ids.length; i++)
		{
			document.getElementById(row_ids[i]).row = recent_items[i];
			
			$('#' + row_ids[i]).css('cursor','pointer');
			
			$('#' + row_ids[i]).click(function(){
				
				self.event_click_callback('task_entries', this.row);
				
			});
		}
		
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
	this.Render = function(form_div_id) {
		this.data_form = document.createElement("form");
		this.data_form.setAttribute('method', "post");
		this.data_form.setAttribute('id', "home_display_form");

		this.new_data_display_div = document.createElement("div");
		
		this.new_data_display_div.innerHTML = 'Running Tasks:<br/>';
		this.running_tasks_div = document.createElement("div");
		this.running_tasks_div.id = 'new_data_display_div';
		this.new_data_display_div.appendChild(this.running_tasks_div);
		
		this.new_data_display_div.innerHTML += 'Upcoming Targets:<br/>';
		this.upcoming_tasks_div = document.createElement("div");
		this.upcoming_tasks_div.id = 'upcoming_tasks_div';
		this.new_data_display_div.appendChild(this.upcoming_tasks_div);
		
		
		this.new_data_display_div.innerHTML += 'Recent Items:<br/>';
		this.recent_items_div = document.createElement("div");
		this.recent_items_div.id = 'recent_items_div';
		this.new_data_display_div.appendChild(this.recent_items_div);
		
		this.data_form.appendChild(this.new_data_display_div);

		var div_tab = document.getElementById(form_div_id);
		div_tab.innerHTML = '';
		div_tab.appendChild(this.data_form);

	};
		
}