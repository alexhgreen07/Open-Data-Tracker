define([
        'jquery.ui',
        ],function($){
	return {
		/** This is the edit task entry form to editing task entry data.
		 * @constructor Edit_Task_Entry_Form
		 */
		Edit_Task_Entry_Form: function (){
			
			var self = this;
			
			this.Refresh = function(data){
				
				//ensure the task info array is saved
				self.task_info_json_array = data.tasks;
				self.task_log = data.task_entries;
				
				Refresh_Select_HTML_From_Table(
					self.edit_task_entry_task_name_select.id,
					data.tasks,
					"name",
					"name");
				
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
				
				
				
				this.Task_Edit_Entry_Select_Change();
				
			};
			
			this.Refresh_From_Diff = function(diff, data)
			{
				
				//ensure the task info array is saved
				self.task_info_json_array = data.tasks;
				self.task_log = data.task_entries;
				
				Refresh_Select_HTML_From_Table_Diff(
					self.edit_task_entry_task_name_select.id,
					diff.data.tasks,
					"name",
					"name");
				
				Refresh_Select_HTML_From_Table_Diff(
					self.edit_task_entry_select.id,
					diff.data.task_entries,
					"task_log_id",
					"start_time");

				Refresh_Select_HTML_From_Table_Diff(
					self.task_target_select.id,
					diff.data.task_targets,
					"task_schedule_id",
					"name");
				
				for(var key in diff.data.task_entries)
				{
					//check if the selected index has been changed
					if(diff.data.task_entries[key]["task_log_id"] == this.edit_task_entry_task_name_select.value)
					{
						this.Task_Edit_Entry_Select_Change();
					}
				}

			};
			
			/** @method Task_Edit_Entry_Submit_Click
			 * @desc This is the edit task entry submit button click event handler.
			 * */
			this.Task_Edit_Entry_Submit_Click = function()
			{

				//retrieve the selected item from the info array
				var selected_index = this.edit_task_entry_task_name_select.selectedIndex;

				if (selected_index > 0) {
					
					var selected_task_entry_id = this.edit_task_entry_select.value;
					var selected_task = this.task_info_json_array[selected_index - 1];
					var task_time = $(this.task_entry_edit_start_time).datetimepicker('getDate');
					var duration = this.task_entry_edit_duration.value;
					var task_note = this.task_entry_edit_note.value;
					var task_status = this.edit_task_entry_task_status_select.value;
					var target_id = this.task_target_select.value;

					var params = {};
				
					params["task_log_id"] = selected_task_entry_id;
					params["task_id"] = selected_task.task_id;
					params["start_time"] = task_time.toISOString();
					params["hours"] = duration;
					params["status"] = task_status;
					params["note"] = task_note;
					params["task_target_id"] = target_id;

					//execute the RPC callback for retrieving the item log
					app.api.Task_Data_Interface.Update_Task_Entry(params, function(jsonRpcObj) {

						if (jsonRpcObj.result.success) {

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
				var value = self.edit_task_entry_select.value;
				
				if(value != 0)
				{
					
					var r=confirm("Are you sure you want to delete this task entry?");
					
					if (r==true)
					{
						var params = {};
						params["task_log_id"] = value;
						
						app.api.Task_Data_Interface.Delete_Task_Entry(params, function(jsonRpcObj) {
						
							if(jsonRpcObj.result.success){
								
								self.edit_task_entry_select.value = 0;
								
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
				//alert('Select item entry changed!');
				
				var selected_index = self.edit_task_entry_select.selectedIndex;
				
				if(selected_index != 0)
				{
					var selected_task_entry = self.task_log[selected_index - 1];
					
					self.edit_task_entry_task_name_select.value = selected_task_entry.name;
					$(self.task_entry_edit_start_time).datetimepicker("setDate", new Date(selected_task_entry.start_time));
					self.edit_task_entry_task_status_select.value = selected_task_entry.status;
					self.task_entry_edit_duration.value = selected_task_entry.hours;
					self.task_entry_edit_note.value = selected_task_entry.note;
					self.task_target_select.value = selected_task_entry.task_target_id;
					
				}
				else
				{
					self.edit_task_entry_task_name_select.value = '-';
					$(self.task_entry_edit_start_time).datetimepicker("setDate", new Date());
					self.edit_task_entry_task_status_select.value = 'Stopped';
					self.task_entry_edit_duration.value = '';
					self.task_entry_edit_note.value = '';
					self.task_target_select.value = 0;
				}
			};
			
			
			
			/** @method Render
			 * @desc This function renders the edit task entry form in the specified div.
			 * @param {String} form_div_id The div ID to render the form in. 
			 * */
			this.Render = function(form_div_id) {

				//create the top form
				this.data_form_edit_entry = document.createElement("form");
				this.data_form_edit_entry.setAttribute('method', "post");
				this.data_form_edit_entry.setAttribute('id', "edit_task_entry_form");
				
				//append to the div tab
				var div_tab = document.getElementById(form_div_id);
				this.data_form_edit_entry = div_tab.appendChild(this.data_form_edit_entry);
				
				this.data_form_edit_entry.appendChild(document.createTextNode('Task Entries:'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));

				//task name select dropdown
				this.edit_task_entry_select = document.createElement("select");
				this.edit_task_entry_select.setAttribute('name', "edit_task_entry_select");
				this.edit_task_entry_select.setAttribute('id', "edit_task_entry_select");
				this.edit_task_entry_select.innerHTML = '<option>-</option>';
				this.edit_task_entry_select = this.data_form_edit_entry.appendChild(this.edit_task_entry_select);
				
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));

				this.data_form_edit_entry.appendChild(document.createTextNode('Task:'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));

				//task name select dropdown
				this.edit_task_entry_task_name_select = document.createElement("select");
				this.edit_task_entry_task_name_select.setAttribute('name', "edit_task_entry_name_to_enter");
				this.edit_task_entry_task_name_select.setAttribute('id', "edit_task_entry_name_to_enter");
				this.edit_task_entry_task_name_select.innerHTML = '<option>-</option>';
				
				this.edit_task_entry_task_name_select = this.data_form_edit_entry.appendChild(this.edit_task_entry_task_name_select);
				
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				this.data_form_edit_entry.appendChild(document.createTextNode('Target:'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				//task name select dropdown
				this.task_target_select = document.createElement("select");
				this.task_target_select.setAttribute('name', "edit_task_target_name");
				this.task_target_select.setAttribute('id', "edit_task_target_name");
				this.task_target_select.innerHTML = '<option>-</option>';
				
				this.task_target_select = this.data_form_edit_entry.appendChild(this.task_target_select);
				
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				this.data_form_edit_entry.appendChild(document.createTextNode('Start Time:'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				this.task_entry_edit_start_time = document.createElement("input");
				this.task_entry_edit_start_time.setAttribute('name', 'task_entry_edit_start_time');
				this.task_entry_edit_start_time.setAttribute('id', 'task_entry_edit_start_time');
				this.task_entry_edit_start_time.setAttribute('type', 'text');
				this.task_entry_edit_start_time = this.data_form_edit_entry.appendChild(this.task_entry_edit_start_time);

				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				this.data_form_edit_entry.appendChild(document.createTextNode('Status:'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				this.edit_task_entry_task_status_select = document.createElement("select");
				this.edit_task_entry_task_status_select.setAttribute('name', "edit_task_entry_status_to_enter");
				this.edit_task_entry_task_status_select.setAttribute('id', "edit_task_entry_status_to_enter");
				this.edit_task_entry_task_status_select.innerHTML = '<option>Stopped</option><option>Started</option>';
				this.edit_task_entry_task_status_select = this.data_form_edit_entry.appendChild(this.edit_task_entry_task_status_select);

				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				this.data_form_edit_entry.appendChild(document.createTextNode('Duration:'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));

				this.task_entry_edit_duration = document.createElement("input");
				this.task_entry_edit_duration.setAttribute('name', 'task_entry_edit_duration');
				this.task_entry_edit_duration.setAttribute('id', 'task_entry_edit_duration');
				this.task_entry_edit_duration.setAttribute('type', 'text');
				this.task_entry_edit_duration.setAttribute('value', '0');
				this.task_entry_edit_duration = this.data_form_edit_entry.appendChild(this.task_entry_edit_duration);

				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				this.data_form_edit_entry.appendChild(document.createTextNode('Note:'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));

				this.task_entry_edit_note = document.createElement("input");
				this.task_entry_edit_note.setAttribute('name', 'task_entry_edit_note');
				this.task_entry_edit_note.setAttribute('id', 'task_entry_edit_note');
				this.task_entry_edit_note.setAttribute('type', 'text');
				this.task_entry_edit_note = this.data_form_edit_entry.appendChild(this.task_entry_edit_note);

				this.data_form_edit_entry.appendChild(document.createElement('br'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				//task submit button creation
				this.edit_task_entry_task_submit_button = document.createElement("input");
				this.edit_task_entry_task_submit_button.setAttribute('id', 'edit_task_entry_task_submit_button');
				this.edit_task_entry_task_submit_button.setAttribute('type', 'submit');
				this.edit_task_entry_task_submit_button.value = 'Submit';
				this.edit_task_entry_task_submit_button = this.data_form_edit_entry.appendChild(this.edit_task_entry_task_submit_button);

				this.data_form_edit_entry.appendChild(document.createElement('br'));
				this.data_form_edit_entry.appendChild(document.createElement('br'));
				
				//task mark complete button creation
				this.edit_task_entry_task_complete_button = document.createElement("input");
				this.edit_task_entry_task_complete_button.setAttribute('id', 'edit_task_entry_task_complete_button');
				this.edit_task_entry_task_complete_button.setAttribute('type', 'submit');
				this.edit_task_entry_task_complete_button.value = 'Delete';
				this.edit_task_entry_task_complete_button = this.data_form_edit_entry.appendChild(this.edit_task_entry_task_complete_button);

				$(this.edit_task_entry_task_submit_button).button();
				$(this.edit_task_entry_task_submit_button).click(function(event) {

					//ensure a normal postback does not occur
					event.preventDefault();
					
					
					//execute the click event
					self.Task_Edit_Entry_Submit_Click();
				});
				
				
				$(this.edit_task_entry_task_complete_button).button();
				$(this.edit_task_entry_task_complete_button).click(function(event) {

					//ensure a normal postback does not occur
					event.preventDefault();
					
					self.Task_Edit_Entry_Delete_Click();

				});
				
				$(this.edit_task_entry_select).change(function() {

					//call the change event function
					self.Task_Edit_Entry_Select_Change();

				});

				$(this.task_entry_edit_start_time).datetimepicker({
					timeFormat : "HH:mm:ss",
					dateFormat : 'yy-mm-dd'
				});
				$(this.task_entry_edit_start_time).datetimepicker("setDate", new Date());

			};

			
		}
	};
});

