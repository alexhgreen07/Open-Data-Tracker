/** This is the home form class which holds all UI objects for the homepage form.
 * @constructor Home_Form
 */
function Home_Form(home_div_id) {
	
	
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
		
		while(upcoming_tasks.length > 3){
			
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
		
		while(recent_items.length > 3){
			
			recent_items.shift();
			
		}
		
		//create the running tasks table
		running_tasks_table = '';
		
		running_tasks_table += '<table><tr><th>Name</th><th>Start Time</th></tr>';
		
		for(var i = 0; i < running_tasks.length; i++)
		{
			running_tasks_table += '<tr>' + 
				'<td>' + running_tasks[i].name + '</td>' + 
				'<td>' + running_tasks[i].start_time + '</td>' + 
				'</tr>';
		}
		
		running_tasks_table += '</table><hr>';
		
		running_tasks_div.innerHTML += running_tasks_table;
		
		//create the upcoming task targets table
		upcoming_tasks_table = '';
		
		upcoming_tasks_table += '<table><tr><th>Name</th><th>Start Time</th></tr>';
		
		for(var i = 0; i < upcoming_tasks.length; i++)
		{
			upcoming_tasks_table += '<tr>' + 
				'<td>' + upcoming_tasks[i].name + '</td>' + 
				'<td>' + upcoming_tasks[i].scheduled_time + '</td>' + 
				'</tr>';
		}
		
		upcoming_tasks_table += '</table><hr>';
		
		upcoming_tasks_div.innerHTML += upcoming_tasks_table;
		
		//create the recent items table
		recent_items_table = '';
		
		recent_items_table += '<table><tr><th>Name</th><th>Entry Time</th><th>Value</th></tr>';
		
		for(var i = 0; i < recent_items.length; i++)
		{
			recent_items_table += '<tr>' + 
				'<td>' + recent_items[i].name + '</td>' + 
				'<td>' + recent_items[i].time + '</td>' + 
				'<td>' + recent_items[i].value + '</td>' + 
				'</tr>';
		}
		
		recent_items_table += '</table><hr>';
		
		recent_items_div.innerHTML += recent_items_table;
		
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