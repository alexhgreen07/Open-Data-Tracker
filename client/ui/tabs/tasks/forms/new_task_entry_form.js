/** This is the new task entry form to entering task entry data.
 * @constructor New_Task_Entry_Form
 */
function New_Task_Entry_Form(){
	
	this.Refresh = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		Refresh_Select_HTML_From_Table(
			self.add_task_entry_task_name_select.id,
			data.tasks,
			"name",
			"name");

		Refresh_Select_HTML_From_Table(
			self.task_target_select.id,
			data.task_targets,
			"task_schedule_id",
			"name");
		
	};
	
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
			var target_id = document.getElementById(this.task_target_select.id).value;

			params[0] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(task_time);
			params[1] = selected_task.task_id;
			params[2] = duration;
			params[3] = task_status;
			params[4] = task_note;
			params[5] = target_id;

			//execute the RPC callback for retrieving the item log
			app.api.Task_Data_Interface.Insert_Task_Entry(params, function(jsonRpcObj) {

				if (jsonRpcObj.result.success == 'true') {

					$('#' + self.task_entry_duration.id).val('0');
					$('#' + self.task_entry_note.id).val('');

					alert('Task entry submitted.');

					app.api.Refresh_Data(function() {
						//self.refresh_item_log_callback();
					});

				} else {
					alert(jsonRpcObj.result.debug);
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
		
		this.data_form_new_entry.innerHTML += '<br />Target:<br />';

		//task name select dropdown
		this.task_target_select = document.createElement("select");
		this.task_target_select.setAttribute('name', "new_task_target_name");
		this.task_target_select.setAttribute('id', "new_task_target_name");
		this.task_target_select.innerHTML = '<option>-</option>';
		
		this.data_form_new_entry.appendChild(this.task_target_select);

		
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

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_new_entry);

		$('#' + this.add_task_entry_task_submit_button.id).button();
		$('#' + this.add_task_entry_task_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();

			//execute the click event
			self.On_Submit_Task_Entry_Click_Event();
		});
		
		$('#' + this.add_task_entry_task_name_select.id).change(function() {

			//call the change event function
			//self.On_Task_Name_Select_Change_Event();

		});
		
		$('#' + this.task_entry_start_time.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_entry_start_time.id).datetimepicker("setDate", new Date());

	};
}