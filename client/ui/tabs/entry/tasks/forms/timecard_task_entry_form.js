define([
        'jquery.ui',
        ],function($){
	
	/** This is the timecard task entry form to starting/stopping tasks.
	 * @constructor Timecard_Task_Entry_Form
	 */
	function Timecard_Task_Entry_Form(){
		
		var self = this;
		
		this.Refresh = function(data){
			
			self.data = data;
			
			Refresh_Select_HTML_From_Table(
				self.task_name_select.id,
				data.tasks,
				"task_id",
				"name");
			
			Refresh_Select_HTML_From_Table(
				self.task_target_select.id,
				data.task_targets,
				"task_schedule_id",
				"name");
			
			Refresh_Select_HTML_From_Table(
				self.task_entries_started_select.id,
				data.task_entries,
				"task_log_id",
				"name");
			
		};
		
		this.Refresh_From_Diff = function(diff, data)
		{
			
			Refresh_Select_HTML_From_Table_Diff(
				self.task_name_select.id,
				diff.data.tasks,
				"task_id",
				"name");
			
			Refresh_Select_HTML_From_Table_Diff(
				self.task_target_select.id,
				diff.data.task_targets,
				"task_schedule_id",
				"name");
			
			Refresh_Select_HTML_From_Table_Diff(
				self.task_entries_started_select.id,
				diff.data.task_entries,
				"task_log_id",
				"name");
			
		};
		
		
		/** @method Start_Stop_Task
		 * @desc This function starts and stops a task with the server.
		 * @param {function} refresh_callback The callback to call after the data operation has completed.
		 * */
		this.Start_Stop_Task = function(is_complete) {
			
			if(this.task_start_stop_button.value == 'Stop')
			{
				var currentTime = new Date();
				var time_diff_seconds = (currentTime - self.current_task_start_time) / 1000;
				var hours = time_diff_seconds / 60 / 60;
				
				var selected_task_entry_id = document.getElementById(self.task_entries_started_select.id).value;
				var selected_task_id = document.getElementById(self.task_name_select.id).value;
				var task_time = self.selected_task_entry.start_time;
				var duration = hours;
				var task_note = self.selected_task_entry.note;
				var task_status = 'Stopped';
				var target_id = document.getElementById(self.task_target_select.id).value;
				
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
				
				var selected_task_id = document.getElementById(self.task_name_select.id).value;
				var task_time = current_time.toISOString();
				var duration = 0;
				var task_note = '';
				var task_status = 'Started';
				var target_id = document.getElementById(self.task_target_select.id).value;
				
				var params = {};
				
				params["start_time"] = task_time;
				params["task_id"] = selected_task_id;
				params["hours"] = duration;
				params["status"] = task_status;
				params["note"] = task_note;
				params["task_target_id"] = target_id;

				//execute the RPC callback for retrieving the item log
				app.api.Task_Data_Interface.Insert_Task_Entry(params, function(jsonRpcObj) {

					if (jsonRpcObj.result.success) {

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

			this.Start_Stop_Task(false);
		};
		
		
		/** @method On_Complete_Click_Event
		 * @desc This function is the complete button click event.
		 * */
		this.On_Complete_Click_Event = function() {
			var task_name = $('#' + this.task_name_select.id).val();
			var task_start_stop = this.task_start_stop_button.value;

			//stop the task before marking it complete
			if (task_start_stop == 'Stop') {
				this.Start_Stop_Task(true);
			}
		};
		
		
		/** @method Refresh_Timer_Display
		 * @desc This function will refresh the start/stop task timer UI elements. It is setup to be called every 1 second.
		 * */
		this.Refresh_Timer_Display = function() {
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
		
		this.Task_Start_Entry_Change = function(){
			

			//execute the click event
			if(document.getElementById(self.task_entries_started_select.id).value != 0)
			{
				
				$('#' + self.task_timecard_note_div.id).show();
				if(document.getElementById(self.task_target_select.id).value != 0)
				{
					$('#' + self.task_start_complete_button.id).show();
				}
				self.task_start_stop_button.value = 'Stop';
			}
			else
			{
				$('#' + self.task_timecard_note_div.id).hide();
				$('#' + self.task_start_complete_button.id).hide();
				self.task_start_stop_button.value = 'Start';
			}
			
		};

		
		/** @method Render
		 * @desc This function renders the timecard task entry form in the specified div.
		 * @param {String} form_div_id The div ID to render the form in. 
		 * */
		this.Render = function(form_div_id) {

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
			
			//hook for the entry change select event
			$('#' + this.task_entries_started_select.id).change(function(event) {

				
				self.Task_Start_Entry_Change();
				
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
	
	function Build_Timecard_Task_Entry_Form()
	{
		
		var built_timecard_task_entry_form = new Timecard_Task_Entry_Form();
		
		return built_timecard_task_entry_form;
		
	}
	
	return {
		Build_Timecard_Task_Entry_Form: Build_Timecard_Task_Entry_Form,
		Timecard_Task_Entry_Form: Timecard_Task_Entry_Form
	};
});

