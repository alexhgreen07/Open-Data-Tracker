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
		recent_items_div.innerHTML = 'item1';
		
		running_tasks = [];
		upcoming_tasks = [];
		recent_items = [];
		
		for (var i = 0; i < data.task_entries.length; i++) {
			
			if(data.task_entries[i].status == "Started")
			{
				running_tasks.push(data.task_entries[i]);
			}
			
		}
		
		for (var i = 0; i < data.item_entries.length; i++) {
			
			recent_items.push(data.item_entries[i]);
			
		}
		
		
		for (var i = 0; i < data.task_targets.length; i++) {
			
			
			upcoming_tasks.push(data.task_targets[i]);
			
		}
		
		
		upcoming_tasks.sort(function(a,b){
			
			return_value = a.scheduled_time.localeCompare(b.scheduled_time);
			
			return return_value;
			
		});
		
		recent_items.sort(function(a,b){
			
			return_value = a.time.localeCompare(b.time);
			
			return return_value;
			
		});
		
		running_tasks_div.innerHTML += JSON.stringify(running_tasks);
		upcoming_tasks_div.innerHTML += JSON.stringify(upcoming_tasks);
		recent_items_div.innerHTML += JSON.stringify(recent_items);
		
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