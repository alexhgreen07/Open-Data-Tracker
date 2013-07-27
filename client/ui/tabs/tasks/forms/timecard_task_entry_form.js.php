<?php
/*
 * NOTE: This is PHP code intended to perform server side includes
 * and resolve any javascript file dependencies. If PHP is
 * not installed on the server, this code can be replaced
 * with client side HTML includes (or dynamic javascript includes.)
*/

Header("content-type: application/x-javascript");

//jquery code
include_once(dirname(__FILE__).'/../../../external/jquery-ui-1.10.0.custom/js/jquery-1.9.0.js');

//jquery UI code
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.js');

//jquery datepicker code (addon)
include_once(dirname(__FILE__).'/../../../../external/jquery-ui-timerpicker-addon/jquery-ui-timepicker-addon.js');

//JSON RPC library
include_once(dirname(__FILE__).'/../../../../external/json-rpc2php-master/jsonRPC2php.client.js');

?>

/** This is the timecard task entry form to starting/stopping tasks.
 * @constructor Timecard_Task_Entry_Form
 */
function Timecard_Task_Entry_Form(){
	
	this.Refresh = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		//create a list of options for the select
		var new_inner_html = '';

		new_inner_html += '<option>-</option>';

		//iterate through all tasks
		for (var i = 0; i < self.task_info_json_array.length; i++) {
			//add task option to select
			new_inner_html += '<option>' + self.task_info_json_array[i].name + '</option>';

			//format task start datetime
			if (self.task_info_json_array[i].start_time != '') {
				//change start date string to javascript date object
				//var t = self.task_info_json_array[i].start_time.split(/[- :]/);
				//self.task_info_json_array[i].start_time = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
			}
		}

		document.getElementById(self.task_name_select.id).innerHTML = new_inner_html;
		
		
	};
	
	
	/** @method On_Task_Name_Select_Change_Event
	 * @desc This function is the HTML select task start/stop index change event handler.
	 * */
	this.On_Task_Name_Select_Change_Event = function() {
		//alert('Handler for task name select change called.');

		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var new_html = '';
		new_html += 'Info:<br /><br />';

		if (selected_index > 0) {

			var new_item = this.task_info_json_array[selected_index - 1];

			new_html += 'Task ID: ' + new_item.task_id + '<br />';
			new_html += 'Date Created: ' + new_item.date_created + '<br />';
			new_html += 'Estimated Time (Hours): ' + new_item.estimated_time + '<br />';
			new_html += 'Status: ' + new_item.item_status + '<br />';
			new_html += 'Start Time: ' + new_item.start_time + '<br />';

			if (new_item.item_status == 'Started') {
				//set the start time and button value
				this.current_task_start_time = new_item.start_time;
				$('#' + this.task_timecard_note_div.id).show();
				this.task_start_stop_button.value = 'Stop';
			} else {
				$('#' + this.task_timecard_note_div.id).hide();
				this.task_start_stop_button.value = 'Start';
			}
		} else {
			this.task_start_stop_button.value = 'Start';
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
	this.Start_Stop_Task = function(refresh_callback) {
		var params = new Array();

		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.task_name_select.id).selectedIndex;
		var selected_task = this.task_info_json_array[selected_index - 1];

		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;
		var task_note = $('#' + this.task_timecard_note.id).val();

		//ensure it is not the first item in the list
		if (task_name != '-') {

			params[0] = task_name;
			params[1] = task_start_stop;
			params[2] = task_note;

			var self = this;

			//execute the RPC callback for retrieving the item log
			app.api.Task_Data_Interface.Task_Start_Stop(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					if (self.task_start_stop_button.value == 'Start') {
						//set the new fiels for the task
						selected_task.start_time = new Date();
						self.current_task_start_time = selected_task.start_time;
						selected_task.item_status = 'Started';

						$('#' + self.task_timecard_note_div.id).show();
						self.task_start_stop_button.value = 'Stop';
					} else {
						//set the new fields for the task
						selected_task.start_time = '';
						selected_task.item_status = 'Stopped';

						//reset the notes
						$('#' + self.task_timecard_note.id).val('');

						$('#' + self.task_timecard_note_div.id).hide();
						self.task_start_stop_button.value = 'Start';
					}

					//refresh the info div
					self.On_Task_Name_Select_Change_Event();

					//refresh the timer
					self.Refresh_Timer_Display();

					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});

				} else {
					alert('Task failed to start/stop.');
				}

			});

		} else {
			alert('Please select a valid task.');
		}
	};
	
	
	/** @method Mark_Task_Complete
	 * @desc This function marks a task complete based on the information in the form.
	 * @param {function} refresh_callback The callback to call after the data operation has completed.
	 * */
	this.Mark_Task_Complete = function(refresh_callback) {
		var params = new Array();

		var task_name = $('#' + this.task_name_select.id).val();
		var task_start_stop = this.task_start_stop_button.value;

		//ensure it is not the first item in the list
		if (task_name != '-') {
			params[0] = task_name;

			var self = this;

			//execute the RPC callback for retrieving the item log
			app.api.Task_Data_Interface.Task_Mark_Complete(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					alert('Task completed.');

					//reset the notes
					$('#' + self.task_timecard_note.id).val('');

					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});
					
				} else {
					alert('Task failed to complete.');
				}

			});

		} else {
			alert('Please select a valid task.');
		}
	};
	
	/** @method On_Start_Stop_Click_Event
	 * @desc This function is the start/stop button click event handler.
	 * */
	this.On_Start_Stop_Click_Event = function() {
		var self = this;

		this.Start_Stop_Task(function() {
			self.refresh_task_log_callback();
		});
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
			this.Start_Stop_Task(function() {
				self.Mark_Task_Complete(function() {
					self.refresh_task_log_callback();
				});
			});
		} else {
			this.Mark_Task_Complete(function() {
				self.refresh_task_log_callback();
			});
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

		this.data_form_timecard_entry.innerHTML += 'Tasks:<br />';

		//task name select dropdown
		this.task_name_select = document.createElement("select");
		this.task_name_select.setAttribute('name', "task_name_to_enter");
		this.task_name_select.setAttribute('id', "task_name_to_enter");
		this.task_name_select.innerHTML = '<option>-</option>';
		
		this.data_form_timecard_entry.appendChild(this.task_name_select);

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
		
		$('#' + this.task_name_select.id).change(function() {

			//call the change event function
			self.On_Task_Name_Select_Change_Event();

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

		
		//this is used to update the timer value on running tasks
		window.setInterval(function() {

			self.Refresh_Timer_Display();

		}, 1000);
	};
	
}