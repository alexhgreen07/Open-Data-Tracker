/** This is the timecard task entry form to starting/stopping tasks.
 * @constructor Timecard_Task_Entry_Form
 */
function Timecard_Task_Entry_Form(){
	
	this.Refresh = function(data){
		
		var self = this;
		self.data = data;
		
		self.Refresh_Task_Name_Select(data);
		
		self.Refresh_Task_Targets(data);
		
		self.Refresh_Task_Started_Entries(data);
		
	};
	
	this.Refresh_Task_Name_Select = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;
		
		var previous_value = document.getElementById(self.task_name_select.id).value;
		var is_previous_value_present = false;
		
		//create a list of options for the select
		var new_inner_html = '';

		new_inner_html += '<option value="0">-</option>';
		self.selected_task = {task_id : 0};
		
		self.active_tasks = Array();
		
		//iterate through all tasks
		for (var i = 0; i < self.task_info_json_array.length; i++) {
			
			if(self.task_info_json_array[i].status == "Active")
			{
				self.active_tasks.push(self.task_info_json_array[i]); 
				
				//add task option to select
				new_inner_html += '<option value="' + self.task_info_json_array[i].task_id + '">';
				new_inner_html += self.task_info_json_array[i].name + '</option>';
				
				if(self.task_info_json_array[i].task_id == previous_value)
				{
					is_previous_value_present = true;
					self.selected_task = self.task_info_json_array[i];
				}
			}

		}

		document.getElementById(self.task_name_select.id).innerHTML = new_inner_html;
				
		if(is_previous_value_present)
		{
			document.getElementById(self.task_name_select.id).value = previous_value;
		}

	};
	
	this.Refresh_Task_Targets = function(data){
		
		var self = this;
		
		var previous_value = document.getElementById(self.task_target_select.id).value;
		var is_previous_value_present = false;
		
		//create a list of options for the select
		var new_inner_html = '';

		new_inner_html += '<option value="0">-</option>';
		
		self.selected_task_target = {task_schedule_id : 0};

		//iterate through all tasks
		for (var i = 0; i < data.task_targets.length; i++) {
			
			for(var j = 0; j < self.active_tasks.length; j++)
			{
				if(self.active_tasks[j].task_id == data.task_targets[i].task_id)
				{
					if(document.getElementById(self.task_name_select.id).value == 0 ||
					document.getElementById(self.task_name_select.id).value == data.task_targets[i].task_id)
					{
						//add task option to select
						new_inner_html += '<option value="'
						new_inner_html += data.task_targets[i].task_schedule_id;
						new_inner_html += '">(';
						new_inner_html += data.task_targets[i].task_schedule_id + ') ';
						new_inner_html += data.task_targets[i].name + '</option>';
						
						if(data.task_targets[i].task_schedule_id == previous_value)
						{
							is_previous_value_present = true;
							self.selected_task_target = data.task_targets[i];
						}
					}
					
					break;
				}
			}
			

		}

		document.getElementById(self.task_target_select.id).innerHTML = new_inner_html;
		
		if(is_previous_value_present)
		{
			document.getElementById(self.task_target_select.id).value = previous_value;
		}
	};
	
	this.Refresh_Task_Started_Entries = function(data){
		
		var self = this;
		
		
		//create a list of options for the select
		var new_inner_html = '';

		new_inner_html += '<option value="0">-</option>';
		
		var previous_value = document.getElementById(self.task_entries_started_select.id).value;
		var is_previous_value_present = false;

		//iterate through all tasks
		for (var i = 0; i < data.task_entries.length; i++) {
			
			for(var j = 0; j < self.active_tasks.length; j++)
			{
				if((self.active_tasks[j].task_id == data.task_entries[i].task_id) && 
					(data.task_entries[i].status == "Started"))
				{
					if(document.getElementById(self.task_name_select.id).value == 0 ||
					document.getElementById(self.task_name_select.id).value == data.task_entries[i].task_id)
					{
						if(document.getElementById(self.task_target_select.id).value == 0 ||
						document.getElementById(self.task_target_select.id).value == data.task_entries[i].task_target_id){
							
							//add task option to select
							new_inner_html += '<option value="'
							new_inner_html += data.task_entries[i].task_log_id;
							new_inner_html += '">(';
							new_inner_html += data.task_entries[i].task_log_id + ') ';
							new_inner_html += data.task_entries[i].name + '</option>';
							
							if(data.task_entries[i].task_log_id == previous_value)
							{
								is_previous_value_present = true;
							}
							
							
						}
						
						
					}
			
					
				}
			}

		}

		document.getElementById(self.task_entries_started_select.id).innerHTML = new_inner_html;
		
		if(is_previous_value_present)
		{
			document.getElementById(self.task_entries_started_select.id).value = previous_value;
			
			$('#' + this.task_timecard_note_div.id).show();
			if(document.getElementById(self.task_target_select.id).value != 0)
			{
				$('#' + this.task_start_complete_button.id).show();
			}
			self.task_start_stop_button.value = 'Stop';
		}
		else
		{
			$('#' + this.task_timecard_note_div.id).hide();
			$('#' + this.task_start_complete_button.id).hide();
			self.task_start_stop_button.value = 'Start';
		}
	};
	
	
	/** @method On_Task_Name_Select_Change_Event
	 * @desc This function is the HTML select task start/stop index change event handler.
	 * */
	this.On_Task_Name_Select_Change_Event = function() {
		
		
		this.Refresh(this.data);
		
		this.On_Task_Change_Event();
	};
	
	
	this.On_Task_Target_Select_Change_Event = function() {
		
		var self = this;
		
		for (var i = 0; i < self.data.task_targets.length; i++) {
		
			if(self.data.task_targets[i].task_schedule_id == document.getElementById(self.task_target_select.id).value)
			{
				document.getElementById(self.task_name_select.id).value = self.data.task_targets[i].task_id;
			}
		
		}
		
		this.Refresh(this.data);
		
		this.On_Task_Change_Event();
	};
	
	this.On_Task_Entry_Select_Change_Event = function() {
		
		var self = this;
		
		if(document.getElementById(self.task_entries_started_select.id).value != 0)
		{
			for (var i = 0; i < self.data.task_entries.length; i++) {
				
				if(self.data.task_entries[i].task_log_id == document.getElementById(self.task_entries_started_select.id).value)
				{
					self.selected_task_entry = self.data.task_entries[i];
					
					var sqlDateStr = self.selected_task_entry.start_time; // as for MySQL DATETIME
			        sqlDateStr = sqlDateStr.replace(/:| /g,"-");
			        var YMDhms = sqlDateStr.split("-");
			        var sqlDate = new Date();
			        sqlDate.setFullYear(parseInt(YMDhms[0]), parseInt(YMDhms[1])-1,
			                                                 parseInt(YMDhms[2]));
			        sqlDate.setHours(parseInt(YMDhms[3]), parseInt(YMDhms[4]), 
			                                              parseInt(YMDhms[5]), 0/*msValue*/);
			        
					self.current_task_start_time = sqlDate;
					
					document.getElementById(self.task_name_select.id).value = self.selected_task_entry.task_id;
					document.getElementById(self.task_target_select.id).value = self.selected_task_entry.task_target_id;
					
					break;
				}
				
			}
			
			$('#' + this.task_timecard_note_div.id).show();
			if(document.getElementById(self.task_target_select.id).value != 0)
			{
				$('#' + this.task_start_complete_button.id).show();
			}
			
			
			self.task_start_stop_button.value = 'Stop';
		}
		else
		{
			$('#' + this.task_timecard_note_div.id).hide();
			$('#' + this.task_start_complete_button.id).hide();
			
			self.task_start_stop_button.value = 'Start';
		}
		
		self.On_Task_Change_Event();
		
	};
	
	
	this.On_Task_Change_Event = function() {
		
		//alert('Handler for task name select change called.');

		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var new_html = '';
		new_html += 'Info:<br /><br />';
		new_html += 'Current Time: ' + (new Date()) + '<br />';

		if (selected_index > 0) {

			var new_item = this.task_info_json_array[selected_index - 1];

			new_html += 'Task ID: ' + new_item.task_id + '<br />';
			new_html += 'Date Created: ' + new_item.date_created + '<br />';
			new_html += 'Estimated Time (Hours): ' + new_item.estimated_time + '<br />';
			
			if(this.task_entries_started_select.value != 0 && this.selected_task_entry != null)
			{
				new_html += 'Status: ' + this.selected_task_entry.status + '<br />';
				new_html += 'Start Time: ' + this.selected_task_entry.start_time + '<br />';
			}
			

		}

		new_html += '<br />';

		this.task_info_div.innerHTML = new_html;

		//refresh the timer
		this.Refresh_Timer_Display();
		
	};
	
	
	/** @method Start_Stop_Task
	 * @desc This function starts and stops a task with the server.
	 * @param {function} refresh_callback The callback to call after the data operation has completed.
	 * */
	this.Start_Stop_Task = function(is_complete) {
		
		var self = this;
		
		if(this.task_start_stop_button.value == 'Stop')
		{
			var currentTime = new Date();
			var time_diff_seconds = (currentTime - self.current_task_start_time) / 1000;
			var hours = time_diff_seconds / 60 / 60;
			
			var selected_task_entry_id = self.selected_task_entry.task_log_id;
			var selected_task_id = self.selected_task_entry.task_id;
			var task_time = self.selected_task_entry.start_time;
			var duration = hours;
			var task_note = self.selected_task_entry.note;
			var task_status = 'Stopped';
			var target_id = self.selected_task_entry.task_target_id;
			
			var params = Array();
			
			params[0] = selected_task_entry_id;
			params[1] = selected_task_id;
			params[2] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(task_time);
			params[3] = duration;
			params[4] = task_status;
			params[5] = task_note;
			params[6] = target_id;
			if(is_complete && target_id != 0)
			{
				params[7] = 1;
			}
			else
			{
				params[7] = 0;
			}
			
	
			//execute the RPC callback for retrieving the item log
			app.api.Task_Data_Interface.Update_Task_Entry(params, function(jsonRpcObj) {
	
				if (jsonRpcObj.result.success == 'true') {
	
					alert('Task entry submitted.');
	
					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
	
				} else {
					
					alert('Failed to update task entry.');
				}
	
	
			});
		}
		else
		{
			
			var current_time = new Date();
			
			var selected_task_id = self.selected_task.task_id;
			var task_time = Cast_Date_to_Server_Datetime(current_time);
			var duration = 0;
			var task_note = '';
			var task_status = 'Started';
			var target_id = self.selected_task_target.task_schedule_id;
			
			var params = new Array();

			params[0] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(task_time);
			params[1] = selected_task_id;
			params[2] = duration;
			params[3] = task_status;
			params[4] = task_note;
			params[5] = target_id;

			//execute the RPC callback for retrieving the item log
			app.api.Task_Data_Interface.Insert_Task_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					alert('Task entry submitted.');

					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});

				} else {
					
					alert('Failed to insert task entry.');
				}

			});
			
		}
		
		
		
	};
	
	/** @method On_Start_Stop_Click_Event
	 * @desc This function is the start/stop button click event handler.
	 * */
	this.On_Start_Stop_Click_Event = function() {
		var self = this;

		this.Start_Stop_Task(false);
	};
	
	
	/** @method On_Complete_Click_Event
	 * @desc This function is the complete button click event.
	 * */
	this.On_Complete_Click_Event = function() {
		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;
		var self = this;

		//stop the task before marking it complete
		if (task_start_stop == 'Stop') {
			this.Start_Stop_Task(true);
		}
	};
	
	
	/** @method Refresh_Timer_Display
	 * @desc This function will refresh the start/stop task timer UI elements. It is setup to be called every 1 second.
	 * */
	this.Refresh_Timer_Display = function() {
		var self = this;
		var new_html = '';

		if (self.task_start_stop_button.value == 'Stop') {
			var currentTime = new Date();

			var time_diff_seconds = (currentTime - self.current_task_start_time) / 1000;
			var days = Math.floor(time_diff_seconds / 60 / 60 / 24);
			var hours = Math.floor(time_diff_seconds / 60 / 60) % 24;
			var minutes = Math.floor(time_diff_seconds / 60) % 60;

			var seconds = Math.floor(time_diff_seconds % 60);

			new_html += "Running Time: " + days + ":" + hours + ":" + minutes + ":" + seconds;
			new_html += '<br /><br />';

		}

		self.task_timer_div.innerHTML = new_html;
	};

	
	/** @method Render
	 * @desc This function renders the timecard task entry form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {

		var self = this;

		//create the top form
		this.data_form_timecard_entry = document.createElement("form");
		this.data_form_timecard_entry.setAttribute('method', "post");
		this.data_form_timecard_entry.setAttribute('id', "timecard_task_entry_form");

		this.data_form_timecard_entry.innerHTML += 'Task:<br />';

		//task name select dropdown
		this.task_name_select = document.createElement("select");
		this.task_name_select.setAttribute('name', "task_name_to_enter");
		this.task_name_select.setAttribute('id', "task_name_to_enter");
		this.task_name_select.innerHTML = '<option value="0">-</option>';
		
		this.data_form_timecard_entry.appendChild(this.task_name_select);

		this.data_form_timecard_entry.innerHTML += '<br />Target:<br />';

		//task name select dropdown
		this.task_target_select = document.createElement("select");
		this.task_target_select.setAttribute('name', "task_target_name");
		this.task_target_select.setAttribute('id', "task_target_name");
		this.task_target_select.innerHTML = '<option value="0">-</option>';
		
		this.data_form_timecard_entry.appendChild(this.task_target_select);

		this.data_form_timecard_entry.innerHTML += '<br />Started Entry:<br />';

		//task name select dropdown
		this.task_entries_started_select = document.createElement("select");
		this.task_entries_started_select.setAttribute('name', "task_entries_started_names");
		this.task_entries_started_select.setAttribute('id', "task_entries_started_names");
		this.task_entries_started_select.innerHTML = '<option value="0">-</option>';
		
		this.data_form_timecard_entry.appendChild(this.task_entries_started_select);

		this.task_timecard_note_div = document.createElement("div");
		this.task_timecard_note_div.setAttribute('id', 'task_timecard_note_div');
		this.task_timecard_note_div.innerHTML = 'Note:<br />';
		this.task_timecard_note = document.createElement("input");
		this.task_timecard_note.setAttribute('id', 'task_timecard_note');
		this.task_timecard_note_div.appendChild(this.task_timecard_note);
		this.data_form_timecard_entry.appendChild(this.task_timecard_note_div);

		//info div creation
		this.task_info_div = document.createElement("div");
		this.task_info_div.setAttribute('id', 'task_info_div');
		this.task_info_div.innerHTML = 'Info:<br /><br />';
		this.data_form_timecard_entry.appendChild(this.task_info_div);

		this.task_timer_div = document.createElement("div");
		this.data_form_timecard_entry.appendChild(this.task_timer_div);

		//task start/stop button creation
		this.task_start_stop_button = document.createElement("input");
		this.task_start_stop_button.setAttribute('id', 'task_entry_start_stop');
		this.task_start_stop_button.setAttribute('name', 'task_entry_start_stop');
		this.task_start_stop_button.setAttribute('type', 'submit');
		this.task_start_stop_button.value = 'Start';

		this.data_form_timecard_entry.appendChild(this.task_start_stop_button);

		this.test_div = document.createElement("div");
		this.test_div.innerHTML = '<br />';
		this.data_form_timecard_entry.appendChild(this.test_div);

		//task mark complete button creation
		this.task_start_complete_button = document.createElement("input");
		this.task_start_complete_button.setAttribute('id', 'task_entry_complete');
		this.task_start_complete_button.setAttribute('name', 'task_entry_complete');
		this.task_start_complete_button.setAttribute('type', 'submit');
		this.task_start_complete_button.value = 'Mark Complete';

		
		this.data_form_timecard_entry.appendChild(this.task_start_complete_button);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_timecard_entry);

		$('#' + self.task_timecard_note_div.id).hide();
		
		//hook for the name change select event
		$('#' + this.task_name_select.id).change(function() {

			//call the change event function
			self.On_Task_Name_Select_Change_Event();

		});
		
		//hook for the target change select event
		$('#' + this.task_target_select.id).change(function(event) {

			//execute the click event
			self.On_Task_Target_Select_Change_Event();
		});
		
		//hook for the entry change select event
		$('#' + this.task_entries_started_select.id).change(function(event) {

			//execute the click event
			self.On_Task_Entry_Select_Change_Event();
		});
		
				
		$('#' + this.task_start_stop_button.id).button();
		$('#' + this.task_start_stop_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Start_Stop_Click_Event();
		});
		
		
		$('#' + this.task_start_complete_button.id).button();
		$('#' + this.task_start_complete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Complete_Click_Event();
		});
		
		//hide the task complete button
		$('#' + this.task_start_complete_button.id).hide();

		
		//this is used to update the timer value on running tasks
		window.setInterval(function() {

			self.Refresh_Timer_Display();

		}, 1000);
	};
	
}