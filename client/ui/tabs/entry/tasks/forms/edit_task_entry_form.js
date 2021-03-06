/** This is the edit task entry form to editing task entry data.
 * @constructor Edit_Task_Entry_Form
 */
function Edit_Task_Entry_Form(){
	
	this.Refresh = function(data){
		
		this.Refresh_Task_Select(data);
		this.Refresh_Task_Entry_Select(data);
		
		this.Task_Edit_Entry_Select_Change();
	};
	
	this.Refresh_Task_Select = function(data){
		
		var self = this;
		
		//ensure the task info array is saved
		self.task_info_json_array = data.tasks;

		Refresh_Select_HTML_From_Table(
			self.edit_task_entry_task_name_select.id,
			data.tasks,
			"name",
			"name");
		
	};
	
	this.Refresh_Task_Entry_Select = function(data){
		
		var self = this;
		
		self.task_log = data.task_entries;
		
		Refresh_Select_HTML_From_Table(
			self.edit_task_entry_select.id,
			data.task_entries,
			"task_log_id",
			"start_time");

		Refresh_Select_HTML_From_Table(
			self.task_target_select.id,
			data.task_targets,
			"task_schedule_id",
			"name");
		
	};
	
	/** @method Task_Edit_Entry_Submit_Click
	 * @desc This is the edit task entry submit button click event handler.
	 * */
	this.Task_Edit_Entry_Submit_Click = function()
	{
		var self = this;
		var params = new Array();

		//retrieve the selected item from the info array
		var selected_index = document.getElementById(this.edit_task_entry_task_name_select.id).selectedIndex;

		if (selected_index > 0) {
			
			var selected_task_entry_id = document.getElementById(this.edit_task_entry_select.id).value;
			var selected_task = this.task_info_json_array[selected_index - 1];
			var task_time = document.getElementById(this.task_entry_edit_start_time.id).value;
			var duration = document.getElementById(this.task_entry_edit_duration.id).value;
			var task_note = document.getElementById(this.task_entry_edit_note.id).value;
			var task_status = document.getElementById(this.edit_task_entry_task_status_select.id).value;
			var target_id = document.getElementById(this.task_target_select.id).value;
		
			params[0] = selected_task_entry_id;
			params[1] = selected_task.task_id;
			params[2] = Cast_Local_Server_Datetime_To_UTC_Server_Datetime(task_time);
			params[3] = duration;
			params[4] = task_status;
			params[5] = task_note;
			params[6] = target_id;
			params[7] = 0;

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
			
	};
	
	
	/** @method Task_Edit_Entry_Delete_Click
	 * @desc This is the delete task entry button click event handler.
	 * */
	this.Task_Edit_Entry_Delete_Click = function()
	{
		var self = this;
		
		var value = document.getElementById(self.edit_task_entry_select.id).value;
		
		if(value != 0)
		{
			
			var r=confirm("Are you sure you want to delete this task entry?");
			
			if (r==true)
			{
				var params = new Array();
				params[0] = value;
				
				app.api.Task_Data_Interface.Delete_Task_Entry(params, function(jsonRpcObj) {
				
					if(jsonRpcObj.result.success == 'true'){
						
						alert('Index deleted: ' + value);
						
						app.api.Refresh_Data(function() {
							//self.refresh_item_log_callback();
						});
						
					}
					else
					{
						alert('Failed to delete the entry.');
					}
				
				});
			}
			else
			{
				//do nothing, operation cancelled.
			}
			
			
		
		}
		else
		{
			alert('Select a valid task entry.');
		}
		
	};
	
	
	/** @method Task_Edit_Entry_Select_Change
	 * @desc This is the edit task HTML select index change event handler.
	 * */
	this.Task_Edit_Entry_Select_Change = function()
	{
		var self = this;
		
		//alert('Select item entry changed!');
		
		var selected_index = document.getElementById(self.edit_task_entry_select.id).selectedIndex;
		
		if(selected_index != 0)
		{
			var selected_task_entry = self.task_log[selected_index - 1];
			
			document.getElementById(self.edit_task_entry_task_name_select.id).value = selected_task_entry.name;
			document.getElementById(self.task_entry_edit_start_time.id).value = selected_task_entry.start_time;
			document.getElementById(self.edit_task_entry_task_status_select.id).value = selected_task_entry.status;
			document.getElementById(self.task_entry_edit_duration.id).value = selected_task_entry.hours;
			document.getElementById(self.task_entry_edit_note.id).value = selected_task_entry.note;
			document.getElementById(self.task_target_select.id).value = selected_task_entry.task_target_id;
			
		}
		else
		{
			document.getElementById(self.edit_task_entry_task_name_select.id).value = '-';
			document.getElementById(self.task_entry_edit_start_time.id).value = '';
			document.getElementById(self.edit_task_entry_task_status_select.id).value = 'Stopped';
			document.getElementById(self.task_entry_edit_duration.id).value = '';
			document.getElementById(self.task_entry_edit_note.id).value = '';
			document.getElementById(self.task_target_select.id).value = 0;
		}
	};
	
	
	
	/** @method Render
	 * @desc This function renders the edit task entry form in the specified div.
	 * @param {String} form_div_id The div ID to render the form in. 
	 * */
	this.Render = function(form_div_id) {

		var self = this;

		//create the top form
		this.data_form_edit_entry = document.createElement("form");
		this.data_form_edit_entry.setAttribute('method', "post");
		this.data_form_edit_entry.setAttribute('id', "edit_task_entry_form");

		this.data_form_edit_entry.innerHTML += 'Task Entries:<br />';

		//task name select dropdown
		this.edit_task_entry_select = document.createElement("select");
		this.edit_task_entry_select.setAttribute('name', "edit_task_entry_select");
		this.edit_task_entry_select.setAttribute('id', "edit_task_entry_select");
		this.edit_task_entry_select.innerHTML = '<option>-</option>';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_select);

		this.data_form_edit_entry.innerHTML += '<br /><br />';

		this.data_form_edit_entry.innerHTML += 'Task:<br />';

		//task name select dropdown
		this.edit_task_entry_task_name_select = document.createElement("select");
		this.edit_task_entry_task_name_select.setAttribute('name', "edit_task_entry_name_to_enter");
		this.edit_task_entry_task_name_select.setAttribute('id', "edit_task_entry_name_to_enter");
		this.edit_task_entry_task_name_select.innerHTML = '<option>-</option>';
		
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_name_select);
		
		this.data_form_edit_entry.innerHTML += '<br />Target:<br />';

		//task name select dropdown
		this.task_target_select = document.createElement("select");
		this.task_target_select.setAttribute('name', "edit_task_target_name");
		this.task_target_select.setAttribute('id', "edit_task_target_name");
		this.task_target_select.innerHTML = '<option>-</option>';
		
		this.data_form_edit_entry.appendChild(this.task_target_select);
		
		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Start Time:<br />';

		this.task_entry_edit_start_time = document.createElement("input");
		this.task_entry_edit_start_time.setAttribute('name', 'task_entry_edit_start_time');
		this.task_entry_edit_start_time.setAttribute('id', 'task_entry_edit_start_time');
		this.task_entry_edit_start_time.setAttribute('type', 'text');
		this.data_form_edit_entry.appendChild(this.task_entry_edit_start_time);

		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Status:<br />';

		this.edit_task_entry_task_status_select = document.createElement("select");
		this.edit_task_entry_task_status_select.setAttribute('name', "edit_task_entry_status_to_enter");
		this.edit_task_entry_task_status_select.setAttribute('id', "edit_task_entry_status_to_enter");
		this.edit_task_entry_task_status_select.innerHTML = '<option>Stopped</option><option>Started</option>';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_status_select);

		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Duration:<br />';

		this.task_entry_edit_duration = document.createElement("input");
		this.task_entry_edit_duration.setAttribute('name', 'task_entry_edit_duration');
		this.task_entry_edit_duration.setAttribute('id', 'task_entry_edit_duration');
		this.task_entry_edit_duration.setAttribute('type', 'text');
		this.task_entry_edit_duration.setAttribute('value', '0');
		this.data_form_edit_entry.appendChild(this.task_entry_edit_duration);

		this.data_form_edit_entry.innerHTML += '<br />';
		
		this.data_form_edit_entry.innerHTML += 'Note:<br />';

		this.task_entry_edit_note = document.createElement("input");
		this.task_entry_edit_note.setAttribute('name', 'task_entry_edit_note');
		this.task_entry_edit_note.setAttribute('id', 'task_entry_edit_note');
		this.task_entry_edit_note.setAttribute('type', 'text');
		this.data_form_edit_entry.appendChild(this.task_entry_edit_note);

		this.data_form_edit_entry.innerHTML += '<br /><br />';

		//task submit button creation
		this.edit_task_entry_task_submit_button = document.createElement("input");
		this.edit_task_entry_task_submit_button.setAttribute('id', 'edit_task_entry_task_submit_button');
		this.edit_task_entry_task_submit_button.setAttribute('type', 'submit');
		this.edit_task_entry_task_submit_button.value = 'Submit';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_submit_button);

		this.data_form_edit_entry.innerHTML += '<br /><br />';

		//task mark complete button creation
		this.edit_task_entry_task_complete_button = document.createElement("input");
		this.edit_task_entry_task_complete_button.setAttribute('id', 'edit_task_entry_task_complete_button');
		this.edit_task_entry_task_complete_button.setAttribute('type', 'submit');
		this.edit_task_entry_task_complete_button.value = 'Delete';
		this.data_form_edit_entry.appendChild(this.edit_task_entry_task_complete_button);

		var div_tab = document.getElementById(form_div_id);

		div_tab.appendChild(this.data_form_edit_entry);

		$('#' + this.edit_task_entry_task_submit_button.id).button();
		$('#' + this.edit_task_entry_task_submit_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			//execute the click event
			self.Task_Edit_Entry_Submit_Click();
		});
		
		
		$('#' + this.edit_task_entry_task_complete_button.id).button();
		$('#' + this.edit_task_entry_task_complete_button.id).click(function(event) {

			//ensure a normal postback does not occur
			event.preventDefault();
			
			
			self.Task_Edit_Entry_Delete_Click();

		});
		
		$('#' + this.edit_task_entry_select.id).change(function() {

			//call the change event function
			self.Task_Edit_Entry_Select_Change();

		});

		$('#' + this.task_entry_edit_start_time.id).datetimepicker({
			timeFormat : "HH:mm:ss",
			dateFormat : 'yy-mm-dd'
		});
		$('#' + this.task_entry_edit_start_time.id).datetimepicker("setDate", new Date());

	};

	
}