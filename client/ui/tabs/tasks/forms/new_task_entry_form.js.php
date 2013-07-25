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

/** This is the new task entry form to entering task entry data.
 * @constructor New_Task_Entry_Form
 */
function New_Task_Entry_Form(){
	
	
	/** @method Insert_Task_Entry
	 * @desc This function inserts a task entry from the insert entry form.
	 * @param {bool} is_completed If 'True' the task entry should be marked complete. Otherwise the entry will not be marked complete.
	 * */
	this.Insert_Task_Entry = function(is_completed) {
		var self = this;
		var params = new Array();

		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.add_task_entry_task_name_select.id).selectedIndex;

		if (selected_index > 0) {

			var selected_task = this.task_info_json_array[selected_index - 1];
			var task_time = $('#' + this.task_entry_start_time.id).val();
			var duration = $('#' + this.task_entry_duration.id).val();
			var task_note = $('#' + this.task_entry_note.id).val();
			var task_status = $('#' + this.add_task_entry_task_status_select.id).val();

			params[0] = task_time;
			params[1] = selected_task.task_id;
			params[2] = duration;
			params[3] = 0;
			params[4] = task_status;
			params[5] = task_note;

			if (is_completed) {

				params[3] = 1;

			} else {
				params[3] = 0;
			}

			//execute the RPC callback for retrieving the item log
			rpc.Task_Data_Interface.Insert_Task_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					$('#' + self.task_entry_duration.id).val('0');
					$('#' + self.task_entry_note.id).val('');

					alert('Task entry submitted.');

					self.Refresh_Tasks(function() {
						//refresh_callback();

						self.Refresh_Task_Name_List(function() {
							self.refresh_task_log_callback();
						});

					});

				} else {
					alert('Failed to insert task entry.');
				}

			});

		}
	};
	
	/** @method On_Submit_Task_Entry_Click_Event
	 * @desc This function is the submit task entry button click event handler.
	 * */
	this.On_Submit_Task_Entry_Click_Event = function() {
		this.Insert_Task_Entry(false);

	};
	
	
	/** @method On_Complete_Task_Entry_Click_Event
	 * @desc This function is the complete task entry button click event handler.
	 * */
	this.On_Complete_Task_Entry_Click_Event = function() {
		//execute the click event
		this.Insert_Task_Entry(true);
	};
	
	/** @method Render
	 * @desc This function renders the new task entry form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {

		var self = this;

		//create the top form
		this.data_form_new_entry = document.createElement("form");
		this.data_form_new_entry.setAttribute('method', "post");
		this.data_form_new_entry.setAttribute('id', "add_task_entry_form");

		this.data_form_new_entry.innerHTML += 'Tasks:<br />';

		//task name select dropdown
		this.add_task_entry_task_name_select = document.createElement("select");
		this.add_task_entry_task_name_select.setAttribute('name', "add_task_entry_name_to_enter");
		this.add_task_entry_task_name_select.setAttribute('id', "add_task_entry_name_to_enter");
		this.add_task_entry_task_name_select.innerHTML = '<option>-</option>';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_name_select);
		
		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Start Time:<br />';

		this.task_entry_start_time = document.createElement("input");
		this.task_entry_start_time.setAttribute('name', 'task_entry_start_time');
		this.task_entry_start_time.setAttribute('id', 'task_entry_start_time');
		this.task_entry_start_time.setAttribute('type', 'text');
		this.data_form_new_entry.appendChild(this.task_entry_start_time);
		
		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Status:<br />';

		this.add_task_entry_task_status_select = document.createElement("select");
		this.add_task_entry_task_status_select.setAttribute('name', "add_task_entry_status_to_enter");
		this.add_task_entry_task_status_select.setAttribute('id', "add_task_entry_status_to_enter");
		this.add_task_entry_task_status_select.innerHTML = '<option>Stopped</option><option>Started</option>';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_status_select);

		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Duration:<br />';

		this.task_entry_duration = document.createElement("input");
		this.task_entry_duration.setAttribute('name', 'task_entry_duration');
		this.task_entry_duration.setAttribute('id', 'task_entry_duration');
		this.task_entry_duration.setAttribute('type', 'text');
		this.task_entry_duration.setAttribute('value', '0');
		this.data_form_new_entry.appendChild(this.task_entry_duration);

		this.data_form_new_entry.innerHTML += '<br />';
		this.data_form_new_entry.innerHTML += 'Note:<br />';

		this.task_entry_note = document.createElement("input");
		this.task_entry_note.setAttribute('name', 'task_entry_note');
		this.task_entry_note.setAttribute('id', 'task_entry_note');
		this.task_entry_note.setAttribute('type', 'text');
		this.data_form_new_entry.appendChild(this.task_entry_note);

		this.data_form_new_entry.innerHTML += '<br /><br />';

		//task submit button creation
		this.add_task_entry_task_submit_button = document.createElement("input");
		this.add_task_entry_task_submit_button.setAttribute('id', 'new_task_entry_submit');
		this.add_task_entry_task_submit_button.setAttribute('type', 'submit');
		this.add_task_entry_task_submit_button.value = 'Submit';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_submit_button);

		this.data_form_new_entry.innerHTML += '<br /><br />';

		//task mark complete button creation
		this.add_task_entry_task_complete_button = document.createElement("input");
		this.add_task_entry_task_complete_button.setAttribute('id', 'new_task_entry_complete');
		this.add_task_entry_task_complete_button.setAttribute('type', 'submit');
		this.add_task_entry_task_complete_button.value = 'Mark Complete';
		this.data_form_new_entry.appendChild(this.add_task_entry_task_complete_button);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_entry);

		$('#' + this.add_task_entry_task_submit_button.id).button();
		$('#' + this.add_task_entry_task_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Submit_Task_Entry_Click_Event();
		});

		$('#' + this.add_task_entry_task_complete_button.id).button();
		$('#' + this.add_task_entry_task_complete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			self.On_Complete_Task_Entry_Click_Event();

		});
		
		$('#' + this.add_task_entry_task_name_select.id).change(function() {

			//call the change event function
			//self.On_Task_Name_Select_Change_Event();

		});
		
		$('#' + this.task_entry_start_time.id).datetimepicker({
			timeFormat : "HH:mm",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_entry_start_time.id).datetimepicker("setDate", new Date());

	};
}